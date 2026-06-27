import { useCallback, useState } from "react";
import type { Locale } from "@vida-familia/shared";
import { Download, LoaderCircle } from "lucide-react";
import { apiPost } from "../lib/api";
import { trackEvent } from "../lib/analytics";
import { TurnstileWidget } from "./TurnstileWidget";

const guides = [
  "spain-student-checklist",
  "origin-documents-checklist",
  "argentina-rentista-checklist",
  "family-relocation-budget",
];

const copy = {
  fa: { eyebrow: "Ø¯Ø±ÛŒØ§ÙØª Ø±Ø§Ù‡Ù†Ù…Ø§", title: "Ø¯Ø±ÛŒØ§ÙØª Ø±Ø§Ù‡Ù†Ù…Ø§ÛŒ Ø±Ø§ÛŒÚ¯Ø§Ù†", intro: "Ø±Ø§Ù‡Ù†Ù…Ø§ÛŒ Ù…ÙˆØ±Ø¯Ù†Ø¸Ø± Ø±Ø§ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯ ØªØ§ Ø¯Ø±Ø®ÙˆØ§Ø³Øª Ø´Ù…Ø§ Ø«Ø¨Øª Ø´ÙˆØ¯.", name: "Ù†Ø§Ù…", email: "Ø§ÛŒÙ…ÛŒÙ„", whatsapp: "ÙˆØ§ØªØ³â€ŒØ§Ù¾", interest: "Ø¹Ù„Ø§Ù‚Ù‡â€ŒÙ…Ù†Ø¯ÛŒ", consent: "Ø¨Ø§ Ø¯Ø±ÛŒØ§ÙØª Ø§ÛŒÙ† Ø±Ø§Ù‡Ù†Ù…Ø§ Ù…ÙˆØ§ÙÙ‚Ù….", submit: "Ø§Ø±Ø³Ø§Ù„ Ø±Ø§Ù‡Ù†Ù…Ø§", success: "Ø¯Ø±Ø®ÙˆØ§Ø³Øª Ø±Ø§Ù‡Ù†Ù…Ø§ÛŒ Ø´Ù…Ø§ Ø«Ø¨Øª Ø´Ø¯. Ù¾Ø³ Ø§Ø² ÙØ¹Ø§Ù„â€ŒØ´Ø¯Ù† Ø§Ø±Ø³Ø§Ù„ Ø§ÛŒÙ…ÛŒÙ„ØŒ Ù„ÛŒÙ†Ú© Ø±Ø§Ù‡Ù†Ù…Ø§ Ø¨Ø±Ø§ÛŒ Ø´Ù…Ø§ Ø§Ø±Ø³Ø§Ù„ Ù…ÛŒâ€ŒØ´ÙˆØ¯." },
  en: { eyebrow: "Guide unlock", title: "Unlock a free guide", intro: "Choose a guide and we will register the request.", name: "Name", email: "Email", whatsapp: "WhatsApp", interest: "Interest", consent: "I agree to receive this guide.", submit: "Send guide", success: "Your guide request has been registered. Once email delivery is active, the guide link will be sent to you." },
  es: { eyebrow: "Recibir guÃ­a", title: "Recibe una guÃ­a gratuita", intro: "Elige una guÃ­a y registraremos la solicitud.", name: "Nombre", email: "Email", whatsapp: "WhatsApp", interest: "InterÃ©s", consent: "Acepto recibir esta guÃ­a.", submit: "Enviar guÃ­a", success: "Tu solicitud de guÃ­a se ha registrado. Cuando el envÃ­o de correo estÃ© activo, te enviaremos el enlace de la guÃ­a." },
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
      <div><p className="eyebrow">{c.eyebrow}</p><h2>{c.title}</h2><p>{c.intro}</p><div className="guide-list">{guides.map((guide) => <button className={guide === selected ? "active" : ""} type="button" key={guide} onClick={() => setSelected(guide)}><bdi>{guide}</bdi></button>)}</div></div>
      <form onSubmit={(event) => void submit(event)}>
        <input type="hidden" name="guide_slug" value={selected} />
        <label className="form-field"><span>{c.name}</span><input name="full_name" maxLength={100} dir="auto" /></label>
        <label className="form-field"><span>{c.email}<b>*</b></span><input name="email" type="email" required dir="auto" /></label>
        <label className="form-field"><span>{c.whatsapp}</span><input name="whatsapp" type="tel" dir="auto" /></label>
        <label className="form-field"><span>{c.interest}</span><input name="interest" dir="auto" /></label>
        <label className="consent-field"><input name="consent" type="checkbox" required /><span>{c.consent}</span></label>
        <TurnstileWidget onToken={handleTurnstileToken} resetSignal={turnstileResetSignal} />
        <button className="button button-gold form-submit" disabled={busy} type="submit">{busy ? <LoaderCircle className="spin" /> : <Download size={18} />}{c.submit}</button>
        {message ? <div className="form-message success">{message}</div> : null}
      </form>
    </section>
  );
}
