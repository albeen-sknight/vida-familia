import { useEffect, useState } from "react";
import type { Locale } from "@vida-familia/shared";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { getCopy } from "../data/i18n";
import { routeFor } from "../lib/locale";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";

export function Header({ locale }: { locale: Locale }) {
  const c = getCopy(locale);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const home = routeFor(locale, "/");
  const navItems = [
    [c.nav.story, `${home}#story`],
    [c.nav.spain, `${home}#spain`],
    [c.nav.argentina, `${home}#argentina`],
    [c.nav.services, `${home}#services`],
    [locale === "fa" ? "زندگی واقعی" : locale === "es" ? "Vida real" : "Real life", `${home}#real-life`],
  ] as const;

  useEffect(() => setMenuOpen(false), [hash, pathname]);
  useEffect(() => { document.body.style.overflow = menuOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [menuOpen]);

  return (
    <>
      <header className="site-header">
        <Link className="brand-lockup" to={routeFor(locale, "/")} aria-label="Vida Familia home">
          <img src="/assets/favikon.png" alt="" width="44" height="44" onError={(event) => { event.currentTarget.style.display = "none"; }} />
          <span><strong>VIDA FAMILIA</strong><small>SPAIN · ARGENTINA</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, href]) => <Link key={href} to={href}>{label}</Link>)}
        </nav>
        <div className="header-actions">
          <LanguageSwitcher locale={locale} compact />
          <Link className="button button-small button-outline" to={routeFor(locale, "/apply")}>{c.nav.apply}</Link>
          <button className="menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen}><Menu /></button>
        </div>
      </header>
      <MobileNav locale={locale} open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
