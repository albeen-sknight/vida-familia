import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { servicePages } from "./data/siteData";
import { localeFromPath, pathWithoutLocale, textDirection } from "./lib/locale";
import { HomePage } from "./pages/HomePage";
import { AboutPage, ApplyPage, ContactPage, DestinationPage, LegalPage, LifestylePage, ResourcesPage, ServicesPage } from "./pages/InfoPages";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";

function ScrollAndLocaleEffects({ locale }: { locale: "fa" | "en" | "es" }) {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = textDirection(locale);
    document.body.dataset.locale = locale;

    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        return;
      }
    }

    window.scrollTo({ top: 0, behavior: "instant" });
  }, [hash, locale, pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  const path = pathWithoutLocale(pathname).replace(/\/$/, "") || "/";

  let page: React.ReactNode;
  if (path === "/") page = <HomePage locale={locale} />;
  else if (path === "/about") page = <AboutPage locale={locale} />;
  else if (path === "/spain") page = <DestinationPage locale={locale} country="spain" />;
  else if (path === "/argentina") page = <DestinationPage locale={locale} country="argentina" />;
  else if (path === "/services") page = <ServicesPage locale={locale} />;
  else if (path === "/family-life" || path === "/student-life" || path === "/business-residency") page = <LifestylePage locale={locale} type={path.slice(1) as "family-life" | "student-life" | "business-residency"} />;
  else if (path === "/resources") page = <ResourcesPage locale={locale} />;
  else if (path === "/apply") page = <ApplyPage locale={locale} />;
  else if (path === "/contact") page = <ContactPage locale={locale} />;
  else if (path === "/privacy" || path === "/terms" || path === "/legal-disclaimer") page = <LegalPage locale={locale} type={path.slice(1) as "privacy" | "terms" | "legal-disclaimer"} />;
  else {
    const match = path.match(/^\/services\/(spain|argentina)\/([^/]+)$/);
    const service = match ? servicePages.find((item) => item.country === match[1] && item.slug === match[2]) : undefined;
    page = service ? <ServiceDetailPage locale={locale} service={service} /> : <NotFoundPage locale={locale} />;
  }

  return <Layout locale={locale}><ScrollAndLocaleEffects locale={locale} />{page}</Layout>;
}
