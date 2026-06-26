import type { Locale } from "@vida-familia/shared";

export type LocalizedText = Record<Locale, string>;

export interface ServicePageData {
  slug: string;
  country: "spain" | "argentina";
  title: LocalizedText;
  summary: LocalizedText;
  audience: LocalizedText[];
  meaning: LocalizedText;
  included: LocalizedText[];
  mistakes: LocalizedText[];
  timeline: Array<{ label: LocalizedText; detail: LocalizedText }>;
  documents: LocalizedText[];
  faqs: Array<{ question: LocalizedText; answer: LocalizedText }>;
}

const l = (fa: string, en: string, es: string): LocalizedText => ({ fa, en, es });

export const familyMembers = [
  {
    initials: "VF",
    name: l("شریف سعیدی", "Sharif Saeedi", "Sharif Saeedi"),
    image: "/assets/team/sharif-saeedi.jpg",
    imageAlt: "Sharif Saeedi",
    imagePosition: "50% 35%",
    role: l("پدر خانواده", "Father", "Padre"),
    title: l("کسب‌وکار، اقامت و جابه‌جایی خانواده", "Business, residency & family relocation", "Empresa, residencia y traslado familiar"),
    note: l("نگاه اجرایی به تصمیم‌های مالی، اداری و زندگی روزمره.", "A practical view of financial, administrative and everyday decisions.", "Una mirada práctica a las decisiones financieras, administrativas y cotidianas."),
  },
  {
    initials: "OD",
    name: l("امیر سعیدی", "Amir Saeedi", "Amir Saeedi"),
    image: "/assets/team/amir-saeedi.jpg",
    imageAlt: "Amir Saeedi",
    imagePosition: "50% 15%",
    role: l("برادر بزرگ‌تر", "Older brother", "Hermano mayor"),
    title: l("دندانپزشکی در دانشگاه کمپلوتنس", "Dentistry at Complutense", "Odontología en la Complutense"),
    note: l("تجربه ورود به دانشگاه، زبان، درس و زندگی دانشجویی در مادرید.", "University entry, language, study and student life in Madrid.", "Acceso universitario, idioma, estudios y vida estudiantil en Madrid."),
  },
  {
    initials: "IT",
    name: l("آلبرتو سعیدی", "Alberto Saeedi", "Alberto Saeedi"),
    image: "/assets/team/alberto-saeedi.jpg",
    imageAlt: "Alberto Saeedi",
    imagePosition: "50% 30%",
    role: l("ASIR، امنیت سایبری و IT", "ASIR, cybersecurity & IT", "ASIR, ciberseguridad e IT"),
    title: l(
      "ASIR؛ مدیریت سیستم‌های کامپیوتری و شبکه",
      "ASIR, cybersecurity & IT work",
      "ASIR, ciberseguridad y trabajo IT"
    ),
    note: l(
      "مسیر دوره عالی مدیریت سیستم‌های کامپیوتری و شبکه، امنیت سایبری و ورود به بازار کار IT در اسپانیا.",
      "The skills-first technical path into Spain's technology market.",
      "La vía técnica y práctica hacia el mercado tecnológico español."
    ),
  },
];

export const destinations = [
  {
    country: "spain" as const,
    title: l("اسپانیا", "Spain", "España"),
    city: l("مادرید و فراتر از آن", "Madrid and beyond", "Madrid y más allá"),
    description: l("برای تحصیل، کار از راه دور، زندگی خانوادگی و ساخت کسب‌وکار در اروپا.", "For study, remote work, family life and building a business in Europe.", "Para estudiar, teletrabajar, vivir en familia y emprender en Europa."),
    services: [
      l("ویزای تحصیلی", "Student visa", "Visado de estudiante"),
      l("نومد دیجیتال", "Digital nomad", "Nómada digital"),
      l("تمکن مالی خانواده", "Family financial means", "Residencia no lucrativa"),
      l("ثبت کسب‌وکار", "Business setup", "Creación de empresa"),
      l("استقرار در مادرید", "Madrid relocation", "Instalación en Madrid"),
    ],
  },
  {
    country: "argentina" as const,
    title: l("آرژانتین", "Argentina", "Argentina"),
    city: l("بوئنوس آیرس و زندگی تازه", "Buenos Aires and a new chapter", "Buenos Aires y una nueva etapa"),
    description: l("برای تحصیل، اقامت خانوادگی و شناخت یک مسیر متفاوت در آمریکای جنوبی.", "For study, family residency and a different path in South America.", "Para estudiar, residir en familia y descubrir otra vía en Sudamérica."),
    services: [
      l("اقامت تحصیلی", "Student residency", "Residencia estudiantil"),
      l("رنتیستا و تمکن مالی", "Rentista / financial means", "Rentista / medios económicos"),
      l("جابه‌جایی خانواده", "Family relocation", "Traslado familiar"),
      l("استقرار در بوئنوس آیرس", "Buenos Aires settlement", "Instalación en Buenos Aires"),
      l("آموزش مسیر تابعیت*", "Citizenship path education*", "Información sobre ciudadanía*"),
    ],
  },
];

export const serviceHighlights = [
  { title: l("انتخاب مسیر", "Pathway strategy", "Estrategia de vía"), text: l("مقایسه واقع‌بینانه گزینه‌ها بر اساس خانواده، بودجه و زمان.", "A realistic comparison based on family, budget and timing.", "Comparación realista según familia, presupuesto y plazo."), index: "01" },
  { title: l("آماده‌سازی مدارک", "Document readiness", "Preparación documental"), text: l("چک‌لیست، نظم پرونده و هماهنگی ترجمه و امور اداری.", "Checklists, file organization and translation coordination.", "Listas, organización y coordinación de traducciones."), index: "02" },
  { title: l("خانه و استقرار", "Housing & settlement", "Vivienda e instalación"), text: l("همراهی عملی برای مسکن، بانک، بیمه، مدرسه و ثبت‌های محلی.", "Practical help with housing, banking, insurance, schools and local registrations.", "Apoyo práctico con vivienda, banca, seguros, colegios y registros."), index: "03" },
  { title: l("همراهی خانواده", "Family coordination", "Coordinación familiar"), text: l("برنامه‌ای که نیازهای همه اعضای خانواده را کنار هم می‌بیند.", "One plan that considers every member of the family.", "Un plan que contempla a todos los miembros de la familia."), index: "04" },
];

export const packageGroups = [
  { country: "Spain", label: l("اقامت خانوادگی اسپانیا", "Spain family move", "Traslado familiar a España"), names: ["Launch Spain", "Settle Spain", "Premium Spain"] },
  { country: "Spain", label: l("نومد دیجیتال", "Digital nomad", "Nómada digital"), names: ["Launch Nomad", "Settle Nomad", "Premium Nomad"] },
  { country: "Spain", label: l("تحصیل در اسپانیا", "Education in Spain", "Estudios en España"), names: ["Launch Edu", "Settle Edu", "Premium Edu"] },
  { country: "Argentina", label: l("جابه‌جایی به آرژانتین", "Argentina move", "Traslado a Argentina"), names: ["Start Argentina", "Settle Argentina", "Premium Move Argentina"] },
  { country: "Argentina", label: l("تحصیل در آرژانتین", "Education in Argentina", "Estudios en Argentina"), names: ["Launch Edu Argentina", "Settle Edu Argentina", "Premium Edu Argentina"] },
];

const commonFaq = {
  guaranteed: { question: l("آیا نتیجه ویزا یا اقامت تضمین می‌شود؟", "Is a visa or residency result guaranteed?", "¿Se garantiza el visado o la residencia?"), answer: l("خیر. تصمیم نهایی با مرجع رسمی است. نقش ما ارزیابی، آماده‌سازی، هماهنگی و کاهش خطاهای قابل پیشگیری است.", "No. The final decision belongs to the competent authority. We help assess, prepare and reduce preventable mistakes.", "No. La decisión corresponde a la autoridad competente. Ayudamos a evaluar, preparar y reducir errores evitables.") },
  fees: { question: l("هزینه‌های دولتی و ترجمه در بسته‌هاست؟", "Are government and translation fees included?", "¿Se incluyen tasas y traducciones?"), answer: l("مگر اینکه در پیشنهاد اختصاصی نوشته شود، هزینه‌های دولتی، کنسولی، ترجمه رسمی و خدمات اشخاص ثالث جداست.", "Unless explicitly stated in a tailored proposal, government, consular, sworn translation and third-party fees are separate.", "Salvo indicación expresa, las tasas públicas, consulares, traducciones juradas y terceros se abonan aparte.") },
};

export const servicePages: ServicePageData[] = [
  {
    slug: "student-visa", country: "spain",
    title: l("ویزای تحصیلی اسپانیا", "Spain student visa", "Visado de estudios en España"),
    summary: l("مسیر تحصیل در اسپانیا، از انتخاب برنامه مناسب و پذیرش تا پرونده و استقرار دانشجویی.", "A structured path from choosing a suitable program and admission to the application and student settlement.", "Un recorrido ordenado desde el programa y la admisión hasta la solicitud y la instalación."),
    audience: [l("دانشجویانی که برنامه تحصیلی معتبر و بودجه واقعی دارند.", "Students with a credible study plan and realistic budget.", "Estudiantes con un plan académico sólido y presupuesto realista."), l("خانواده‌هایی که کیفیت تحصیل و زندگی روزمره را همزمان می‌سنجند.", "Families weighing education and everyday life together.", "Familias que valoran estudios y vida cotidiana a la vez."), l("متقاضیانی که برای زبان، زمان‌بندی و مدارک آمادگی دارند.", "Applicants ready for language, timing and documentation demands.", "Solicitantes preparados para idioma, plazos y documentación.")],
    meaning: l("اقامت تحصیلی به یک پذیرش واقعی، اثبات منابع مالی، بیمه مناسب و پرونده منسجم نیاز دارد. نوع دوره، محل اقدام و شرایط همراهان می‌تواند روند را تغییر دهد.", "Student status generally requires genuine admission, financial proof, suitable insurance and a coherent file. Program type, filing location and dependants can change the process.", "La estancia por estudios suele exigir admisión real, medios económicos, seguro adecuado y un expediente coherente. El tipo de programa, lugar de solicitud y familiares cambian el proceso."),
    included: [l("ارزیابی اولیه مسیر و ریسک‌ها", "Initial pathway and risk assessment", "Evaluación inicial de vía y riesgos"), l("برنامه مدارک و زمان‌بندی", "Document and timing plan", "Plan documental y calendario"), l("هماهنگی ترجمه، بیمه و امور اداری", "Translation, insurance and administrative coordination", "Coordinación de traducción, seguro y trámites"), l("آمادگی برای ورود و ثبت‌های بعدی", "Arrival and post-entry registration preparation", "Preparación de llegada y registros posteriores")],
    mistakes: [l("انتخاب دوره‌ای که با سابقه و هدف متقاضی هم‌خوان نیست.", "Choosing a course that does not fit the applicant's background or goal.", "Elegir un curso incoherente con el perfil o el objetivo."), l("شروع دیرهنگام ترجمه، بیمه یا اثبات تمکن.", "Starting translations, insurance or financial proof too late.", "Empezar tarde traducciones, seguro o medios económicos."), l("نادیده گرفتن برنامه مسکن و هزینه ماه‌های اول.", "Ignoring housing and first-month costs.", "Ignorar vivienda y costes de los primeros meses.")],
    timeline: [{ label: l("۱. ارزیابی", "1. Assessment", "1. Evaluación"), detail: l("هدف، سابقه، بودجه و تقویم", "Goal, background, budget and calendar", "Objetivo, perfil, presupuesto y calendario") }, { label: l("۲. پذیرش", "2. Admission", "2. Admisión"), detail: l("انتخاب و تکمیل پرونده آموزشی", "Program selection and academic file", "Selección y expediente académico") }, { label: l("۳. درخواست", "3. Application", "3. Solicitud"), detail: l("مدارک، ترجمه و ثبت پرونده", "Documents, translations and filing", "Documentos, traducciones y presentación") }, { label: l("۴. ورود", "4. Arrival", "4. Llegada"), detail: l("مسکن، ثبت‌های محلی و شروع زندگی", "Housing, local registration and settling in", "Vivienda, registros e instalación") }],
    documents: [l("گذرنامه و سوابق هویتی", "Passport and civil records", "Pasaporte y documentos civiles"), l("پذیرش و مدارک تحصیلی", "Admission and academic records", "Admisión y expediente académico"), l("اثبات منابع مالی", "Evidence of financial means", "Prueba de medios económicos"), l("بیمه، گواهی‌های لازم و ترجمه رسمی", "Insurance, required certificates and official translations", "Seguro, certificados y traducciones oficiales")],
    faqs: [commonFaq.guaranteed, commonFaq.fees],
  },
  {
    slug: "digital-nomad", country: "spain",
    title: l("ویزای نومد دیجیتال اسپانیا", "Spain digital nomad visa", "Visado de nómada digital en España"),
    summary: l("برای حرفه‌ای‌هایی که درآمد بین‌المللی واقعی دارند و می‌خواهند زندگی و کار از راه دور را در اسپانیا سامان دهند.", "For professionals with genuine international income who want to structure remote work and life in Spain.", "Para profesionales con ingresos internacionales reales que quieren organizar su trabajo remoto y su vida en España."),
    audience: [l("کارمندان دورکار شرکت‌های خارج از اسپانیا.", "Remote employees of companies outside Spain.", "Empleados remotos de empresas fuera de España."), l("فریلنسرها و صاحبان کسب‌وکار با قرارداد و سابقه قابل اثبات.", "Freelancers and business owners with provable contracts and history.", "Autónomos y empresarios con contratos e historial demostrables."), l("خانواده‌هایی که مالیات، مدرسه و زندگی بلندمدت را جدی بررسی می‌کنند.", "Families taking tax, schooling and long-term life seriously.", "Familias que analizan fiscalidad, colegios y vida a largo plazo.")],
    meaning: l("این مسیر فقط داشتن لپ‌تاپ نیست؛ رابطه کاری، سابقه فعالیت، سطح درآمد، ساختار شرکت و پیامدهای مالیاتی باید کنار هم بررسی شوند.", "This pathway is more than owning a laptop: work relationships, operating history, income, company structure and tax implications must be assessed together.", "Esta vía no consiste solo en tener un portátil: relación laboral, antigüedad, ingresos, estructura empresarial e impacto fiscal deben analizarse conjuntamente."),
    included: [l("بررسی مدل درآمد و قراردادها", "Income and contract review", "Revisión de ingresos y contratos"), l("نقشه مدارک شرکت و حرفه", "Company and professional evidence map", "Mapa de documentos empresariales y profesionales"), l("هماهنگی با متخصص حقوقی یا مالیاتی در صورت نیاز", "Coordination with legal or tax professionals when needed", "Coordinación jurídica o fiscal cuando proceda"), l("برنامه ورود، مسکن و ثبت‌های محلی", "Arrival, housing and local registration plan", "Plan de llegada, vivienda y registros")],
    mistakes: [l("فرض اینکه هر درآمد آنلاین واجد شرایط است.", "Assuming every online income stream qualifies.", "Suponer que cualquier ingreso online sirve."), l("بی‌توجهی به اقامت مالیاتی و ساختار فاکتورها.", "Ignoring tax residence and invoicing structure.", "Ignorar residencia fiscal y facturación."), l("ارائه قراردادهای مبهم یا سابقه فعالیت ناکافی.", "Submitting vague contracts or insufficient operating history.", "Presentar contratos vagos o poca antigüedad.")],
    timeline: [{ label: l("۱. تشخیص صلاحیت", "1. Eligibility", "1. Elegibilidad"), detail: l("درآمد، رابطه کاری و خانواده", "Income, work relationship and family", "Ingresos, relación laboral y familia") }, { label: l("۲. طراحی پرونده", "2. File design", "2. Diseño"), detail: l("شرکت، قرارداد، حرفه و مالی", "Company, contracts, profession and finance", "Empresa, contratos, profesión y finanzas") }, { label: l("۳. ثبت", "3. Filing", "3. Presentación"), detail: l("انتخاب محل و تکمیل درخواست", "Filing route and complete application", "Vía y solicitud completa") }, { label: l("۴. استقرار", "4. Settlement", "4. Instalación"), detail: l("ثبت، بانک، خانه و امور خانواده", "Registration, banking, housing and family", "Registros, banco, vivienda y familia") }],
    documents: [l("قراردادها و نامه‌های شرکتی", "Contracts and company letters", "Contratos y cartas de empresa"), l("مدارک سابقه و صلاحیت حرفه‌ای", "Professional history and qualification evidence", "Historial y cualificación profesional"), l("گردش مالی و اثبات درآمد", "Financial statements and income evidence", "Extractos y prueba de ingresos"), l("مدارک هویتی، بیمه و گواهی‌های لازم", "Civil documents, insurance and required certificates", "Documentos civiles, seguro y certificados")],
    faqs: [commonFaq.guaranteed, commonFaq.fees],
  },
  {
    slug: "family-financial-means", country: "spain",
    title: l("اقامت خانوادگی با تمکن مالی در اسپانیا", "Spain family financial-means pathway", "Residencia familiar por medios económicos en España"),
    summary: l("برنامه‌ای خانواده‌محور برای کسانی که منابع مالی کافی دارند و قصد اشتغال محلی، محور اصلی مسیرشان نیست.", "A family-centered plan for applicants with sufficient means whose pathway is not based primarily on local employment.", "Un plan familiar para personas con medios suficientes cuya vía no se basa principalmente en empleo local."),
    audience: [l("خانواده‌هایی با پس‌انداز و درآمد پایدار قابل اثبات.", "Families with provable savings and stable income.", "Familias con ahorro e ingresos estables demostrables."), l("افرادی که کیفیت زندگی، مدرسه و برنامه بلندمدت می‌خواهند.", "People prioritizing quality of life, schools and long-term planning.", "Personas que priorizan calidad de vida, colegios y planificación."), l("متقاضیانی که محدودیت‌های کاری این مسیر را می‌پذیرند.", "Applicants who understand this route's work limitations.", "Solicitantes que comprenden sus limitaciones laborales.")],
    meaning: l("عدد حساب بانکی به‌تنهایی کافی نیست. منبع پول، استمرار منابع، اندازه خانواده، بیمه و برنامه اقامت باید یک روایت مالی قابل‌فهم بسازند.", "A bank balance alone is not enough. Source and continuity of funds, family size, insurance and residence plan need to form a coherent financial story.", "El saldo bancario no basta. Origen y continuidad de fondos, tamaño familiar, seguro y plan de residencia deben formar una historia coherente."),
    included: [l("تحلیل منابع و ساختار مالی خانواده", "Family means and financial structure review", "Análisis de medios y estructura familiar"), l("چک‌لیست اعضای خانواده", "Family-member document checklist", "Lista documental por familiar"), l("هماهنگی مدرسه، بیمه و مسکن", "School, insurance and housing coordination", "Coordinación de colegios, seguro y vivienda"), l("برنامه تمدیدپذیری و استقرار", "Renewal-aware settlement plan", "Plan de instalación pensando en la renovación")],
    mistakes: [l("انتقال ناگهانی پول بدون توضیح منبع.", "Large last-minute transfers without source evidence.", "Transferencias de última hora sin justificar origen."), l("محاسبه بودجه فقط برای متقاضی اصلی.", "Budgeting only for the main applicant.", "Calcular medios solo para el solicitante principal."), l("نادیده گرفتن محدودیت کار و هزینه واقعی خانواده.", "Ignoring work limits and real family costs.", "Ignorar límites laborales y costes familiares reales.")],
    timeline: [{ label: l("۱. برنامه مالی", "1. Financial plan", "1. Plan financiero"), detail: l("منبع، مبلغ و اندازه خانواده", "Source, amount and family size", "Origen, importe y familia") }, { label: l("۲. پرونده خانواده", "2. Family file", "2. Expediente familiar"), detail: l("هویت، روابط، بیمه و محل زندگی", "Civil status, insurance and residence", "Estado civil, seguro y residencia") }, { label: l("۳. درخواست", "3. Application", "3. Solicitud"), detail: l("ترجمه، ثبت و پیگیری", "Translation, filing and follow-up", "Traducción, presentación y seguimiento") }, { label: l("۴. جابه‌جایی", "4. Relocation", "4. Traslado"), detail: l("خانه، مدرسه، بانک و ثبت‌ها", "Home, school, banking and registrations", "Vivienda, colegio, banco y registros") }],
    documents: [l("مدارک هویتی و خانوادگی", "Civil and family records", "Documentos civiles y familiares"), l("صورت‌حساب و اسناد منبع دارایی", "Statements and source-of-funds evidence", "Extractos y origen de fondos"), l("بیمه درمانی مناسب", "Suitable health insurance", "Seguro médico adecuado"), l("گواهی‌ها، ترجمه‌ها و برنامه سکونت", "Certificates, translations and residence plan", "Certificados, traducciones y plan de residencia")],
    faqs: [commonFaq.guaranteed, commonFaq.fees],
  },
  {
    slug: "student-residency", country: "argentina",
    title: l("اقامت تحصیلی آرژانتین", "Argentina student residency", "Residencia estudiantil en Argentina"),
    summary: l("از انتخاب مؤسسه و آماده‌سازی سوابق تا ثبت اقامت، DNI و استقرار دانشجویی در بوئنوس آیرس.", "From institution choice and records to residency filing, DNI and student settlement in Buenos Aires.", "Desde la institución y los antecedentes hasta la residencia, DNI e instalación estudiantil en Buenos Aires."),
    audience: [l("دانشجویان با پذیرش واقعی و برنامه تحصیلی روشن.", "Students with genuine admission and a clear study plan.", "Estudiantes con admisión real y plan académico claro."), l("افرادی که برای فرایندهای اداری محلی آمادگی دارند.", "Applicants ready for local administrative processes.", "Personas preparadas para trámites administrativos locales."), l("خانواده‌هایی که بودجه زندگی در بوئنوس آیرس را سنجیده‌اند.", "Families that have assessed Buenos Aires living costs.", "Familias que han evaluado el coste de vida porteño.")],
    meaning: l("پذیرش، سوابق هویتی و کیفری، ورود قانونی و ثبت‌های محلی باید با ترتیب درست پیش بروند. مقررات و زمان‌های اداری ممکن است تغییر کنند.", "Admission, civil and criminal records, lawful entry and local registrations need the right sequence. Rules and processing times can change.", "Admisión, antecedentes, ingreso regular y registros locales deben seguir el orden correcto. Normas y plazos pueden cambiar."),
    included: [l("بررسی برنامه تحصیلی و مدارک مبدا", "Study-plan and origin-document review", "Revisión académica y documental de origen"), l("نقشه اقامت و ثبت‌های محلی", "Residency and local-registration map", "Mapa de residencia y registros locales"), l("هماهنگی ترجمه و وقت‌های اداری", "Translation and appointment coordination", "Coordinación de traducciones y turnos"), l("راهنمای DNI، مسکن، بیمه و بانک", "DNI, housing, insurance and banking guidance", "Guía de DNI, vivienda, seguro y banca")],
    mistakes: [l("آماده نکردن به‌موقع گواهی‌ها و تأییدات مبدا.", "Late preparation of origin certificates and legalizations.", "Preparar tarde certificados y legalizaciones de origen."), l("اتکا به اطلاعات قدیمی درباره وقت‌ها و فرایندها.", "Relying on outdated appointment or process information.", "Confiar en información antigua sobre turnos y procesos."), l("نداشتن بودجه امن برای ماه‌های اول.", "Lacking a safe first-month budget.", "No contar con presupuesto seguro para los primeros meses.")],
    timeline: [{ label: l("۱. پیش از سفر", "1. Before travel", "1. Antes del viaje"), detail: l("پذیرش، سوابق و تأییدات", "Admission, records and legalizations", "Admisión, antecedentes y legalizaciones") }, { label: l("۲. ورود", "2. Arrival", "2. Llegada"), detail: l("محل اقامت و مدارک محلی", "Address and local evidence", "Domicilio y documentación local") }, { label: l("۳. اقامت", "3. Residency", "3. Residencia"), detail: l("ثبت پرونده و پیگیری", "Filing and follow-up", "Presentación y seguimiento") }, { label: l("۴. استقرار", "4. Settlement", "4. Instalación"), detail: l("DNI، بانک، بیمه و دانشگاه", "DNI, banking, insurance and university", "DNI, banco, seguro y universidad") }],
    documents: [l("گذرنامه و ورود قانونی", "Passport and lawful-entry record", "Pasaporte e ingreso regular"), l("پذیرش یا گواهی تحصیلی معتبر", "Valid admission or study certificate", "Admisión o certificado de estudios válido"), l("سوابق هویتی و کیفری موردنیاز", "Required civil and criminal records", "Documentos civiles y antecedentes requeridos"), l("ترجمه‌ها و تأییدات لازم", "Required translations and legalizations", "Traducciones y legalizaciones necesarias")],
    faqs: [commonFaq.guaranteed, commonFaq.fees],
  },
  {
    slug: "rentista-family", country: "argentina",
    title: l("اقامت رنتیستا و خانواده در آرژانتین", "Argentina rentista & family residency", "Residencia rentista y familiar en Argentina"),
    summary: l("برای خانواده‌هایی با درآمد منظم از خارج که می‌خواهند منابع، مدارک و استقرار خود را با واقع‌بینی آماده کنند.", "For families with recurring foreign income who want to prepare evidence and settlement realistically.", "Para familias con ingresos periódicos del exterior que quieren preparar pruebas e instalación de forma realista."),
    audience: [l("افرادی با درآمد دوره‌ای واقعی و قابل ردیابی از خارج.", "People with genuine, traceable recurring foreign income.", "Personas con ingresos periódicos reales y trazables del exterior."), l("خانواده‌هایی که زندگی و هزینه‌های آرژانتین را بررسی کرده‌اند.", "Families that have researched life and costs in Argentina.", "Familias que han estudiado la vida y los costes en Argentina."), l("متقاضیانی که برای تغییرات مقرراتی انعطاف دارند.", "Applicants prepared for regulatory change.", "Solicitantes preparados para cambios normativos." )],
    meaning: l("رنتیستا بر درآمد منظم و قابل اثبات تکیه دارد، نه صرفاً یک موجودی بانکی. نوع درآمد، اسناد منبع و روش دریافت باید پیش از اقدام بررسی شوند.", "Rentista status relies on regular provable income, not only a bank balance. Income type, source evidence and receipt method need review before filing.", "La categoría rentista se basa en ingresos regulares demostrables, no solo saldo bancario. Tipo, origen y forma de cobro deben revisarse antes."),
    included: [l("بررسی نوع و استمرار درآمد", "Income type and continuity review", "Revisión del tipo y continuidad de ingresos"), l("نقشه اسناد مبدا و ترجمه", "Origin-document and translation map", "Mapa de documentos y traducciones"), l("هماهنگی اقامت اعضای خانواده", "Family-member residency coordination", "Coordinación de residencia familiar"), l("راهنمای DNI، CDI/CUIL، خانه و بانک", "DNI, CDI/CUIL, housing and banking guidance", "Guía de DNI, CDI/CUIL, vivienda y banca")],
    mistakes: [l("اشتباه گرفتن پس‌انداز با درآمد دوره‌ای.", "Confusing savings with recurring income.", "Confundir ahorro con ingresos periódicos."), l("اسناد ناقص درباره منبع یا استمرار پرداخت.", "Incomplete source or continuity evidence.", "Pruebas incompletas de origen o continuidad."), l("تصمیم بر اساس وعده تابعیت یا نتیجه قطعی.", "Deciding based on promised citizenship or guaranteed results.", "Decidir por promesas de ciudadanía o resultados garantizados.")],
    timeline: [{ label: l("۱. تحلیل درآمد", "1. Income analysis", "1. Análisis de ingresos"), detail: l("نوع، منبع و استمرار", "Type, source and continuity", "Tipo, origen y continuidad") }, { label: l("۲. مدارک مبدا", "2. Origin file", "2. Documentos de origen"), detail: l("گواهی‌ها، تأییدات و ترجمه", "Certificates, legalizations and translation", "Certificados, legalizaciones y traducción") }, { label: l("۳. ورود و ثبت", "3. Arrival & filing", "3. Llegada y solicitud"), detail: l("آدرس، اقامت و پیگیری", "Address, residency and follow-up", "Domicilio, residencia y seguimiento") }, { label: l("۴. زندگی روزمره", "4. Daily life", "4. Vida cotidiana"), detail: l("DNI، مالیات، بانک، بیمه و مدرسه", "DNI, tax IDs, banking, insurance and school", "DNI, claves fiscales, banco, seguro y colegio") }],
    documents: [l("اسناد درآمد و قراردادهای مربوط", "Income evidence and relevant contracts", "Pruebas de ingresos y contratos"), l("گردش حساب و مسیر دریافت", "Statements and receipt trail", "Extractos y trazabilidad de cobros"), l("مدارک هویتی و خانوادگی", "Civil and family records", "Documentos civiles y familiares"), l("سوابق، ترجمه‌ها و تأییدات لازم", "Records, translations and legalizations", "Antecedentes, traducciones y legalizaciones")],
    faqs: [commonFaq.guaranteed, commonFaq.fees],
  },
];

export const contentPillars = [
  { fa: "زندگی دانشجویی", en: "Student life", es: "Vida estudiantil", code: "STUDY" },
  { fa: "کسب‌وکار و اقامت", en: "Business & residency", es: "Empresa y residencia", code: "BUILD" },
  { fa: "زندگی خانوادگی", en: "Family life", es: "Vida familiar", code: "FAMILY" },
  { fa: "راهنمای اسپانیا", en: "Spain guides", es: "Guías de España", code: "ES" },
  { fa: "راهنمای آرژانتین", en: "Argentina guides", es: "Guías de Argentina", code: "AR" },
] satisfies Array<Record<Locale, string> & { code: string }>;
