import type { Locale } from "@vida-familia/shared";
import { ArrowUpLeft, BookOpenCheck, ChevronDown, Handshake, Scale, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { DestinationCard } from "../components/DestinationCard";
import { DisclaimerBox } from "../components/DisclaimerBox";
import { FamilyMemberCard } from "../components/FamilyMemberCard";
import { HeroBanner } from "../components/HeroBanner";
import { JsonLd } from "../components/JsonLd";
import { PackageCard } from "../components/PackageCard";
import { PresenceSection } from "../components/PresenceSection";
import { QualificationCTA } from "../components/QualificationCTA";
import { SEOHead } from "../components/SEOHead";
import { SectionHeading } from "../components/SectionHeading";
import { ServiceCard } from "../components/ServiceCard";
import { TrustBadge } from "../components/TrustBadge";
import { getCopy } from "../data/i18n";
import { contentPillars, destinations, familyMembers, packageGroups, serviceHighlights } from "../data/siteData";
import { routeFor } from "../lib/locale";

const siteUrl = "https://vidafamilia.es";

const homeCopy = {
  fa: {
    storyEyebrow: "THE DIFFERENCE",
    storyTitle: "ما فقط مشاور مهاجرت نیستیم",
    storyBody: "سایت‌های معمولی قانون را توضیح می‌دهند. ما از هزینه‌های واقعی، اشتباه‌ها، انتخاب خانه و دانشگاه، فشار روزهای اول و درس‌هایی می‌گوییم که خودمان زندگی کرده‌ایم — و بعد به افراد آماده کمک می‌کنیم مسیرشان را درست بسازند.",
    quote: "قانون مهم است؛ اما دانستن اینکه یک خانواده واقعاً چگونه زندگی را از نو می‌سازد، چیز دیگری است.",
    familyIntro: "سه زاویه از یک روایت واقعی؛ کسب‌وکار، دانشگاه و مسیر فنی در اسپانیا.",
    familyNarratives: [
      "برنامه‌ریزی مالی و کسب‌وکار، اقامت و جابه‌جایی خانواده، و تصمیم‌های واقعی درباره خرید یا اجاره خانه.",
      "تحصیل دندان‌پزشکی در دانشگاه کمپلوتنسه مادرید؛ از ورود به دانشگاه تا ریتم واقعی زندگی دانشجویی.",
      "مسیر ASIR، فناوری اطلاعات و امنیت سایبری؛ کار و سفر فنی در اسپانیا با هدف حرفه‌ای پیوستن به Deloitte.",
    ],
    familyFocuses: [["کسب‌وکار", "برنامه مالی", "استقرار خانواده"], ["دندان‌پزشکی", "UCM مادرید", "زندگی دانشجویی"], ["ASIR", "امنیت سایبری", "مسیر Deloitte"]],
    servicesIntro: "هر مسیر یک پرونده جدا نیست؛ مجموعه‌ای از تصمیم‌های به‌هم‌پیوسته درباره اقامت، تحصیل، کار، خانه و زندگی خانواده است.",
    packageIntro: "سطح همراهی را انتخاب کنید؛ دامنه نهایی بعد از ارزیابی پرونده، شفاف و مکتوب مشخص می‌شود.",
    packageSummary: "مشاهده سطح‌های همراهی",
    packageDescription: "از ارزیابی و نقشه راه تا هماهنگی مرحله‌ای برای استقرار.",
    packageFeatures: ["ارزیابی و نقشه راه", "چک‌لیست اختصاصی", "هماهنگی مرحله‌ای"],
    packageDisclaimer: "قیمت‌ها تقریبی هستند و بسته به پرونده، شهر، زمان و شرایط متقاضی تغییر می‌کنند. هزینه‌های دولتی و اشخاص ثالث جداگانه محاسبه می‌شوند مگر اینکه کتبی ذکر شود.",
    destinationDisclaimer: "اطلاعات مسیر تابعیت آرژانتین صرفاً آموزشی است. قوانین و رویه‌های قضایی تغییرپذیرند و باید برای هر پرونده با متخصص دارای صلاحیت بررسی شوند.",
    finalEyebrow: "START WITH CLARITY",
    finalTitle: "اگر تصمیم شما جدی است، مسیر را درست شروع کنیم.",
    finalBody: "چند پاسخ روشن، به ما کمک می‌کند پیش از هر وعده یا هزینه‌ای ببینیم کدام مسیر با زندگی واقعی شما تناسب دارد.",
    finalContact: "هنوز سؤال دارید؟ با ما صحبت کنید",
    trustDisclaimer: "Vida Familia خدمات آموزشی و هماهنگی ارائه می‌دهد؛ دفتر وکالت یا مرجع دولتی نیست. هیچ نتیجه ویزا، اقامت، پذیرش، کار یا تابعیتی تضمین نمی‌شود و امور حقوقی، مالیاتی یا مالی باید با متخصص دارای صلاحیت بررسی شوند.",
  },
  en: {
    storyEyebrow: "THE DIFFERENCE",
    storyTitle: "We are more than immigration consultants",
    storyBody: "Generic sites explain rules. We talk about real costs, wrong turns, housing and university decisions, the pressure of the first days and lessons we have lived — then help prepared people build a proper route.",
    quote: "Law matters. Understanding how a family actually rebuilds a life is something else.",
    familyIntro: "Three perspectives from one lived story: business, university and a technical career in Spain.",
    familyNarratives: [
      "Business and financial planning, residency and family relocation, plus real property and rental decisions.",
      "Dentistry at the Complutense University of Madrid — from university entry to the rhythm of student life.",
      "ASIR, IT and cybersecurity; work and technical travel in Spain with a long-term Deloitte ambition.",
    ],
    familyFocuses: [["Business", "Financial plan", "Family settlement"], ["Dentistry", "UCM Madrid", "Student life"], ["ASIR", "Cybersecurity", "Deloitte path"]],
    servicesIntro: "A pathway is never one isolated application. It is a connected set of decisions about residency, study, work, housing and family life.",
    packageIntro: "Choose the level of guidance; final scope is set out clearly in writing after assessment.",
    packageSummary: "View guidance levels",
    packageDescription: "From assessment and roadmap to phased settlement coordination.",
    packageFeatures: ["Assessment & roadmap", "Tailored checklist", "Phased coordination"],
    packageDisclaimer: "Prices are indicative and vary by case, city, timing and applicant circumstances. Government and third-party fees are separate unless stated in writing.",
    destinationDisclaimer: "Argentina citizenship information is educational. Law and court practice can change and require qualified case-specific review.",
    finalEyebrow: "START WITH CLARITY",
    finalTitle: "If the decision is serious, start the journey properly.",
    finalBody: "A few clear answers help us identify what fits your real life before promises, services or cost.",
    finalContact: "Still have a question? Talk to us",
    trustDisclaimer: "Vida Familia provides education and coordination; it is not a law firm or public authority. No visa, residency, admission, work or citizenship outcome is guaranteed. Legal, tax and financial matters require qualified review.",
  },
  es: {
    storyEyebrow: "LA DIFERENCIA",
    storyTitle: "Somos más que consultores migratorios",
    storyBody: "Las páginas genéricas explican normas. Nosotros hablamos de costes reales, errores, decisiones de vivienda y universidad, la presión de los primeros días y lecciones vividas — y ayudamos a personas preparadas a construir bien su ruta.",
    quote: "La ley importa; entender cómo una familia reconstruye de verdad su vida es otra cosa.",
    familyIntro: "Tres miradas de una historia vivida: empresa, universidad y carrera técnica en España.",
    familyNarratives: [
      "Empresa y planificación financiera, residencia y traslado familiar, además de decisiones reales de compra o alquiler.",
      "Odontología en la Universidad Complutense de Madrid: del acceso universitario a la vida estudiantil real.",
      "ASIR, informática y ciberseguridad; trabajo y viajes técnicos en España con la ambición de llegar a Deloitte.",
    ],
    familyFocuses: [["Empresa", "Plan financiero", "Instalación familiar"], ["Odontología", "UCM Madrid", "Vida estudiantil"], ["ASIR", "Ciberseguridad", "Ruta Deloitte"]],
    servicesIntro: "Una vía nunca es un trámite aislado. Es un conjunto conectado de decisiones sobre residencia, estudios, trabajo, vivienda y familia.",
    packageIntro: "Elige el nivel de acompañamiento; el alcance final se define claramente por escrito tras la evaluación.",
    packageSummary: "Ver niveles de apoyo",
    packageDescription: "Desde la evaluación y hoja de ruta hasta la coordinación por fases.",
    packageFeatures: ["Evaluación y hoja de ruta", "Lista personalizada", "Coordinación por fases"],
    packageDisclaimer: "Los precios son orientativos y cambian según expediente, ciudad, momento y circunstancias. Tasas y terceros se cobran aparte salvo indicación escrita.",
    destinationDisclaimer: "La información sobre ciudadanía argentina es educativa. La normativa y práctica judicial pueden cambiar y requieren revisión profesional para cada caso.",
    finalEyebrow: "EMPIEZA CON CLARIDAD",
    finalTitle: "Si la decisión es seria, empecemos bien el camino.",
    finalBody: "Unas respuestas claras nos ayudan a identificar qué encaja con tu vida antes de promesas, servicios o costes.",
    finalContact: "¿Aún tienes preguntas? Hablemos",
    trustDisclaimer: "Vida Familia ofrece educación y coordinación; no es un despacho ni una autoridad. No se garantiza visado, residencia, admisión, empleo ni ciudadanía. Los asuntos jurídicos, fiscales y financieros requieren revisión profesional.",
  },
} as const;

export function HomePage({ locale }: { locale: Locale }) {
  const c = getCopy(locale);
  const page = homeCopy[locale];
  const localized = <T extends Record<Locale, string>>(item: T) => item[locale];

  return (
    <>
      <SEOHead locale={locale} title={locale === "fa" ? "VIDA FAMILIA | اسپانیا و آرژانتین از نگاه یک خانواده واقعی" : locale === "es" ? "VIDA FAMILIA | España y Argentina desde la experiencia real" : "VIDA FAMILIA | Spain & Argentina through real experience"} description={c.heroNote} path={locale === "fa" ? "/" : `/${locale}`} keywords={locale === "fa" ? ["مهاجرت به اسپانیا", "مهاجرت به آرژانتین", "زندگی در مادرید", "اقامت خانوادگی"] : locale === "es" ? ["residencia España", "reubicación familiar", "residencia Argentina"] : ["Spain family relocation", "Argentina residency", "Madrid student life"]} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Organization", name: "Vida Familia", url: siteUrl, logo: `${siteUrl}/assets/logo.png`, image: `${siteUrl}/assets/banner.png`, description: c.heroNote, areaServed: ["Spain", "Argentina"], knowsLanguage: ["fa", "en", "es"] }} />

      <div className="home-cinematic">
        <HeroBanner locale={locale} />

        <section id="story" className="story-section section-pad">
          <div className="container story-grid scene-reveal">
            <div className="story-number">01</div>
            <div><SectionHeading eyebrow={page.storyEyebrow} title={page.storyTitle} inverse /><p className="story-lead">{page.storyBody}</p><Link className="text-link" to={routeFor(locale, "/about")}>{c.learnMore}<span>↗</span></Link></div>
            <blockquote><span>“</span>{page.quote}</blockquote>
          </div>
        </section>

        <section id="family" className="family-section section-pad">
          <div className="container">
            <SectionHeading eyebrow={c.familyKicker} title={c.familyTitle} description={page.familyIntro} />
            <div className="family-grid">{familyMembers.map((member, index) => <FamilyMemberCard key={member.initials} initials={member.initials} role={localized(member.role)} title={localized(member.title)} note={page.familyNarratives[index] ?? localized(member.note)} focuses={[...(page.familyFocuses[index] ?? [])]} index={index} />)}</div>
          </div>
        </section>

        <section id="destinations" className="destination-section section-pad">
          <div className="container">
            <SectionHeading eyebrow={c.destinationKicker} title={c.destinationTitle} align="center" inverse />
            <div className="destination-grid">{destinations.map((destination) => <DestinationCard key={destination.country} country={destination.country} title={localized(destination.title)} city={localized(destination.city)} description={localized(destination.description)} services={destination.services.map(localized)} href={routeFor(locale, `/${destination.country}`)} action={c.explore} />)}</div>
            <DisclaimerBox>{page.destinationDisclaimer}</DisclaimerBox>
          </div>
        </section>

        <section id="services" className="services-section section-pad">
          <div className="container">
            <div className="section-split"><SectionHeading eyebrow={c.servicesKicker} title={c.servicesTitle} /><p>{page.servicesIntro}</p></div>
            <div className="services-grid">{serviceHighlights.map((service) => <ServiceCard key={service.index} index={service.index} title={localized(service.title)} text={localized(service.text)} href={routeFor(locale, "/services")} />)}</div>
          </div>
        </section>

        <PresenceSection locale={locale} />

        <section id="packages" className="packages-section section-pad">
          <div className="container">
            <SectionHeading eyebrow={c.packagesKicker} title={c.packagesTitle} description={page.packageIntro} inverse />
            <div className="package-groups">{packageGroups.map((group, groupIndex) => (
              <details className="package-group scene-reveal" open={groupIndex === 0} key={localized(group.label)}>
                <summary><span className="package-country">{group.country === "Spain" ? "ES" : "AR"}</span><span><strong>{localized(group.label)}</strong><small>{page.packageSummary}</small></span><ChevronDown aria-hidden="true" /></summary>
                <div className="package-grid">{group.names.map((name, index) => <PackageCard key={name} name={name} tier={index === 0 ? "ESSENTIAL" : index === 1 ? "GUIDED" : "CONCIERGE"} description={page.packageDescription} features={[...page.packageFeatures]} featured={index === 1} />)}</div>
              </details>
            ))}</div>
            <DisclaimerBox>{page.packageDisclaimer}</DisclaimerBox>
          </div>
        </section>

        <div id="qualification" className="qualification-wrap container"><QualificationCTA locale={locale} /></div>

        <section id="real-life" className="media-section section-pad">
          <div className="container"><SectionHeading eyebrow={c.mediaKicker} title={c.mediaTitle} align="center" inverse /><div className="content-pillars">{contentPillars.map((item, index) => <Link key={item.code} to={routeFor(locale, "/resources")} className={`content-pillar pillar-${index + 1} scene-reveal`}><span>{item.code}</span><h3>{item[locale]}</h3><small>0{index + 1}</small></Link>)}</div></div>
        </section>

        <section className="trust-section section-pad"><div className="container"><SectionHeading eyebrow="TRUST & REALITY" title={c.trustTitle} inverse align="center" /><div className="trust-grid"><TrustBadge icon={BookOpenCheck} title={locale === "fa" ? "تجربه زیسته" : locale === "es" ? "Experiencia vivida" : "Lived experience"} text={locale === "fa" ? "آنچه می‌گوییم از زندگی واقعی می‌آید." : locale === "es" ? "Compartimos lo que hemos vivido." : "We share what we have actually lived."} /><TrustBadge icon={Scale} title={locale === "fa" ? "مرز روشن تخصص" : locale === "es" ? "Límites claros" : "Clear boundaries"} text={locale === "fa" ? "برای امور حقوقی با متخصص مجاز هماهنگ می‌شویم." : locale === "es" ? "Coordinamos profesionales habilitados cuando procede." : "We coordinate licensed professionals when needed."} /><TrustBadge icon={ShieldCheck} title={locale === "fa" ? "بدون تضمین ساختگی" : locale === "es" ? "Sin falsas garantías" : "No false guarantees"} text={locale === "fa" ? "هیچ نتیجه مهاجرتی را تضمین نمی‌کنیم." : locale === "es" ? "No garantizamos resultados migratorios." : "We do not guarantee immigration outcomes."} /><TrustBadge icon={Handshake} title={locale === "fa" ? "پرونده‌محور" : locale === "es" ? "Cada caso cuenta" : "Case-specific"} text={locale === "fa" ? "راه درست به شرایط واقعی شما بستگی دارد." : locale === "es" ? "La vía depende de tus circunstancias." : "The right path depends on your circumstances."} /></div><DisclaimerBox>{page.trustDisclaimer}</DisclaimerBox></div></section>

        <section id="final-cta" className="final-cta section-pad">
          <div className="final-cta-glow" aria-hidden="true" />
          <div className="final-cta-word" aria-hidden="true">VIDA</div>
          <div className="container final-cta-content scene-reveal">
            <p className="eyebrow">{page.finalEyebrow}</p>
            <h2>{page.finalTitle}</h2>
            <p>{page.finalBody}</p>
            <div><Link className="button button-gold" to={routeFor(locale, "/apply")}>{c.applyCta}<ArrowUpLeft size={18} /></Link><Link className="text-link" to={routeFor(locale, "/contact")}>{page.finalContact}<ArrowUpLeft size={17} /></Link></div>
          </div>
        </section>
      </div>
    </>
  );
}
