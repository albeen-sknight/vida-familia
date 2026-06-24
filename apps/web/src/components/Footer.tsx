import type { Locale } from "@vida-familia/shared";
import { ArrowUpLeft, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { getCopy } from "../data/i18n";
import { routeFor } from "../lib/locale";
import { DisclaimerBox } from "./DisclaimerBox";

export function Footer({ locale }: { locale: Locale }) {
  const c = getCopy(locale);
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand"><img src="/assets/logo.png" alt="Vida Familia" loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} /><h2>VIDA<br />FAMILIA</h2><p>{c.footerLine}</p></div>
        <div className="footer-links"><p className="eyebrow">EXPLORE</p><Link to={routeFor(locale, "/about")}>{c.nav.story}</Link><Link to={routeFor(locale, "/services")}>{c.nav.services}</Link><Link to={routeFor(locale, "/resources")}>{c.nav.resources}</Link><Link to={routeFor(locale, "/contact")}>Contact</Link></div>
        <div className="footer-links"><p className="eyebrow">LEGAL</p><Link to={routeFor(locale, "/privacy")}>Privacy</Link><Link to={routeFor(locale, "/terms")}>Terms</Link><Link to={routeFor(locale, "/legal-disclaimer")}>Legal disclaimer</Link></div>
        <div className="footer-cta"><p className="eyebrow">START HERE</p><h3>{c.qualificationTitle}</h3><Link to={routeFor(locale, "/apply")}>{c.applyCta}<ArrowUpLeft size={18} /></Link><div className="social-links" aria-label="Social media placeholders"><span aria-label="Instagram"><Instagram size={18} /></span><span aria-label="YouTube"><Youtube size={18} /></span></div></div>
      </div>
      <DisclaimerBox compact>{c.legalShort}</DisclaimerBox>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} VIDA FAMILIA. {c.rights}</span><span>SPAIN · ARGENTINA</span></div>
    </footer>
  );
}
