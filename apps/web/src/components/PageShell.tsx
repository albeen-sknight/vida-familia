import type { Locale } from "@vida-familia/shared";
import { PresenceSection } from "./PresenceSection";
import { SEOHead } from "./SEOHead";

export function PageShell({ locale, eyebrow, title, intro, path, children, tone = "navy" }: { locale: Locale; eyebrow: string; title: string; intro: string; path: string; children: React.ReactNode; tone?: "navy" | "spain" | "argentina" }) {
  return (
    <>
      <SEOHead locale={locale} title={`${title} | VIDA FAMILIA`} description={intro} path={path} />
      <section className={`page-hero page-hero-${tone}`}><div className="page-hero-grid" aria-hidden="true" /><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></div><span className="page-hero-mark">VF</span></section>
      <div className="page-content">{children}{path === "/contact" ? <PresenceSection locale={locale} embedded /> : null}</div>
    </>
  );
}
