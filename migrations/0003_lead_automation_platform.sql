PRAGMA foreign_keys = ON;

ALTER TABLE leads ADD COLUMN reference_code TEXT;
ALTER TABLE leads ADD COLUMN lead_score INTEGER;
ALTER TABLE leads ADD COLUMN priority TEXT DEFAULT 'review' CHECK (priority IN ('hot', 'qualified', 'review', 'not_ready', 'spam'));
ALTER TABLE leads ADD COLUMN recommended_next_step TEXT;
ALTER TABLE leads ADD COLUMN source TEXT;
ALTER TABLE leads ADD COLUMN campaign TEXT;
ALTER TABLE leads ADD COLUMN assigned_to TEXT;
ALTER TABLE leads ADD COLUMN last_contacted_at TEXT;
ALTER TABLE leads ADD COLUMN next_follow_up_at TEXT;
ALTER TABLE leads ADD COLUMN updated_at TEXT;

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  locale TEXT NOT NULL DEFAULT 'fa' CHECK (locale IN ('fa', 'en', 'es')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  topic TEXT NOT NULL,
  message TEXT NOT NULL,
  consent INTEGER NOT NULL CHECK (consent = 1),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'replied', 'archived')),
  source TEXT,
  admin_notes TEXT
);

CREATE TABLE IF NOT EXISTS consultation_requests (
  id TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  reference_code TEXT NOT NULL UNIQUE,
  locale TEXT NOT NULL DEFAULT 'fa' CHECK (locale IN ('fa', 'en', 'es')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  target_country TEXT NOT NULL,
  consultation_type TEXT NOT NULL,
  preferred_day TEXT,
  preferred_time_window TEXT,
  timezone TEXT,
  message TEXT,
  consent INTEGER NOT NULL CHECK (consent = 1),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'scheduled', 'completed', 'archived')),
  priority TEXT NOT NULL DEFAULT 'review' CHECK (priority IN ('hot', 'qualified', 'review', 'not_ready', 'spam')),
  assigned_to TEXT
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  email TEXT NOT NULL UNIQUE,
  locale TEXT NOT NULL DEFAULT 'fa' CHECK (locale IN ('fa', 'en', 'es')),
  interest TEXT,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed', 'bounced')),
  consent INTEGER NOT NULL CHECK (consent = 1)
);

CREATE TABLE IF NOT EXISTS quiz_results (
  id TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  locale TEXT NOT NULL DEFAULT 'fa' CHECK (locale IN ('fa', 'en', 'es')),
  target_country_preference TEXT,
  goal TEXT,
  budget_range TEXT,
  income_range TEXT,
  family_size TEXT,
  timeline TEXT,
  education_level TEXT,
  work_background TEXT,
  documents_ready TEXT,
  suggested_paths_json TEXT NOT NULL DEFAULT '[]',
  readiness_score INTEGER NOT NULL DEFAULT 0,
  contact_email TEXT,
  whatsapp TEXT,
  consent INTEGER NOT NULL DEFAULT 0 CHECK (consent IN (0, 1)),
  source TEXT
);

CREATE TABLE IF NOT EXISTS guide_unlocks (
  id TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  locale TEXT NOT NULL DEFAULT 'fa' CHECK (locale IN ('fa', 'en', 'es')),
  guide_slug TEXT NOT NULL,
  full_name TEXT,
  email TEXT NOT NULL,
  whatsapp TEXT,
  interest TEXT,
  consent INTEGER NOT NULL CHECK (consent = 1),
  source TEXT,
  emailed_at TEXT
);

CREATE TABLE IF NOT EXISTS lead_timeline (
  id TEXT PRIMARY KEY NOT NULL,
  lead_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  event_type TEXT NOT NULL,
  note TEXT NOT NULL,
  author TEXT,
  metadata_json TEXT,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  event_name TEXT NOT NULL,
  path TEXT NOT NULL,
  locale TEXT,
  country TEXT,
  source TEXT,
  campaign TEXT,
  session_id TEXT,
  metadata_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_reference_code ON leads(reference_code);
CREATE INDEX IF NOT EXISTS idx_leads_whatsapp ON leads(whatsapp);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON leads(priority);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_reference_code ON consultation_requests(reference_code);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_quiz_results_created_at ON quiz_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guide_unlocks_guide_slug ON guide_unlocks(guide_slug);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_path ON analytics_events(path);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
