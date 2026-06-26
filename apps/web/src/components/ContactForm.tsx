import { useCallback, useRef, useState } from "react";
import type { Locale } from "@vida-familia/shared";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { apiPost, publicWhatsAppLink } from "../lib/api";
import { trackEvent } from "../lib/analytics";
import { TurnstileWidget } from "./TurnstileWidget";

type Status = "idle" | "submitting" | "success" | "error";

const copy = {
  fa: {
    title: "پیام خود را بفرستید",
    intro: "برای سؤال عمومی، همکاری یا هماهنگی اولیه پیام بگذارید. ارزیابی پرونده شخصی همچنان از فرم ارزیابی شروع می‌شود.",
    fullName: "نام و نام خانوادگی",
    email: "ایمیل",
    whatsapp: "واتس‌اپ",
    topic: "موضوع",
    message: "پیام",
    consent: "می‌پذیرم که Vida Familia اطلاعات من را برای پاسخ‌گویی ذخیره و استفاده کند.",
    submit: "ارسال پیام",
    success: "پیام شما دریافت شد.",
    error: "پیام ارسال نشد. کمی بعد دوباره تلاش کنید.",
    whatsappLink: "ادامه در واتس‌اپ",
  },
  en: {
    title: "Send us a message",
    intro: "Use this for general questions, partnerships or initial coordination. Personal case assessment still begins with the assessment form.",
    fullName: "Full name",
    email: "Email",
    whatsapp: "WhatsApp",
    topic: "Topic",
    message: "Message",
    consent: "I agree that Vida Familia may store and use my details to respond.",
    submit: "Send message",
    success: "Your message was received.",
    error: "Message failed. Please try again shortly.",
    whatsappLink: "Continue on WhatsApp",
  },
  es: {
    title: "Envíanos un mensaje",
    intro: "Para preguntas generales, colaboraciones o coordinación inicial. La evaluación personal empieza con el formulario.",
    fullName: "Nombre completo",
    email: "Correo electrónico",
    whatsapp: "WhatsApp",
    topic: "Tema",
    message: "Mensaje",
    consent: "Acepto que Vida Familia almacene y use mis datos para responder.",
    submit: "Enviar mensaje",
    success: "Hemos recibido tu mensaje.",
    error: "No se pudo enviar. Inténtalo de nuevo en unos minutos.",
    whatsappLink: "Continuar por WhatsApp",
  },
} as const;

function value(formData: FormData, key: string): string {
  const item = formData.get(key);
  return typeof item === "string" ? item.trim() : "";
}

export function ContactForm({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const handleTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const formData = new FormData(form);
    const payload = {
      locale,
      preferred_language: locale,
      full_name: value(formData, "full_name"),
      email: value(formData, "email"),
      whatsapp: value(formData, "whatsapp"),
      topic: value(formData, "topic"),
      message: value(formData, "message"),
      consent: formData.get("consent") === "on",
      website: value(formData, "website"),
      turnstileToken,
      source: "contact_page",
    };
    if (!payload.consent) {
      setStatus("error");
      setMessage(c.consent);
      return;
    }
    setStatus("submitting");
    setMessage("");
    try {
      const result = await apiPost<{ ok: true; message: string }>("/api/contact", payload);
      setStatus("success");
      setMessage(result.message || c.success);
      trackEvent("contact_submit", { topic: payload.topic }, locale);
      formRef.current?.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : c.error);
    } finally {
      setTurnstileToken("");
      setTurnstileResetSignal((value) => value + 1);
    }
  }

  const whatsApp = publicWhatsAppLink(`Vida Familia contact, ${message || c.success}`);

  return (
    <section className="contact-form-section content-section">
      <div className="form-intro"><p className="eyebrow">CONTACT FORM</p><h2>{c.title}</h2><p>{c.intro}</p></div>
      <form ref={formRef} className="contact-form" onSubmit={(event) => void submit(event)}>
        <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <div className="form-grid">
          <label className="form-field"><span>{c.fullName}<b>*</b></span><input name="full_name" required maxLength={100} dir="auto" /></label>
          <label className="form-field"><span>{c.email}<b>*</b></span><input name="email" type="email" required dir="auto" maxLength={254} /></label>
          <label className="form-field"><span>{c.whatsapp}</span><input name="whatsapp" type="tel" dir="auto" maxLength={40} /></label>
          <label className="form-field"><span>{c.topic}<b>*</b></span><input name="topic" required maxLength={120} dir="auto" /></label>
        </div>
        <label className="form-field"><span>{c.message}<b>*</b></span><textarea name="message" required rows={5} maxLength={3000} dir="auto" /></label>
        <label className="consent-field"><input type="checkbox" name="consent" required /><span>{c.consent}</span></label>
        <TurnstileWidget onToken={handleTurnstileToken} resetSignal={turnstileResetSignal} />
        {status === "success" ? <div className="form-message success"><CheckCircle2 /> <span>{message || c.success}{whatsApp ? <> · <a href={whatsApp} target="_blank" rel="noreferrer">{c.whatsappLink}</a></> : null}</span></div> : null}
        {status === "error" ? <div className="form-message error">{message || c.error}</div> : null}
        <button className="button button-gold form-submit" type="submit" disabled={status === "submitting"}>{status === "submitting" ? <LoaderCircle className="spin" /> : <Send size={18} />}{c.submit}</button>
      </form>
    </section>
  );
}
