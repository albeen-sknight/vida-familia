import type { Locale } from "@vida-familia/shared";
import { ArrowUpLeft, X } from "lucide-react";
import { Link } from "react-router-dom";
import { getCopy } from "../data/i18n";
import { routeFor } from "../lib/locale";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function MobileNav({ locale, open, onClose }: { locale: Locale; open: boolean; onClose: () => void }) {
  const c = getCopy(locale);
  const home = routeFor(locale, "/");
  const links = [
    [c.nav.story, `${home}#story`],
    [c.nav.spain, `${home}#spain`],
    [c.nav.argentina, `${home}#argentina`],
    [c.nav.services, `${home}#services`],
    [locale === "fa" ? "زندگی واقعی" : locale === "es" ? "Vida real" : "Real life", `${home}#real-life`],
  ] as const;

  return (
    <div className={`mobile-nav ${open ? "mobile-nav-open" : ""}`} aria-hidden={!open}>
      <div className="mobile-nav-top">
        <LanguageSwitcher locale={locale} />
        <button type="button" onClick={onClose} aria-label="Close menu"><X /></button>
      </div>
      <nav aria-label="Mobile navigation">
        {links.map(([label, href], index) => <Link key={href} onClick={onClose} to={href}><small>0{index + 1}</small><span>{label}</span><ArrowUpLeft size={18} /></Link>)}
      </nav>
      <Link className="button button-gold" onClick={onClose} to={routeFor(locale, "/apply")}>{c.applyCta}</Link>
    </div>
  );
}
