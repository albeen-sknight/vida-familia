import { countries, desiredPaths, isLocale, type LeadPayload, type Locale } from "@vida-familia/shared";

type Bindings = Env & {
  ADMIN_API_TOKEN?: string;
  ADMIN_EMAIL?: string;
  ADMIN_NOTIFICATION_EMAILS?: string;
  ALLOWED_ORIGINS?: string;
  FROM_EMAIL?: string;
  PUBLIC_SITE_URL?: string;
  RESEND_API_KEY?: string;
  SMS_CONFIRMATIONS_ENABLED?: string;
  SMS_PROVIDER?: "disabled" | "twilio" | "whatsapp" | string;
  TURNSTILE_SECRET_KEY?: string;
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_FROM_NUMBER?: string;
  WHATSAPP_PHONE_NUMBER_ID?: string;
  WHATSAPP_TOKEN?: string;
};

type NormalizedLead = Omit<LeadPayload, "website"> & {
  campaign: string;
  source: string;
  turnstileToken: string;
};

type Priority = "hot" | "qualified" | "review" | "not_ready" | "spam";
type JsonRecord = Record<string, unknown>;

const MAX_BODY_BYTES = 32 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s().-]{7,30}$/;
const DEFAULT_ALLOWED_ORIGINS = [
  "https://vida-familia-web.pages.dev",
  "https://*.vida-familia-web.pages.dev",
  "https://vidafamilia.es",
  "https://www.vidafamilia.es",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];
const DEFAULT_SITE_URL = "https://vidafamilia.es";
const DEFAULT_ADMIN_NOTIFICATION_EMAILS = [
  "vidafamilia.team@gmail.com",
  "albertosaeedi@gmail.com",
  "saeediamirahmad8849@gmail.com",
  "sharif.saeedi0709@gmail.com",
];
const EMAIL_DISCLAIMER = "Vida Familia provides educational, relocation and coordination services. No visa or residency outcome is guaranteed, and legal matters may require licensed professionals.";

class ApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly fields?: string[]) {
    super(message);
  }
}

function json(data: unknown, status = 200, headers?: HeadersInit): Response {
  return Response.json(data, { status, headers });
}

function isRecord(input: unknown): input is JsonRecord {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function normalizeString(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  return input.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function optionalString(input: unknown, maxLength: number): string | null {
  const value = normalizeString(input, maxLength);
  return value ? value : null;
}

function normalizeLocale(input: unknown): Locale {
  const value = typeof input === "string" ? input : undefined;
  return isLocale(value) ? value : "fa";
}

function allowedOriginPatterns(env: Bindings): string[] {
  const configured = (env.ALLOWED_ORIGINS ?? "").split(",").map((origin) => origin.trim()).filter(Boolean);
  return [...new Set([...DEFAULT_ALLOWED_ORIGINS, ...configured])];
}

function matchesOriginPattern(origin: string, pattern: string): boolean {
  if (origin === pattern) return true;
  if (!pattern.includes("*.")) return false;

  try {
    const originUrl = new URL(origin);
    const patternUrl = new URL(pattern.replace("*.", ""));
    const suffix = `.${patternUrl.hostname}`;
    return originUrl.protocol === patternUrl.protocol
      && originUrl.port === patternUrl.port
      && originUrl.hostname.endsWith(suffix)
      && originUrl.hostname !== patternUrl.hostname;
  } catch {
    return false;
  }
}

function isOriginAllowed(origin: string, env: Bindings): boolean {
  return allowedOriginPatterns(env).some((pattern) => matchesOriginPattern(origin, pattern));
}

function corsHeaders(request: Request, env: Bindings): Headers {
  const origin = request.headers.get("Origin");
  const headers = new Headers({ Vary: "Origin" });
  if (origin && isOriginAllowed(origin, env)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    headers.set("Access-Control-Max-Age", "86400");
  }
  return headers;
}

function withCors(response: Response, request: Request, env: Bindings): Response {
  const headers = new Headers(response.headers);
  corsHeaders(request, env).forEach((value, key) => headers.set(key, value));
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function assertOriginAllowed(request: Request, env: Bindings): void {
  const origin = request.headers.get("Origin");
  if (origin && !isOriginAllowed(origin, env)) throw new ApiError(403, "Origin not allowed");
}

function assertJsonRequest(request: Request): void {
  if (!request.headers.get("Content-Type")?.toLowerCase().includes("application/json")) throw new ApiError(415, "Content-Type must be application/json");
}

async function readBoundedJson(request: Request): Promise<unknown> {
  const contentLength = request.headers.get("Content-Length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) throw new ApiError(413, "Request body is too large");
  if (!request.body) throw new ApiError(400, "A JSON request body is required");

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) throw new ApiError(413, "Request body is too large");
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder().decode(body));
  } catch {
    throw new ApiError(400, "Request body must be valid JSON");
  }
}

async function constantTimeEqual(provided: string, expected: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [providedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(provided)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  const left = new Uint8Array(providedHash);
  const right = new Uint8Array(expectedHash);
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= (left[index] ?? 0) ^ (right[index] ?? 0);
  return difference === 0;
}

async function assertAdmin(request: Request, env: Bindings): Promise<void> {
  const expectedToken = env.ADMIN_API_TOKEN;
  const header = request.headers.get("Authorization");
  const providedToken = header?.startsWith("Bearer ") ? header.slice(7) : "";
  if (!expectedToken || !providedToken || !(await constantTimeEqual(providedToken, expectedToken))) throw new ApiError(401, "Unauthorized");
}

function adminRecipients(env: Bindings): string[] {
  const configured = (env.ADMIN_NOTIFICATION_EMAILS || env.ADMIN_EMAIL || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => EMAIL_PATTERN.test(email));
  return configured.length ? configured : DEFAULT_ADMIN_NOTIFICATION_EMAILS;
}

function siteUrl(env: Bindings): string {
  return (env.PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[char] ?? char);
}

function rowsTable(rows: Array<[string, string | number | null | undefined]>): string {
  return `<table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:14px">${rows.map(([label, value]) => `<tr><th align="left" style="border-bottom:1px solid #e7e1d7;padding:8px;color:#081e35;width:34%">${escapeHtml(label)}</th><td style="border-bottom:1px solid #e7e1d7;padding:8px">${escapeHtml(String(value ?? ""))}</td></tr>`).join("")}</table>`;
}

function emailLayout(title: string, body: string): string {
  const direction = /[\u0600-\u06FF]/.test(title) ? "rtl" : "ltr";
  return `<!doctype html><html><body style="margin:0;background:#f7f1e6;padding:24px"><main dir="${direction}" style="max-width:720px;margin:auto;background:#fffdf8;border:1px solid #eadfce;border-radius:18px;overflow:hidden"><header style="background:#081e35;color:white;padding:26px 30px"><p style="margin:0 0 6px;color:#f1bf00;font:700 11px Arial;letter-spacing:.16em">VIDA FAMILIA</p><h1 style="margin:0;font:500 28px Georgia,serif">${escapeHtml(title)}</h1></header><section style="padding:28px 30px;color:#17202a;font:15px/1.7 Arial,sans-serif">${body}</section><footer style="padding:18px 30px;background:#f7f1e6;color:#6f6b63;font:12px/1.6 Arial,sans-serif">Spain & Argentina through real experience.<br>${escapeHtml(EMAIL_DISCLAIMER)}</footer></main></body></html>`;
}

type EmailMessage = {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

async function sendEmail(env: Bindings, message: EmailMessage): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const recipients = [...new Set(message.to.map((email) => email.trim().toLowerCase()).filter((email) => EMAIL_PATTERN.test(email)))];
  if (!recipients.length) {
    console.log(JSON.stringify({ message: "Email skipped: no valid recipients", subject: message.subject }));
    return { ok: true, skipped: true };
  }
  if (!env.RESEND_API_KEY || !env.FROM_EMAIL) {
    console.log(JSON.stringify({ message: "Email skipped: RESEND_API_KEY or FROM_EMAIL not configured", subject: message.subject }));
    return { ok: true, skipped: true };
  }
  const payload: JsonRecord = {
    from: env.FROM_EMAIL,
    to: recipients,
    subject: message.subject,
    html: message.html,
    text: message.text,
  };
  if (message.replyTo && EMAIL_PATTERN.test(message.replyTo)) payload.reply_to = message.replyTo;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      console.error(JSON.stringify({ message: "Resend email failed", status: response.status, subject: message.subject }));
      return { ok: false, error: "Email provider failed" };
    }
    return { ok: true };
  } catch (error) {
    console.error(JSON.stringify({ message: "Resend email request failed", subject: message.subject, error: error instanceof Error ? error.message : String(error) }));
    return { ok: false, error: "Email provider failed" };
  }
}

async function verifyTurnstileIfConfigured(request: Request, env: Bindings, token: string): Promise<void> {
  if (!env.TURNSTILE_SECRET_KEY) {
    console.log(JSON.stringify({ message: "Turnstile skipped: TURNSTILE_SECRET_KEY not configured" }));
    return;
  }
  if (!token) throw new ApiError(422, "Turnstile verification is required", ["turnstileToken"]);
  const formData = new FormData();
  formData.append("secret", env.TURNSTILE_SECRET_KEY);
  formData.append("response", token);
  const remoteIp = request.headers.get("CF-Connecting-IP");
  if (remoteIp) formData.append("remoteip", remoteIp);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: formData });
  const data: { success?: boolean; "error-codes"?: string[] } = await response.json<{ success?: boolean; "error-codes"?: string[] }>().catch(() => ({ success: false }));
  if (!data.success) {
    console.warn(JSON.stringify({ message: "Turnstile verification failed", errors: data["error-codes"] ?? [] }));
    throw new ApiError(403, "Turnstile verification failed", ["turnstileToken"]);
  }
}

async function generateReferenceCode(env: Bindings, table: "leads" | "consultation_requests"): Promise<string> {
  const year = new Date().getUTCFullYear();
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const random = new Uint32Array(1);
    crypto.getRandomValues(random);
    const suffix = String((random[0] ?? 0) % 1_000_000).padStart(6, "0");
    const code = `VF-${year}-${suffix}`;
    const found = await env.DB.prepare(`SELECT id FROM ${table} WHERE reference_code = ? LIMIT 1`).bind(code).first<{ id: string }>();
    if (!found) return code;
  }
  return `VF-${year}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

function scoreLead(lead: NormalizedLead): { score: number; priority: Priority; recommendedNextStep: string } {
  let score = 0;
  const budget = lead.budget_range.toLowerCase();
  const income = lead.income_range.toLowerCase();
  const timeline = lead.timeline.toLowerCase();
  const documents = lead.documents_ready.toLowerCase();
  const detail = `${lead.main_concern} ${lead.message}`.trim();
  const background = `${lead.education_background} ${lead.professional_background}`.trim().toLowerCase();

  if (/(3|4|5|6|7|8|9)\d{4}|[5-9]\d\s?k|50k|60k|70k|80k|90k|100k|€|\$|یورو|دلار/.test(budget)) score += 20;
  else if (budget.length >= 5 && !/none|no|ندار|نیست/.test(budget)) score += 10;
  if (/(income|salary|passive|remote|monthly|درآمد|حقوق|ماهانه|اجاره|rent|€|\$|\d)/.test(income) && !/none|no|ندار|نیست/.test(income)) score += 15;
  if (/(3|6|9|12|month|months|ماه|سال|quarter|soon)/.test(timeline)) score += 15;
  if (/(ready|partial|translated|apostille|yes|آماده|ترجمه|بخشی|نسبی|sí|si|parcial)/.test(documents)) score += 15;
  if (lead.desired_path !== "Not sure" && lead.target_country !== "Not sure") score += 10;
  if (detail.length >= 90) score += 10;
  if (background.length >= 30 || /(dent|doctor|engineer|developer|business|student|university|IT|cyber|دندان|مهندس|پزشک|دانشگاه|کسب|تجارت|فناوری)/i.test(background)) score += 10;
  if (lead.consent) score += 5;

  const priority: Priority = score >= 80 ? "hot" : score >= 60 ? "qualified" : score >= 40 ? "review" : "not_ready";
  const recommendedNextStep = priority === "hot" || priority === "qualified"
    ? "Review details and prepare a focused consultation."
    : priority === "review"
      ? "Review fit and request missing evidence before a call."
      : "Send preparation guidance before offering a consultation.";
  return { score, priority, recommendedNextStep };
}

function localizedLeadMessage(locale: Locale): string {
  if (locale === "fa") return "درخواست شما با موفقیت دریافت شد. تیم Vida Familia اطلاعات اولیه شما را بررسی می‌کند و در صورت مناسب بودن مسیر، برای مرحله بعد با شما تماس خواهد گرفت.";
  if (locale === "es") return "Hemos recibido tu solicitud. El equipo de Vida Familia revisará la información inicial y, si la vía encaja, te contactará para el siguiente paso.";
  return "We received your request. The Vida Familia team will review your initial information and contact you about the next step if the pathway is a fit.";
}

function applicantStatusMessage(locale: Locale, priority: Priority): string {
  if (locale === "fa") return priority === "not_ready" ? "نیازمند آماده‌سازی بیشتر" : "قابل بررسی";
  if (locale === "es") return priority === "not_ready" ? "Requiere más preparación" : "Listo para revisión";
  return priority === "not_ready" ? "Needs more preparation" : "Ready for review";
}

function normalizeLead(input: unknown): { lead: NormalizedLead; honeypot: string } {
  if (!isRecord(input)) throw new ApiError(400, "Request body must be a JSON object");
  const rawTargetCountry = input.target_country;
  const rawDesiredPath = input.desired_path;
  const lead: NormalizedLead = {
    locale: normalizeLocale(input.locale),
    full_name: normalizeString(input.full_name, 100),
    email: normalizeString(input.email, 254).toLowerCase(),
    whatsapp: normalizeString(input.whatsapp, 40),
    current_country: normalizeString(input.current_country, 80),
    target_country: countries.includes(rawTargetCountry as (typeof countries)[number]) ? rawTargetCountry as NormalizedLead["target_country"] : "Not sure",
    desired_path: desiredPaths.includes(rawDesiredPath as (typeof desiredPaths)[number]) ? rawDesiredPath as NormalizedLead["desired_path"] : "Not sure",
    family_size: normalizeString(input.family_size, 20),
    budget_range: normalizeString(input.budget_range, 80),
    income_range: normalizeString(input.income_range, 80),
    education_background: normalizeString(input.education_background, 600),
    professional_background: normalizeString(input.professional_background, 600),
    timeline: normalizeString(input.timeline, 80),
    documents_ready: normalizeString(input.documents_ready, 160),
    main_concern: normalizeString(input.main_concern, 1200),
    message: normalizeString(input.message, 3000),
    consent: input.consent === true,
    source: normalizeString(input.source, 80) || "apply_form",
    campaign: normalizeString(input.campaign, 120),
    turnstileToken: normalizeString(input.turnstileToken, 2048),
  };

  const required: Array<keyof NormalizedLead> = ["full_name", "email", "whatsapp", "current_country", "family_size", "budget_range", "income_range", "timeline", "documents_ready", "main_concern"];
  const invalid = required.filter((field) => typeof lead[field] !== "string" || (lead[field] as string).length === 0);
  if (lead.full_name.length < 2) invalid.push("full_name");
  if (!EMAIL_PATTERN.test(lead.email)) invalid.push("email");
  if (!PHONE_PATTERN.test(lead.whatsapp)) invalid.push("whatsapp");
  if (!countries.includes(rawTargetCountry as (typeof countries)[number])) invalid.push("target_country");
  if (!desiredPaths.includes(rawDesiredPath as (typeof desiredPaths)[number])) invalid.push("desired_path");
  if (!lead.consent) invalid.push("consent");
  const uniqueInvalid = [...new Set(invalid)];
  if (uniqueInvalid.length) throw new ApiError(422, "Please check the highlighted fields", uniqueInvalid);
  return { lead, honeypot: normalizeString(input.website, 200) };
}

async function saveTimeline(env: Bindings, leadId: string, eventType: string, note: string, author = "system", metadata?: JsonRecord): Promise<void> {
  await env.DB.prepare("INSERT INTO lead_timeline (id, lead_id, event_type, note, author, metadata_json) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(crypto.randomUUID(), leadId, eventType, note, author, metadata ? JSON.stringify(metadata) : null)
    .run();
}

function leadEmailMessages(env: Bindings, lead: NormalizedLead, id: string, referenceCode: string, score: number, priority: Priority, recommendedNextStep: string): { admin: EmailMessage; applicant: EmailMessage } {
  const adminRows: Array<[string, string | number]> = [
    ["Reference", referenceCode],
    ["Priority", priority],
    ["Lead score", score],
    ["Name", lead.full_name],
    ["Email", lead.email],
    ["WhatsApp", lead.whatsapp],
    ["Locale", lead.locale],
    ["Target country", lead.target_country],
    ["Desired path", lead.desired_path],
    ["Current country", lead.current_country],
    ["Family size", lead.family_size],
    ["Budget", lead.budget_range],
    ["Income", lead.income_range],
    ["Timeline", lead.timeline],
    ["Documents", lead.documents_ready],
    ["Main concern", lead.main_concern],
    ["Message", lead.message],
    ["Recommended next step", recommendedNextStep],
    ["Admin detail placeholder", `${siteUrl(env)}/dashboard/leads/${id}`],
  ];
  const applicantTitle = lead.locale === "fa" ? "درخواست شما دریافت شد" : lead.locale === "es" ? "Hemos recibido tu solicitud" : "We received your request";
  const applicantBody = lead.locale === "fa"
    ? `<p>درخواست شما با موفقیت دریافت شد. تیم Vida Familia اطلاعات اولیه شما را بررسی می‌کند و در صورت مناسب بودن مسیر، برای مرحله بعد با شما تماس خواهد گرفت.</p><p><strong>کد پیگیری:</strong> ${escapeHtml(referenceCode)}</p><p>این پیام به معنی تأیید پرونده یا تضمین نتیجه مهاجرتی نیست؛ بررسی نهایی همیشه به مدارک، شرایط فردی و قوانین به‌روز بستگی دارد.</p>`
    : lead.locale === "es"
      ? `<p>Hemos recibido tu solicitud correctamente. El equipo de Vida Familia revisará tu información inicial y te contactará si la vía encaja.</p><p><strong>Referencia:</strong> ${escapeHtml(referenceCode)}</p><p>Este mensaje no confirma aceptación del caso ni garantiza ningún resultado migratorio.</p>`
      : `<p>Your request was received successfully. The Vida Familia team will review your initial information and contact you if the pathway is a fit.</p><p><strong>Reference:</strong> ${escapeHtml(referenceCode)}</p><p>This message does not confirm case acceptance or guarantee any immigration outcome.</p>`;
  return {
    admin: {
      to: adminRecipients(env),
      subject: `New Vida Familia lead: ${lead.full_name} — ${lead.target_country} / ${lead.desired_path}`,
      html: emailLayout("New Vida Familia lead", rowsTable(adminRows)),
      text: adminRows.map(([label, value]) => `${label}: ${value}`).join("\n"),
      replyTo: lead.email,
    },
    applicant: {
      to: [lead.email],
      subject: lead.locale === "fa" ? `درخواست Vida Familia — ${referenceCode}` : `Vida Familia request — ${referenceCode}`,
      html: emailLayout(applicantTitle, applicantBody),
      text: `${applicantTitle}\nReference: ${referenceCode}\n${localizedLeadMessage(lead.locale)}\nNo result is guaranteed.`,
    },
  };
}

async function sendApplicantSmsOrWhatsAppConfirmation(env: Bindings, whatsapp: string, message: string): Promise<{ ok: boolean; skipped?: boolean; detail: string }> {
  if (env.SMS_CONFIRMATIONS_ENABLED !== "true") return { ok: true, skipped: true, detail: "SMS confirmations disabled or provider not configured." };
  if (!PHONE_PATTERN.test(whatsapp)) return { ok: true, skipped: true, detail: "Applicant phone format not usable for SMS/WhatsApp." };
  try {
    if (env.SMS_PROVIDER === "twilio" && env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_FROM_NUMBER) {
      const body = new URLSearchParams({ From: env.TWILIO_FROM_NUMBER, To: whatsapp, Body: message });
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: "POST",
        headers: { Authorization: `Basic ${btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`)}`, "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      return { ok: response.ok, skipped: false, detail: response.ok ? "Twilio SMS queued." : "Twilio SMS failed." };
    }
    if (env.SMS_PROVIDER === "whatsapp" && env.WHATSAPP_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID) {
      const response = await fetch(`https://graph.facebook.com/v19.0/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ messaging_product: "whatsapp", to: whatsapp.replace(/\D/g, ""), type: "text", text: { body: message } }),
      });
      return { ok: response.ok, skipped: false, detail: response.ok ? "WhatsApp message queued." : "WhatsApp message failed." };
    }
    return { ok: true, skipped: true, detail: "SMS confirmations disabled or provider not configured." };
  } catch (error) {
    console.error(JSON.stringify({ message: "SMS/WhatsApp confirmation failed", error: error instanceof Error ? error.message : String(error) }));
    return { ok: false, detail: "SMS/WhatsApp provider failed." };
  }
}

async function notifyLead(env: Bindings, lead: NormalizedLead, id: string, referenceCode: string, score: number, priority: Priority, recommendedNextStep: string): Promise<void> {
  const { admin, applicant } = leadEmailMessages(env, lead, id, referenceCode, score, priority, recommendedNextStep);
  await Promise.allSettled([sendEmail(env, admin), sendEmail(env, applicant), sendApplicantSmsOrWhatsAppConfirmation(env, lead.whatsapp, `Vida Familia: ${referenceCode}`)]);
}

async function createLead(request: Request, env: Bindings, ctx: ExecutionContext): Promise<Response> {
  assertOriginAllowed(request, env);
  assertJsonRequest(request);
  const { lead, honeypot } = normalizeLead(await readBoundedJson(request));
  if (honeypot) return json({ ok: true, priority: "spam", message: localizedLeadMessage(lead.locale) }, 202);
  await verifyTurnstileIfConfigured(request, env, lead.turnstileToken);

  const recent = await env.DB.prepare("SELECT id FROM leads WHERE email = ? AND julianday(created_at) >= julianday('now', '-5 minutes') LIMIT 1").bind(lead.email).first<{ id: string }>();
  if (recent) throw new ApiError(429, "A recent request already exists. Please wait before trying again.");

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const referenceCode = await generateReferenceCode(env, "leads");
  const { score, priority, recommendedNextStep } = scoreLead(lead);
  await env.DB.prepare(`
    INSERT INTO leads (
      id, created_at, locale, full_name, email, whatsapp, current_country,
      target_country, desired_path, family_size, budget_range, income_range,
      education_background, professional_background, timeline, documents_ready,
      main_concern, message, consent, status, reference_code, lead_score,
      priority, recommended_next_step, source, campaign, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, createdAt, lead.locale, lead.full_name, lead.email, lead.whatsapp, lead.current_country,
    lead.target_country, lead.desired_path, lead.family_size, lead.budget_range, lead.income_range,
    lead.education_background || null, lead.professional_background || null, lead.timeline,
    lead.documents_ready, lead.main_concern, lead.message || null, 1, "new", referenceCode,
    score, priority, recommendedNextStep, lead.source || null, lead.campaign || null, createdAt,
  ).run();
  await saveTimeline(env, id, "lead_created", `Lead ${referenceCode} created with priority ${priority}.`, "system", { score, priority });
  ctx.waitUntil(notifyLead(env, lead, id, referenceCode, score, priority, recommendedNextStep).catch((error) => console.error(JSON.stringify({ message: "Lead notification failed", referenceCode, error: error instanceof Error ? error.message : String(error) }))));

  return json({
    ok: true,
    id,
    lead_id: id,
    reference_code: referenceCode,
    priority,
    user_status: applicantStatusMessage(lead.locale, priority),
    recommended_next_step: recommendedNextStep,
    message: localizedLeadMessage(lead.locale),
  }, 201);
}

type ContactPayload = {
  id: string;
  locale: Locale;
  fullName: string;
  email: string;
  whatsapp: string | null;
  topic: string;
  message: string;
  source: string | null;
};

function validateContact(input: unknown): ContactPayload & { consent: boolean; honeypot: string; turnstileToken: string } {
  if (!isRecord(input)) throw new ApiError(400, "Request body must be a JSON object");
  const locale = normalizeLocale(input.locale ?? input.preferred_language);
  const payload = {
    id: crypto.randomUUID(),
    locale,
    fullName: normalizeString(input.full_name, 100),
    email: normalizeString(input.email, 254).toLowerCase(),
    whatsapp: optionalString(input.whatsapp, 40),
    topic: normalizeString(input.topic, 120) || "General",
    message: normalizeString(input.message, 3000),
    source: optionalString(input.source, 80),
    consent: input.consent === true,
    honeypot: normalizeString(input.website, 200),
    turnstileToken: normalizeString(input.turnstileToken, 2048),
  };
  const invalid: string[] = [];
  if (payload.fullName.length < 2) invalid.push("full_name");
  if (!EMAIL_PATTERN.test(payload.email)) invalid.push("email");
  if (payload.whatsapp && !PHONE_PATTERN.test(payload.whatsapp)) invalid.push("whatsapp");
  if (payload.message.length < 10) invalid.push("message");
  if (!payload.consent) invalid.push("consent");
  if (invalid.length) throw new ApiError(422, "Please check the highlighted fields", invalid);
  return payload;
}

async function createContactMessage(request: Request, env: Bindings, ctx: ExecutionContext): Promise<Response> {
  assertOriginAllowed(request, env);
  assertJsonRequest(request);
  const payload = validateContact(await readBoundedJson(request));
  if (payload.honeypot) return json({ ok: true, message: "Message received" }, 202);
  await verifyTurnstileIfConfigured(request, env, payload.turnstileToken);
  await env.DB.prepare("INSERT INTO contact_messages (id, locale, full_name, email, whatsapp, topic, message, consent, status, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(payload.id, payload.locale, payload.fullName, payload.email, payload.whatsapp, payload.topic, payload.message, 1, "new", payload.source)
    .run();
  ctx.waitUntil(notifyGenericContact(env, payload).catch((error) => console.error(JSON.stringify({ message: "Contact notification failed", error: error instanceof Error ? error.message : String(error) }))));
  return json({ ok: true, id: payload.id, message: payload.locale === "fa" ? "پیام شما دریافت شد." : payload.locale === "es" ? "Hemos recibido tu mensaje." : "Your message was received." }, 201);
}

async function notifyGenericContact(env: Bindings, payload: ContactPayload): Promise<void> {
  const adminRows: Array<[string, string | number | null]> = [["Name", payload.fullName], ["Email", payload.email], ["WhatsApp", payload.whatsapp], ["Locale", payload.locale], ["Topic", payload.topic], ["Message", payload.message]];
  const applicantTitle = payload.locale === "fa" ? "پیام شما دریافت شد" : payload.locale === "es" ? "Mensaje recibido" : "Message received";
  await Promise.allSettled([
    sendEmail(env, { to: adminRecipients(env), subject: `New Vida Familia contact: ${payload.topic} — ${payload.fullName}`, html: emailLayout("New contact message", rowsTable(adminRows)), text: adminRows.map(([label, value]) => `${label}: ${value ?? ""}`).join("\n"), replyTo: payload.email }),
    sendEmail(env, { to: [payload.email], subject: applicantTitle, html: emailLayout(applicantTitle, `<p>${payload.locale === "fa" ? "پیام شما با موفقیت دریافت شد. تیم Vida Familia در صورت نیاز با شما تماس می‌گیرد." : payload.locale === "es" ? "Tu mensaje se recibió correctamente. El equipo de Vida Familia te contactará si hace falta." : "Your message was received successfully. The Vida Familia team will contact you if needed."}</p>`), text: applicantTitle }),
  ]);
}

async function createConsultationRequest(request: Request, env: Bindings, ctx: ExecutionContext): Promise<Response> {
  assertOriginAllowed(request, env);
  assertJsonRequest(request);
  const input = await readBoundedJson(request);
  if (!isRecord(input)) throw new ApiError(400, "Request body must be a JSON object");
  const locale = normalizeLocale(input.language ?? input.locale);
  const fullName = normalizeString(input.full_name, 100);
  const email = normalizeString(input.email, 254).toLowerCase();
  const whatsapp = normalizeString(input.whatsapp, 40);
  const consent = input.consent === true;
  const invalid = [fullName.length < 2 ? "full_name" : "", !EMAIL_PATTERN.test(email) ? "email" : "", !PHONE_PATTERN.test(whatsapp) ? "whatsapp" : "", !consent ? "consent" : ""].filter(Boolean);
  if (invalid.length) throw new ApiError(422, "Please check the highlighted fields", invalid);
  await verifyTurnstileIfConfigured(request, env, normalizeString(input.turnstileToken, 2048));
  const id = crypto.randomUUID();
  const referenceCode = await generateReferenceCode(env, "consultation_requests");
  await env.DB.prepare(`INSERT INTO consultation_requests (id, reference_code, locale, full_name, email, whatsapp, target_country, consultation_type, preferred_day, preferred_time_window, timezone, message, consent, status, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, referenceCode, locale, fullName, email, whatsapp, normalizeString(input.target_country, 80), normalizeString(input.consultation_type, 120), optionalString(input.preferred_day, 80), optionalString(input.preferred_time_window, 80), optionalString(input.timezone, 80), optionalString(input.message, 2000), 1, "new", "review")
    .run();
  ctx.waitUntil(notifyConsultation(env, { id, referenceCode, locale, fullName, email, whatsapp }).catch((error) => console.error(JSON.stringify({ message: "Consultation notification failed", error: error instanceof Error ? error.message : String(error) }))));
  return json({ ok: true, id, reference_code: referenceCode, message: localizedLeadMessage(locale) }, 201);
}

async function notifyConsultation(env: Bindings, payload: { id: string; referenceCode: string; locale: Locale; fullName: string; email: string; whatsapp: string }): Promise<void> {
  const applicantTitle = payload.locale === "fa" ? "درخواست مشاوره شما دریافت شد" : payload.locale === "es" ? "Solicitud de consulta recibida" : "Consultation request received";
  const referenceLabel = payload.locale === "fa" ? "کد پیگیری" : payload.locale === "es" ? "Referencia" : "Reference";
  await Promise.allSettled([
    sendEmail(env, { to: adminRecipients(env), subject: `New consultation request: ${payload.fullName} — ${payload.referenceCode}`, html: emailLayout("New consultation request", rowsTable([["Reference", payload.referenceCode], ["Name", payload.fullName], ["Email", payload.email], ["WhatsApp", payload.whatsapp], ["Admin detail placeholder", `${siteUrl(env)}/dashboard`]])), text: `Reference: ${payload.referenceCode}\nName: ${payload.fullName}\nEmail: ${payload.email}`, replyTo: payload.email }),
    sendEmail(env, { to: [payload.email], subject: `Vida Familia consultation — ${payload.referenceCode}`, html: emailLayout(applicantTitle, `<p>${localizedLeadMessage(payload.locale)}</p><p><strong>${referenceLabel}:</strong> ${escapeHtml(payload.referenceCode)}</p>`), text: `${referenceLabel}: ${payload.referenceCode}\n${localizedLeadMessage(payload.locale)}\n${EMAIL_DISCLAIMER}` }),
  ]);
}

async function subscribeNewsletter(request: Request, env: Bindings, ctx: ExecutionContext): Promise<Response> {
  assertOriginAllowed(request, env);
  assertJsonRequest(request);
  const input = await readBoundedJson(request);
  if (!isRecord(input)) throw new ApiError(400, "Request body must be a JSON object");
  const email = normalizeString(input.email, 254).toLowerCase();
  const locale = normalizeLocale(input.locale);
  if (!EMAIL_PATTERN.test(email) || input.consent !== true) throw new ApiError(422, "Please check the highlighted fields", !EMAIL_PATTERN.test(email) ? ["email"] : ["consent"]);
  await verifyTurnstileIfConfigured(request, env, normalizeString(input.turnstileToken, 2048));
  const now = new Date().toISOString();
  await env.DB.prepare(`INSERT INTO newsletter_subscribers (id, created_at, updated_at, email, locale, interest, source, status, consent) VALUES (?, ?, ?, ?, ?, ?, ?, 'subscribed', 1)
    ON CONFLICT(email) DO UPDATE SET updated_at = excluded.updated_at, locale = excluded.locale, interest = excluded.interest, source = excluded.source, status = 'subscribed', consent = 1`)
    .bind(crypto.randomUUID(), now, now, email, locale, optionalString(input.interest, 160), optionalString(input.source, 80))
    .run();
  const newsletterTitle = locale === "fa" ? "عضویت شما در خبرنامه ثبت شد" : locale === "es" ? "Suscripción registrada" : "Newsletter subscription saved";
  const newsletterBody = locale === "fa" ? "عضویت شما ثبت شد. فقط ایمیل‌های کاربردی و مرتبط با مسیر اسپانیا و آرژانتین ارسال می‌کنیم." : locale === "es" ? "Tu suscripción se ha registrado. Solo enviaremos mensajes prácticos y relacionados con las rutas de España y Argentina." : "Your subscription has been saved. We only send practical updates related to Spain and Argentina pathways.";
  ctx.waitUntil(sendEmail(env, { to: [email], subject: "Vida Familia newsletter", html: emailLayout(newsletterTitle, `<p>${newsletterBody}</p>`), text: `${newsletterTitle}\n${newsletterBody}` }).catch((error) => console.error(JSON.stringify({ message: "Newsletter email failed", error: error instanceof Error ? error.message : String(error) }))));
  return json({ ok: true, message: locale === "fa" ? "عضویت ثبت شد." : locale === "es" ? "Suscripción registrada." : "Subscription saved." }, 201);
}

function calculateQuiz(input: JsonRecord): { suggested: string[]; score: number; nextStep: string } {
  let score = 20;
  const target = normalizeString(input.target_country_preference, 80).toLowerCase();
  const goal = normalizeString(input.goal, 160).toLowerCase();
  const budget = normalizeString(input.budget_range, 160).toLowerCase();
  const income = normalizeString(input.income_range, 160).toLowerCase();
  const timeline = normalizeString(input.timeline, 80).toLowerCase();
  const documents = normalizeString(input.documents_ready, 120).toLowerCase();
  const work = normalizeString(input.work_background, 300).toLowerCase();
  if (/(ready|partial|آماده|ترجمه|parcial|sí|si)/.test(documents)) score += 20;
  if (/(3|6|12|month|ماه|soon)/.test(timeline)) score += 15;
  if (/(€|\$|\d|income|salary|remote|درآمد|حقوق)/.test(income)) score += 20;
  if (/(€|\$|\d|k|یورو|دلار)/.test(budget)) score += 15;
  if (work.length > 20) score += 10;
  const suggested: string[] = [];
  if (target.includes("spain") || target.includes("اسپان") || target.includes("espa")) {
    if (goal.includes("study") || goal.includes("تحصیل") || goal.includes("estud")) suggested.push("Spain student visa");
    if (goal.includes("remote") || goal.includes("digital") || goal.includes("nomad") || work.includes("remote") || work.includes("it")) suggested.push("Spain digital nomad");
    suggested.push("Spain family financial means");
  } else if (target.includes("argentina") || target.includes("آرژ") || target.includes("argent")) {
    if (goal.includes("study") || goal.includes("تحصیل") || goal.includes("estud")) suggested.push("Argentina student residency");
    suggested.push("Argentina rentista/family relocation");
  } else {
    suggested.push("Spain student visa", "Spain digital nomad", "Argentina student residency");
  }
  const unique = [...new Set(score < 45 ? ["Not ready / needs review"] : suggested)].slice(0, 3);
  return { suggested: unique, score: Math.min(score, 100), nextStep: score >= 60 ? "Continue to the full assessment form." : "Review budget, timing and documents before applying." };
}

function quizApplicantEmail(locale: Locale, result: { suggested: string[]; score: number; nextStep: string }): { subject: string; title: string; html: string; text: string } {
  const paths = result.suggested.join(", ");
  if (locale === "fa") {
    const title = "نتیجه آزمون مسیر Vida Familia";
    return {
      subject: "نتیجه آزمون مسیر Vida Familia",
      title,
      html: `<p>نتیجه اولیه شما ثبت شد.</p><p><strong>امتیاز آمادگی:</strong> ${result.score}/100</p><p><strong>مسیرهای پیشنهادی:</strong> ${escapeHtml(paths)}</p><p><strong>گام بعدی:</strong> ${escapeHtml(result.nextStep)}</p><p>این نتیجه یک ارزیابی اولیه است و جایگزین بررسی کامل مدارک و شرایط فردی نیست.</p>`,
      text: `${title}\nReadiness: ${result.score}/100\nSuggested paths: ${paths}\nNext step: ${result.nextStep}\n${EMAIL_DISCLAIMER}`,
    };
  }
  if (locale === "es") {
    const title = "Resultado de tu quiz de ruta";
    return {
      subject: "Resultado de tu quiz de ruta Vida Familia",
      title,
      html: `<p>Tu resultado inicial se ha registrado.</p><p><strong>Puntuación de preparación:</strong> ${result.score}/100</p><p><strong>Vías sugeridas:</strong> ${escapeHtml(paths)}</p><p><strong>Siguiente paso:</strong> ${escapeHtml(result.nextStep)}</p><p>Este resultado es una orientación inicial y no sustituye una revisión completa de documentos y circunstancias personales.</p>`,
      text: `${title}\nReadiness: ${result.score}/100\nSuggested paths: ${paths}\nNext step: ${result.nextStep}\n${EMAIL_DISCLAIMER}`,
    };
  }
  const title = "Your pathway quiz result";
  return {
    subject: "Your Vida Familia pathway quiz result",
    title,
    html: `<p>Your initial pathway result has been registered.</p><p><strong>Readiness score:</strong> ${result.score}/100</p><p><strong>Suggested paths:</strong> ${escapeHtml(paths)}</p><p><strong>Next step:</strong> ${escapeHtml(result.nextStep)}</p><p>This is an initial direction and does not replace a full review of documents and personal circumstances.</p>`,
    text: `${title}\nReadiness: ${result.score}/100\nSuggested paths: ${paths}\nNext step: ${result.nextStep}\n${EMAIL_DISCLAIMER}`,
  };
}

async function notifyQuizResult(env: Bindings, payload: { id: string; locale: Locale; input: JsonRecord; result: { suggested: string[]; score: number; nextStep: string }; email: string | null; consent: boolean }): Promise<void> {
  const adminRows: Array<[string, string | number | null]> = [
    ["Quiz ID", payload.id],
    ["Locale", payload.locale],
    ["Contact email", payload.email],
    ["Email result requested", payload.consent ? "yes" : "no"],
    ["Target preference", optionalString(payload.input.target_country_preference, 80)],
    ["Goal", optionalString(payload.input.goal, 160)],
    ["Budget", optionalString(payload.input.budget_range, 160)],
    ["Income", optionalString(payload.input.income_range, 160)],
    ["Family size", optionalString(payload.input.family_size, 30)],
    ["Timeline", optionalString(payload.input.timeline, 80)],
    ["Education level", optionalString(payload.input.education_level, 160)],
    ["Work background", optionalString(payload.input.work_background, 600)],
    ["Documents ready", optionalString(payload.input.documents_ready, 160)],
    ["WhatsApp", optionalString(payload.input.whatsapp, 40)],
    ["Source", optionalString(payload.input.source, 80)],
    ["Readiness score", payload.result.score],
    ["Suggested paths", payload.result.suggested.join(", ")],
    ["Next step", payload.result.nextStep],
  ];
  const jobs: Promise<{ ok: boolean; skipped?: boolean; error?: string }>[] = [
    sendEmail(env, {
      to: adminRecipients(env),
      subject: `New pathway quiz result: ${payload.result.score}/100`,
      html: emailLayout("New pathway quiz result", rowsTable(adminRows)),
      text: adminRows.map(([label, value]) => `${label}: ${value ?? ""}`).join("\n"),
      replyTo: payload.email ?? undefined,
    }),
  ];
  if (payload.email && payload.consent) {
    const applicant = quizApplicantEmail(payload.locale, payload.result);
    jobs.push(sendEmail(env, { to: [payload.email], subject: applicant.subject, html: emailLayout(applicant.title, applicant.html), text: applicant.text }));
  }
  await Promise.allSettled(jobs);
}

async function createQuizResult(request: Request, env: Bindings, ctx: ExecutionContext): Promise<Response> {
  assertOriginAllowed(request, env);
  assertJsonRequest(request);
  const input = await readBoundedJson(request);
  if (!isRecord(input)) throw new ApiError(400, "Request body must be a JSON object");
  const locale = normalizeLocale(input.locale);
  await verifyTurnstileIfConfigured(request, env, normalizeString(input.turnstileToken, 2048));
  const result = calculateQuiz(input);
  const id = crypto.randomUUID();
  const email = optionalString(input.contact_email, 254)?.toLowerCase() ?? null;
  const consent = input.consent === true;
  await env.DB.prepare(`INSERT INTO quiz_results (id, locale, target_country_preference, goal, budget_range, income_range, family_size, timeline, education_level, work_background, documents_ready, suggested_paths_json, readiness_score, contact_email, whatsapp, consent, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, locale, optionalString(input.target_country_preference, 80), optionalString(input.goal, 160), optionalString(input.budget_range, 160), optionalString(input.income_range, 160), optionalString(input.family_size, 30), optionalString(input.timeline, 80), optionalString(input.education_level, 160), optionalString(input.work_background, 600), optionalString(input.documents_ready, 160), JSON.stringify(result.suggested), result.score, email, optionalString(input.whatsapp, 40), consent ? 1 : 0, optionalString(input.source, 80))
    .run();
  ctx.waitUntil(notifyQuizResult(env, { id, locale, input, result, email: email && EMAIL_PATTERN.test(email) ? email : null, consent }).catch((error) => console.error(JSON.stringify({ message: "Quiz notification failed", quizId: id, error: error instanceof Error ? error.message : String(error) }))));
  return json({ ok: true, id, suggested_paths: result.suggested, readiness_score: result.score, next_step: result.nextStep }, 201);
}

const GUIDE_DOWNLOADS: Record<string, { titleFa: string; titleEn: string; titleEs: string; pdfUrl: string; htmlUrl: string }> = {
  "origin-documents-checklist": {
    titleFa: "مدارک مبدا را از کجا شروع کنیم؟",
    titleEn: "Where should origin documents start?",
    titleEs: "¿Por dónde empezar con los documentos de origen?",
    pdfUrl: "https://vidafamilia.es/guides/origin-documents-checklist-fa.pdf",
    htmlUrl: "https://vidafamilia.es/guides/origin-documents-checklist-fa.html",
  },
  "spain-student-checklist": {
    titleFa: "پرسش‌هایی که پیش از انتخاب دوره باید بپرسید",
    titleEn: "Questions to ask before choosing a study program",
    titleEs: "Preguntas antes de elegir un programa de estudios",
    pdfUrl: "https://vidafamilia.es/guides/spain-student-checklist-fa.pdf",
    htmlUrl: "https://vidafamilia.es/guides/spain-student-checklist-fa.html",
  },
  "argentina-rentista-checklist": {
    titleFa: "درآمد آنلاین با پرونده قابل دفاع چه تفاوتی دارد؟",
    titleEn: "Online income vs. a defensible file",
    titleEs: "Ingresos online frente a un expediente defendible",
    pdfUrl: "https://vidafamilia.es/guides/argentina-rentista-checklist-fa.pdf",
    htmlUrl: "https://vidafamilia.es/guides/argentina-rentista-checklist-fa.html",
  },
  "family-relocation-budget": {
    titleFa: "بودجه ماه اول زندگی خانوادگی",
    titleEn: "First-month family relocation budget",
    titleEs: "Presupuesto familiar del primer mes",
    pdfUrl: "https://vidafamilia.es/guides/family-relocation-budget-fa.pdf",
    htmlUrl: "https://vidafamilia.es/guides/family-relocation-budget-fa.html",
  },
};

function guideApplicantEmail(locale: Locale, guideSlug: string): { subject: string; title: string; html: string; text: string } {
  const guide = GUIDE_DOWNLOADS[guideSlug];

  if (locale === "fa") {
    const title = "درخواست راهنمای شما ثبت شد";
    const guideTitle = guide?.titleFa ?? guideSlug;
    const guideLinksHtml = guide
      ? `<p><strong>دانلود PDF:</strong> <a href="${escapeHtml(guide.pdfUrl)}">${escapeHtml(guide.pdfUrl)}</a></p><p><strong>نسخه آنلاین:</strong> <a href="${escapeHtml(guide.htmlUrl)}">${escapeHtml(guide.htmlUrl)}</a></p>`
      : `<p>در حال حاضر فایل دانلود عمومی برای این راهنما در سایت قرار نگرفته است. پس از آماده‌شدن فایل یا لینک واقعی، آن را برای شما ارسال می‌کنیم.</p>`;
    const guideLinksText = guide
      ? `Guide: ${guideTitle}\nPDF: ${guide.pdfUrl}\nOnline version: ${guide.htmlUrl}`
      : `Guide: ${guideSlug}\nThe guide file/link is not published yet. We will send it when available.`;

    return {
      subject: "درخواست راهنمای Vida Familia ثبت شد",
      title,
      html: `<p>درخواست شما برای راهنمای <strong>${escapeHtml(guideTitle)}</strong> ثبت شد.</p>${guideLinksHtml}`,
      text: `${title}\n${guideLinksText}\n${EMAIL_DISCLAIMER}`,
    };
  }

  if (locale === "es") {
    const title = "Tu solicitud de guía se ha registrado";
    const guideTitle = guide?.titleEs ?? guideSlug;
    const guideLinksHtml = guide
      ? `<p><strong>PDF:</strong> <a href="${escapeHtml(guide.pdfUrl)}">${escapeHtml(guide.pdfUrl)}</a></p><p><strong>Versión online:</strong> <a href="${escapeHtml(guide.htmlUrl)}">${escapeHtml(guide.htmlUrl)}</a></p>`
      : `<p>Actualmente no hay un archivo o enlace público de descarga para esta guía. Cuando el enlace real esté disponible, te lo enviaremos.</p>`;
    const guideLinksText = guide
      ? `Guide: ${guideTitle}\nPDF: ${guide.pdfUrl}\nOnline version: ${guide.htmlUrl}`
      : `Guide: ${guideSlug}\nThe guide file/link is not published yet. We will send it when available.`;

    return {
      subject: "Solicitud de guía Vida Familia registrada",
      title,
      html: `<p>Tu solicitud para la guía <strong>${escapeHtml(guideTitle)}</strong> se ha registrado.</p>${guideLinksHtml}`,
      text: `${title}\n${guideLinksText}\n${EMAIL_DISCLAIMER}`,
    };
  }

  const title = "Your guide request has been registered";
  const guideTitle = guide?.titleEn ?? guideSlug;
  const guideLinksHtml = guide
    ? `<p><strong>PDF:</strong> <a href="${escapeHtml(guide.pdfUrl)}">${escapeHtml(guide.pdfUrl)}</a></p><p><strong>Online version:</strong> <a href="${escapeHtml(guide.htmlUrl)}">${escapeHtml(guide.htmlUrl)}</a></p>`
    : `<p>There is not yet a published public download file or guide link for this resource. When the real link is available, we will send it to you.</p>`;
  const guideLinksText = guide
    ? `Guide: ${guideTitle}\nPDF: ${guide.pdfUrl}\nOnline version: ${guide.htmlUrl}`
    : `Guide: ${guideSlug}\nThe guide file/link is not published yet. We will send it when available.`;

  return {
    subject: "Vida Familia guide request registered",
    title,
    html: `<p>Your request for <strong>${escapeHtml(guideTitle)}</strong> has been registered.</p>${guideLinksHtml}`,
    text: `${title}\n${guideLinksText}\n${EMAIL_DISCLAIMER}`,
  };
}

async function notifyGuideUnlock(env: Bindings, payload: { id: string; locale: Locale; guideSlug: string; email: string; fullName: string | null; whatsapp: string | null; interest: string | null; source: string | null; timestamp: string }): Promise<void> {
  const applicant = guideApplicantEmail(payload.locale, payload.guideSlug);
  const adminRows: Array<[string, string | number | null]> = [
    ["Guide unlock ID", payload.id],
    ["Guide", payload.guideSlug],
    ["Email", payload.email],
    ["Name", payload.fullName],
    ["WhatsApp", payload.whatsapp],
    ["Interest", payload.interest],
    ["Locale", payload.locale],
    ["Source", payload.source],
    ["Timestamp", payload.timestamp],
  ];
  await Promise.allSettled([
    sendEmail(env, { to: [payload.email], subject: applicant.subject, html: emailLayout(applicant.title, applicant.html), text: applicant.text }),
    sendEmail(env, { to: adminRecipients(env), subject: `Guide request: ${payload.guideSlug}`, html: emailLayout("New guide request", rowsTable(adminRows)), text: adminRows.map(([label, value]) => `${label}: ${value ?? ""}`).join("\n"), replyTo: payload.email }),
  ]);
}

async function unlockGuide(request: Request, env: Bindings, ctx: ExecutionContext): Promise<Response> {
  assertOriginAllowed(request, env);
  assertJsonRequest(request);
  const input = await readBoundedJson(request);
  if (!isRecord(input)) throw new ApiError(400, "Request body must be a JSON object");
  const locale = normalizeLocale(input.locale);
  const email = normalizeString(input.email, 254).toLowerCase();
  const guideSlug = normalizeString(input.guide_slug, 120);
  if (!EMAIL_PATTERN.test(email) || !guideSlug || input.consent !== true) throw new ApiError(422, "Please check the highlighted fields", !EMAIL_PATTERN.test(email) ? ["email"] : !guideSlug ? ["guide_slug"] : ["consent"]);
  await verifyTurnstileIfConfigured(request, env, normalizeString(input.turnstileToken, 2048));
  const id = crypto.randomUUID();
  const fullName = optionalString(input.full_name, 100);
  const whatsapp = optionalString(input.whatsapp, 40);
  const interest = optionalString(input.interest, 160);
  const source = optionalString(input.source, 80);
  await env.DB.prepare("INSERT INTO guide_unlocks (id, locale, guide_slug, full_name, email, whatsapp, interest, consent, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(id, locale, guideSlug, fullName, email, whatsapp, interest, 1, source)
    .run();
  ctx.waitUntil(notifyGuideUnlock(env, { id, locale, guideSlug, email, fullName, whatsapp, interest, source, timestamp: new Date().toISOString() }).catch((error) => console.error(JSON.stringify({ message: "Guide notification failed", guideUnlockId: id, error: error instanceof Error ? error.message : String(error) }))));
  return json({ ok: true, id, message: locale === "fa" ? "راهنما برای شما ارسال می‌شود." : locale === "es" ? "Te enviaremos la guía." : "The guide will be sent to you." }, 201);
}

async function recordAnalyticsEvent(request: Request, env: Bindings): Promise<Response> {
  assertOriginAllowed(request, env);
  assertJsonRequest(request);
  const input = await readBoundedJson(request);
  if (!isRecord(input)) throw new ApiError(400, "Request body must be a JSON object");
  const eventName = normalizeString(input.event_name, 80);
  const path = normalizeString(input.path, 400) || "/";
  const allowed = new Set(["page_view", "language_switch", "apply_start", "apply_submit", "contact_submit", "quiz_start", "quiz_complete", "guide_unlock", "cta_click"]);
  if (!allowed.has(eventName)) throw new ApiError(422, "Unsupported event_name", ["event_name"]);
  const cf = request.cf as { country?: string } | undefined;
  const metadata = isRecord(input.metadata) ? input.metadata : {};
  await env.DB.prepare("INSERT INTO analytics_events (id, event_name, path, locale, country, source, campaign, session_id, metadata_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(crypto.randomUUID(), eventName, path, optionalString(input.locale, 8), optionalString(input.country, 2) || cf?.country || null, optionalString(input.source, 120), optionalString(input.campaign, 120), optionalString(input.session_id, 120), JSON.stringify(metadata))
    .run();
  return json({ ok: true }, 201);
}

async function adminStats(request: Request, env: Bindings): Promise<Response> {
  assertOriginAllowed(request, env);
  await assertAdmin(request, env);
  const [
    totalLeads, last7, hot, qualified, spain, argentina, student, nomad, contacts, consultations, newsletter, topEvents,
  ] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) AS count FROM leads").first<{ count: number }>(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM leads WHERE julianday(created_at) >= julianday('now', '-7 days')").first<{ count: number }>(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM leads WHERE priority = 'hot'").first<{ count: number }>(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM leads WHERE priority = 'qualified'").first<{ count: number }>(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM leads WHERE target_country = 'Spain'").first<{ count: number }>(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM leads WHERE target_country = 'Argentina'").first<{ count: number }>(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM leads WHERE desired_path = 'Student'").first<{ count: number }>(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM leads WHERE desired_path = 'Digital nomad'").first<{ count: number }>(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM contact_messages").first<{ count: number }>(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM consultation_requests").first<{ count: number }>(),
    env.DB.prepare("SELECT COUNT(*) AS count FROM newsletter_subscribers WHERE status = 'subscribed'").first<{ count: number }>(),
    env.DB.prepare("SELECT event_name, path, COUNT(*) AS count FROM analytics_events GROUP BY event_name, path ORDER BY count DESC LIMIT 10").all(),
  ]);
  return json({ ok: true, stats: {
    total_leads: totalLeads?.count ?? 0,
    leads_last_7_days: last7?.count ?? 0,
    hot_leads: hot?.count ?? 0,
    qualified_leads: qualified?.count ?? 0,
    spain_leads: spain?.count ?? 0,
    argentina_leads: argentina?.count ?? 0,
    student_leads: student?.count ?? 0,
    digital_nomad_leads: nomad?.count ?? 0,
    contact_messages_count: contacts?.count ?? 0,
    consultation_requests_count: consultations?.count ?? 0,
    newsletter_count: newsletter?.count ?? 0,
    top_events: topEvents.results,
  } });
}

async function adminListLeads(request: Request, env: Bindings): Promise<Response> {
  assertOriginAllowed(request, env);
  await assertAdmin(request, env);
  const url = new URL(request.url);
  const limit = Math.min(Math.max(Number.parseInt(url.searchParams.get("limit") ?? "25", 10) || 25, 1), 100);
  const offset = Math.max(Number.parseInt(url.searchParams.get("offset") ?? "0", 10) || 0, 0);
  const filters: string[] = [];
  const params: Array<string | number> = [];
  for (const [param, column, allowedValues] of [
    ["status", "status", ["new", "reviewing", "qualified", "not_fit", "contacted", "archived"]],
    ["priority", "priority", ["hot", "qualified", "review", "not_ready", "spam"]],
    ["target_country", "target_country", [...countries]],
    ["desired_path", "desired_path", [...desiredPaths]],
  ] as const) {
    const value = url.searchParams.get(param);
    if (value && (allowedValues as readonly string[]).includes(value)) {
      filters.push(`${column} = ?`);
      params.push(value);
    }
  }
  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const result = await env.DB.prepare(`SELECT id, created_at, updated_at, reference_code, locale, full_name, email, whatsapp, current_country, target_country, desired_path, family_size, budget_range, income_range, timeline, documents_ready, main_concern, consent, status, priority, lead_score, recommended_next_step, source, campaign, assigned_to, next_follow_up_at FROM leads ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
    .bind(...params, limit, offset)
    .all();
  return json({ ok: true, leads: result.results, limit, offset });
}

async function adminLeadDetail(request: Request, env: Bindings, leadId: string): Promise<Response> {
  assertOriginAllowed(request, env);
  await assertAdmin(request, env);
  const lead = await env.DB.prepare("SELECT * FROM leads WHERE id = ? LIMIT 1").bind(leadId).first();
  if (!lead) throw new ApiError(404, "Lead not found");
  const timeline = await env.DB.prepare("SELECT id, created_at, event_type, note, author, metadata_json FROM lead_timeline WHERE lead_id = ? ORDER BY created_at DESC LIMIT 100").bind(leadId).all();
  return json({ ok: true, lead, timeline: timeline.results });
}

async function adminPatchLeadStatus(request: Request, env: Bindings, leadId: string): Promise<Response> {
  assertOriginAllowed(request, env);
  await assertAdmin(request, env);
  assertJsonRequest(request);
  const input = await readBoundedJson(request);
  if (!isRecord(input)) throw new ApiError(400, "Request body must be a JSON object");
  const status = normalizeString(input.status, 40);
  const priority = optionalString(input.priority, 40);
  const allowedStatus = ["new", "reviewing", "qualified", "not_fit", "contacted", "archived"];
  const allowedPriority = ["hot", "qualified", "review", "not_ready", "spam"];
  if (!allowedStatus.includes(status)) throw new ApiError(422, "Unsupported status", ["status"]);
  if (priority && !allowedPriority.includes(priority)) throw new ApiError(422, "Unsupported priority", ["priority"]);
  const updatedAt = new Date().toISOString();
  await env.DB.prepare("UPDATE leads SET status = ?, priority = COALESCE(?, priority), assigned_to = COALESCE(?, assigned_to), next_follow_up_at = COALESCE(?, next_follow_up_at), updated_at = ? WHERE id = ?")
    .bind(status, priority, optionalString(input.assigned_to, 120), optionalString(input.next_follow_up_at, 80), updatedAt, leadId)
    .run();
  const note = optionalString(input.note, 2000);
  if (note) await saveTimeline(env, leadId, "status_updated", note, optionalString(input.author, 120) ?? "admin", { status, priority });
  return json({ ok: true });
}

async function adminAddLeadNote(request: Request, env: Bindings, leadId: string): Promise<Response> {
  assertOriginAllowed(request, env);
  await assertAdmin(request, env);
  assertJsonRequest(request);
  const input = await readBoundedJson(request);
  if (!isRecord(input)) throw new ApiError(400, "Request body must be a JSON object");
  const note = normalizeString(input.note, 3000);
  if (note.length < 2) throw new ApiError(422, "Note is required", ["note"]);
  await saveTimeline(env, leadId, "note_added", note, normalizeString(input.author, 120) || "admin");
  return json({ ok: true });
}

async function adminSimpleList(request: Request, env: Bindings, table: "contact_messages" | "consultation_requests"): Promise<Response> {
  assertOriginAllowed(request, env);
  await assertAdmin(request, env);
  const url = new URL(request.url);
  const limit = Math.min(Math.max(Number.parseInt(url.searchParams.get("limit") ?? "25", 10) || 25, 1), 100);
  const result = await env.DB.prepare(`SELECT * FROM ${table} ORDER BY created_at DESC LIMIT ?`).bind(limit).all();
  return json({ ok: true, items: result.results });
}

async function route(request: Request, env: Bindings, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
    assertOriginAllowed(request, env);
    return new Response(null, { status: 204, headers: corsHeaders(request, env) });
  }
  if (request.method === "GET" && url.pathname === "/api/health") return json({ ok: true, service: "vida-familia-api", timestamp: new Date().toISOString() });
  if (request.method === "POST" && url.pathname === "/api/leads") return createLead(request, env, ctx);
  if (request.method === "POST" && url.pathname === "/api/contact") return createContactMessage(request, env, ctx);
  if (request.method === "POST" && url.pathname === "/api/consultation-request") return createConsultationRequest(request, env, ctx);
  if (request.method === "POST" && url.pathname === "/api/newsletter") return subscribeNewsletter(request, env, ctx);
  if (request.method === "POST" && url.pathname === "/api/quiz/pathway") return createQuizResult(request, env, ctx);
  if (request.method === "POST" && url.pathname === "/api/guides/unlock") return unlockGuide(request, env, ctx);
  if (request.method === "POST" && url.pathname === "/api/analytics/event") return recordAnalyticsEvent(request, env);
  if (request.method === "GET" && url.pathname === "/api/admin/stats") return adminStats(request, env);
  if (request.method === "GET" && url.pathname === "/api/admin/leads") return adminListLeads(request, env);
  if (request.method === "GET" && url.pathname === "/api/admin/contact-messages") return adminSimpleList(request, env, "contact_messages");
  if (request.method === "GET" && url.pathname === "/api/admin/consultation-requests") return adminSimpleList(request, env, "consultation_requests");
  const detailMatch = url.pathname.match(/^\/api\/admin\/leads\/([^/]+)$/);
  if (request.method === "GET" && detailMatch) return adminLeadDetail(request, env, detailMatch[1] ?? "");
  const statusMatch = url.pathname.match(/^\/api\/admin\/leads\/([^/]+)\/status$/);
  if (request.method === "PATCH" && statusMatch) return adminPatchLeadStatus(request, env, statusMatch[1] ?? "");
  const noteMatch = url.pathname.match(/^\/api\/admin\/leads\/([^/]+)\/notes$/);
  if (request.method === "POST" && noteMatch) return adminAddLeadNote(request, env, noteMatch[1] ?? "");
  throw new ApiError(404, "Not found");
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    try {
      const response = await route(request, env, ctx);
      return withCors(response, request, env);
    } catch (error) {
      if (error instanceof ApiError) return withCors(json({ ok: false, error: error.message, ...(error.fields ? { fields: error.fields } : {}) }, error.status), request, env);
      console.error(JSON.stringify({ message: "Unhandled API error", method: request.method, path: new URL(request.url).pathname, error: error instanceof Error ? error.message : String(error) }));
      return withCors(json({ ok: false, error: "Internal server error" }, 500), request, env);
    }
  },
} satisfies ExportedHandler<Bindings>;
