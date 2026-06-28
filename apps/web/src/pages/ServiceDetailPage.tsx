import type { Locale } from "@vida-familia/shared";
import { AlertTriangle, ArrowUpLeft, FileCheck2, UserRoundCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { DisclaimerBox } from "../components/DisclaimerBox";
import { FAQAccordion } from "../components/FAQAccordion";
import { JsonLd } from "../components/JsonLd";
import { PackageCard } from "../components/PackageCard";
import { PageShell } from "../components/PageShell";
import { QualificationCTA } from "../components/QualificationCTA";
import { SectionHeading } from "../components/SectionHeading";
import { packageGroups, type ServicePageData } from "../data/siteData";
import { routeFor } from "../lib/locale";

export function ServiceDetailPage({ locale, service }: { locale: Locale; service: ServicePageData }) {
  const title = service.title[locale];
  const summary = service.summary[locale];
  const path = `/services/${service.country}/${service.slug}`;
  const groupIndex = service.country === "argentina" ? (service.slug === "student-residency" ? 4 : 3) : service.slug === "student-visa" ? 2 : service.slug === "digital-nomad" ? 1 : 0;
  const packageGroup = packageGroups[groupIndex] ?? packageGroups[0];
  if (!packageGroup) return null;
  const packageDescription = locale === "fa" ? "دامنه دقیق پس از ارزیابی اولیه و بر اساس پیچیدگی پرونده مشخص می‌شود." : locale === "es" ? "El alcance exacto se define tras la evaluación inicial según la complejidad del caso." : "Exact scope is set after initial assessment based on case complexity.";
  const features = locale === "fa" ? ["نقشه راه شخصی", "چک‌لیست مرحله‌ای", "هماهنگی و پیگیری"] : locale === "es" ? ["Hoja de ruta personal", "Lista por fases", "Coordinación y seguimiento"] : ["Personal roadmap", "Phased checklist", "Coordination & follow-up"];

  return (
    <PageShell locale={locale} eyebrow={`${service.country === "spain" ? "SPAIN" : "ARGENTINA"} · SERVICE PATHWAY`} title={title} intro={summary} path={path} tone={service.country} contentClassName="service-page-content">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Service", name: title, description: summary, url: `https://vidafamilia.es${path}`, provider: { "@type": "Organization", name: "Vida Familia", url: "https://vidafamilia.es" }, areaServed: service.country === "spain" ? "Spain" : "Argentina", serviceType: title }} />

      <section className="content-section two-column-intro"><div><SectionHeading eyebrow="01 · FIT" title={locale === "fa" ? "این مسیر برای چه کسانی است؟" : locale === "es" ? "¿Para quién es esta vía?" : "Who is this for?"} /></div><ul className="check-list large">{service.audience.map((item) => <li key={item[locale]}><UserRoundCheck />{item[locale]}</li>)}</ul></section>

      <section className="content-section tinted-section"><SectionHeading eyebrow="02 · CONTEXT" title={locale === "fa" ? "این مسیر دقیقاً چه معنایی دارد؟" : locale === "es" ? "¿Qué significa esta vía?" : "What does this pathway mean?"} /><p className="content-lead">{service.meaning[locale]}</p></section>

      <section className="content-section"><div className="section-split"><SectionHeading eyebrow="03 · SCOPE" title={locale === "fa" ? "خدماتی که می‌توانیم هماهنگ کنیم" : locale === "es" ? "Servicios que podemos coordinar" : "Services we can coordinate"} /><p>{locale === "fa" ? "پیشنهاد نهایی پس از بررسی نیازها و مرز مسئولیت متخصصان همکار تهیه می‌شود." : locale === "es" ? "La propuesta final se prepara tras revisar necesidades y responsabilidades profesionales." : "The final proposal follows a needs review and clear professional boundaries."}</p></div><div className="included-grid">{service.included.map((item, index) => <article key={item[locale]}><span>0{index + 1}</span><FileCheck2 /><h3>{item[locale]}</h3></article>)}</div></section>

      <section className="content-section mistake-section"><SectionHeading eyebrow="04 · AVOID" title={locale === "fa" ? "اشتباه‌های رایج" : locale === "es" ? "Errores frecuentes" : "Common mistakes"} inverse /><div className="mistake-grid">{service.mistakes.map((item, index) => <article key={item[locale]}><AlertTriangle /><small>0{index + 1}</small><p>{item[locale]}</p></article>)}</div></section>

      <section className="content-section"><SectionHeading eyebrow="05 · PROCESS" title={locale === "fa" ? "نمای کلی زمان‌بندی" : locale === "es" ? "Resumen del proceso" : "Timeline overview"} description={locale === "fa" ? "زمان دقیق وابسته به مرجع، فصل، محل اقدام و آمادگی مدارک است." : locale === "es" ? "Los plazos dependen de autoridad, temporada, lugar y documentación." : "Exact timing depends on authority, season, filing location and readiness."} /><div className="timeline">{service.timeline.map((step, index) => <article key={step.label[locale]}><div><span>0{index + 1}</span></div><h3>{step.label[locale]}</h3><p>{step.detail[locale]}</p></article>)}</div></section>

      <section className="content-section documents-section"><div><SectionHeading eyebrow="06 · DOCUMENTS" title={locale === "fa" ? "نمای کلی مدارک" : locale === "es" ? "Documentación general" : "Document overview"} inverse /><p>{locale === "fa" ? "این فهرست عمومی است و جای چک‌لیست اختصاصی یا بررسی حقوقی را نمی‌گیرد." : locale === "es" ? "Es una lista general; no sustituye una lista personalizada ni revisión jurídica." : "This is a general list, not a substitute for a tailored checklist or legal review."}</p></div><ol>{service.documents.map((item, index) => <li key={item[locale]}><span>{String(index + 1).padStart(2, "0")}</span>{item[locale]}</li>)}</ol></section>

      <section className="content-section"><SectionHeading eyebrow="07 · PACKAGES" title={locale === "fa" ? "سطح همراهی را انتخاب کنید" : locale === "es" ? "Elige el nivel de apoyo" : "Choose your support level"} /><div className="package-grid">{packageGroup.names.map((name, index) => <PackageCard key={name} name={name} tier={index === 0 ? "ESSENTIAL" : index === 1 ? "GUIDED" : "CONCIERGE"} description={packageDescription} features={features} featured={index === 1} />)}</div><DisclaimerBox>{locale === "fa" ? "قیمت‌ها و زمان‌ها تقریبی و وابسته به پرونده هستند. هزینه‌های رسمی و اشخاص ثالث تنها در صورت تصریح کتبی در پیشنهاد گنجانده می‌شوند." : locale === "es" ? "Precios y plazos son orientativos. Tasas y terceros solo se incluyen si la propuesta lo indica por escrito." : "Prices and timing are indicative. Official and third-party fees are included only if stated in writing."}</DisclaimerBox></section>

      <section className="content-section faq-section"><SectionHeading eyebrow="08 · FAQ" title={locale === "fa" ? "پرسش‌های متداول" : locale === "es" ? "Preguntas frecuentes" : "Frequently asked questions"} /><FAQAccordion items={service.faqs.map((faq) => ({ question: faq.question[locale], answer: faq.answer[locale] }))} /></section>

      <QualificationCTA locale={locale} />
      <DisclaimerBox>{locale === "fa" ? "محتوای این صفحه آموزشی است و جای مشاوره حقوقی، مالیاتی یا مالی شخصی را نمی‌گیرد. قوانین و رویه‌ها تغییر می‌کنند؛ پیش از اقدام باید اطلاعات از منابع رسمی و متخصص واجد صلاحیت تأیید شود. ویدا فامیلیا نتیجه ویزا، اقامت یا تابعیت را تضمین نمی‌کند." : locale === "es" ? "Contenido educativo que no sustituye asesoramiento jurídico, fiscal o financiero. Las normas cambian y deben confirmarse antes de actuar. Vida Familia no garantiza visados, residencia ni ciudadanía." : "This educational content does not replace legal, tax or financial advice. Rules change and must be confirmed before action. Vida Familia does not guarantee visa, residency or citizenship outcomes."}</DisclaimerBox>
      <div className="next-path"><p>{locale === "fa" ? "هنوز مطمئن نیستید کدام مسیر مناسب است؟" : locale === "es" ? "¿Aún no sabes qué vía encaja?" : "Still unsure which path fits?"}</p><Link to={routeFor(locale, "/services")}>{locale === "fa" ? "مقایسه همه خدمات" : locale === "es" ? "Comparar servicios" : "Compare all services"}<ArrowUpLeft /></Link></div>
    </PageShell>
  );
}
