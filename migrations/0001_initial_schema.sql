PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  locale TEXT NOT NULL DEFAULT 'fa' CHECK (locale IN ('fa', 'en', 'es')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  current_country TEXT NOT NULL,
  target_country TEXT NOT NULL CHECK (target_country IN ('Spain', 'Argentina', 'Not sure')),
  desired_path TEXT NOT NULL CHECK (desired_path IN ('Student', 'Digital nomad', 'Family financial means', 'Rentista', 'Business/company', 'Not sure')),
  family_size TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  income_range TEXT NOT NULL,
  education_background TEXT,
  professional_background TEXT,
  timeline TEXT NOT NULL,
  documents_ready TEXT NOT NULL,
  main_concern TEXT NOT NULL,
  message TEXT,
  consent INTEGER NOT NULL CHECK (consent = 1),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'qualified', 'not_fit', 'contacted', 'archived'))
);

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY NOT NULL,
  country TEXT NOT NULL CHECK (country IN ('Spain', 'Argentina')),
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  title_fa TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  description_fa TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1))
);

CREATE TABLE IF NOT EXISTS packages (
  id TEXT PRIMARY KEY NOT NULL,
  service_id TEXT NOT NULL,
  name TEXT NOT NULL,
  tier TEXT NOT NULL,
  country TEXT NOT NULL CHECK (country IN ('Spain', 'Argentina')),
  price_label TEXT NOT NULL,
  description_fa TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  features_json TEXT NOT NULL DEFAULT '[]',
  disclaimer TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY NOT NULL,
  slug TEXT NOT NULL,
  locale TEXT NOT NULL CHECK (locale IN ('fa', 'en', 'es')),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  category TEXT NOT NULL,
  country TEXT NOT NULL CHECK (country IN ('Spain', 'Argentina', 'General')),
  published_at TEXT,
  is_published INTEGER NOT NULL DEFAULT 0 CHECK (is_published IN (0, 1)),
  UNIQUE (slug, locale)
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_target_country ON leads(target_country);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_packages_service_id ON packages(service_id);
CREATE INDEX IF NOT EXISTS idx_resources_slug ON resources(slug);
CREATE INDEX IF NOT EXISTS idx_resources_locale ON resources(locale);
CREATE INDEX IF NOT EXISTS idx_resources_published_at ON resources(published_at DESC);
