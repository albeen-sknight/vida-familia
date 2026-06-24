import type { Locale } from "@vida-familia/shared";
import { ArrowUpLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { SEOHead } from "../components/SEOHead";
import { routeFor } from "../lib/locale";

export function NotFoundPage({ locale }: { locale: Locale }) {
  return <section className="not-found"><SEOHead locale={locale} title="404 | VIDA FAMILIA" description="Page not found" path="/404" /><span>404</span><p className="eyebrow">PATH NOT FOUND</p><h1>{locale === "fa" ? "این مسیر هنوز وجود ندارد" : locale === "es" ? "Este camino aún no existe" : "This path does not exist yet"}</h1><Link className="button button-gold" to={routeFor(locale, "/")}>{locale === "fa" ? "بازگشت به خانه" : locale === "es" ? "Volver al inicio" : "Back home"}<ArrowUpLeft /></Link></section>;
}
