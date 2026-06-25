import { useCallback, useState } from "react";
import type { Locale } from "@vida-familia/shared";
import { ArrowUpLeft, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { apiPost } from "../lib/api";
import { trackEvent } from "../lib/analytics";
import { routeFor } from "../lib/locale";
import { TurnstileWidget } from "./TurnstileWidget";

const copy = {
  fa: {
    eyebrow: "PATHWAY QUIZ",
    title: "کدام مسیر به شما نزدیک‌تر است؟",
    intro: "چند پاسخ کوتاه بدهید تا یک پیشنهاد اولیه و غیرقطعی دریافت کنید.",
    country: "ترجیح کشور",
    goal: "هدف اصلی",
    budget: "بودجه",
    income: "درآمد",
    timeline: "زمان‌بندی",
    documents: "مدارک",
    email: "ایمیل اختیاری برای ارسال نتیجه",
    consent: "می‌خواهم نتیجه برایم ایمیل شود.",
    submit: "دریافت پیشنهاد اولیه",
    result: "پیشنهاد اولیه",
    next: "ادامه با فرم ارزیابی",
  },
  en: {
    eyebrow: "PATHWAY QUIZ",
    title: "Which path fits you best?",
    intro: "Answer a few quick questions for an initial, non-binding direction.",
    country: "Country preference",
    goal: "Main goal",
    budget: "Budget",
    income: "Income",
    timeline: "Timeline",
    documents: "Documents",
    email: "Optional email for results",
    consent: "Email me the result.",
    submit: "Get initial direction",
    result: "Initial direction",
    next: "Continue to assessment",
  },
  es: {
    eyebrow: "PATHWAY QUIZ",
    title: "¿Qué vía encaja mejor?",
    intro: "Responde unas preguntas para recibir una orientación inicial no vinculante.",
    country: "Preferencia de país",
    goal: "Objetivo principal",
    budget: "Presupuesto",
    income: "Ingresos",
    timeline: "Plazo",
    documents: "Documentos",
    email: "Email opcional para resultados",
    consent: "Quiero recibir el resultado por email.",
    submit: "Recibir orientación",
    result: "Orientación inicial",
    next: "Continuar a evaluación",
  },
} as const;

type QuizResult = { suggested_paths: string[]; readiness_score: number; next_step: string };

function value(data: FormData, key: string): string {
  const item = data.get(key);
  return typeof item === "string" ? item.trim() : "";
}

export function PathwayQuiz({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const handleTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setError("");
    trackEvent("quiz_start", {}, locale);
    try {
      const response = await apiPost<QuizResult>("/api/quiz/pathway", {
        locale,
        target_country_preference: value(data, "target_country_preference"),
        goal: value(data, "goal"),
        budget_range: value(data, "budget_range"),
        income_range: value(data, "income_range"),
        family_size: value(data, "family_size"),
        timeline: value(data, "timeline"),
        education_level: value(data, "education_level"),
        work_background: value(data, "work_background"),
        documents_ready: value(data, "documents_ready"),
        contact_email: value(data, "contact_email"),
        consent: data.get("consent") === "on",
        source: "homepage_quiz",
        turnstileToken,
      });
      setResult(response);
      trackEvent("quiz_complete", { readiness_score: response.readiness_score, suggested_paths: response.suggested_paths }, locale);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Quiz failed.");
    } finally {
      setBusy(false);
      setTurnstileToken("");
      setTurnstileResetSignal((value) => value + 1);
    }
  }

  return (
    <section id="pathway-quiz" className="quiz-section section-pad">
      <div className="container quiz-grid">
        <div><p className="eyebrow">{c.eyebrow}</p><h2>{c.title}</h2><p>{c.intro}</p></div>
        <form className="quiz-card" onSubmit={(event) => void submit(event)}>
          <div className="form-grid">
            <label className="form-field"><span>{c.country}</span><select name="target_country_preference" defaultValue="Spain"><option>Spain</option><option>Argentina</option><option>Not sure</option></select></label>
            <label className="form-field"><span>{c.goal}</span><input name="goal" required placeholder="study / work / family" /></label>
            <label className="form-field"><span>{c.budget}</span><input name="budget_range" required /></label>
            <label className="form-field"><span>{c.income}</span><input name="income_range" /></label>
            <label className="form-field"><span>{c.timeline}</span><input name="timeline" /></label>
            <label className="form-field"><span>{c.documents}</span><input name="documents_ready" /></label>
            <label className="form-field"><span>{c.email}</span><input name="contact_email" type="email" dir="ltr" /></label>
            <label className="form-field"><span>Background</span><input name="work_background" /></label>
          </div>
          <input name="family_size" type="hidden" value="not specified" />
          <input name="education_level" type="hidden" value="not specified" />
          <label className="consent-field"><input type="checkbox" name="consent" /><span>{c.consent}</span></label>
          <TurnstileWidget onToken={handleTurnstileToken} resetSignal={turnstileResetSignal} />
          <button className="button button-gold form-submit" type="submit" disabled={busy}>{c.submit}</button>
          {error ? <div className="form-message error">{error}</div> : null}
          {result ? <div className="quiz-result"><CheckCircle2 /><div><strong>{c.result}: {result.readiness_score}/100</strong><ul>{result.suggested_paths.map((path) => <li key={path}>{path}</li>)}</ul><p>{result.next_step}</p><Link className="text-link" to={routeFor(locale, "/apply")}>{c.next}<ArrowUpLeft size={17} /></Link></div></div> : null}
        </form>
      </div>
    </section>
  );
}
