import type { Locale } from "@vida-familia/shared";
import { BookOpenCheck, Handshake, Scale, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { DestinationCard } from "../components/DestinationCard";
import { DisclaimerBox } from "../components/DisclaimerBox";
import { FamilyMemberCard } from "../components/FamilyMemberCard";
import { HeroBanner } from "../components/HeroBanner";
import { JsonLd } from "../components/JsonLd";
import { PackageCard } from "../components/PackageCard";
import { QualificationCTA } from "../components/QualificationCTA";
import { SEOHead } from "../components/SEOHead";
import { SectionHeading } from "../components/SectionHeading";
import { ServiceCard } from "../components/ServiceCard";
import { TrustBadge } from "../components/TrustBadge";
import { getCopy } from "../data/i18n";
import { contentPillars, destinations, familyMembers, packageGroups, serviceHighlights } from "../data/siteData";
import { routeFor } from "../lib/locale";

const siteUrl = "https://vidafamilia.es";

export function HomePage({ locale }: { locale: Locale }) {
  const c = getCopy(locale);
  const localized = <T extends Record<Locale, string>>(item: T) => item[locale];
  const packageDescription = locale === "fa" ? "دامنه همراهی از ارزیابی و نقشه راه تا هماهنگی استقرار کامل." : locale === "es" ? "Desde la evaluación y hoja de ruta hasta la coordinación integral de la instalación." : "From assessment and roadmap to complete settlement coordination.";
  const packageFeatures = locale === "fa" ? ["ارزیابی و نقشه راه", "چک‌لیست اختصاصی", "هماهنگی مرحله‌ای"] : locale === "es" ? ["Evaluación y hoja de ruta", "Lista personalizada", "Coordinación por fases"] : ["Assessment & roadmap", "Tailored checklist", "Phased coordination"];

  return (
    <>
      <SEOHead locale={locale} title={locale === "fa" ? "VIDA FAMILIA | اسپانیا و آرژانتین از نگاه یک خانواده واقعی" : locale === "es" ? "VIDA FAMILIA | España y Argentina desde la experiencia real" : "VIDA FAMILIA | Spain & Argentina through real experience"} description={c.heroNote} path={locale === "fa" ? "/" : `/${locale}`} keywords={locale === "fa" ? ["مهاجرت به اسپانیا", "مهاجرت به آرژانتین", "ویزای تحصیلی اسپانیا", "ویزای نومد دیجیتال اسپانیا", "اقامت تمکن مالی اسپانیا", "اقامت رنتیستا آرژانتین", "زندگی در مادرید", "زندگی در بوئنوس آیرس"] : locale === "es" ? ["residencia España", "visado nómada digital España", "residencia Argentina", "estudiantes extranjeros Argentina"] : ["Spain relocation for families", "Argentina residency services", "Spain student visa", "Spain digital nomad visa"]} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", name: "Vida Familia", url: siteUrl, logo: `${siteUrl}/assets/logo.png`, image: `${siteUrl}/assets/banner.png`, description: c.heroNote, areaServed: ["Spain", "Argentina"], knowsLanguage: ["fa", "en", "es"] }} />
      <HeroBanner locale={locale} />

      <section id="story" className="story-section section-pad">
        <div className="container story-grid">
          <div className="story-number">01</div>
          <div><SectionHeading eyebrow="THE REAL STORY" title={c.storyTitle} /><p className="story-lead">{c.storyBody}</p><Link className="text-link" to={routeFor(locale, "/about")}>{c.learnMore}<span>↗</span></Link></div>
          <blockquote><span>“</span>{locale === "fa" ? "قانون مهم است؛ اما دانستن اینکه یک خانواده واقعاً چگونه زندگی را از نو می‌سازد، چیز دیگری است." : locale === "es" ? "La ley importa; entender cómo una familia reconstruye de verdad su vida es otra cosa." : "Law matters. Understanding how a family actually rebuilds a life is something else."}</blockquote>
        </div>
      </section>

      <section className="family-section section-pad">
        <div className="container"><SectionHeading eyebrow={c.familyKicker} title={c.familyTitle} description={locale === "fa" ? "بدون تصویرسازی ساختگی؛ هر کارت بخشی از تجربه‌ای است که واقعاً زندگی شده." : locale === "es" ? "Sin personajes inventados: cada perspectiva nace de una experiencia vivida." : "No invented personas—each perspective comes from lived experience."} />
          <div className="family-grid">{familyMembers.map((member, index) => <FamilyMemberCard key={member.initials} initials={member.initials} role={localized(member.role)} title={localized(member.title)} note={localized(member.note)} index={index} />)}</div>
        </div>
      </section>

      <section className="destination-section section-pad">
        <div className="container"><SectionHeading eyebrow={c.destinationKicker} title={c.destinationTitle} align="center" inverse />
          <div className="destination-grid">{destinations.map((destination) => <DestinationCard key={destination.country} country={destination.country} title={localized(destination.title)} city={localized(destination.city)} description={localized(destination.description)} services={destination.services.map(localized)} href={routeFor(locale, `/${destination.country}`)} action={c.explore} />)}</div>
          <DisclaimerBox>{locale === "fa" ? "اطلاعات مسیر تابعیت آرژانتین صرفاً آموزشی است. شرایط قانونی و رویه‌های قضایی تغییرپذیرند و باید برای هر پرونده با متخصص دارای صلاحیت بررسی شوند." : locale === "es" ? "La información sobre ciudadanía argentina es educativa. La normativa y práctica judicial pueden cambiar y requieren revisión profesional para cada caso." : "Argentina citizenship information is educational. Law and court practice can change and require qualified case-specific review."}</DisclaimerBox>
        </div>
      </section>

      <section className="services-section section-pad">
        <div className="container"><div className="section-split"><SectionHeading eyebrow={c.servicesKicker} title={c.servicesTitle} /><p>{locale === "fa" ? "ما کار را به فهرست فرم‌ها تقلیل نمی‌دهیم. هر تصمیم باید با مسکن، مدرسه، بانک، بیمه و زندگی واقعی هماهنگ باشد." : locale === "es" ? "No reducimos el proceso a formularios. Cada decisión debe encajar con vivienda, colegios, banca, seguros y vida real." : "We do not reduce the process to forms. Every decision must align with housing, school, banking, insurance and real life."}</p></div>
          <div className="services-grid">{serviceHighlights.map((service) => <ServiceCard key={service.index} index={service.index} title={localized(service.title)} text={localized(service.text)} href={routeFor(locale, "/services")} />)}</div>
        </div>
      </section>

      <section className="packages-section section-pad">
        <div className="container"><SectionHeading eyebrow={c.packagesKicker} title={c.packagesTitle} description={locale === "fa" ? "نام بسته، سطح همراهی را مشخص می‌کند؛ دامنه نهایی پس از ارزیابی پرونده مکتوب می‌شود." : locale === "es" ? "El paquete indica el nivel de apoyo; el alcance final se define por escrito tras la evaluación." : "The package signals the support level; final scope is confirmed in writing after assessment."} />
          <div className="package-groups">{packageGroups.map((group) => <div className="package-group" key={localized(group.label)}><div className="package-group-title"><span>{group.country === "Spain" ? "ES" : "AR"}</span><h3>{localized(group.label)}</h3></div><div className="package-grid">{group.names.map((name, index) => <PackageCard key={name} name={name} tier={index === 0 ? "ESSENTIAL" : index === 1 ? "GUIDED" : "CONCIERGE"} description={packageDescription} features={packageFeatures} featured={index === 1} />)}</div></div>)}</div>
          <DisclaimerBox>{locale === "fa" ? "قیمت‌ها تقریبی هستند و بسته به پرونده، شهر، زمان و شرایط متقاضی تغییر می‌کنند. هزینه‌های دولتی و اشخاص ثالث جداگانه محاسبه می‌شوند مگر اینکه کتبی ذکر شود." : locale === "es" ? "Los precios son orientativos y cambian según expediente, ciudad, momento y circunstancias. Tasas y terceros se cobran aparte salvo indicación escrita." : "Prices are indicative and vary by case, city, timing and applicant circumstances. Government and third-party fees are separate unless stated in writing."}</DisclaimerBox>
        </div>
      </section>

      <div className="container qualification-wrap"><QualificationCTA locale={locale} /></div>

      <section className="media-section section-pad"><div className="container"><SectionHeading eyebrow={c.mediaKicker} title={c.mediaTitle} align="center" /><div className="content-pillars">{contentPillars.map((item, index) => <Link key={item.code} to={routeFor(locale, "/resources")} className={`content-pillar pillar-${index + 1}`}><span>{item.code}</span><h3>{item[locale]}</h3><small>0{index + 1}</small></Link>)}</div></div></section>

      <section className="trust-section section-pad"><div className="container"><SectionHeading eyebrow="TRUST & REALITY" title={c.trustTitle} inverse align="center" /><div className="trust-grid"><TrustBadge icon={BookOpenCheck} title={locale === "fa" ? "تجربه زیسته" : locale === "es" ? "Experiencia vivida" : "Lived experience"} text={locale === "fa" ? "آنچه می‌گوییم از زندگی واقعی می‌آید." : locale === "es" ? "Compartimos lo que hemos vivido." : "We share what we have actually lived."} /><TrustBadge icon={Scale} title={locale === "fa" ? "مرز روشن تخصص" : locale === "es" ? "Límites claros" : "Clear boundaries"} text={locale === "fa" ? "برای امور حقوقی با متخصص مجاز هماهنگ می‌شویم." : locale === "es" ? "Coordinamos profesionales habilitados cuando procede." : "We coordinate licensed professionals when needed."} /><TrustBadge icon={ShieldCheck} title={locale === "fa" ? "بدون تضمین ساختگی" : locale === "es" ? "Sin falsas garantías" : "No false guarantees"} text={locale === "fa" ? "هیچ نتیجه مهاجرتی را تضمین نمی‌کنیم." : locale === "es" ? "No garantizamos resultados migratorios." : "We do not guarantee immigration outcomes."} /><TrustBadge icon={Handshake} title={locale === "fa" ? "پرونده‌محور" : locale === "es" ? "Cada caso cuenta" : "Case-specific"} text={locale === "fa" ? "راه درست به شرایط واقعی شما بستگی دارد." : locale === "es" ? "La vía depende de tus circunstancias." : "The right path depends on your circumstances."} /></div></div></section>
    </>
  );
}
