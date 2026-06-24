export const supportedLocales = ["fa", "en", "es"] as const;
export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = "fa";

export const countries = ["Spain", "Argentina", "Not sure"] as const;
export type TargetCountry = (typeof countries)[number];

export const desiredPaths = [
  "Student",
  "Digital nomad",
  "Family financial means",
  "Rentista",
  "Business/company",
  "Not sure",
] as const;
export type DesiredPath = (typeof desiredPaths)[number];

export const routes = {
  home: "/",
  about: "/about",
  spain: "/spain",
  argentina: "/argentina",
  services: "/services",
  apply: "/apply",
  contact: "/contact",
  resources: "/resources",
} as const;

export interface LeadPayload {
  locale: Locale;
  full_name: string;
  email: string;
  whatsapp: string;
  current_country: string;
  target_country: TargetCountry;
  desired_path: DesiredPath;
  family_size: string;
  budget_range: string;
  income_range: string;
  education_background: string;
  professional_background: string;
  timeline: string;
  documents_ready: string;
  main_concern: string;
  message: string;
  consent: boolean;
  website?: string;
}

export interface Service {
  id: string;
  country: "Spain" | "Argentina";
  slug: string;
  category: string;
  title_fa: string;
  title_en: string;
  title_es: string;
  description_fa: string;
  description_en: string;
  description_es: string;
  is_active: boolean;
}

export interface ServicePackage {
  id: string;
  service_id: string;
  name: string;
  tier: "launch" | "settle" | "premium";
  country: "Spain" | "Argentina";
  price_label: string;
  description_fa: string;
  description_en: string;
  description_es: string;
  features: string[];
  disclaimer: string;
  is_active: boolean;
}

export type Package = ServicePackage;

export interface Resource {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  body_markdown: string;
  category: string;
  country: "Spain" | "Argentina" | "General";
  published_at: string | null;
  is_published: boolean;
}

export function isLocale(value: string | undefined): value is Locale {
  return supportedLocales.includes(value as Locale);
}
