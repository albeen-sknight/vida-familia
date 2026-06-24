import type { Locale } from "@vida-familia/shared";
import { ArrowUpLeft, CircleCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { getCopy } from "../data/i18n";
import { routeFor } from "../lib/locale";

export function QualificationCTA({ locale }: { locale: Locale }) {
  const c = getCopy(locale);
  const requirements = locale === "fa" ? ["تصمیم جدی", "توان مالی متناسب", "مدارک شفاف", "انتظار واقع‌بینانه", "همراهی با فرایند"] : locale === "es" ? ["Intención seria", "Capacidad económica", "Documentos claros", "Expectativas realistas", "Proceso estructurado"] : ["Serious intent", "Financial capacity", "Clear documents", "Realistic expectations", "Structured process"];
  return (
    <section className="qualification-section">
      <div className="qualification-number">08</div>
      <div className="qualification-copy">
        <p className="eyebrow">QUALIFICATION FIRST</p>
        <h2>{c.qualificationTitle}</h2>
        <p>{c.qualificationBody}</p>
        <Link className="button button-gold" to={routeFor(locale, "/apply")}>{c.applyCta}<ArrowUpLeft size={18} /></Link>
      </div>
      <ul>{requirements.map((item) => <li key={item}><CircleCheck size={18} />{item}</li>)}</ul>
    </section>
  );
}
