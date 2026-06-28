import { useState } from "react";
import type { Locale } from "@vida-familia/shared";
import { ArrowUpLeft, BookOpen, BriefcaseBusiness, Building2, GraduationCap, Heart, Home, Mail, MapPin, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";
import { ContactForm } from "../components/ContactForm";
import { DisclaimerBox } from "../components/DisclaimerBox";
import { GuideUnlockSection } from "../components/GuideUnlockSection";
import { LeadForm } from "../components/LeadForm";
import { PageShell } from "../components/PageShell";
import { QualificationCTA } from "../components/QualificationCTA";
import { SectionHeading } from "../components/SectionHeading";
import { ServiceCard } from "../components/ServiceCard";
import { destinations, serviceHighlights, servicePages } from "../data/siteData";
import { routeFor } from "../lib/locale";

const pageCopy = {
  fa: {
    aboutTitle: "یک خانواده؛ دو کشور؛ یک روایت صادقانه", aboutIntro: "ویدا فامیلیا از تجربه واقعی تحصیل، کار، خانواده و ساختن زندگی میان اسپانیا و آرژانتین شکل گرفته است.",
    aboutLead: "ما این مسیر را از پشت میز شروع نکردیم.", aboutBody: "از انتخاب مدرسه و دانشگاه تا خانه، بانک، بیمه، مدارک و روزهای پرابهام اول را زندگی کرده‌ایم. هدف ما فروش رؤیا نیست؛ تبدیل تجربه پراکنده به یک مسیر قابل‌فهم برای افراد جدی است.",
    servicesTitle: "مسیر درست، قبل از خدمات بیشتر", servicesIntro: "خدمات ما از ارزیابی تناسب مسیر شروع می‌شود و فقط تا جایی ادامه پیدا می‌کند که برای پرونده شما معنا داشته باشد.",
    resourcesTitle: "راهنماهایی برای تصمیم بهتر", resourcesIntro: "محتوای ویدا فامیلیا برای دیدن واقعیت زندگی، هزینه، تحصیل و کار پیش از تصمیم طراحی شده است.",
    applyTitle: "اول تناسب مسیر را بررسی کنیم", applyIntro: "این یک فرم فروش نیست؛ نقطه شروع یک ارزیابی واقع‌بینانه و محترمانه است.",
    contactTitle: "یک گفت‌وگوی روشن، نه یک وعده مبهم", contactIntro: "برای سؤال عمومی یا همکاری پیام بگذارید. ارزیابی پرونده‌های شخصی از طریق فرم ارزیابی انجام می‌شود.",
  },
  en: {
    aboutTitle: "One family. Two countries. An honest story.", aboutIntro: "Vida Familia grew from real experience of study, work, family and rebuilding life across Spain and Argentina.",
    aboutLead: "We did not begin this journey behind a desk.", aboutBody: "We have lived the decisions around school, university, housing, banking, insurance, paperwork and uncertain first days. Our purpose is not to sell a dream; it is to turn scattered experience into a clear path for serious people.",
    servicesTitle: "The right path before more services", servicesIntro: "Our work starts by assessing fit and continues only as far as it genuinely serves your case.",
    resourcesTitle: "Guides for better decisions", resourcesIntro: "Vida Familia content helps you see real life, cost, study and work before deciding.",
    applyTitle: "Let us assess fit first", applyIntro: "This is not a sales form; it is the start of a realistic, respectful assessment.",
    contactTitle: "A clear conversation, not a vague promise", contactIntro: "Leave a note for general questions or partnerships. Personal case assessments begin through the assessment form.",
  },
  es: {
    aboutTitle: "Una familia. Dos países. Una historia honesta.", aboutIntro: "Vida Familia nace de una experiencia real de estudios, trabajo, familia y reconstrucción de vida entre España y Argentina.",
    aboutLead: "No empezamos este viaje detrás de un escritorio.", aboutBody: "Hemos vivido las decisiones sobre colegios, universidad, vivienda, banca, seguros, documentos y los inciertos primeros días. No vendemos un sueño: convertimos experiencia dispersa en un camino claro para personas serias.",
    servicesTitle: "La vía correcta antes que más servicios", servicesIntro: "Nuestro trabajo comienza valorando el encaje y continúa solo cuando aporta valor real al caso.",
    resourcesTitle: "Guías para decidir mejor", resourcesIntro: "El contenido de Vida Familia muestra vida, costes, estudios y trabajo reales antes de decidir.",
    applyTitle: "Primero evaluamos el encaje", applyIntro: "No es un formulario comercial; es el inicio de una evaluación realista y respetuosa.",
    contactTitle: "Una conversación clara, no una promesa vaga", contactIntro: "Escríbenos para preguntas generales o colaboraciones. La evaluación personal comienza con el formulario.",
  },
} as const;

export function AboutPage({ locale }: { locale: Locale }) {
  const c = pageCopy[locale];
  const principles = locale === "fa" ? [["واقعیت قبل از آرزو", "هزینه‌ها، محدودیت‌ها و اشتباه‌ها را هم می‌گوییم."], ["خانواده به‌عنوان یک کل", "تصمیم یک نفر بر تحصیل، کار و آرامش همه اثر دارد."], ["تخصص در جای درست", "موضوع حقوقی یا مالیاتی را به متخصص دارای صلاحیت می‌سپاریم."], ["فرایند به‌جای فشار", "نه فوریت ساختگی داریم و نه وعده نتیجه قطعی."]] : locale === "es" ? [["Realidad antes que ilusión", "También hablamos de costes, límites y errores."], ["La familia como conjunto", "Cada decisión afecta estudios, trabajo y bienestar de todos."], ["Experiencia donde corresponde", "Derivamos lo jurídico o fiscal a profesionales habilitados."], ["Proceso, no presión", "Sin urgencia falsa ni promesas de resultado."]] : [["Reality before aspiration", "We also discuss costs, limits and mistakes."], ["The family as a whole", "Each decision affects everyone's study, work and wellbeing."], ["Expertise in the right place", "Legal and tax matters go to qualified professionals."], ["Process, not pressure", "No fake urgency and no promised outcome."]];
  return <PageShell locale={locale} eyebrow="OUR STORY" title={c.aboutTitle} intro={c.aboutIntro} path="/about"><section className="content-section editorial-story"><div><p className="eyebrow">WHY VIDA FAMILIA</p><h2>{c.aboutLead}</h2></div><p>{c.aboutBody}</p></section><section className="content-section"><SectionHeading eyebrow="OUR STANDARD" title={locale === "fa" ? "چیزی که به آن پایبندیم" : locale === "es" ? "Nuestros principios" : "What we stand for"} /><div className="principles-grid">{principles.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section><QualificationCTA locale={locale} /></PageShell>;
}

export function DestinationPage({ locale, country }: { locale: Locale; country: "spain" | "argentina" }) {
  const data = destinations.find((item) => item.country === country);
  if (!data) return null;
  const title = data.title[locale];
  const intro = data.description[locale];
  const services = servicePages.filter((item) => item.country === country);
  const practical = locale === "fa"
    ? country === "spain"
      ? ["NIE / TIE", "ثبت محل سکونت", "بانک", "مسکن", "بیمه", "هماهنگی مالیاتی", "ثبت مدرسه", "ترجمه"]
      : ["DNI", "CDI / CUIL", "گواهی محل سکونت", "بانک", "مسکن", "بیمه", "ثبت مدرسه", "ترجمه"]
    : country === "spain"
      ? ["NIE / TIE", "Empadronamiento", "Banking", "Housing", "Insurance", "Tax coordination", "School enrollment", "Translation"]
      : ["DNI", "CDI / CUIL", "Certificado de domicilio", "Banking", "Housing", "Insurance", "School enrollment", "Translation"];
  return <PageShell locale={locale} eyebrow={locale === "fa" ? `${country === "spain" ? "اسپانیا" : "آرژانتین"} · مقصد` : locale === "es" ? `${country === "spain" ? "España" : "Argentina"} · destino` : `${country.toUpperCase()} · destination`} title={title} intro={intro} path={`/${country}`} tone={country} contentClassName="country-page-content"><section className="content-section editorial-story"><div><p className="eyebrow">{locale === "fa" ? "زندگی واقعی" : locale === "es" ? "Vida real" : "Real life"}</p><h2>{locale === "fa" ? `زندگی در ${title} فقط پرونده اقامت نیست` : locale === "es" ? `Vivir en ${title} no es solo un expediente` : `Life in ${title} is more than an application`}</h2></div><p>{locale === "fa" ? "محله، هزینه، مدرسه، زبان، رفت‌وآمد و شبکه حمایتی به اندازه مدارک اهمیت دارند. برنامه ما این تصمیم‌ها را در یک تصویر واحد کنار هم می‌گذارد." : locale === "es" ? "Barrio, costes, colegios, idioma, transporte y red de apoyo importan tanto como los documentos. Nuestro plan conecta todas estas decisiones." : "Neighborhood, cost, school, language, transport and support networks matter as much as documents. Our plan connects them."}</p></section><section className="content-section"><SectionHeading eyebrow={locale === "fa" ? "مسیرها" : locale === "es" ? "Vías" : "Pathways"} title={locale === "fa" ? "مسیرهای اصلی" : locale === "es" ? "Vías principales" : "Core pathways"} /><div className="pathway-grid">{services.map((service) => <Link key={service.slug} to={routeFor(locale, `/services/${country}/${service.slug}`)}><span>{country === "spain" ? "ES" : "AR"}</span><h3>{service.title[locale]}</h3><p>{service.summary[locale]}</p><ArrowUpLeft /></Link>)}</div></section><section className="content-section tinted-section"><SectionHeading eyebrow={locale === "fa" ? "استقرار" : locale === "es" ? "Instalación" : "Settlement"} title={locale === "fa" ? "جزئیات زندگی روزمره" : locale === "es" ? "Detalles de la vida diaria" : "Everyday settlement details"} /><div className="tag-cloud">{practical.map((item) => <span key={item}><bdi>{item}</bdi></span>)}</div></section><QualificationCTA locale={locale} /><DisclaimerBox>{locale === "fa" ? "شرایط اقامت، مالیات، کار و تابعیت تغییرپذیر و پرونده‌محور است. این صفحه آموزشی است و باید پیش از اقدام با منبع رسمی و متخصص مناسب تأیید شود." : locale === "es" ? "Residencia, fiscalidad, trabajo y ciudadanía cambian y dependen del caso. Confirma la información con fuentes oficiales y profesionales." : "Residency, tax, work and citizenship rules change and depend on the case. Confirm information with official sources and qualified professionals."}</DisclaimerBox></PageShell>;
}

const journeyCopy = {
  fa: {
    labels: { next: "مرحله بعد", previous: "مرحله قبل", continue: "ادامه مسیر", back: "بازگشت به مراحل" },
    title: "از تصمیم تا استقرار",
    routesTitle: "مسیرهای خدماتی",
    details: [
      "ابتدا مقصد، هدف، بودجه، زمان‌بندی و محدودیت‌های واقعی خانواده کنار هم دیده می‌شوند.",
      "مدارک اصلی، ترجمه‌ها، زمان تأیید و ترتیب اقدام‌ها قبل از عجله برای ارسال پرونده منظم می‌شوند.",
      "خانه، بانک، بیمه، ثبت‌های محلی و ریتم روزهای اول از قبل در برنامه قرار می‌گیرند.",
      "تصمیم یک نفر روی مدرسه، کار، زبان و آرامش همه اثر دارد، پس مسیر خانواده یکپارچه دیده می‌شود.",
    ],
  },
  en: {
    labels: { next: "Next step", previous: "Previous step", continue: "Continue the path", back: "Back to steps" },
    title: "From decision to settlement",
    routesTitle: "Service routes",
    details: [
      "First we connect destination, goal, budget, timing and the family’s real constraints.",
      "We organize documents, translations, validation timing and sequence before rushing the file.",
      "Housing, banking, insurance, local registrations and first days are planned early.",
      "One person’s decision affects school, work, language and family stability, so the plan stays connected.",
    ],
  },
  es: {
    labels: { next: "Siguiente paso", previous: "Paso anterior", continue: "Continuar la ruta", back: "Volver a los pasos" },
    title: "De la decisión a la instalación",
    routesTitle: "Rutas de servicio",
    details: [
      "Primero conectamos destino, objetivo, presupuesto, calendario y límites reales de la familia.",
      "Ordenamos documentos, traducciones, tiempos de validación y secuencia antes de presentar.",
      "Vivienda, banco, seguro, registros locales y primeros días entran en el plan desde el inicio.",
      "La decisión de una persona afecta colegio, trabajo, idioma y calma familiar, por eso miramos el conjunto.",
    ],
  },
} as const;

export const pathwayStepSlugs = ["pathway-strategy", "document-readiness", "housing-settlement", "family-coordination"] as const;
type PathwayStepSlug = (typeof pathwayStepSlugs)[number];

const pathwayStepDetails: Record<PathwayStepSlug, Record<Locale, {
  lead: string;
  sections: Array<{ title: string; body: string }>;
  outcome: string;
  connects: string;
}>> = {
  "pathway-strategy": {
    fa: {
      lead: "این مرحله قبل از هر فرم و هزینه جدی، مسیر زندگی را روشن می‌کند: اسپانیا یا آرژانتین، تحصیل یا کار، بودجه، زمان و نیازهای خانواده.",
      sections: [
        { title: "چه مسئله‌ای را حل می‌کند", body: "تصمیم‌های پراکنده درباره کشور، نوع اقامت، دانشگاه، کار، خانواده و پول را به یک مسیر قابل تصمیم تبدیل می‌کند." },
        { title: "ویدا فامیلیا چه چیزی را بررسی می‌کند", body: "تناسب اسپانیا و آرژانتین، بودجه واقعی، زمان‌بندی، هدف تحصیلی یا کاری، ریسک‌های خانواده و معیارهای تصمیم را کنار هم می‌گذاریم." },
        { title: "خانواده چه چیزی آماده می‌کند", body: "هدف اصلی، وضعیت مالی، سن و نیازهای اعضای خانواده، سطح زبان، سابقه تحصیل یا کار و محدودیت‌های زمانی." },
        { title: "اشتباه‌های رایج", body: "شروع با کشور محبوب، نه کشور مناسب؛ نادیده گرفتن هزینه ماه‌های اول؛ یا انتخاب مسیر بدون دیدن مدرسه، کار و مسکن." },
      ],
      outcome: "خروجی عملی این مرحله یک نقشه راه اولیه است: مقصد پیشنهادی، مسیر محتمل، زمان تقریبی، ریسک‌ها و قدم بعدی برای مدارک.",
      connects: "وقتی مسیر انتخاب شد، مرحله بعد این است که مدارک با همان مسیر هماهنگ شوند، نه اینکه یک چک‌لیست عمومی دنبال شود.",
    },
    en: {
      lead: "This step clarifies the life route before serious forms or costs: Spain or Argentina, study or work, budget, timing and family needs.",
      sections: [
        { title: "What this step solves", body: "It turns scattered choices about country, residence path, university, work, family and money into a route you can actually decide on." },
        { title: "What Vida Familia checks", body: "We compare Spain and Argentina fit, realistic budget, timing, study or work goals, family risks and the criteria behind the decision." },
        { title: "What the family provides", body: "Main goal, finances, ages and needs of family members, language level, study or work background and timing constraints." },
        { title: "Common mistakes", body: "Starting with the country that feels attractive instead of the country that fits; ignoring first-month costs; choosing a route before checking school, work and housing reality." },
      ],
      outcome: "The practical outcome is an initial roadmap: recommended destination, likely pathway, rough timing, risks and the next document step.",
      connects: "Once the route is chosen, documents need to match that route rather than follow a generic checklist.",
    },
    es: {
      lead: "Esta etapa aclara la ruta de vida antes de formularios o costes serios: España o Argentina, estudios o trabajo, presupuesto, tiempos y necesidades familiares.",
      sections: [
        { title: "Qué resuelve esta etapa", body: "Convierte decisiones dispersas sobre país, residencia, universidad, trabajo, familia y dinero en una ruta que se puede decidir." },
        { title: "Qué revisa Vida Familia", body: "Comparamos encaje entre España y Argentina, presupuesto realista, calendario, objetivo académico o laboral, riesgos familiares y criterios de decisión." },
        { title: "Qué aporta la familia", body: "Objetivo principal, situación económica, edades y necesidades familiares, nivel de idioma, perfil académico o laboral y límites de tiempo." },
        { title: "Errores frecuentes", body: "Empezar por el país que atrae y no por el que encaja; ignorar costes iniciales; elegir ruta sin mirar colegio, trabajo y vivienda." },
      ],
      outcome: "El resultado práctico es una hoja de ruta inicial: destino recomendado, vía probable, tiempos aproximados, riesgos y siguiente paso documental.",
      connects: "Una vez elegida la ruta, los documentos deben responder a esa ruta y no a una lista genérica.",
    },
  },
  "document-readiness": {
    fa: {
      lead: "در این مرحله پرونده از حالت ایده به مدارک قابل پیگیری تبدیل می‌شود؛ مدارک هویتی، مالی، تحصیلی، ترجمه‌ها و زمان تأییدها کنار هم می‌آیند.",
      sections: [
        { title: "چه مسئله‌ای را حل می‌کند", body: "ریسک توقف پرونده به‌خاطر مدرک ناقص، ترجمه دیرهنگام، تاریخ منقضی یا ترتیب اشتباه اقدام‌ها را کم می‌کند." },
        { title: "ویدا فامیلیا چه چیزی را آماده می‌کند", body: "چک‌لیست مسیرمحور، اولویت مدارک کند، ترجمه و آپوستیل یا لگالیزیشن، بسته درخواست و زمان‌بندی ارسال." },
        { title: "خانواده چه چیزی آماده می‌کند", body: "پاسپورت‌ها، مدارک تولد و ازدواج در صورت نیاز، سوابق تحصیلی، مدارک مالی، گواهی‌های لازم و نسخه‌های قابل ترجمه." },
        { title: "اشتباه‌های رایج", body: "ترجمه قبل از نهایی‌شدن مسیر، جا انداختن مدرک کشور مبدأ، بی‌توجهی به اعتبار زمانی، یا ارسال فایل‌های پراکنده بدون ساختار." },
      ],
      outcome: "خروجی عملی، یک پرونده منظم با اولویت، وضعیت هر مدرک و قدم‌های بعدی برای ترجمه، تأیید یا تکمیل است.",
      connects: "وقتی مدارک روشن شد، برنامه ورود و استقرار می‌تواند واقعی‌تر شود: خانه، بانک، بیمه، ثبت‌های محلی و روزهای اول.",
    },
    en: {
      lead: "This step turns the idea into a trackable file: identity, financial, academic documents, translations and validation timing are organized together.",
      sections: [
        { title: "What this step solves", body: "It reduces the risk of a file stopping because of missing paperwork, late translation, expired records or the wrong order of actions." },
        { title: "What Vida Familia prepares", body: "A pathway-specific checklist, slow-document priorities, translation and apostille/legalization timing, application packet structure and submission sequence." },
        { title: "What the family provides", body: "Passports, birth or marriage records when relevant, education records, financial evidence, required certificates and clean copies for translation." },
        { title: "Common mistakes", body: "Translating before the route is final, forgetting origin-country documents, ignoring document validity windows or sending scattered files without structure." },
      ],
      outcome: "The practical outcome is an organized file with priorities, status for each document and next actions for translation, validation or completion.",
      connects: "When the paperwork is clear, arrival planning becomes more realistic: housing, banking, insurance, local registrations and first days.",
    },
    es: {
      lead: "Esta etapa convierte la idea en un expediente controlable: identidad, finanzas, estudios, traducciones y validaciones se ordenan juntos.",
      sections: [
        { title: "Qué resuelve esta etapa", body: "Reduce el riesgo de que el expediente se pare por documentos incompletos, traducciones tardías, certificados caducados o secuencia incorrecta." },
        { title: "Qué prepara Vida Familia", body: "Lista específica por vía, prioridad de documentos lentos, traducción y apostilla/legalización, estructura del paquete y calendario de presentación." },
        { title: "Qué aporta la familia", body: "Pasaportes, partidas o certificados familiares si aplican, estudios, pruebas económicas, certificados necesarios y copias limpias para traducir." },
        { title: "Errores frecuentes", body: "Traducir antes de cerrar la ruta, olvidar documentos del país de origen, ignorar plazos de validez o enviar archivos sin estructura." },
      ],
      outcome: "El resultado práctico es un expediente ordenado con prioridades, estado de cada documento y próximos pasos de traducción, validación o cierre.",
      connects: "Con los documentos claros, la llegada puede planificarse mejor: vivienda, banco, seguro, registros locales y primeros días.",
    },
  },
  "housing-settlement": {
    fa: {
      lead: "این مرحله زندگی روزهای اول را از قبل جدی می‌گیرد: خانه، محله، مدرسه، بانک، بیمه، ثبت محلی و نیازهای هفته اول.",
      sections: [
        { title: "چه مسئله‌ای را حل می‌کند", body: "کمک می‌کند ورود خانواده به کشور جدید فقط یک تاریخ پرواز نباشد، بلکه برنامه‌ای برای خواب، پول، رفت‌وآمد، مدرسه و آرامش اولیه داشته باشد." },
        { title: "ویدا فامیلیا چه چیزی را بررسی می‌کند", body: "تناسب محله با بودجه و مدرسه، مدارک اجاره، نیازهای بانکی و بیمه‌ای، ثبت‌های محلی و اولویت کارهای هفته اول." },
        { title: "خانواده چه چیزی آماده می‌کند", body: "بودجه مسکن، تعداد اعضا، نیاز مدرسه یا دانشگاه، شهر ترجیحی، زمان ورود، مدارک درآمد و سطح انعطاف در محله یا نوع خانه." },
        { title: "اشتباه‌های رایج", body: "رزرو عجولانه خانه، ندیدن هزینه ضمانت و کمیسیون، عقب انداختن بانک یا بیمه، یا انتخاب محله فقط براساس عکس." },
      ],
      outcome: "خروجی عملی، برنامه ورود و استقرار است: اولویت‌های مسکن، کارهای اداری، نیازهای مالی و چک‌لیست روزهای اول.",
      connects: "بعد از آماده‌شدن ورود، باید مطمئن شد وظایف و زمان‌بندی بین اعضای خانواده هماهنگ است.",
    },
    en: {
      lead: "This step treats the first days as a real life plan: housing, neighborhood, school, banking, insurance, local registration and first-week needs.",
      sections: [
        { title: "What this step solves", body: "It makes arrival more than a flight date by planning where the family sleeps, how money works, transport, school needs and early stability." },
        { title: "What Vida Familia checks", body: "Neighborhood fit for budget and school, rental evidence, banking and insurance needs, local registrations and first-week priorities." },
        { title: "What the family provides", body: "Housing budget, family size, school or university needs, preferred city, arrival date, income evidence and flexibility on neighborhood or housing type." },
        { title: "Common mistakes", body: "Rushing into housing, missing deposit and agency costs, delaying bank or insurance steps, or choosing a neighborhood from photos alone." },
      ],
      outcome: "The practical outcome is an arrival and settlement plan: housing priorities, administrative steps, financial needs and first-days checklist.",
      connects: "Once arrival is planned, the family needs clear task ownership and timing so everyone stays aligned.",
    },
    es: {
      lead: "Esta etapa toma en serio los primeros días: vivienda, barrio, colegio, banco, seguro, registros locales y necesidades de la primera semana.",
      sections: [
        { title: "Qué resuelve esta etapa", body: "Hace que la llegada sea más que un vuelo: planifica dónde dormir, cómo gestionar dinero, transporte, colegio y estabilidad inicial." },
        { title: "Qué revisa Vida Familia", body: "Encaje de barrio con presupuesto y colegio, documentos de alquiler, necesidades bancarias y de seguro, registros locales y prioridades de la primera semana." },
        { title: "Qué aporta la familia", body: "Presupuesto de vivienda, tamaño familiar, necesidades escolares o universitarias, ciudad preferida, fecha de llegada, prueba de ingresos y flexibilidad." },
        { title: "Errores frecuentes", body: "Reservar vivienda con prisa, no calcular fianza y comisión, retrasar banco o seguro, o elegir barrio solo por fotos." },
      ],
      outcome: "El resultado práctico es un plan de llegada e instalación: prioridades de vivienda, trámites, necesidades financieras y lista de primeros días.",
      connects: "Con la llegada planificada, la familia necesita tareas claras y calendario compartido para mantenerse alineada.",
    },
  },
  "family-coordination": {
    fa: {
      lead: "مرحله آخر مسیر را انسانی نگه می‌دارد: زمان‌بندی خانواده، مدرسه بچه‌ها، نقش همسر یا شریک، تقسیم وظایف و ارتباط شفاف.",
      sections: [
        { title: "چه مسئله‌ای را حل می‌کند", body: "جابه‌جایی فقط پرونده یک نفر نیست. این مرحله فشار تصمیم، وظایف و انتظارها را بین اعضای خانواده قابل مدیریت می‌کند." },
        { title: "ویدا فامیلیا چه چیزی را هماهنگ می‌کند", body: "تقویم مشترک، مالک هر کار، نیازهای مدرسه و زبان، اولویت‌های همسر یا شریک، نقاط تصمیم و زمان تماس‌های پیگیری." },
        { title: "خانواده چه چیزی آماده می‌کند", body: "مسئول هر بخش، محدودیت‌های کاری و تحصیلی، نیاز کودکان، ترجیح‌های زندگی روزمره و تصمیم‌هایی که باید قبل از حرکت گرفته شود." },
        { title: "اشتباه‌های رایج", body: "تمرکز کامل روی متقاضی اصلی، نادیده گرفتن مدرسه و زبان، تقسیم‌نکردن وظایف، یا نگه‌داشتن تصمیم‌های سخت تا روزهای آخر." },
      ],
      outcome: "خروجی عملی، یک برنامه هماهنگی خانواده است: وظایف، تاریخ‌ها، مسئولیت‌ها، نقاط پیگیری و مسیر ادامه بعد از ورود.",
      connects: "در این نقطه مسیر آماده ورود به ارزیابی کامل یا اجرای مرحله‌ای است؛ اگر تناسب وجود داشته باشد، همکاری دقیق‌تر تعریف می‌شود.",
    },
    en: {
      lead: "The final step keeps the move human: family timing, children’s school needs, spouse or partner planning, task ownership and clear communication.",
      sections: [
        { title: "What this step solves", body: "Relocation is not one person’s file. This step makes decisions, responsibilities and expectations manageable for the whole family." },
        { title: "What Vida Familia coordinates", body: "Shared calendar, task owners, school and language needs, spouse or partner priorities, decision points and follow-up rhythm." },
        { title: "What the family provides", body: "Who owns each task, work and study constraints, children’s needs, daily-life preferences and decisions that must be made before moving." },
        { title: "Common mistakes", body: "Focusing only on the main applicant, ignoring school and language, leaving tasks unassigned or keeping hard decisions until the final days." },
      ],
      outcome: "The practical outcome is a family coordination plan: tasks, dates, owners, follow-up points and the continuation path after arrival.",
      connects: "At this point the route is ready for full assessment or phased execution; if the fit is real, the next collaboration can be defined precisely.",
    },
    es: {
      lead: "La última etapa mantiene la mudanza humana: calendario familiar, colegio de los hijos, planificación de pareja, reparto de tareas y comunicación clara.",
      sections: [
        { title: "Qué resuelve esta etapa", body: "La reubicación no es el expediente de una sola persona. Ordena decisiones, responsabilidades y expectativas para toda la familia." },
        { title: "Qué coordina Vida Familia", body: "Calendario compartido, responsables de tareas, colegio e idioma, prioridades de pareja, puntos de decisión y ritmo de seguimiento." },
        { title: "Qué aporta la familia", body: "Responsables de cada parte, límites laborales y académicos, necesidades de hijos, preferencias de vida diaria y decisiones previas a la mudanza." },
        { title: "Errores frecuentes", body: "Mirar solo al solicitante principal, ignorar colegio e idioma, no repartir tareas o dejar decisiones difíciles para el final." },
      ],
      outcome: "El resultado práctico es un plan de coordinación familiar: tareas, fechas, responsables, puntos de seguimiento y continuación tras la llegada.",
      connects: "En este punto la ruta está lista para evaluación completa o ejecución por fases; si encaja, la colaboración se define con precisión.",
    },
  },
};

export function ServicesPage({ locale }: { locale: Locale }) {
  const c = pageCopy[locale];
  const journey = journeyCopy[locale];
  const localized = <T extends Record<Locale, string>>(item: T) => item[locale];

  return (
    <PageShell locale={locale} eyebrow={locale === "fa" ? "خدمات" : locale === "es" ? "Servicios" : "Services"} title={c.servicesTitle} intro={c.servicesIntro} path="/services">
      <section id="service-steps" className="content-section service-steps-overview">
        <SectionHeading eyebrow={journey.labels.continue} title={journey.title} />
        <div className="services-grid">
          {serviceHighlights.map((service, index) => (
            <ServiceCard key={service.index} index={service.index} title={localized(service.title)} text={localized(service.text)} href={routeFor(locale, "/services/pathway/" + pathwayStepSlugs[index])} />
          ))}
        </div>
      </section>

      <section className="content-section">
        <SectionHeading eyebrow={locale === "fa" ? "مسیرها" : locale === "es" ? "Rutas" : "Routes"} title={journey.routesTitle} />
        <div className="pathway-grid pathway-grid-wide">
          {servicePages.map((service) => <Link key={service.country + "-" + service.slug} to={routeFor(locale, "/services/" + service.country + "/" + service.slug)}><span>{service.country === "spain" ? "ES" : "AR"}</span><h3>{service.title[locale]}</h3><p>{service.summary[locale]}</p><ArrowUpLeft /></Link>)}
        </div>
      </section>

      <section className="content-section">
        <SectionHeading eyebrow={locale === "fa" ? "حمایت عملی" : locale === "es" ? "Apoyo práctico" : "Practical support"} title={locale === "fa" ? "خدمات تکمیلی استقرار" : locale === "es" ? "Apoyo práctico de instalación" : "Practical settlement support"} />
        <div className="icon-feature-grid"><article><Home /><h3>{locale === "fa" ? "مسکن" : locale === "es" ? "Vivienda" : "Housing"}</h3><p>{locale === "fa" ? "استراتژی جست‌وجو، مدارک اجاره و هماهنگی عملی." : locale === "es" ? "Estrategia de búsqueda, documentos de alquiler y coordinación práctica." : "Search strategy, rental documents and practical coordination."}</p></article><article><Building2 /><h3>{locale === "fa" ? "امور اداری" : locale === "es" ? "Administración" : "Administration"}</h3><p>{locale === "fa" ? "ثبت‌های محلی، بانک، بیمه و زمان‌بندی امور." : locale === "es" ? "Registros locales, banca, seguro y calendario." : "Local registrations, banking, insurance and timing."}</p></article><article><GraduationCap /><h3>{locale === "fa" ? "آموزش" : locale === "es" ? "Educación" : "Education"}</h3><p>{locale === "fa" ? "دانشگاه، مدرسه، زبان و انطباق تحصیلی." : locale === "es" ? "Universidad, colegio, idioma y adaptación académica." : "University, school, language and academic transition."}</p></article><article><BriefcaseBusiness /><h3>{locale === "fa" ? "کسب‌وکار" : locale === "es" ? "Empresa" : "Business"}</h3><p>{locale === "fa" ? "هماهنگی ساختار کسب‌وکار و ارجاع تخصصی." : locale === "es" ? "Coordinación de estructura empresarial y derivaciones profesionales." : "Business structure coordination and specialist referrals."}</p></article></div>
      </section>
      <QualificationCTA locale={locale} />
    </PageShell>
  );
}

export function PathwayStepPage({ locale, slug }: { locale: Locale; slug: string }) {
  const index = pathwayStepSlugs.indexOf(slug as (typeof pathwayStepSlugs)[number]);
  if (index < 0) return null;

  const journey = journeyCopy[locale];
  const service = serviceHighlights[index];
  if (!service) return null;

  const detail = journey.details[index] ?? "";
  const localized = <T extends Record<Locale, string>>(item: T) => item[locale];
  const previousSlug = index > 0 ? pathwayStepSlugs[index - 1] : undefined;
  const nextSlug = index < pathwayStepSlugs.length - 1 ? pathwayStepSlugs[index + 1] : undefined;
  const stepDetail = pathwayStepDetails[slug as PathwayStepSlug][locale];

  return (
    <PageShell locale={locale} eyebrow={journey.labels.continue + " / " + service.index} title={localized(service.title)} intro={stepDetail.lead} path={"/services/pathway/" + slug}>
      <section className="content-section service-flow-detail-section">
        <article className="service-flow-panel pathway-step-page-panel" id={"service-step-" + service.index}>
          <p className="eyebrow">{journey.title}</p>
          <h2>{localized(service.title)}</h2>
          <p>{localized(service.text)}</p>
          <p>{detail}</p>
          <div className="pathway-step-nav">
            {previousSlug ? <Link className="text-link" to={routeFor(locale, "/services/pathway/" + previousSlug)}>{journey.labels.previous}</Link> : null}
            {nextSlug ? <Link className="button button-small button-outline" to={routeFor(locale, "/services/pathway/" + nextSlug)}>{journey.labels.next}</Link> : <Link className="button button-small button-outline" to={routeFor(locale, "/apply")}>{locale === "fa" ? "ارزیابی شرایط من" : locale === "es" ? "Evaluar mi situación" : "Assess my situation"}</Link>}
            <Link className="text-link" to={routeFor(locale, "/services#service-steps")}>{journey.labels.back}</Link>
          </div>
        </article>
      </section>

      <section className="content-section pathway-detail-grid" aria-label={localized(service.title)}>
        {stepDetail.sections.map((section, sectionIndex) => (
          <article className="pathway-detail-card" key={section.title}>
            <span>{String(sectionIndex + 1).padStart(2, "0")}</span>
            <h3>{section.title}</h3>
            <p>{section.body}</p>
          </article>
        ))}
      </section>

      <section className="content-section pathway-outcome-panel">
        <div>
          <p className="eyebrow">{locale === "fa" ? "خروجی عملی" : locale === "es" ? "Resultado práctico" : "Practical outcome"}</p>
          <h2>{stepDetail.outcome}</h2>
        </div>
        <div>
          <p className="eyebrow">{locale === "fa" ? "اتصال به مرحله بعد" : locale === "es" ? "Conexión con la siguiente etapa" : "How it connects"}</p>
          <p>{stepDetail.connects}</p>
          <div className="pathway-step-nav">
            {previousSlug ? <Link className="text-link" to={routeFor(locale, "/services/pathway/" + previousSlug)}>{journey.labels.previous}</Link> : null}
            {nextSlug ? <Link className="button button-small button-outline" to={routeFor(locale, "/services/pathway/" + nextSlug)}>{journey.labels.next}</Link> : <Link className="button button-small button-outline" to={routeFor(locale, "/apply")}>{locale === "fa" ? "ارزیابی شرایط من" : locale === "es" ? "Evaluar mi situación" : "Assess my situation"}</Link>}
            <Link className="text-link" to={routeFor(locale, "/services#service-steps")}>{journey.labels.back}</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export function LifestylePage({ locale, type }: { locale: Locale; type: "family-life" | "student-life" | "business-residency" }) {
  const info = {
    "family-life": { icon: Heart, title: { fa: "زندگی خانوادگی", en: "Family life", es: "Vida familiar" }, intro: { fa: "مدرسه، محله، سلامت، زبان و ریتم روزمره؛ چیزهایی که کیفیت واقعی جابه‌جایی را می‌سازند.", en: "School, neighborhood, health, language and daily rhythm, the ingredients of a real family move.", es: "Colegio, barrio, salud, idioma y ritmo diario: lo que define un traslado familiar real." } },
    "student-life": { icon: BookOpen, title: { fa: "زندگی دانشجویی", en: "Student life", es: "Vida estudiantil" }, intro: { fa: "پذیرش فقط آغاز است؛ زبان، بودجه، خانه و سازگاری تعیین می‌کنند تجربه تحصیل چگونه پیش می‌رود.", en: "Admission is only the beginning; language, budget, housing and adaptation shape the experience.", es: "La admisión es solo el comienzo; idioma, presupuesto, vivienda y adaptación definen la experiencia." } },
    "business-residency": { icon: BriefcaseBusiness, title: { fa: "کسب‌وکار و اقامت", en: "Business & residency", es: "Empresa y residencia" }, intro: { fa: "تصمیم‌های شرکتی، حرفه‌ای، مالیاتی و خانوادگی باید از ابتدا با هم دیده شوند.", en: "Company, professional, tax and family decisions need one coherent plan from the start.", es: "Empresa, profesión, fiscalidad y familia necesitan un plan coherente desde el inicio." } },
  }[type];
  const Icon = info.icon;
  return <PageShell locale={locale} eyebrow="LIVED EXPERIENCE" title={info.title[locale]} intro={info.intro[locale]} path={`/${type}`}><section className="content-section lifestyle-focus"><Icon /><div><h2>{locale === "fa" ? "واقعیت‌های کوچک، تصمیم‌های بزرگ" : locale === "es" ? "Pequeñas realidades, grandes decisiones" : "Small realities, big decisions"}</h2><p>{locale === "fa" ? "محتوای این بخش به‌تدریج با راهنماهای میدانی، تجربه‌های خانواده و گفت‌وگو با متخصصان تکمیل می‌شود. نسخه نخست، چارچوب تصمیم و مسیرهای مرتبط را در اختیار شما می‌گذارد." : locale === "es" ? "Esta sección crecerá con guías de campo, experiencias familiares y conversaciones profesionales. La primera versión ofrece el marco y las vías relacionadas." : "This section will grow with field guides, family experience and professional conversations. The first release provides a decision framework and related pathways."}</p></div></section><QualificationCTA locale={locale} /></PageShell>;
}

export function ResourcesPage({ locale }: { locale: Locale }) {
  const c = pageCopy[locale];
  const [openIndex, setOpenIndex] = useState(0);
  const sectionLabels = locale === "fa" ? ["برای چه کسی است؟", "چه چیزهایی را باید بررسی کنید؟", "اشتباه رایج", "قدم بعدی"] : locale === "es" ? ["Para quién es", "Qué revisar", "Error frecuente", "Siguiente paso"] : ["Who it is for", "What to check", "Common mistake", "Next step"];
  const readGuide = locale === "fa" ? "مطالعه راهنما" : locale === "es" ? "Leer guía" : "Read guide";
  const guides = locale === "fa" ? [
    { category: "بودجه", title: "بودجه ماه اول زندگی خانوادگی", sections: ["برای خانواده‌هایی که می‌خواهند قبل از ورود، فشار نقدینگی ماه اول را واقع‌بینانه ببینند.", "ودیعه، اجاره اول، حق آژانس در صورت وجود، خرید روزمره، حمل‌ونقل، بیمه، وسایل مدرسه، ثبت‌های اداری و ذخیره اضطراری.", "حساب‌کردن فقط اجاره و بلیت، بدون بودجه شروع زندگی و هزینه‌های کوچک اما پی‌درپی.", "یک بودجه پایه بنویسید و در فرم ارزیابی، شهر، تعداد اعضای خانواده و زمان ورود را دقیق وارد کنید."] },
    { category: "تحصیل", title: "پرسش‌هایی که پیش از انتخاب دوره باید بپرسید", sections: ["برای دانشجو یا خانواده‌ای که می‌خواهد دوره با ویزا، زبان و مسیر بعدی هم‌خوان باشد.", "اعتبار مرکز، برنامه زمانی، زبان آموزش، شهریه، سازگاری با ویزا، حضور و غیاب، اثر بر تمدید و ارتباط با مسیر شغلی.", "انتخاب دوره فقط بر اساس عنوان جذاب، بدون بررسی حضور الزامی یا ارزش واقعی برای پرونده.", "قبل از پرداخت، اطلاعات رسمی دوره را کنار زمان‌بندی ویزا و بودجه زندگی بررسی کنید."] },
    { category: "مدارک", title: "مدارک مبدا را از کجا شروع کنیم؟", sections: ["برای متقاضیانی که نمی‌دانند کدام مدارک را زودتر آماده، ترجمه یا قانونی کنند.", "گذرنامه، شناسنامه و ازدواج، گواهی سوءپیشینه در صورت نیاز، مدارک تحصیلی، گردش حساب و زمان ترجمه یا تأیید.", "شروع دیرهنگام ترجمه و تأیید مدارک، مخصوصاً وقتی یک سند باید از چند مرجع عبور کند.", "اول مدارک زمان‌بر را فهرست کنید، سپس برای هر مسیر چک‌لیست اختصاصی بسازید."] },
    { category: "درآمد", title: "درآمد آنلاین با پرونده قابل دفاع چه تفاوتی دارد؟", sections: ["برای فریلنسرها، صاحبان کسب‌وکار آنلاین و متقاضیانی که درآمدشان باید قابل توضیح باشد.", "قراردادها، فاکتورها، رد بانکی، نامه مشتری یا شرکت، هماهنگی مالیاتی، ثبات درآمد، منبع درآمد و ساختار کار از راه دور.", "داشتن درآمد واقعی اما بدون رد مستند، توضیح منظم و سازگاری میان قرارداد، بانک و مالیات.", "نمونه مدارک درآمدی را جمع کنید و قبل از تصمیم، قابل دفاع بودن آن‌ها را بسنجید."] },
  ] : locale === "es" ? [
    { category: "Presupuesto", title: "Presupuesto familiar del primer mes", sections: ["Para familias que necesitan ver la presión de caja antes de llegar.", "Depósito, primera renta, agencia si aplica, comida, transporte, seguro, material escolar, registros y reserva de emergencia.", "Calcular solo alquiler y vuelos, dejando fuera los pequeños costes iniciales.", "Prepara un presupuesto base e indica ciudad, familia y fecha prevista en la evaluación."] },
    { category: "Estudios", title: "Preguntas antes de elegir un programa", sections: ["Para estudiantes y familias que quieren alinear curso, visado, idioma y futuro.", "Acreditación, horario, idioma, matrícula, compatibilidad con visado, asistencia, renovación y relevancia profesional.", "Elegir por el título sin revisar asistencia obligatoria o valor real para el expediente.", "Antes de pagar, compara la información oficial con calendario, presupuesto y visado."] },
    { category: "Documentos", title: "Por dónde empezar con los documentos de origen", sections: ["Para quienes no saben qué preparar, traducir o legalizar primero.", "Pasaporte, partidas, matrimonio, certificado penal si aplica, estudios, bancos y tiempos de traducción o legalización.", "Dejar traducciones y legalizaciones para el final, cuando un documento depende de varios pasos.", "Lista primero los documentos lentos y crea una checklist para tu vía concreta."] },
    { category: "Ingresos", title: "Ingresos online frente a pruebas defendibles", sections: ["Para freelancers, negocios online y solicitantes cuya renta debe explicarse bien.", "Contratos, facturas, trazabilidad bancaria, cartas, coherencia fiscal, estabilidad, fuente de ingresos y estructura remota.", "Tener ingresos reales sin prueba ordenada entre contrato, banco e impuestos.", "Reúne ejemplos de prueba y revisa si son defendibles antes de elegir la vía."] },
  ] : [
    { category: "Budget", title: "First-month family budget", sections: ["For families who need a realistic view of first-month cash pressure before arrival.", "Deposit, first rent, agency fee if relevant, groceries, transport, insurance, school supplies, registrations and emergency reserve.", "Counting only rent and flights while ignoring the smaller setup costs that arrive together.", "Draft a base budget, then share city, family size and timing in the assessment form."] },
    { category: "Study", title: "Questions to ask before choosing a program", sections: ["For students and families matching a program with visa, language and future plans.", "Accreditation, schedule, language, tuition, visa compatibility, attendance, renewal implications and career relevance.", "Choosing a program by title only without checking attendance rules or case value.", "Before paying, compare official program details with visa timing and living budget."] },
    { category: "Documents", title: "Where to start with origin-country documents", sections: ["For applicants unsure what to prepare, translate or legalize first.", "Passport, birth or marriage records, police certificate if needed, education documents, bank statements and legalization timing.", "Leaving translations and legalizations until late, especially when a document has several stops.", "List slow documents first, then build a pathway-specific checklist."] },
    { category: "Income", title: "Online income vs. defensible case evidence", sections: ["For freelancers, online business owners and applicants whose income needs a clear explanation.", "Contracts, invoices, bank trace, client letters, tax consistency, stability, source of income and remote-work structure.", "Having real income without a coherent trail across contract, bank and tax records.", "Collect sample income evidence and test whether it is defensible before choosing the route."] },
  ];
  return <PageShell locale={locale} eyebrow={locale === "fa" ? "یادداشت‌های میدانی" : locale === "es" ? "Notas prácticas" : "Field notes"} title={c.resourcesTitle} intro={c.resourcesIntro} path="/resources"><section className="content-section resources-grid resources-grid-expandable">{guides.map((guide, index) => <article key={guide.title} className={openIndex === index ? "resource-card-open" : ""}><button type="button" onClick={() => setOpenIndex(openIndex === index ? -1 : index)} aria-expanded={openIndex === index}><span>{guide.category}</span><small>0{index + 1}</small><h2>{guide.title}</h2><p>{readGuide}</p></button>{openIndex === index ? <div className="resource-detail">{guide.sections.map((text, detailIndex) => <section key={sectionLabels[detailIndex]}><h3>{sectionLabels[detailIndex]}</h3><p>{text}</p></section>)}</div> : null}</article>)}</section><GuideUnlockSection locale={locale} /><DisclaimerBox>{locale === "fa" ? "منابع به‌تدریج منتشر می‌شوند. تاریخ به‌روزرسانی و منبع هر راهنما هنگام انتشار مشخص خواهد شد." : locale === "es" ? "Los recursos se publicarán gradualmente. Cada guía indicará fecha de actualización y fuentes cuando se publique." : "Resources will be published gradually. Each guide will show its update date and sources when released."}</DisclaimerBox></PageShell>;
}

export function ApplyPage({ locale }: { locale: Locale }) { const c = pageCopy[locale]; return <PageShell locale={locale} eyebrow="ASSESSMENT" title={c.applyTitle} intro={c.applyIntro} path="/apply"><LeadForm locale={locale} /><DisclaimerBox>{locale === "fa" ? "ارسال فرم به‌معنای ایجاد رابطه حقوقی، پذیرش پرونده یا تضمین نتیجه نیست. اطلاعات فقط برای ارزیابی و تماس استفاده می‌شود." : locale === "es" ? "Enviar el formulario no crea relación jurídica, aceptación del caso ni garantía. Los datos se usan para evaluación y contacto." : "Submitting does not create a legal relationship, case acceptance or guarantee. Data is used for assessment and contact only."}</DisclaimerBox></PageShell>; }

export function ContactPage({ locale }: { locale: Locale }) {
  const c = pageCopy[locale];
  const general = locale === "fa"
    ? {
      label: "عمومی",
      title: "پیام عمومی",
      body: "برای سؤال عمومی، هماهنگی اولیه یا همکاری، به این نشانی پیام بدهید:",
    }
    : locale === "es"
      ? {
        label: "General",
        title: "Mensaje general",
        body: "Para preguntas generales, primera coordinación o colaboración, escríbenos a:",
      }
      : {
        label: "General",
        title: "General message",
        body: "For general questions, first coordination, or collaboration, write to:",
      };
  const assessment = locale === "fa"
    ? {
      label: "ارزیابی پرونده",
      title: "بررسی پرونده",
      body: "برای حفظ نظم و حریم خصوصی، ارزیابی پرونده از فرم اختصاصی شروع می‌شود.",
      cta: "رفتن به فرم",
    }
    : locale === "es"
      ? {
        label: "Evaluación del caso",
        title: "Revisión del expediente",
        body: "Para mantener la información ordenada y privada, la evaluación personal empieza con el formulario dedicado.",
        cta: "Ir al formulario",
      }
      : {
        label: "Case assessment",
        title: "File review",
        body: "To keep information organized and private, personal case review starts through the dedicated form.",
        cta: "Go to form",
      };
  const location = locale === "fa"
    ? {
      label: "ایران · اسپانیا",
      title: "کنگان · شیراز · مادرید",
      body: "جلسه حضوری فقط با هماهنگی قبلی و پس از ارزیابی اولیه انجام می‌شود.",
    }
    : locale === "es"
      ? {
        label: "Irán · España",
        title: "Kangan · Shiraz · Madrid",
        body: "Las reuniones presenciales se realizan únicamente con coordinación previa y después de una evaluación inicial.",
      }
      : {
        label: "Iran · Spain",
        title: "Kangan · Shiraz · Madrid",
        body: "In-person meetings are only arranged with prior coordination and after an initial assessment.",
      };

  return (
    <PageShell locale={locale} eyebrow="CONTACT" title={c.contactTitle} intro={c.contactIntro} path="/contact">
      <section className="content-section contact-grid">
        <article>
          <Mail />
          <p className="eyebrow">{general.label}</p>
          <h2>{general.title}</h2>
          <p>{general.body}</p>
          <a className="contact-card-email" href="mailto:info@vidafamilia.es" dir="ltr">info@vidafamilia.es</a>
        </article>
        <article>
          <PhoneCall />
          <p className="eyebrow">{assessment.label}</p>
          <h2>{assessment.title}</h2>
          <p>{assessment.body}</p>
          <Link className="text-link" to={routeFor(locale, "/apply")}>{assessment.cta}<ArrowUpLeft /></Link>
        </article>
        <article>
          <MapPin />
          <p className="eyebrow">{location.label}</p>
          <h2>{location.title}</h2>
          <p>{location.body}</p>
        </article>
      </section>
      <ContactForm locale={locale} />
    </PageShell>
  );
}

export function LegalPage({ locale, type }: { locale: Locale; type: "privacy" | "terms" | "legal-disclaimer" }) {
  const content = {
    privacy: {
      fa: {
        title: "حریم خصوصی",
        intro: "این سیاست توضیح می‌دهد ویدا فامیلیا چگونه اطلاعاتی را که از طریق وب‌سایت و فرم‌ها ارائه می‌کنید دریافت، استفاده و نگهداری می‌کند.",
        updated: "آخرین به‌روزرسانی: ۲۴ ژوئن ۲۰۲۶",
        sections: [
          ["مسئول وب‌سایت و راه تماس", "ویدا فامیلیا این وب‌سایت را برای ارائه اطلاعات، ارزیابی اولیه، هماهنگی خدمات و پاسخ‌گویی به پیام‌ها اداره می‌کند. برای پرسش‌های مربوط به حریم خصوصی می‌توانید به info@vidafamilia.es پیام بدهید."],
          ["داده‌هایی که دریافت می‌کنیم", "ممکن است نام، ایمیل، شماره واتس‌اپ، کشور فعلی، مقصد یا علاقه‌مندی، پاسخ‌های فرم ارزیابی، پیام‌های تماس، درخواست راهنما، ترجیح زبان و اطلاعات فنی پایه مانند زمان ارسال، صفحه مبدأ و داده‌های امنیتی لازم دریافت شود."],
          ["هدف استفاده از داده‌ها", "از اطلاعات برای پاسخ‌گویی، ارزیابی اولیه تناسب مسیر، هماهنگی خدمات، ارسال پیام‌های مرتبط، امنیت و جلوگیری از سوءاستفاده، بهبود خدمات، و نگهداری سوابق اداری یا ضروری استفاده می‌شود."],
          ["مبنای رضایت و ضرورت", "وقتی فرم ارسال می‌کنید یا درخواست راهنما می‌گذارید، اطلاعات را داوطلبانه ارائه می‌کنید. بسته به نوع ارتباط، استفاده از داده‌ها می‌تواند بر رضایت شما، ضرورت پاسخ‌گویی یا هماهنگی، و منافع مشروع عملیاتی و امنیتی متکی باشد."],
          ["پردازش و نگهداری", "داده‌ها ممکن است در ابزارهای میزبانی وب‌سایت، ایمیل، پایگاه داده، فرم‌ها، امنیت و ارائه‌دهندگان خدماتی که برای اداره سایت لازم هستند پردازش یا نگهداری شود. دسترسی فقط برای اعضای تیم ویدا فامیلیا، مدیران لازم، ارائه‌دهندگان مرتبط و متخصصان واجد صلاحیت در صورت نیاز به هماهنگی یا پاسخ‌گویی محدود می‌شود."],
          ["مدت نگهداری", "اطلاعات فقط تا زمانی نگهداری می‌شود که برای پاسخ‌گویی، هماهنگی خدمات، سوابق اداری یا الزامات قابل اعمال به‌طور منطقی لازم باشد، یا تا زمانی که درخواست حذف معتبر و قابل اجرا دریافت شود."],
          ["حقوق شما", "می‌توانید درخواست دسترسی، اصلاح، حذف یا پس‌گرفتن رضایت خود را از طریق info@vidafamilia.es ارسال کنید. ممکن است برای امنیت و جلوگیری از دسترسی غیرمجاز، پیش از انجام درخواست، نیاز به تأیید هویت یا جزئیات بیشتر باشد."],
          ["امنیت", "ویدا فامیلیا از اقدامات فنی و سازمانی معقول برای محافظت از اطلاعات استفاده می‌کند، اما هیچ سامانه اینترنتی، ایمیل یا پایگاه داده‌ای امنیت مطلق ندارد."],
          ["کاربران بین‌المللی و خانواده‌ها", "این وب‌سایت برای کاربران و خانواده‌هایی در زمینه اسپانیا، آرژانتین، ایران و دیگر کشورها استفاده می‌شود. اگر اطلاعات مربوط به فرد زیر سن قانونی ارسال شود، باید توسط والد یا سرپرست قانونی انجام شود."],
          ["کوکی‌ها و ذخیره‌سازی فنی", "سایت ممکن است از کوکی‌ها یا ذخیره‌سازی فنی ضروری برای عملکرد، ترجیح زبان یا جلسه، امنیت و ابزارهای ضداسپم استفاده کند. اگر ابزارهای تحلیل فعال باشند، ممکن است برای فهم عملکرد صفحات و بهبود تجربه کاربری داده‌های آماری محدود ثبت شود. می‌توانید کوکی‌ها را از تنظیمات مرورگر خود کنترل یا حذف کنید."],
          ["به‌روزرسانی این سیاست", "ممکن است این سیاست با تغییر خدمات، ابزارهای عملیاتی یا الزامات قابل اعمال به‌روزرسانی شود. نسخه منتشرشده در همین صفحه، نسخه جاری سیاست حریم خصوصی است."],
        ],
      },
      en: {
        title: "Privacy policy",
        intro: "This policy explains how Vida Familia receives, uses and protects information you provide through the website and its forms.",
        updated: "Last updated: 24 June 2026",
        sections: [
          ["Who operates the site and how to contact us", "Vida Familia operates this website to provide information, initial assessment, service coordination and responses to messages. For privacy questions, contact info@vidafamilia.es."],
          ["Information we collect", "We may collect name, email, WhatsApp number, current country, destination or interest, assessment answers, contact messages, guide requests, language preference and basic technical metadata such as submission time, source page and security data needed to operate the site."],
          ["Why we use information", "We use information to reply, assess initial fit, coordinate services, send relevant messages, maintain security, prevent abuse, improve the service and keep necessary administrative records."],
          ["Consent and lawful basis", "When you submit a form or request a guide, you provide information voluntarily. Depending on the interaction, processing may rely on your consent, the need to respond or coordinate, and legitimate operational and security interests."],
          ["Processing and storage", "Information may be processed or stored through website hosting, email, database, form, security and other service providers used to operate the site. Access is limited to the Vida Familia team, necessary administrators, relevant providers and qualified professionals when needed for coordination or response."],
          ["Retention", "Information is kept only as long as reasonably necessary for response, coordination, administrative records or applicable requirements, or until a valid deletion request is handled where applicable."],
          ["Your rights", "You may request access, correction, deletion or withdrawal of consent by contacting info@vidafamilia.es. To protect privacy and prevent unauthorized access, we may ask for identity confirmation or additional details before acting on a request."],
          ["Security", "Vida Familia uses reasonable technical and organizational measures to protect information, but no internet service, email system or database can be guaranteed absolutely secure."],
          ["International users and families", "The site may be used by people and families connected with Spain, Argentina, Iran and other countries. If information about a minor is submitted, it should be provided by a parent or legal guardian."],
          ["Cookies and technical storage", "The site may use essential cookies or technical storage for functionality, language or session preferences, security and anti-spam tools. If analytics tools are enabled, limited statistical data may be used to understand page performance and improve the user experience. You can control or delete cookies through your browser settings."],
          ["Updates to this policy", "This policy may be updated as services, operational tools or applicable requirements change. The version published on this page is the current privacy policy."],
        ],
      },
      es: {
        title: "Política de privacidad",
        intro: "Esta política explica cómo Vida Familia recibe, usa y protege la información que proporcionas a través del sitio web y sus formularios.",
        updated: "Última actualización: 24 de junio de 2026",
        sections: [
          ["Quién opera el sitio y contacto", "Vida Familia opera este sitio para ofrecer información, evaluación inicial, coordinación de servicios y respuesta a mensajes. Para consultas de privacidad, escribe a info@vidafamilia.es."],
          ["Datos que recogemos", "Podemos recoger nombre, correo electrónico, WhatsApp, país actual, destino o interés, respuestas de evaluación, mensajes de contacto, solicitudes de guías, preferencia de idioma y metadatos técnicos básicos como hora de envío, página de origen y datos de seguridad necesarios para operar el sitio."],
          ["Para qué usamos los datos", "Usamos la información para responder, valorar el encaje inicial, coordinar servicios, enviar mensajes relacionados, mantener seguridad, prevenir abusos, mejorar el servicio y conservar registros administrativos necesarios."],
          ["Consentimiento y base de uso", "Cuando envías un formulario o solicitas una guía, proporcionas datos voluntariamente. Según la interacción, el uso puede basarse en tu consentimiento, la necesidad de responder o coordinar, y los intereses legítimos operativos y de seguridad."],
          ["Tratamiento y almacenamiento", "La información puede procesarse o almacenarse mediante alojamiento web, correo electrónico, base de datos, formularios, seguridad y otros proveedores necesarios para operar el sitio. El acceso se limita al equipo de Vida Familia, administradores necesarios, proveedores relevantes y profesionales cualificados cuando haga falta para coordinar o responder."],
          ["Conservación", "Los datos se conservan solo durante el tiempo razonablemente necesario para responder, coordinar, mantener registros administrativos o cumplir requisitos aplicables, o hasta tramitar una solicitud válida de eliminación cuando proceda."],
          ["Tus derechos", "Puedes solicitar acceso, rectificación, eliminación o retirada del consentimiento escribiendo a info@vidafamilia.es. Para proteger la privacidad y evitar accesos no autorizados, podemos pedir confirmación de identidad o detalles adicionales."],
          ["Seguridad", "Vida Familia aplica medidas técnicas y organizativas razonables para proteger la información, pero ningún servicio de internet, sistema de correo o base de datos puede garantizar seguridad absoluta."],
          ["Usuarios internacionales y familias", "El sitio puede ser usado por personas y familias vinculadas con España, Argentina, Irán y otros países. Si se envía información de un menor, debe hacerlo un padre, madre o tutor legal."],
          ["Cookies y almacenamiento técnico", "El sitio puede usar cookies esenciales o almacenamiento técnico para funcionamiento, preferencias de idioma o sesión, seguridad y herramientas antispam. Si se habilitan herramientas de analítica, pueden usarse datos estadísticos limitados para entender el rendimiento de páginas y mejorar la experiencia. Puedes controlar o eliminar cookies desde la configuración del navegador."],
          ["Actualizaciones de esta política", "Esta política puede actualizarse cuando cambien los servicios, herramientas operativas o requisitos aplicables. La versión publicada en esta página es la política de privacidad vigente."],
        ],
      },
    },
    terms: {
      fa: {
        title: "شرایط استفاده",
        intro: "این شرایط، قواعد استفاده از وب‌سایت و ارتباط اولیه با ویدا فامیلیا را توضیح می‌دهد.",
        updated: "آخرین به‌روزرسانی: ۲۴ ژوئن ۲۰۲۶",
        sections: [
          ["پذیرش شرایط", "با استفاده از این وب‌سایت، خواندن محتوا یا ارسال فرم، می‌پذیرید که استفاده شما از سایت تابع این شرایط است. اگر با این شرایط موافق نیستید، نباید از فرم‌ها یا خدمات ارتباطی سایت استفاده کنید."],
          ["استفاده از وب‌سایت", "این وب‌سایت برای اطلاع‌رسانی، آموزش عمومی، معرفی خدمات و دریافت درخواست‌های اولیه طراحی شده است. استفاده از آن باید قانونی، محترمانه و بدون تلاش برای اختلال، دسترسی غیرمجاز یا سوءاستفاده باشد."],
          ["محتوای آموزشی و پیشنهاد خدمات", "محتوای سایت عمومی است و به‌تنهایی جایگزین مشاوره فردی حقوقی، مالیاتی، مهاجرتی، مالی، تحصیلی یا حرفه‌ای نیست. هر پیشنهاد خدمات باید متناسب با شرایط فردی و به‌صورت مشخص تأیید شود."],
          ["استفاده نادرست از فرم‌ها", "ارسال اطلاعات دروغین، پیام اسپم، سوءاستفاده خودکار، تلاش برای دورزدن ابزارهای امنیتی یا ارسال اطلاعات شخص ثالث بدون اجازه مجاز نیست."],
          ["اطلاعات ارائه‌شده توسط کاربر", "شما مسئول هستید اطلاعاتی که ارسال می‌کنید درست، کامل، به‌روز و قانونی باشد. تصمیم‌ها و برنامه‌ریزی‌ها می‌تواند به صحت همین اطلاعات وابسته باشد."],
          ["رسمی‌شدن خدمات", "مشاوره، هماهنگی یا خدمات پولی فقط زمانی رسمی می‌شود که دامنه، قیمت، مسئولیت‌ها، زمان‌بندی و شرایط به‌صورت کتبی بین طرفین تأیید شود. مکاتبه اولیه یا ارسال فرم به‌معنای پذیرش پرونده نیست."],
          ["هزینه‌ها، دامنه و زمان‌بندی", "هر قیمت، دامنه کار، مسئولیت یا زمان‌بندی فقط زمانی معتبر است که در پیشنهاد، پیام یا توافق مکتوب مشخص تأیید شده باشد. هزینه‌های رسمی، اشخاص ثالث و تغییرات دولتی ممکن است جداگانه اعمال شوند."],
          ["مالکیت فکری", "متن، ساختار، طراحی، نام‌ها و محتوای سایت متعلق به ویدا فامیلیا یا استفاده‌شده با مجوز است. استفاده شخصی مجاز است، اما بازنشر تجاری، کپی گسترده یا استفاده تبلیغاتی بدون اجازه کتبی مجاز نیست."],
          ["پیوندها و ابزارهای شخص ثالث", "سایت ممکن است به منابع رسمی، ابزارها، سرویس‌های پرداخت، ایمیل، فرم، نقشه، تحلیل یا وب‌سایت‌های دیگر اشاره کند. ویدا فامیلیا مسئول محتوای مستقل، سیاست‌ها یا عملکرد اشخاص ثالث نیست."],
          ["محدودیت مسئولیت", "تا حد مجاز قانون، ویدا فامیلیا مسئول تصمیم‌هایی که صرفاً بر اساس محتوای عمومی سایت گرفته می‌شود، یا خسارت ناشی از تغییر قوانین، تصمیم مقامات، تأخیرها، خطای کاربر یا سرویس‌های شخص ثالث نیست."],
          ["تغییر شرایط", "ممکن است این شرایط با تغییر خدمات یا الزامات قابل اعمال به‌روزرسانی شود. ادامه استفاده از سایت پس از انتشار نسخه جدید به‌معنای پذیرش همان نسخه است."],
          ["تماس", "برای پرسش درباره این شرایط می‌توانید به info@vidafamilia.es پیام بدهید."],
        ],
      },
      en: {
        title: "Terms of use",
        intro: "These terms explain the rules for using the website and starting communication with Vida Familia.",
        updated: "Last updated: 24 June 2026",
        sections: [
          ["Acceptance of terms", "By using this website, reading its content or submitting a form, you agree that your use is governed by these terms. If you do not agree, you should not use the forms or communication features."],
          ["Use of the website", "The website is provided for information, general education, service presentation and initial requests. Use must be lawful, respectful and free from attempts to disrupt, gain unauthorized access or abuse the site."],
          ["Educational content and service proposals", "Website content is general and does not replace individualized legal, tax, immigration, financial, academic or professional advice. Any service proposal must be confirmed for the specific situation."],
          ["Misuse of forms", "False submissions, spam, automated abuse, attempts to bypass security tools or submission of third-party personal information without permission are not allowed."],
          ["User-provided information", "You are responsible for providing information that is accurate, complete, updated and lawful. Planning and coordination may depend on the accuracy of that information."],
          ["When services become formal", "Consultations, coordination or paid services become formal only when scope, pricing, responsibilities, timelines and conditions are confirmed in writing. Initial messages or form submissions do not mean case acceptance."],
          ["Pricing, scope and timelines", "Any price, scope of work, responsibility or timeline is valid only when confirmed in a written proposal, message or agreement. Official fees, third-party costs and authority changes may apply separately."],
          ["Intellectual property", "Text, structure, design, names and website content belong to Vida Familia or are used with permission. Personal use is allowed; commercial republication, large-scale copying or promotional use requires written permission."],
          ["External links and third-party tools", "The site may refer to official sources, tools, payment services, email, forms, maps, analytics or other websites. Vida Familia is not responsible for independent third-party content, policies or performance."],
          ["Limitation of liability", "To the extent permitted by law, Vida Familia is not responsible for decisions made solely from general website content, or for losses caused by rule changes, authority decisions, delays, user error or third-party services."],
          ["Changes to these terms", "These terms may be updated as services or applicable requirements change. Continued use of the site after a new version is published means acceptance of that version."],
          ["Contact", "For questions about these terms, contact info@vidafamilia.es."],
        ],
      },
      es: {
        title: "Condiciones de uso",
        intro: "Estas condiciones explican las reglas para usar el sitio web e iniciar comunicación con Vida Familia.",
        updated: "Última actualización: 24 de junio de 2026",
        sections: [
          ["Aceptación de las condiciones", "Al usar este sitio, leer su contenido o enviar un formulario, aceptas que tu uso se rige por estas condiciones. Si no estás de acuerdo, no debes usar los formularios ni las funciones de contacto."],
          ["Uso del sitio web", "El sitio se ofrece para información, educación general, presentación de servicios y solicitudes iniciales. El uso debe ser legal, respetuoso y sin intentos de interrumpir, acceder sin autorización o abusar del sitio."],
          ["Contenido educativo y propuestas de servicio", "El contenido del sitio es general y no sustituye asesoramiento individualizado legal, fiscal, migratorio, financiero, académico o profesional. Cualquier propuesta de servicio debe confirmarse para la situación concreta."],
          ["Uso indebido de formularios", "No se permiten envíos falsos, spam, abuso automatizado, intentos de eludir herramientas de seguridad ni envío de datos de terceros sin permiso."],
          ["Información proporcionada por el usuario", "Eres responsable de proporcionar información exacta, completa, actualizada y lícita. La planificación y coordinación pueden depender de la precisión de esa información."],
          ["Cuándo los servicios son formales", "Las consultas, coordinación o servicios de pago solo se formalizan cuando alcance, precio, responsabilidades, tiempos y condiciones se confirman por escrito. Un mensaje inicial o formulario no implica aceptación del caso."],
          ["Precios, alcance y plazos", "Cualquier precio, alcance, responsabilidad o plazo solo es válido cuando se confirma en una propuesta, mensaje o acuerdo escrito. Tasas oficiales, costes de terceros y cambios de autoridad pueden aplicarse aparte."],
          ["Propiedad intelectual", "Textos, estructura, diseño, nombres y contenido del sitio pertenecen a Vida Familia o se usan con permiso. Se permite uso personal; la republicación comercial, copia masiva o uso promocional requiere permiso escrito."],
          ["Enlaces externos y herramientas de terceros", "El sitio puede remitir a fuentes oficiales, herramientas, pagos, correo, formularios, mapas, analítica u otros sitios. Vida Familia no responde por contenido, políticas o funcionamiento independiente de terceros."],
          ["Limitación de responsabilidad", "En la medida permitida por la ley, Vida Familia no responde por decisiones tomadas solo a partir de contenido general del sitio, ni por pérdidas causadas por cambios normativos, decisiones de autoridades, retrasos, error del usuario o servicios de terceros."],
          ["Cambios en estas condiciones", "Estas condiciones pueden actualizarse cuando cambien los servicios o requisitos aplicables. El uso continuado del sitio tras publicarse una nueva versión implica aceptación de esa versión."],
          ["Contacto", "Para consultas sobre estas condiciones, escribe a info@vidafamilia.es."],
        ],
      },
    },
    "legal-disclaimer": {
      fa: {
        title: "سلب مسئولیت حقوقی",
        intro: "این صفحه مرز خدمات آموزشی و هماهنگی ویدا فامیلیا را با خدمات تخصصی تنظیم‌شده روشن می‌کند.",
        updated: "آخرین به‌روزرسانی: ۲۴ ژوئن ۲۰۲۶",
        sections: [
          ["ماهیت خدمات ویدا فامیلیا", "ویدا فامیلیا خدمات آموزشی، جابه‌جایی، هماهنگی و ارزیابی اولیه ارائه می‌دهد. هدف، کمک به فهم مسیر، آماده‌سازی تصمیم‌ها و هماهنگی مراحل عملی است؛ ویدا فامیلیا مرجع دولتی، دانشگاه، کارفرما، بانک، دفتر املاک یا دفتر وکالت نیست."],
          ["نقش آموزشی و هماهنگی", "محتوا، فرم‌ها، گفت‌وگوها و راهنماها برای شفاف‌سازی، سازمان‌دهی اطلاعات و هماهنگی بهتر طراحی شده‌اند. این خدمات به‌تنهایی جایگزین تصمیم‌گیری رسمی یا مشاوره تخصصی فردی نیستند."],
          ["بدون تضمین نتیجه", "هیچ ویزا، اقامت، پذیرش دانشگاهی، شغل، مسکن، شهروندی، وقت سفارت، پاسخ اداره، تصمیم دولتی یا نتیجه اداری تضمین نمی‌شود. تصمیم نهایی همیشه به مرجع، مؤسسه یا طرف ثالث مربوط وابسته است."],
          ["مشاوره حقوقی، مالیاتی، مالی یا مهاجرتی", "ویدا فامیلیا مشاوره حقوقی، مالیاتی، مالی، مهاجرتی یا تخصصی تنظیم‌شده ارائه نمی‌دهد مگر اینکه به‌صورت روشن توسط متخصص واجد صلاحیت مربوط ارائه شود. برای امور تنظیم‌شده باید از متخصص مناسب مشورت بگیرید."],
          ["تغییر قوانین و رویه‌ها", "قواعد رسمی، الزامات، هزینه‌ها، وقت‌ها، فرم‌ها، رویه‌های اداری و معیارهای تصمیم‌گیری ممکن است تغییر کنند. پیش از اقدام، اطلاعات باید از منابع رسمی یا متخصص واجد صلاحیت تأیید شود."],
          ["مسئولیت کاربر", "کاربر مسئول ارائه اطلاعات درست، کامل و به‌روز است. هر تصمیم، ارسال مدرک یا اقدام عملی که بر اساس اطلاعات ناقص یا نادرست انجام شود، می‌تواند بر نتیجه اثر بگذارد."],
          ["اشخاص ثالث", "ممکن است در برخی موارد به متخصصان، مؤسسات، پلتفرم‌ها، دانشگاه‌ها، ارائه‌دهندگان خدمات، بانک‌ها، بیمه‌ها یا منابع رسمی ارجاع داده شود. ویدا فامیلیا کنترل‌کننده تصمیم، قیمت، زمان‌بندی یا عملکرد مستقل اشخاص ثالث نیست."],
          ["تفاوت اسپانیا و آرژانتین", "مسیرهای اسپانیا و آرژانتین از نظر قانون، مدارک، زمان‌بندی، زبان، هزینه، مؤسسات و واقعیت زندگی روزمره متفاوت‌اند. اطلاعات یک کشور نباید بدون بررسی جداگانه برای کشور دیگر فرض شود."],
          ["محدودیت اتکا", "مطالب سایت برای شفافیت و اطلاعات عمومی منتشر شده است. نباید تنها بر اساس این مطالب تصمیم مالی، حقوقی، مهاجرتی، تحصیلی یا خانوادگی مهم بگیرید."],
          ["راه تماس", "برای پرسش درباره این سلب مسئولیت یا مرز خدمات، به info@vidafamilia.es پیام بدهید."],
        ],
      },
      en: {
        title: "Legal disclaimer",
        intro: "This page clarifies the boundary between Vida Familia’s educational and coordination services and regulated professional services.",
        updated: "Last updated: 24 June 2026",
        sections: [
          ["Nature of Vida Familia services", "Vida Familia provides educational, relocation, coordination and initial assessment services. The purpose is to help people understand pathways, organize decisions and coordinate practical steps; Vida Familia is not a government authority, university, employer, bank, real estate office or law firm."],
          ["Educational and coordination role", "Content, forms, conversations and guides are designed to improve clarity, organize information and coordinate next steps. They do not replace official decisions or individualized professional advice."],
          ["No guarantee of outcome", "No visa, residence permit, university admission, employment, housing, citizenship, appointment, authority response, government decision or administrative outcome is guaranteed. Final decisions always depend on the relevant authority, institution or third party."],
          ["Legal, tax, financial or immigration advice", "Vida Familia does not provide legal, tax, financial, immigration or other regulated professional advice unless it is explicitly provided by a qualified professional in that field. For regulated matters, users should consult an appropriate professional."],
          ["Changing rules and procedures", "Official rules, requirements, fees, appointments, forms, administrative practice and decision criteria may change. Before acting, information should be confirmed through official sources or qualified professionals."],
          ["User responsibility", "Users are responsible for providing truthful, complete and updated information. Any decision, document submission or practical step based on incomplete or inaccurate information may affect the outcome."],
          ["Third parties", "In some cases, users may be referred to professionals, institutions, platforms, universities, service providers, banks, insurers or official sources. Vida Familia does not control independent third-party decisions, prices, timing or performance."],
          ["Spain and Argentina differences", "Spain and Argentina pathways differ in law, documents, timing, language, costs, institutions and daily-life reality. Information about one country should not be assumed to apply to the other without separate confirmation."],
          ["Limitation of reliance", "Website materials are published for transparency and general information. You should not make major financial, legal, immigration, academic or family decisions solely from this content."],
          ["Contact route", "For questions about this disclaimer or the boundaries of the service, contact info@vidafamilia.es."],
        ],
      },
      es: {
        title: "Aviso legal",
        intro: "Esta página aclara el límite entre los servicios educativos y de coordinación de Vida Familia y los servicios profesionales regulados.",
        updated: "Última actualización: 24 de junio de 2026",
        sections: [
          ["Naturaleza de los servicios de Vida Familia", "Vida Familia ofrece servicios educativos, de reubicación, coordinación y evaluación inicial. Su finalidad es ayudar a entender vías, ordenar decisiones y coordinar pasos prácticos; Vida Familia no es autoridad gubernamental, universidad, empleador, banco, agencia inmobiliaria ni despacho jurídico."],
          ["Rol educativo y de coordinación", "El contenido, formularios, conversaciones y guías buscan aportar claridad, organizar información y coordinar próximos pasos. No sustituyen decisiones oficiales ni asesoramiento profesional individualizado."],
          ["Sin garantía de resultado", "No se garantiza visado, residencia, admisión universitaria, empleo, vivienda, ciudadanía, cita, respuesta de una autoridad, decisión gubernamental ni resultado administrativo. Las decisiones finales dependen siempre de la autoridad, institución o tercero correspondiente."],
          ["Asesoramiento legal, fiscal, financiero o migratorio", "Vida Familia no presta asesoramiento legal, fiscal, financiero, migratorio ni otro servicio profesional regulado salvo que sea prestado expresamente por un profesional cualificado en esa materia. Para asuntos regulados, el usuario debe consultar al profesional adecuado."],
          ["Cambios en normas y procedimientos", "Las reglas oficiales, requisitos, tasas, citas, formularios, práctica administrativa y criterios de decisión pueden cambiar. Antes de actuar, la información debe confirmarse mediante fuentes oficiales o profesionales cualificados."],
          ["Responsabilidad del usuario", "El usuario es responsable de aportar información veraz, completa y actualizada. Cualquier decisión, envío documental o paso práctico basado en información incompleta o inexacta puede afectar al resultado."],
          ["Terceros", "En algunos casos se puede derivar a profesionales, instituciones, plataformas, universidades, proveedores, bancos, aseguradoras o fuentes oficiales. Vida Familia no controla decisiones, precios, tiempos ni funcionamiento independiente de terceros."],
          ["Diferencias entre España y Argentina", "Las vías de España y Argentina difieren en ley, documentos, plazos, idioma, costes, instituciones y realidad cotidiana. La información de un país no debe asumirse aplicable al otro sin confirmación separada."],
          ["Limitación de confianza", "Los materiales del sitio se publican por transparencia e información general. No debes tomar decisiones importantes financieras, legales, migratorias, académicas o familiares basándote solo en este contenido."],
          ["Vía de contacto", "Para consultas sobre este aviso o los límites del servicio, escribe a info@vidafamilia.es."],
        ],
      },
    },
  }[type][locale];

  return (
    <PageShell locale={locale} eyebrow={locale === "fa" ? "حقوقی" : "Legal"} title={content.title} intro={content.intro} path={`/${type}`}>
      <section className="content-section legal-copy">
        <p className="legal-updated">{content.updated}</p>
        {content.sections.map(([heading, text]) => (
          <section key={heading}>
            <h2>{heading}</h2>
            <p>{text}</p>
          </section>
        ))}
        <p className="legal-contact">
          {locale === "fa" ? "راه تماس: " : locale === "es" ? "Contacto: " : "Contact: "}
          <a href="mailto:info@vidafamilia.es" dir="ltr">info@vidafamilia.es</a>
        </p>
      </section>
    </PageShell>
  );
}
