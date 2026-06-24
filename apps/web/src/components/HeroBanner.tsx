import type { Locale } from "@vida-familia/shared";
import { ArrowDown, ArrowUpLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { getCopy } from "../data/i18n";
import { routeFor } from "../lib/locale";

export function HeroBanner({ locale }: { locale: Locale }) {
  const c = getCopy(locale);
  return (
    <section className="hero">
      <img className="hero-image" src="/assets/banner.png" alt="Vida Familia — Spain and Argentina" fetchPriority="high" onError={(event) => { event.currentTarget.style.display = "none"; }} />
      <div className="hero-overlay" />
      <div className="hero-side hero-side-spain"><span>ES</span><p>MADRID</p></div>
      <div className="hero-side hero-side-argentina"><span>AR</span><p>BUENOS AIRES</p></div>
      <div className="hero-content">
        <p className="eyebrow hero-eyebrow">{c.heroEyebrow}</p>
        <h1>{c.heroTitle}</h1>
        <p className="hero-subtitle">{c.heroSubtitle}</p>
        <p className="hero-note">{c.heroNote}</p>
        <div className="hero-actions">
          <Link className="button button-gold" to={routeFor(locale, "/apply")}>{c.applyCta}<ArrowUpLeft size={18} aria-hidden="true" /></Link>
          <Link className="button button-ghost" to={routeFor(locale, "/about")}>{c.nav.story}</Link>
        </div>
      </div>
      <a className="scroll-cue" href="#story"><ArrowDown size={18} /><span>SCROLL</span></a>
    </section>
  );
}
