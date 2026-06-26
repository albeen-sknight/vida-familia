import { useCallback, useRef, useState } from "react";
import type { LeadPayload, Locale } from "@vida-familia/shared";
import { CheckCircle2, LoaderCircle, MessageCircle, Send } from "lucide-react";
import { apiPost, publicWhatsAppLink } from "../lib/api";
import { trackEvent } from "../lib/analytics";
import { TurnstileWidget } from "./TurnstileWidget";

type FormStatus = "idle" | "submitting" | "success" | "error";
type LeadResult = {
  ok: true;
  lead_id: string;
  reference_code: string;
  priority: string;
  user_status?: string;
  recommended_next_step: string;
  message: string;
};

const labels = {
  fa: {
    title: "فرم ارزیابی اولیه",
    intro: "این فرم حدود ۵ دقیقه زمان می‌برد. پاسخ دقیق شما کمک می‌کند پیش از هر تماس، تناسب مسیر را واقع‌بینانه بررسی کنیم.",
    fields: { full_name: "نام و نام خانوادگی", email: "ایمیل", whatsapp: "واتس‌اپ با کد کشور", current_country: "کشور محل اقامت فعلی", target_country: "کشور مقصد", desired_path: "مسیر موردنظر", family_size: "تعداد اعضای خانواده", budget_range: "بودجه تقریبی جابه‌جایی", income_range: "درآمد ماهانه تقریبی", education_background: "سابقه تحصیلی", professional_background: "سابقه حرفه‌ای", timeline: "زمان موردنظر برای اقدام", documents_ready: "وضعیت آماده‌بودن مدارک", main_concern: "مهم‌ترین سؤال یا نگرانی", message: "توضیحات تکمیلی" },
    choose: "انتخاب کنید",
    destinations: { Spain: "اسپانیا", Argentina: "آرژانتین", "Not sure": "هنوز مطمئن نیستم" },
    paths: { Student: "تحصیل", "Digital nomad": "نومد دیجیتال", "Family financial means": "تمکن مالی خانواده", Rentista: "رنتیستا", "Business/company": "کسب‌وکار / شرکت", "Not sure": "هنوز مطمئن نیستم" },
    consent: "با ارسال این فرم تأیید می‌کنم که اطلاعات اولیه من برای بررسی شرایط و پاسخگویی توسط Vida Familia ذخیره شود.",
    submit: "ارسال برای ارزیابی",
    success: "درخواست شما ثبت شد. پس از بررسی اولیه از مسیر ارتباطی اعلام‌شده با شما تماس می‌گیریم.",
    error: "ارسال انجام نشد. لطفاً اتصال خود را بررسی کنید یا کمی بعد دوباره تلاش کنید.",
    privacy: "اطلاعات شما فقط برای ارزیابی و تماس استفاده می‌شود. این فرم به‌معنای پذیرش پرونده یا تضمین نتیجه نیست.",
  },
  en: {
    title: "Initial assessment form", intro: "This takes about five minutes. Accurate answers help us assess fit before any call.",
    fields: { full_name: "Full name", email: "Email", whatsapp: "WhatsApp with country code", current_country: "Current country", target_country: "Target country", desired_path: "Desired pathway", family_size: "Family size", budget_range: "Approximate relocation budget", income_range: "Approximate monthly income", education_background: "Education background", professional_background: "Professional background", timeline: "Preferred timeline", documents_ready: "Document readiness", main_concern: "Main question or concern", message: "Additional context" },
    choose: "Choose an option", destinations: { Spain: "Spain", Argentina: "Argentina", "Not sure": "Not sure" }, paths: { Student: "Student", "Digital nomad": "Digital nomad", "Family financial means": "Family financial means", Rentista: "Rentista", "Business/company": "Business / company", "Not sure": "Not sure" },
    consent: "By submitting, I agree that Vida Familia may store my initial information to assess my situation and contact me.", submit: "Submit for assessment", success: "Your request has been recorded. We will review it before contacting you.", error: "Submission failed. Check your connection or try again shortly.", privacy: "Your information is used only for assessment and contact. Submitting does not mean case acceptance or a guaranteed outcome.",
  },
  es: {
    title: "Formulario de evaluación inicial", intro: "Tarda unos cinco minutos. Tus respuestas nos ayudan a valorar el encaje antes de una llamada.",
    fields: { full_name: "Nombre completo", email: "Correo electrónico", whatsapp: "WhatsApp con prefijo", current_country: "País actual", target_country: "País de destino", desired_path: "Vía deseada", family_size: "Tamaño familiar", budget_range: "Presupuesto aproximado", income_range: "Ingresos mensuales aproximados", education_background: "Formación académica", professional_background: "Experiencia profesional", timeline: "Plazo previsto", documents_ready: "Estado de documentos", main_concern: "Principal pregunta o preocupación", message: "Contexto adicional" },
    choose: "Elige una opción", destinations: { Spain: "España", Argentina: "Argentina", "Not sure": "No estoy seguro" }, paths: { Student: "Estudios", "Digital nomad": "Nómada digital", "Family financial means": "Medios económicos familiares", Rentista: "Rentista", "Business/company": "Empresa / negocio", "Not sure": "No estoy seguro" },
    consent: "Al enviar, acepto que Vida Familia almacene mis datos iniciales para evaluar mi situación y contactarme.", submit: "Enviar para evaluación", success: "Tu solicitud se ha registrado. La revisaremos antes de contactarte.", error: "No se pudo enviar. Comprueba la conexión o inténtalo de nuevo en unos minutos.", privacy: "Tus datos se usan solo para evaluación y contacto. El envío no implica aceptación ni garantía de resultado.",
  },
} as const;

const targetCountries = ["Spain", "Argentina", "Not sure"] as const;
const paths = ["Student", "Digital nomad", "Family financial means", "Rentista", "Business/company", "Not sure"] as const;

function value(formData: FormData, key: string): string {
  const item = formData.get(key);
  return typeof item === "string" ? item.trim() : "";
}

export function LeadForm({ locale }: { locale: Locale }) {
  const l = labels[locale];
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<LeadResult | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const handleTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const payload: LeadPayload & { source: string; turnstileToken?: string } = {
      locale,
      full_name: value(formData, "full_name"), email: value(formData, "email"), whatsapp: value(formData, "whatsapp"), current_country: value(formData, "current_country"),
      target_country: value(formData, "target_country") as LeadPayload["target_country"], desired_path: value(formData, "desired_path") as LeadPayload["desired_path"], family_size: value(formData, "family_size"),
      budget_range: value(formData, "budget_range"), income_range: value(formData, "income_range"), education_background: value(formData, "education_background"), professional_background: value(formData, "professional_background"),
      timeline: value(formData, "timeline"), documents_ready: value(formData, "documents_ready"), main_concern: value(formData, "main_concern"), message: value(formData, "message"), consent: formData.get("consent") === "on", website: value(formData, "website"),
      source: "apply_form",
      turnstileToken,
    };

    if (!payload.consent) { setStatus("error"); setErrorMessage(l.consent); return; }
    setStatus("submitting"); setErrorMessage("");
    setResult(null);
    trackEvent("apply_start", { target_country: payload.target_country, desired_path: payload.desired_path }, locale);
    try {
      const data = await apiPost<LeadResult>("/api/leads", payload);
      setResult(data);
      setStatus("success");
      trackEvent("apply_submit", { reference_code: data.reference_code, priority: data.priority }, locale);
      formRef.current?.reset();
    } catch (error) {
      setStatus("error");
      const safeMessage = error instanceof Error && error.name !== "AbortError" && !(error instanceof TypeError) ? error.message : l.error;
      setErrorMessage(safeMessage);
    } finally {
      setTurnstileToken("");
      setTurnstileResetSignal((value) => value + 1);
    }
  }

  const input = (name: keyof typeof l.fields, options?: { type?: string; required?: boolean; dir?: "ltr" | "rtl" | "auto"; placeholder?: string }) => (
    <label className="form-field"><span>{l.fields[name]}{options?.required === false ? null : <b aria-hidden="true">*</b>}</span><input name={name} type={options?.type ?? "text"} required={options?.required !== false} dir={options?.dir ?? "auto"} placeholder={options?.placeholder} maxLength={name === "email" ? 254 : 160} /></label>
  );

  return (
    <section className="lead-form-card">
      <div className="form-intro"><p className="eyebrow">QUALIFICATION</p><h2>{l.title}</h2><p>{l.intro}</p><div className="form-progress"><span>01</span><i /><span>04</span></div></div>
      <form ref={formRef} onSubmit={(event) => void submit(event)} noValidate={false}>
        <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <fieldset><legend>01 · {locale === "fa" ? "اطلاعات تماس" : locale === "es" ? "Contacto" : "Contact"}</legend><div className="form-grid">{input("full_name")}{input("email", { type: "email" })}{input("whatsapp", { type: "tel", placeholder: "+34 …" })}{input("current_country")}</div></fieldset>
        <fieldset><legend>02 · {locale === "fa" ? "مقصد و مسیر" : locale === "es" ? "Destino y vía" : "Destination & path"}</legend><div className="form-grid">
          <label className="form-field"><span>{l.fields.target_country}<b>*</b></span><select name="target_country" required defaultValue=""><option value="" disabled>{l.choose}</option>{targetCountries.map((item) => <option key={item} value={item}>{l.destinations[item]}</option>)}</select></label>
          <label className="form-field"><span>{l.fields.desired_path}<b>*</b></span><select name="desired_path" required defaultValue=""><option value="" disabled>{l.choose}</option>{paths.map((item) => <option key={item} value={item}>{l.paths[item]}</option>)}</select></label>
          {input("family_size", { type: "number" })}{input("timeline", { placeholder: locale === "fa" ? "مثلاً ۶ تا ۱۲ ماه" : "e.g. 6–12 months" })}
        </div></fieldset>
        <fieldset><legend>03 · {locale === "fa" ? "آمادگی مالی و حرفه‌ای" : locale === "es" ? "Preparación económica y profesional" : "Financial & professional readiness"}</legend><div className="form-grid">{input("budget_range")}{input("income_range")}{input("education_background", { required: false })}{input("professional_background", { required: false })}{input("documents_ready")}</div></fieldset>
        <fieldset><legend>04 · {locale === "fa" ? "اولویت شما" : locale === "es" ? "Tu prioridad" : "Your priority"}</legend><div className="form-grid form-grid-full">
          <label className="form-field"><span>{l.fields.main_concern}<b>*</b></span><textarea name="main_concern" required rows={4} maxLength={1200} dir="auto" /></label>
          <label className="form-field"><span>{l.fields.message}</span><textarea name="message" rows={4} maxLength={3000} dir="auto" /></label>
        </div></fieldset>
        <label className="consent-field"><input type="checkbox" name="consent" required /><span>{l.consent}</span></label>
        <TurnstileWidget onToken={handleTurnstileToken} resetSignal={turnstileResetSignal} />
        <p className="form-privacy">{l.privacy}</p>
        {status === "success" ? <div className="form-message success form-result" role="status"><CheckCircle2 /><div><p>{result?.message || l.success}</p>{result ? <dl><div><dt>{locale === "fa" ? "کد پیگیری" : locale === "es" ? "Referencia" : "Reference"}</dt><dd><bdi>{result.reference_code}</bdi></dd></div><div><dt>{locale === "fa" ? "وضعیت اولیه" : locale === "es" ? "Estado inicial" : "Initial status"}</dt><dd dir="auto">{result.user_status || (locale === "fa" ? "قابل بررسی" : locale === "es" ? "Listo para revisión" : "Ready for review")}</dd></div><div><dt>{locale === "fa" ? "مرحله بعد" : locale === "es" ? "Siguiente paso" : "Next step"}</dt><dd dir="auto">{result.recommended_next_step}</dd></div></dl> : null}{result && publicWhatsAppLink(`Vida Familia ${result.reference_code}`) ? <a className="text-link" href={publicWhatsAppLink(`Vida Familia ${result.reference_code}`) ?? undefined} target="_blank" rel="noreferrer"><MessageCircle size={17} />{locale === "fa" ? "ارسال کد در واتس‌اپ" : locale === "es" ? "Enviar referencia por WhatsApp" : "Send reference by WhatsApp"}</a> : null}</div></div> : null}
        {status === "error" ? <div className="form-message error" role="alert">{errorMessage || l.error}</div> : null}
        <button className="button button-gold form-submit" type="submit" disabled={status === "submitting"}>{status === "submitting" ? <LoaderCircle className="spin" /> : <Send size={18} />}{l.submit}</button>
      </form>
    </section>
  );
}
