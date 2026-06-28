import type { Locale } from "@vida-familia/shared";
import { ArrowDown, ArrowUpLeft, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { getCopy } from "../data/i18n";
import { routeFor } from "../lib/locale";
import { ParallaxStage } from "./ParallaxStage";

export function HeroBanner({ locale }: { locale: Locale }) {
  const c = getCopy(locale);
  const home = routeFor(locale, "/");
  const sceneLabel = locale === "fa" ? "یک خانواده · دو مقصد · یک تجربه واقعی" : locale === "es" ? "Una familia · Dos destinos · Una experiencia real" : "One family · Two destinations · Real experience";
  const pathLabel = locale === "fa" ? "انتخاب مسیر" : locale === "es" ? "Elige tu ruta" : "Choose a path";
  const scrollLabel = locale === "fa" ? "پایین‌تر، کشف مسیر" : locale === "es" ? "Bajar y descubrir" : "Scroll to discover";

  return (
    <section className="hero" id="top">
      <ParallaxStage className="hero-stage">
        <img className="hero-image" src="/assets/banner.png" alt="Vida Familia, Spain and Argentina" fetchPriority="high" onError={(event) => { event.currentTarget.style.display = "none"; }} />
        <div className="hero-overlay" />
        <div className="hero-decor" dir="ltr" aria-hidden="true">
          <div className="hero-frame"><span>VIDA / 01</span><span>{sceneLabel}</span></div>
          <div className="hero-side hero-side-spain"><span>ES</span><p>MADRID</p></div>
          <div className="hero-side hero-side-argentina"><span>AR</span><p>BUENOS AIRES</p></div>
        </div>
      </ParallaxStage>

      <div className="hero-content">
        <div className="hero-heading scene-reveal">
          <p className="eyebrow hero-eyebrow">{c.heroEyebrow}</p>
          <h1>{c.heroTitle}</h1>
          <p className="hero-subtitle">{c.heroSubtitle}</p>
        </div>
        <div className="hero-intro scene-reveal">
          <p className="hero-note">{c.heroNote}</p>
          <p className="hero-path-label"><Compass size={15} />{pathLabel}</p>
          <div className="hero-actions">
            <Link className="button button-gold" to={routeFor(locale, "/apply")}>{c.applyCta}<ArrowUpLeft size={18} aria-hidden="true" /></Link>
            <Link className="button button-spain" to={routeFor(locale, "/spain")}>{c.nav.spain}</Link>
            <Link className="button button-argentina" to={routeFor(locale, "/argentina")}>{c.nav.argentina}</Link>
            <Link className="button button-ghost" to={`${home}#story`}>{c.nav.story}</Link>
          </div>
        </div>
      </div>
      <a className="scroll-cue" href="#story"><ArrowDown size={18} /><span>{scrollLabel}</span></a>
    </section>
  );
}
