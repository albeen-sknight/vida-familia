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
  return <PageShell locale={locale} eyebrow={locale === "fa" ? `${country === "spain" ? "اسپانیا" : "آرژانتین"} · مقصد` : locale === "es" ? `${country === "spain" ? "España" : "Argentina"} · destino` : `${country.toUpperCase()} · destination`} title={title} intro={intro} path={`/${country}`} tone={country}><section className="content-section editorial-story"><div><p className="eyebrow">{locale === "fa" ? "زندگی واقعی" : locale === "es" ? "Vida real" : "Real life"}</p><h2>{locale === "fa" ? `زندگی در ${title} فقط پرونده اقامت نیست` : locale === "es" ? `Vivir en ${title} no es solo un expediente` : `Life in ${title} is more than an application`}</h2></div><p>{locale === "fa" ? "محله، هزینه، مدرسه، زبان، رفت‌وآمد و شبکه حمایتی به اندازه مدارک اهمیت دارند. برنامه ما این تصمیم‌ها را در یک تصویر واحد کنار هم می‌گذارد." : locale === "es" ? "Barrio, costes, colegios, idioma, transporte y red de apoyo importan tanto como los documentos. Nuestro plan conecta todas estas decisiones." : "Neighborhood, cost, school, language, transport and support networks matter as much as documents. Our plan connects them."}</p></section><section className="content-section"><SectionHeading eyebrow={locale === "fa" ? "مسیرها" : locale === "es" ? "Vías" : "Pathways"} title={locale === "fa" ? "مسیرهای اصلی" : locale === "es" ? "Vías principales" : "Core pathways"} /><div className="pathway-grid">{services.map((service) => <Link key={service.slug} to={routeFor(locale, `/services/${country}/${service.slug}`)}><span>{country === "spain" ? "ES" : "AR"}</span><h3>{service.title[locale]}</h3><p>{service.summary[locale]}</p><ArrowUpLeft /></Link>)}</div></section><section className="content-section tinted-section"><SectionHeading eyebrow={locale === "fa" ? "استقرار" : locale === "es" ? "Instalación" : "Settlement"} title={locale === "fa" ? "جزئیات زندگی روزمره" : locale === "es" ? "Detalles de la vida diaria" : "Everyday settlement details"} /><div className="tag-cloud">{practical.map((item) => <span key={item}><bdi>{item}</bdi></span>)}</div></section><QualificationCTA locale={locale} /><DisclaimerBox>{locale === "fa" ? "شرایط اقامت، مالیات، کار و تابعیت تغییرپذیر و پرونده‌محور است. این صفحه آموزشی است و باید پیش از اقدام با منبع رسمی و متخصص مناسب تأیید شود." : locale === "es" ? "Residencia, fiscalidad, trabajo y ciudadanía cambian y dependen del caso. Confirma la información con fuentes oficiales y profesionales." : "Residency, tax, work and citizenship rules change and depend on the case. Confirm information with official sources and qualified professionals."}</DisclaimerBox></PageShell>;
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
      title: { fa: "حریم خصوصی", en: "Privacy policy", es: "Política de privacidad" }, intro: { fa: "نحوه استفاده از اطلاعاتی که داوطلبانه در فرم‌ها ارائه می‌کنید.", en: "How we use information you voluntarily provide through forms.", es: "Cómo usamos la información que facilitas voluntariamente." },
      sections: locale === "fa" ? [["اطلاعاتی که دریافت می‌کنیم", "نام، اطلاعات تماس و پاسخ‌های ارزیابی که خودتان ارسال می‌کنید."], ["هدف استفاده", "فقط برای ارزیابی اولیه، پاسخگویی، امنیت و نگهداری سوابق ضروری."], ["نگهداری و دسترسی", "دسترسی محدود است و اطلاعات بیش از نیاز عملی نگهداری نمی‌شود. سیاست حذف نهایی پیش از راه‌اندازی توسط مالک تأیید می‌شود."], ["حقوق شما", "برای درخواست دسترسی، اصلاح یا حذف، از نشانی رسمی که پیش از راه‌اندازی درج می‌شود استفاده کنید."]] : locale === "es" ? [["Datos recogidos", "Nombre, contacto y respuestas que envías."], ["Finalidad", "Evaluación inicial, respuesta, seguridad y registros necesarios."], ["Conservación y acceso", "Acceso limitado y conservación solo durante el tiempo necesario. El propietario validará la política final antes del lanzamiento."], ["Tus derechos", "Podrás solicitar acceso, rectificación o eliminación en el correo oficial que se publicará."]] : [["Information collected", "Name, contact details and assessment answers you submit."], ["Purpose", "Initial assessment, response, security and necessary records only."], ["Retention and access", "Access is limited and data is not kept longer than operationally needed. The owner will confirm final retention before launch."], ["Your rights", "Use the official address published before launch to request access, correction or deletion."]],
    },
    terms: {
      title: { fa: "شرایط استفاده", en: "Terms of use", es: "Condiciones de uso" }, intro: { fa: "قواعد استفاده از وب‌سایت و ارتباط با ویدا فامیلیا.", en: "Rules for using this website and engaging with Vida Familia.", es: "Reglas para usar este sitio y relacionarse con Vida Familia." },
      sections: locale === "fa" ? [["استفاده آموزشی", "محتوا عمومی و آموزشی است و پیشنهاد حقوقی، مالیاتی یا مالی شخصی نیست."], ["عدم تضمین", "هیچ نتیجه ویزا، اقامت، پذیرش، کار یا تابعیت تضمین نمی‌شود."], ["پیشنهاد خدمات", "دامنه، هزینه، مسئولیت و شرایط هر همکاری فقط در پیشنهاد یا قرارداد مکتوب معتبر است."], ["مالکیت محتوا", "استفاده شخصی مجاز است؛ بازنشر تجاری بدون اجازه کتبی مجاز نیست."]] : locale === "es" ? [["Uso educativo", "El contenido es general y no constituye asesoramiento jurídico, fiscal o financiero personal."], ["Sin garantía", "No se garantiza visado, residencia, admisión, empleo ni ciudadanía."], ["Propuesta de servicios", "Alcance, precio y responsabilidades solo valen por escrito."], ["Contenido", "Se permite uso personal, no republicación comercial sin permiso."]] : [["Educational use", "Content is general and not personal legal, tax or financial advice."], ["No guarantee", "No visa, residency, admission, work or citizenship result is guaranteed."], ["Service proposals", "Scope, price and responsibility are valid only when agreed in writing."], ["Content ownership", "Personal use is allowed; commercial republication requires written permission."]],
    },
    "legal-disclaimer": {
      title: { fa: "سلب مسئولیت حقوقی", en: "Legal disclaimer", es: "Aviso legal" }, intro: { fa: "مرز خدمات آموزشی و هماهنگی ویدا فامیلیا با خدمات تخصصی تنظیم‌شده.", en: "The boundary between Vida Familia's education/coordination and regulated professional services.", es: "El límite entre educación/coordinación y servicios profesionales regulados." },
      sections: locale === "fa" ? [["ماهیت خدمات", "ویدا فامیلیا تجربه، آموزش جابه‌جایی و هماهنگی ارائه می‌دهد؛ دفتر وکالت یا مرجع دولتی نیست."], ["متخصصان مجاز", "امور حقوقی، مالیاتی یا مالی ممکن است به وکیل، حسابدار یا متخصص دارای مجوز ارجاع شود."], ["اطلاعات متغیر", "قوانین، مبالغ، رویه‌ها و زمان‌ها تغییر می‌کنند و باید پیش از اقدام از منبع رسمی تأیید شوند."], ["تصمیم نهایی", "تصمیم هر مرجع مستقل است و هیچ نتیجه‌ای تحت کنترل یا تضمین ویدا فامیلیا نیست."]] : locale === "es" ? [["Naturaleza", "Vida Familia ofrece experiencia, educación de reubicación y coordinación; no es un despacho ni autoridad."], ["Profesionales habilitados", "Lo jurídico, fiscal o financiero puede derivarse a profesionales habilitados."], ["Información cambiante", "Normas, importes, prácticas y plazos cambian y deben confirmarse oficialmente."], ["Decisión final", "Cada autoridad decide independientemente; Vida Familia no controla ni garantiza resultados."]] : [["Nature of service", "Vida Familia offers lived experience, relocation education and coordination; it is not a law firm or authority."], ["Licensed professionals", "Legal, tax or financial matters may be referred to qualified professionals."], ["Changing information", "Rules, amounts, practice and timing change and must be officially confirmed."], ["Final decision", "Authorities decide independently; Vida Familia neither controls nor guarantees results."]],
    },
  }[type];
  return <PageShell locale={locale} eyebrow={locale === "fa" ? "حقوقی" : locale === "es" ? "Legal" : "Legal"} title={content.title[locale]} intro={content.intro[locale]} path={`/${type}`}><section className="content-section legal-copy"><p className="legal-updated">{locale === "fa" ? "نسخه آماده‌سازی پیش از راه‌اندازی · ۲۴ ژوئن ۲۰۲۶" : locale === "es" ? "Versión pre-lanzamiento · 24 junio 2026" : "Pre-launch version · 24 June 2026"}</p>{content.sections.map(([heading, text]) => <section key={heading}><h2>{heading}</h2><p>{text}</p></section>)}<DisclaimerBox>{locale === "fa" ? "مالک باید پیش از راه‌اندازی نهایی، هویت حقوقی، نشانی تماس، دوره نگهداری داده و الزامات محلی حریم خصوصی را با متخصص مناسب تأیید کند." : locale === "es" ? "Antes del lanzamiento, el propietario debe validar identidad legal, contacto, retención y requisitos locales con un profesional." : "Before launch, the owner should validate legal identity, contact details, retention period and local privacy requirements with a qualified professional."}</DisclaimerBox></section></PageShell>;
}
