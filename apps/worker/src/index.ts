import { countries, desiredPaths, isLocale, type LeadPayload } from "@vida-familia/shared";

type Bindings = Env & {
  ADMIN_API_TOKEN?: string;
  ALLOWED_ORIGINS?: string;
};

type NormalizedLead = Omit<LeadPayload, "website">;

const MAX_BODY_BYTES = 32 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_ALLOWED_ORIGINS = "http://localhost:5173,https://vidafamilia.es,https://www.vidafamilia.es";

class ApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly fields?: string[]) {
    super(message);
  }
}

function json(data: unknown, status = 200, headers?: HeadersInit): Response {
  return Response.json(data, { status, headers });
}

function allowedOrigins(env: Bindings): Set<string> {
  return new Set((env.ALLOWED_ORIGINS ?? DEFAULT_ALLOWED_ORIGINS).split(",").map((origin) => origin.trim()).filter(Boolean));
}

function corsHeaders(request: Request, env: Bindings): Headers {
  const origin = request.headers.get("Origin");
  const headers = new Headers({ Vary: "Origin" });
  if (origin && allowedOrigins(env).has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
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
  if (origin && !allowedOrigins(env).has(origin)) throw new ApiError(403, "Origin not allowed");
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

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function normalizeString(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  return input.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function validateLead(input: unknown): { lead: NormalizedLead; honeypot: string } {
  if (!isRecord(input)) throw new ApiError(400, "Request body must be a JSON object");
  const rawLocale = typeof input.locale === "string" ? input.locale : undefined;
  const rawTargetCountry = input.target_country;
  const rawDesiredPath = input.desired_path;

  const lead: NormalizedLead = {
    locale: isLocale(rawLocale) ? rawLocale : "fa",
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
  };

  const required: Array<keyof NormalizedLead> = ["full_name", "email", "whatsapp", "current_country", "family_size", "budget_range", "income_range", "timeline", "documents_ready", "main_concern"];
  const invalid = required.filter((field) => typeof lead[field] !== "string" || (lead[field] as string).length === 0);
  if (lead.full_name.length < 2) invalid.push("full_name");
  if (!EMAIL_PATTERN.test(lead.email)) invalid.push("email");
  if (!countries.includes(rawTargetCountry as (typeof countries)[number])) invalid.push("target_country");
  if (!desiredPaths.includes(rawDesiredPath as (typeof desiredPaths)[number])) invalid.push("desired_path");
  if (!lead.consent) invalid.push("consent");

  const uniqueInvalid = [...new Set(invalid)];
  if (uniqueInvalid.length) throw new ApiError(422, "Please check the highlighted fields", uniqueInvalid);
  return { lead, honeypot: normalizeString(input.website, 200) };
}

async function createLead(request: Request, env: Bindings): Promise<Response> {
  assertOriginAllowed(request, env);
  if (!request.headers.get("Content-Type")?.toLowerCase().includes("application/json")) throw new ApiError(415, "Content-Type must be application/json");
  const { lead, honeypot } = validateLead(await readBoundedJson(request));
  if (honeypot) return json({ ok: true }, 202);

  const recent = await env.DB.prepare("SELECT id FROM leads WHERE email = ? AND julianday(created_at) >= julianday('now', '-5 minutes') LIMIT 1").bind(lead.email).first<{ id: string }>();
  if (recent) throw new ApiError(429, "A recent request already exists. Please wait before trying again.");

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  await env.DB.prepare(`
    INSERT INTO leads (
      id, created_at, locale, full_name, email, whatsapp, current_country,
      target_country, desired_path, family_size, budget_range, income_range,
      education_background, professional_background, timeline, documents_ready,
      main_concern, message, consent, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, createdAt, lead.locale, lead.full_name, lead.email, lead.whatsapp, lead.current_country,
    lead.target_country, lead.desired_path, lead.family_size, lead.budget_range, lead.income_range,
    lead.education_background || null, lead.professional_background || null, lead.timeline,
    lead.documents_ready, lead.main_concern, lead.message || null, 1, "new",
  ).run();

  return json({ ok: true, id, message: "Lead received" }, 201);
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

async function listLeads(request: Request, env: Bindings): Promise<Response> {
  assertOriginAllowed(request, env);
  const expectedToken = env.ADMIN_API_TOKEN;
  if (!expectedToken) throw new ApiError(404, "Not found");
  const header = request.headers.get("Authorization");
  const providedToken = header?.startsWith("Bearer ") ? header.slice(7) : "";
  if (!providedToken || !(await constantTimeEqual(providedToken, expectedToken))) throw new ApiError(401, "Unauthorized");

  const url = new URL(request.url);
  const requestedLimit = Number.parseInt(url.searchParams.get("limit") ?? "25", 10);
  const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 100) : 25;
  const before = normalizeString(url.searchParams.get("before"), 40) || null;
  const result = await env.DB.prepare(`
    SELECT id, created_at, locale, full_name, email, whatsapp, current_country,
      target_country, desired_path, family_size, budget_range, income_range,
      education_background, professional_background, timeline, documents_ready,
      main_concern, message, consent, status
    FROM leads
    WHERE (? IS NULL OR created_at < ?)
    ORDER BY created_at DESC
    LIMIT ?
  `).bind(before, before, limit).all();
  const last = result.results.at(-1);
  const nextCursor = last && typeof last.created_at === "string" && result.results.length === limit ? last.created_at : null;
  return json({ ok: true, leads: result.results, next_cursor: nextCursor });
}

async function route(request: Request, env: Bindings): Promise<Response> {
  const url = new URL(request.url);
  if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
    assertOriginAllowed(request, env);
    return new Response(null, { status: 204, headers: corsHeaders(request, env) });
  }
  if (request.method === "GET" && url.pathname === "/api/health") return json({ ok: true, service: "vida-familia-api", timestamp: new Date().toISOString() });
  if (request.method === "POST" && url.pathname === "/api/leads") return createLead(request, env);
  if (request.method === "GET" && url.pathname === "/api/admin/leads") return listLeads(request, env);
  throw new ApiError(404, "Not found");
}

export default {
  async fetch(request, env): Promise<Response> {
    try {
      const response = await route(request, env);
      return withCors(response, request, env);
    } catch (error) {
      if (error instanceof ApiError) return withCors(json({ ok: false, error: error.message, ...(error.fields ? { fields: error.fields } : {}) }, error.status), request, env);
      console.error(JSON.stringify({ message: "Unhandled API error", method: request.method, path: new URL(request.url).pathname, error: error instanceof Error ? error.message : String(error) }));
      return withCors(json({ ok: false, error: "Internal server error" }, 500), request, env);
    }
  },
} satisfies ExportedHandler<Bindings>;
