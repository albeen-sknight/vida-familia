import { useCallback, useState } from "react";
import type { Locale } from "@vida-familia/shared";
import { Download, LoaderCircle } from "lucide-react";
import { apiPost } from "../lib/api";
import { trackEvent } from "../lib/analytics";
import { TurnstileWidget } from "./TurnstileWidget";

const guides = [
  "spain-student-checklist",
  "spain-first-month-madrid",
  "argentina-rentista-checklist",
  "family-relocation-budget",
];

const copy = {
  fa: { title: "دریافت راهنمای رایگان", intro: "راهنمای موردنظر را انتخاب کنید تا لینک برای شما ایمیل شود.", name: "نام", email: "ایمیل", whatsapp: "واتس‌اپ", interest: "علاقه‌مندی", consent: "با دریافت این راهنما موافقم.", submit: "ارسال راهنما", success: "درخواست راهنما ثبت شد." },
  en: { title: "Unlock a free guide", intro: "Choose a guide and we will send the link by email.", name: "Name", email: "Email", whatsapp: "WhatsApp", interest: "Interest", consent: "I agree to receive this guide.", submit: "Send guide", success: "Guide request saved." },
  es: { title: "Recibe una guía gratuita", intro: "Elige una guía y enviaremos el enlace por email.", name: "Nombre", email: "Email", whatsapp: "WhatsApp", interest: "Interés", consent: "Acepto recibir esta guía.", submit: "Enviar guía", success: "Solicitud registrada." },
} as const;

export function GuideUnlockSection({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [selected, setSelected] = useState(guides[0]);
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
      await apiPost("/api/guides/unlock", {
        locale,
        guide_slug: selected,
        full_name: String(data.get("full_name") || "").trim(),
        email: String(data.get("email") || "").trim(),
        whatsapp: String(data.get("whatsapp") || "").trim(),
        interest: String(data.get("interest") || "").trim(),
        consent: data.get("consent") === "on",
        source: "resources_page",
        turnstileToken,
      });
      trackEvent("guide_unlock", { guide_slug: selected }, locale);
      setMessage(c.success);
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to unlock guide.");
    } finally {
      setBusy(false);
      setTurnstileToken("");
      setTurnstileResetSignal((value) => value + 1);
    }
  }

  return (
    <section className="guide-unlock content-section">
      <div><p className="eyebrow">GUIDE UNLOCK</p><h2>{c.title}</h2><p>{c.intro}</p><div className="guide-list">{guides.map((guide) => <button className={guide === selected ? "active" : ""} type="button" key={guide} onClick={() => setSelected(guide)}>{guide}</button>)}</div></div>
      <form onSubmit={(event) => void submit(event)}>
        <input type="hidden" name="guide_slug" value={selected} />
        <label className="form-field"><span>{c.name}</span><input name="full_name" maxLength={100} /></label>
        <label className="form-field"><span>{c.email}<b>*</b></span><input name="email" type="email" required dir="ltr" /></label>
        <label className="form-field"><span>{c.whatsapp}</span><input name="whatsapp" type="tel" dir="ltr" /></label>
        <label className="form-field"><span>{c.interest}</span><input name="interest" /></label>
        <label className="consent-field"><input name="consent" type="checkbox" required /><span>{c.consent}</span></label>
        <TurnstileWidget onToken={handleTurnstileToken} resetSignal={turnstileResetSignal} />
        <button className="button button-gold form-submit" disabled={busy} type="submit">{busy ? <LoaderCircle className="spin" /> : <Download size={18} />}{c.submit}</button>
        {message ? <div className="form-message success">{message}</div> : null}
      </form>
    </section>
  );
}
