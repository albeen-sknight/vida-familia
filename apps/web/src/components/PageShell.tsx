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

const heroImages: Record<string, string> = {
  "/about": "/assets/heroes/about-hero.png",
  "/spain": "/assets/heroes/spain-hero.png",
  "/argentina": "/assets/heroes/argentina-hero.png",
  "/services": "/assets/heroes/services-hero.png",
  "/contact": "/assets/heroes/contact-hero.png",
  "/resources": "/assets/heroes/resources-hero.png",
  "/apply": "/assets/heroes/apply-hero.png",
};

function resolveHeroImage(path: string) {
  if (path.includes("/spain")) return "/assets/heroes/spain-hero.png";
  if (path.includes("/argentina")) return "/assets/heroes/argentina-hero.png";
  if (path.includes("/resources")) return "/assets/heroes/resources-hero.png";
  if (path.includes("/apply")) return "/assets/heroes/apply-hero.png";
  if (path.includes("/contact")) return "/assets/heroes/contact-hero.png";
  if (path.includes("/about")) return "/assets/heroes/about-hero.png";
  if (path.includes("/services")) return "/assets/heroes/services-hero.png";
  if (path.includes("/real-life") || path.includes("/experience")) return "/assets/heroes/real-life-hero.png";

  return heroImages[path] ?? "/assets/heroes/services-hero.png";
}

export function PageShell({
  locale,
  eyebrow,
  title,
  intro,
  path,
  children,
  tone = "navy",
  contentClassName,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  intro: string;
  path: string;
  children: React.ReactNode;
  tone?: "navy" | "spain" | "argentina";
  contentClassName?: string;
}) {
  const localizedEyebrow = eyebrowCopy[locale][eyebrow] ?? eyebrow;
  const heroImage = resolveHeroImage(path);

  return (
    <>
      <SEOHead locale={locale} title={`${title} | VIDA FAMILIA`} description={intro} path={path} />

      <section
        className={`page-hero page-hero-${tone} page-hero-art`}
        style={{ "--page-hero-image": `url(${heroImage})` } as React.CSSProperties}
      >
        <div className="page-hero-grid" aria-hidden="true" />
        <div className="page-hero-backdrop" aria-hidden="true" />

        <div className="page-hero-copy">
          <p className="eyebrow">{localizedEyebrow}</p>
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>

        <span className="page-hero-mark" aria-hidden="true">
          VF
        </span>
      </section>

      <div className={contentClassName ? `page-content ${contentClassName}` : "page-content"}>
        {children}
        {path === "/contact" ? <PresenceSection locale={locale} embedded /> : null}
      </div>
    </>
  );
}
