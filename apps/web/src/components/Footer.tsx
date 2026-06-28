import type { Locale } from "@vida-familia/shared";
import { ArrowUpLeft, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { getCopy } from "../data/i18n";
import { routeFor } from "../lib/locale";
import { DisclaimerBox } from "./DisclaimerBox";
import { NewsletterForm } from "./NewsletterForm";

const footerCopy = {
  fa: {
    explore: "کاوش",
    legal: "حقوقی",
    start: "از اینجا شروع کنید",
    contact: "تماس",
    privacy: "حریم خصوصی",
    terms: "شرایط استفاده",
    disclaimer: "سلب مسئولیت حقوقی",
    destinations: "اسپانیا · آرژانتین",
    social: "شبکه‌های اجتماعی",
    instagram: "اینستاگرام",
    youtube: "یوتیوب",
  },
  en: {
    explore: "Explore",
    legal: "Legal",
    start: "Start here",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms",
    disclaimer: "Legal disclaimer",
    destinations: "Spain · Argentina",
    social: "Social media",
    instagram: "Instagram",
    youtube: "YouTube",
  },
  es: {
    explore: "Explorar",
    legal: "Legal",
    start: "Empieza aquí",
    contact: "Contacto",
    privacy: "Privacidad",
    terms: "Términos",
    disclaimer: "Aviso legal",
    destinations: "España · Argentina",
    social: "Redes sociales",
    instagram: "Instagram",
    youtube: "YouTube",
  },
} as const;

export function Footer({ locale }: { locale: Locale }) {
  const c = getCopy(locale);
  const f = footerCopy[locale];
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-stack">
          <div className="footer-brand"><img src="/assets/logo.png" alt="Vida Familia" loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} /><h2>VIDA<br />FAMILIA</h2><p>{c.footerLine}</p></div>
          <div className="footer-links"><p className="eyebrow">{f.explore}</p><Link to={routeFor(locale, "/about")}>{c.nav.story}</Link><Link to={routeFor(locale, "/services")}>{c.nav.services}</Link><Link to={routeFor(locale, "/resources")}>{c.nav.resources}</Link><Link to={routeFor(locale, "/contact")}>{f.contact}</Link></div>
          <div className="footer-links"><p className="eyebrow">{f.legal}</p><Link to={routeFor(locale, "/privacy")}>{f.privacy}</Link><Link to={routeFor(locale, "/terms")}>{f.terms}</Link><Link to={routeFor(locale, "/legal-disclaimer")}>{f.disclaimer}</Link></div>
          <div className="footer-cta"><p className="eyebrow">{f.start}</p><h3>{c.qualificationTitle}</h3><Link to={routeFor(locale, "/apply")}>{c.applyCta}<ArrowUpLeft size={18} /></Link><div className="social-links" aria-label={f.social}><a href="https://www.instagram.com/vidafamilia.es/" target="_blank" rel="noopener noreferrer" aria-label={f.instagram}><Instagram size={18} aria-hidden="true" /><span>{f.instagram}</span></a><a href="https://www.youtube.com/@vidafamilia.global" target="_blank" rel="noopener noreferrer" aria-label={f.youtube}><Youtube size={18} aria-hidden="true" /><span>{f.youtube}</span></a></div></div>
        </div>
        <div className="footer-newsletter"><NewsletterForm locale={locale} compact /></div>
      </div>
      <DisclaimerBox compact>{c.legalShort}</DisclaimerBox>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} VIDA FAMILIA. {c.rights}</span><span>{f.destinations}</span></div>
    </footer>
  );
}
