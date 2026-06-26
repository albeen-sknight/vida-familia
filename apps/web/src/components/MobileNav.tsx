import { useEffect } from "react";
import type { Locale } from "@vida-familia/shared";
import { ArrowUpLeft, X } from "lucide-react";
import { Link } from "react-router-dom";
import { getCopy } from "../data/i18n";
import { routeFor } from "../lib/locale";
import { LanguageSwitcher } from "./LanguageSwitcher";

type NavGroup = {
  title: string;
  links: Array<[string, string]>;
};

const menuCopy = {
  fa: {
    label: "فهرست سایت",
    close: "بستن فهرست",
    start: "شروع",
    destinations: "مقصدها",
    pathway: "مسیرها",
    guides: "راهنماها",
    trust: "درباره و اعتماد",
    legal: "حقوقی",
    assessment: "ارزیابی شرایط من",
    quiz: "آزمون مسیر",
    consultation: "فرم مشاوره",
    chooseRoute: "انتخاب مسیر",
    documents: "آماده‌سازی مدارک",
    housing: "خانه و استقرار",
    family: "همراهی خانواده",
    decisionGuides: "راهنماهای تصمیم بهتر",
    studentLife: "زندگی دانشجویی",
    business: "کسب‌وکار و اقامت",
    familyLife: "زندگی خانوادگی",
    spainGuides: "راهنمای اسپانیا",
    argentinaGuides: "راهنمای آرژانتین",
    story: "داستان ما",
    realLife: "زندگی واقعی",
    contact: "تماس",
    privacy: "حریم خصوصی",
    terms: "شرایط استفاده",
    disclaimer: "سلب مسئولیت حقوقی",
  },
  en: {
    label: "Site menu",
    close: "Close menu",
    start: "Start",
    destinations: "Destinations",
    pathway: "Pathway",
    guides: "Guides",
    trust: "About and trust",
    legal: "Legal",
    assessment: "Evaluate my situation",
    quiz: "Pathway quiz",
    consultation: "Consultation form",
    chooseRoute: "Choose the route",
    documents: "Document readiness",
    housing: "Housing and settlement",
    family: "Family coordination",
    decisionGuides: "Decision guides",
    studentLife: "Student life",
    business: "Business and residency",
    familyLife: "Family life",
    spainGuides: "Spain guides",
    argentinaGuides: "Argentina guides",
    story: "Our story",
    realLife: "Real life",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms",
    disclaimer: "Legal disclaimer",
  },
  es: {
    label: "Menú del sitio",
    close: "Cerrar menú",
    start: "Inicio",
    destinations: "Destinos",
    pathway: "Ruta",
    guides: "Guías",
    trust: "Historia y confianza",
    legal: "Legal",
    assessment: "Evaluar mi situación",
    quiz: "Test de vía",
    consultation: "Formulario de consulta",
    chooseRoute: "Elegir la vía",
    documents: "Preparación documental",
    housing: "Vivienda e instalación",
    family: "Coordinación familiar",
    decisionGuides: "Guías para decidir mejor",
    studentLife: "Vida estudiantil",
    business: "Empresa y residencia",
    familyLife: "Vida familiar",
    spainGuides: "Guías de España",
    argentinaGuides: "Guías de Argentina",
    story: "Nuestra historia",
    realLife: "Vida real",
    contact: "Contacto",
    privacy: "Privacidad",
    terms: "Términos",
    disclaimer: "Aviso legal",
  },
} as const;

export function MobileNav({ locale, open, onClose }: { locale: Locale; open: boolean; onClose: () => void }) {
  const c = getCopy(locale);
  const m = menuCopy[locale];
  const home = routeFor(locale, "/");
  const groups: NavGroup[] = [
    { title: m.start, links: [[m.assessment, routeFor(locale, "/apply")], [m.quiz, `${home}#pathway-quiz`], [m.consultation, routeFor(locale, "/contact")]] },
    { title: m.destinations, links: [[c.nav.spain, routeFor(locale, "/spain")], [c.nav.argentina, routeFor(locale, "/argentina")]] },
    { title: m.pathway, links: [[m.chooseRoute, `${home}#services`], [m.documents, `${home}#service-step-02`], [m.housing, `${home}#service-step-03`], [m.family, `${home}#service-step-04`]] },
    { title: m.guides, links: [[m.decisionGuides, routeFor(locale, "/resources")], [m.studentLife, routeFor(locale, "/student-life")], [m.business, routeFor(locale, "/business-residency")], [m.familyLife, routeFor(locale, "/family-life")], [m.spainGuides, routeFor(locale, "/spain")], [m.argentinaGuides, routeFor(locale, "/argentina")]] },
    { title: m.trust, links: [[m.story, routeFor(locale, "/about")], [m.realLife, `${home}#real-life`], [c.nav.services, routeFor(locale, "/services")], [m.contact, routeFor(locale, "/contact")]] },
    { title: m.legal, links: [[m.privacy, routeFor(locale, "/privacy")], [m.terms, routeFor(locale, "/terms")], [m.disclaimer, routeFor(locale, "/legal-disclaimer")]] },
  ];

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <div className={`mobile-nav ${open ? "mobile-nav-open" : ""} ${locale === "fa" ? "mobile-nav-rtl" : ""}`} aria-hidden={!open} onMouseDown={onClose}>
      <aside id="site-menu" className="mobile-nav-panel" role="dialog" aria-modal="true" aria-label={m.label} onMouseDown={(event) => event.stopPropagation()}>
        <div className="mobile-nav-top">
          <LanguageSwitcher locale={locale} />
          <button type="button" onClick={onClose} aria-label={m.close}><X /></button>
        </div>
        <nav aria-label={m.label}>
          {groups.map((group) => (
            <section className="mobile-nav-group" key={group.title}>
              <p>{group.title}</p>
              {group.links.map(([label, href]) => <Link key={`${group.title}-${href}-${label}`} onClick={onClose} to={href}><span>{label}</span><ArrowUpLeft size={16} /></Link>)}
            </section>
          ))}
        </nav>
        <Link className="button button-gold" onClick={onClose} to={routeFor(locale, "/apply")}>{c.applyCta}</Link>
      </aside>
    </div>
  );
}
