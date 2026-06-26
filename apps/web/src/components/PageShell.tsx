import type { Locale } from "@vida-familia/shared";
import { PresenceSection } from "./PresenceSection";
import { SEOHead } from "./SEOHead";

const eyebrowCopy: Record<Locale, Record<string, string>> = {
  fa: {
    "OUR STORY": "داستان ما",
    SERVICES: "خدمات",
    ASSESSMENT: "ارزیابی",
    CONTACT: "تماس",
    "LIVED EXPERIENCE": "تجربه زیسته",
  },
  en: {},
  es: {
    "OUR STORY": "Nuestra historia",
    SERVICES: "Servicios",
    ASSESSMENT: "Evaluación",
    CONTACT: "Contacto",
    "LIVED EXPERIENCE": "Experiencia vivida",
  },
};

export function PageShell({ locale, eyebrow, title, intro, path, children, tone = "navy" }: { locale: Locale; eyebrow: string; title: string; intro: string; path: string; children: React.ReactNode; tone?: "navy" | "spain" | "argentina" }) {
  const localizedEyebrow = eyebrowCopy[locale][eyebrow] ?? eyebrow;
  return (
    <>
      <SEOHead locale={locale} title={`${title} | VIDA FAMILIA`} description={intro} path={path} />
      <section className={`page-hero page-hero-${tone}`}>
        <div className="page-hero-grid" aria-hidden="true" />
        <div><p className="eyebrow">{localizedEyebrow}</p><h1>{title}</h1><p>{intro}</p></div>
        {/* TODO: Replace this intentional VF art treatment with page-specific cinematic destination imagery after launch. */}
        <span className="page-hero-mark">VF</span>
      </section>
      <div className="page-content">{children}{path === "/contact" ? <PresenceSection locale={locale} embedded /> : null}</div>
    </>
  );
}
