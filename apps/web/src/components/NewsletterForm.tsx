import { useCallback, useState } from "react";
import type { Locale } from "@vida-familia/shared";
import { apiPost } from "../lib/api";
import { TurnstileWidget } from "./TurnstileWidget";

const labels = {
  fa: { title: "خبرنامه Vida Familia", email: "ایمیل", interest: "علاقه‌مندی", submit: "عضویت", success: "عضویت ثبت شد.", consent: "با دریافت پیام‌های آموزشی موافقم." },
  en: { title: "Vida Familia newsletter", email: "Email", interest: "Interest", submit: "Subscribe", success: "Subscription saved.", consent: "I agree to receive educational updates." },
  es: { title: "Newsletter Vida Familia", email: "Email", interest: "Interés", submit: "Suscribirme", success: "Suscripción registrada.", consent: "Acepto recibir novedades educativas." },
} as const;

export function NewsletterForm({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const l = labels[locale];
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const handleTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setMessage("");
    try {
      await apiPost("/api/newsletter", {
        email: String(data.get("email") || "").trim(),
        interest: String(data.get("interest") || "").trim(),
        locale,
        source: compact ? "footer" : "resources",
        consent: data.get("consent") === "on",
        turnstileToken,
      });
      setMessage(l.success);
      form.reset();
      setTurnstileToken("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to subscribe.");
    } finally {
      setBusy(false);
      setTurnstileToken("");
      setTurnstileResetSignal((value) => value + 1);
    }
  }

  return (
    <form className={`newsletter-form ${compact ? "newsletter-compact" : ""}`} onSubmit={(event) => void submit(event)}>
      <p className="eyebrow">{l.title}</p>
      <div><input name="email" type="email" required placeholder={l.email} dir="ltr" /><input name="interest" placeholder={l.interest} /></div>
      <label><input name="consent" type="checkbox" required /> <span>{l.consent}</span></label>
      <TurnstileWidget onToken={handleTurnstileToken} resetSignal={turnstileResetSignal} />
      <button className="button button-gold button-small" disabled={busy} type="submit">{l.submit}</button>
      {message ? <small>{message}</small> : null}
    </form>
  );
}
