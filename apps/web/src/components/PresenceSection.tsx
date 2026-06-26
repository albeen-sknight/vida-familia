import type { Locale } from "@vida-familia/shared";
import { ArrowUpLeft, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { routeFor } from "../lib/locale";

const presenceCopy = {
  fa: {
    eyebrow: "حضور ما",
    title: "دفاتر و حضور ما",
    intro: "از جنوب ایران تا مادرید؛ تجربه‌ای واقعی، ارتباطی نزدیک‌تر",
    note: "این شهرها شبکه حضور، تجربه و ارتباط ما را نشان می‌دهند؛ جلسه حضوری فقط با هماهنگی قبلی انجام می‌شود.",
    locations: [
      ["کنگان", "ریشه و ارتباط محلی در جنوب ایران"],
      ["شیراز", "گفت‌وگو، برنامه‌ریزی و هماهنگی"],
      ["مادرید", "تجربه زندگی، تحصیل و استقرار"],
    ],
    action: "ارتباط با ما",
  },
  en: {
    eyebrow: "Our presence",
    title: "Our presence",
    intro: "From southern Iran to Madrid, lived experience and closer connection.",
    note: "These cities represent our network of presence, experience and connection. In-person meetings are by prior arrangement.",
    locations: [
      ["Kanghan", "Local roots and connection in southern Iran"],
      ["Shiraz", "Conversation, planning and coordination"],
      ["Madrid", "Lived study, work and settlement experience"],
    ],
    action: "Contact us",
  },
  es: {
    eyebrow: "NUESTRA PRESENCIA",
    title: "Nuestra presencia",
    intro: "Del sur de Irán a Madrid: experiencia vivida y conexión cercana.",
    note: "Estas ciudades representan nuestra red de presencia, experiencia y conexión. Las reuniones presenciales son con cita previa.",
    locations: [
      ["Kanghan", "Raíces y conexión local en el sur de Irán"],
      ["Shiraz", "Conversación, planificación y coordinación"],
      ["Madrid", "Experiencia real de estudio, trabajo e instalación"],
    ],
    action: "Contactar",
  },
} as const;

export function PresenceSection({ locale, embedded = false }: { locale: Locale; embedded?: boolean }) {
  const c = presenceCopy[locale];
  return (
    <section id="presence" className={`presence-section ${embedded ? "presence-embedded" : "section-pad"}`}>
      <div className={embedded ? "" : "container"}>
        <div className="presence-heading scene-reveal">
          <div><p className="eyebrow">{c.eyebrow}</p><h2>{c.title}</h2></div>
          <p>{c.intro}</p>
        </div>
        <div className="presence-map" aria-label={c.title}>
          <div className="presence-line" aria-hidden="true" />
          {c.locations.map(([city, detail], index) => (
            <article className="presence-point scene-reveal" key={city}>
              <span><MapPin size={18} /><small>0{index + 1}</small></span>
              <h3>{city}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
        <div className="presence-note"><p>{c.note}</p><Link className="text-link" to={routeFor(locale, "/contact")}>{c.action}<ArrowUpLeft size={17} /></Link></div>
      </div>
    </section>
  );
}
