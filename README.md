# Vida Familia

Vida Familia is a Persian-first, family-led relocation, education, lifestyle, and advisory platform for Spain and Argentina. This repository contains a multilingual React site, a Cloudflare Worker lead API, a D1 schema, and the deployment handoff for `vidafamilia.es`.

The domain **has been purchased from GoDaddy** and GoDaddy nameservers are set to Cloudflare: `hayes.ns.cloudflare.com` and `novalee.ns.cloudflare.com`. Public DNS/Cloudflare activation may still be propagating, so do not assume `vidafamilia.es` is active until Cloudflare shows the zone as **Active**. Pages/Worker custom domains should be attached only after that.

## Architecture

```text
apps/web       React 19 + Vite + TypeScript + Tailwind CSS
apps/worker    Cloudflare Worker API
packages/shared  Shared types and constants
migrations     Cloudflare D1 schema and seed catalog
```

Cloudflare configuration is intentionally split:

- Root `wrangler.toml` is **Pages-only** (`vida-familia-web` and `apps/web/dist`). Cloudflare Pages reads this file during Git deployments.
- Root `wrangler.worker.toml` is **Worker + D1 only** (`vida-familia-api`, binding `DB`). Every Worker/D1 script selects it explicitly with `-c wrangler.worker.toml`.

Production plan:

- Site: `https://vidafamilia.es`
- WWW alias: `https://www.vidafamilia.es`
- API: `https://api.vidafamilia.es`
- GitHub: <https://github.com/albeen-sknight/vida-familia>
- Pages project: `vida-familia-web`
- Worker: `vida-familia-api`
- D1 database/binding: `vida-familia-db` / `DB`
- Production D1 database ID: `8efefb70-f96c-4fc6-b525-2b0300528b2a`
- Production D1 region: `WEUR`
- Worker temporary URL: `https://vida-familia-api.natsu-dragneel13576.workers.dev`
- Current deployed Worker version ID: `bdd5c15e-00c9-4abf-ab7d-c84a217f26c1`

## Current deployment status

- GitHub `origin/main` includes `551cea4 Configure production D1 database`.
- Production D1 database `vida-familia-db` has been created in region `WEUR`.
- `wrangler.worker.toml` contains the real database ID `8efefb70-f96c-4fc6-b525-2b0300528b2a`.
- Production D1 migrations have been applied successfully: `0001_initial_schema.sql`, `0002_seed_catalog.sql`, and `0003_lead_automation_platform.sql`.
- Worker `vida-familia-api` has been deployed successfully and has D1 binding `env.DB → vida-familia-db`.
- Until `api.vidafamilia.es` is attached, use `https://vida-familia-api.natsu-dragneel13576.workers.dev`.
- Resend, Turnstile, and SMS/WhatsApp providers are not configured yet.

## Requirements

- Node.js 20.19+ (Node 22 LTS is also suitable)
- pnpm 9+
- Wrangler 4 (installed in this workspace)
- A Cloudflare login is needed only for remote D1 and deployment actions

If `pnpm` is not installed:

```bash
corepack enable
corepack prepare pnpm@10.12.4 --activate
```

## Local setup

```bash
pnpm install
pnpm db:migrate:local
pnpm dev
```

Then open:

- Frontend: <http://localhost:5173>
- Worker health: <http://localhost:8787/api/health>

`pnpm dev` runs both processes. Run them separately with `pnpm dev:web` and `pnpm dev:worker` when debugging.

For local Worker overrides, create an untracked `.dev.vars` from `.dev.vars.example`. Never commit the real file. Public forms work locally without email/SMS secrets; Resend, Turnstile, SMS/WhatsApp, and admin access activate only when their variables are configured.

## Assets

Production assets are already located at:

```text
apps/web/public/assets/banner.png
apps/web/public/assets/logo.png
apps/web/public/assets/favikon.png
```

If they need to be restored, copy the owner's source files:

```text
C:\Users\PC\Desktop\Vida Familia Web\banner.png
C:\Users\PC\Desktop\Vida Familia Web\logo.png
C:\Users\PC\Desktop\Vida Familia Web\favikon.png
```

to `apps/web/public/assets/`. Missing images fail gracefully to branded CSS backgrounds/text rather than crashing the app. `favikon.png` is used for the favicon, Apple touch icon, and PWA icon source.

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Run frontend and Worker together |
| `pnpm dev:web` | Run Vite on port 5173 |
| `pnpm dev:worker` | Run the API with `wrangler.worker.toml` on Wrangler's default port 8787 |
| `pnpm typecheck` | Type-check all packages and generate Worker bindings |
| `pnpm build` | Build shared types, frontend, and Worker dry-run bundle |
| `pnpm lint` | Run strict TypeScript checks |
| `pnpm format` | Format source/docs with Prettier |
| `pnpm preview` | Preview the built frontend |
| `pnpm db:migrate:local` | Apply D1 migrations locally through `wrangler.worker.toml` |
| `pnpm db:migrate:prod` | Apply remote D1 migrations through `wrangler.worker.toml` |
| `pnpm deploy:worker` | Deploy `vida-familia-api` through `wrangler.worker.toml` |
| `pnpm deploy:worker:dry` | Validate the Worker bundle without deployment |

## Frontend

- `/` and `/fa` are Persian and RTL-first.
- `/en` and `/es` are LTR English and Spanish homepages.
- Every main page also works with a locale prefix, for example `/en/about`.
- Five detailed service routes include audience, meaning, scope, mistakes, timeline, documents, packages, FAQ, qualification, and legal disclaimers.
- `/apply` validates qualification data in the browser and submits to `${VITE_API_BASE_URL}/api/leads`; the success state shows a reference code and next step.
- `/contact` includes a real D1-backed contact form.
- The homepage includes a pathway quiz backed by `/api/quiz/pathway`.
- `/resources` includes guide unlock and newsletter capture forms.
- `/dashboard` and `/dashboard/leads` are token-gated internal admin scaffolds. There is no fake login; the admin manually enters `ADMIN_API_TOKEN`.
- SEO metadata, Open Graph, Twitter cards, canonical URLs, Organization/Service JSON-LD, `robots.txt`, and `sitemap.xml` use `https://vidafamilia.es`.

Translations live in `apps/web/src/data/i18n.ts` and localized content in `apps/web/src/data/siteData.ts`. Add a key for `fa`, `en`, and `es` together. Add a service by extending `servicePages`, then seed the corresponding database record if it should be database-managed later.

The current resources UI is an editorial launch slate. Publishable resource records are prepared in D1 but a resource CMS/API is intentionally out of MVP scope.

## Worker API

### `GET /api/health`

Returns service health and an ISO timestamp. No D1 read is required.

### Public submit endpoints

All public POST endpoints enforce the origin allowlist, a 32 KiB body limit, JSON content type, server-side validation, consent checks where relevant, and prepared D1 statements. If `TURNSTILE_SECRET_KEY` is configured, the Worker requires and verifies the submitted Turnstile token with Cloudflare Siteverify. If the secret is not configured, Turnstile is skipped so local development and MVP launch are not blocked.

| Endpoint | Purpose |
|---|---|
| `POST /api/leads` | Apply form; creates `reference_code`, deterministic lead score, priority, recommended next step, D1 row, admin notification email, applicant confirmation email, optional disabled-by-default SMS/WhatsApp confirmation |
| `POST /api/contact` | Contact page form; saves to `contact_messages`, emails admins, emails applicant |
| `POST /api/consultation-request` | Consultation request; saves to `consultation_requests`, generates reference code, emails admins/applicant |
| `POST /api/newsletter` | Upserts `newsletter_subscribers`; optional welcome email; does not notify admins by default |
| `POST /api/quiz/pathway` | Mini pathway quiz; saves result and returns `suggested_paths`, `readiness_score`, and `next_step` |
| `POST /api/guides/unlock` | Guide unlock lead magnet; saves request, emails guide link placeholder, notifies admins for high-intent guide unlocks |
| `POST /api/analytics/event` | Privacy-friendly anonymous event tracking; stores no IP address |

Email delivery uses Resend when `RESEND_API_KEY` and `FROM_EMAIL` are configured. If D1 saves successfully but email fails, the applicant still receives a successful API response and the Worker logs a safe provider failure.

### Admin endpoints

All admin routes require `Authorization: Bearer <ADMIN_API_TOKEN>`. If the token is missing or incorrect, the Worker returns `401`.

| Endpoint | Purpose |
|---|---|
| `GET /api/admin/stats` | Lead, contact, consultation, newsletter, and top analytics counts |
| `GET /api/admin/leads?limit=&offset=&status=&priority=&target_country=&desired_path=` | Filtered lead list |
| `GET /api/admin/leads/:id` | Full lead detail plus timeline |
| `PATCH /api/admin/leads/:id/status` | Update status, optional priority, assignment, follow-up date, and note |
| `POST /api/admin/leads/:id/notes` | Add timeline note |
| `GET /api/admin/contact-messages` | Recent contact messages |
| `GET /api/admin/consultation-requests` | Recent consultation requests |

## D1

The migrations create `leads`, `services`, `packages`, `resources`, the seed catalog, lead automation fields, contact messages, consultation requests, newsletter subscribers, quiz results, guide unlocks, lead timeline notes, analytics events, and supporting indexes.

Local:

```bash
pnpm db:migrate:local
```

Production remote D1 is already created and configured in `wrangler.worker.toml`:

```text
database_name = vida-familia-db
database_id = 8efefb70-f96c-4fc6-b525-2b0300528b2a
binding = DB
region = WEUR
```

Remote migrations have already been applied successfully:

- `0001_initial_schema.sql`
- `0002_seed_catalog.sql`
- `0003_lead_automation_platform.sql`

Use these commands only when checking or applying future migrations:

```bash
pnpm exec wrangler d1 migrations list vida-familia-db --remote -c wrangler.worker.toml
pnpm db:migrate:prod
```

Inspect local leads and automation rows:

```bash
pnpm exec wrangler d1 execute vida-familia-db --local --command "SELECT reference_code, created_at, email, priority, status FROM leads ORDER BY created_at DESC LIMIT 10" -c wrangler.worker.toml
pnpm exec wrangler d1 execute vida-familia-db --local --command "SELECT created_at, email, topic FROM contact_messages ORDER BY created_at DESC LIMIT 10" -c wrangler.worker.toml
```

## Environment values

Frontend builds read `VITE_*` values. Metadata uses `VITE_SITE_URL` with a production-safe fallback of `https://vidafamilia.es`; the API uses a local fallback of `http://localhost:8787`.

Cloudflare Pages production variables:

| Variable name | Value |
|---|---|
| `PUBLIC_SITE_URL` | `https://vidafamilia.es` |
| `VITE_API_BASE_URL` | `https://api.vidafamilia.es` |
| `VITE_SITE_URL` | `https://vidafamilia.es` |
| `VITE_TURNSTILE_SITE_KEY` | Optional Turnstile site key |
| `VITE_PUBLIC_WHATSAPP_NUMBER` | Optional public business WhatsApp number, digits only or `+` format |

In the Cloudflare UI, the variable **name** is exactly `VITE_TURNSTILE_SITE_KEY`—do not include an equals sign in the name. An empty value is valid.

Worker secrets/vars:

| Name | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend API key for outbound admin/applicant emails |
| `FROM_EMAIL` | Recommended: `no-reply@vidafamilia.es` after sender/domain verification |
| `ADMIN_NOTIFICATION_EMAILS` | `albertosaeedi@gmail.com,saeediamirahmad8849@gmail.com,sharif.saeedi0709@gmail.com` |
| `ADMIN_API_TOKEN` | Manual token for `/dashboard` and `/api/admin/*` |
| `TURNSTILE_SECRET_KEY` | Optional; when present, public submits require Siteverify |
| `SMS_CONFIRMATIONS_ENABLED` | `false` by default |
| `SMS_PROVIDER` | `disabled`, `twilio`, or `whatsapp` |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` | Optional future Twilio SMS setup |
| `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` | Optional future WhatsApp Cloud API setup |

Set secrets interactively; do not echo them into terminal history:

```bash
pnpm exec wrangler secret put RESEND_API_KEY -c wrangler.worker.toml
pnpm exec wrangler secret put ADMIN_API_TOKEN -c wrangler.worker.toml
pnpm exec wrangler secret put TURNSTILE_SECRET_KEY -c wrangler.worker.toml
```

Non-secret Worker vars can be entered in the Cloudflare dashboard. Preview values should point to the deployed `workers.dev` API and current Pages preview URL. Turnstile and SMS are optional and are not required by the MVP.

Recommended future email aliases: `info@vidafamilia.es`, `apply@vidafamilia.es`, `spain@vidafamilia.es`, and `argentina@vidafamilia.es`. Cloudflare Email Routing can forward those aliases to Gmail inboxes, but the owner must configure that in the Cloudflare dashboard.

Resend setup is required for real email delivery:

1. Create or verify a Resend account.
2. Verify the sending domain/sender for `vidafamilia.es`.
3. Set `FROM_EMAIL=no-reply@vidafamilia.es` only after verification.
4. Add `RESEND_API_KEY` as a Worker secret.
5. Test one real `/apply` submission and confirm both admin and applicant emails.

## Cloudflare Pages

Pages project `vida-familia-web` is connected to `albeen-sknight/vida-familia` on branch `main`:

```text
Framework preset: React (Vite), Vite, or None
Root directory: (leave blank)
Build command: pnpm --filter @vida-familia/web build
Build output directory: apps/web/dist
```

Root `wrangler.toml` contains only the Pages project name, compatibility date, and output directory. The `_redirects` file provides the SPA fallback. `_headers` provides baseline browser security headers and immutable caching for versioned asset output. Attach `vidafamilia.es` and `www.vidafamilia.es` only after Cloudflare shows the purchased zone as active.

## Worker deployment

Worker `vida-familia-api` has already been deployed with D1 binding `env.DB → vida-familia-db`.

Current temporary Worker URL:

```text
https://vida-familia-api.natsu-dragneel13576.workers.dev
```

Current deployed Worker version ID:

```text
bdd5c15e-00c9-4abf-ab7d-c84a217f26c1
```

For future Worker deployments:

```bash
pnpm exec wrangler login
pnpm exec wrangler whoami
pnpm deploy:worker:dry
pnpm deploy:worker
```

Test the temporary Worker URL first, then attach `api.vidafamilia.es` under the Worker's Domains & Routes settings after the Cloudflare zone is Active.

Useful local API tests after `pnpm dev:worker` and `pnpm db:migrate:local`:

```bash
curl http://localhost:8787/api/health
curl -X POST http://localhost:8787/api/leads -H "Content-Type: application/json" --data "{\"locale\":\"en\",\"full_name\":\"Test Lead\",\"email\":\"lead@example.com\",\"whatsapp\":\"+34600000000\",\"current_country\":\"Iran\",\"target_country\":\"Spain\",\"desired_path\":\"Student\",\"family_size\":\"2\",\"budget_range\":\"50000 EUR\",\"income_range\":\"remote income\",\"timeline\":\"6 months\",\"documents_ready\":\"partial\",\"main_concern\":\"I want to understand the student route and first steps for my family.\",\"message\":\"This is a local smoke test.\",\"consent\":true}"
curl -X POST http://localhost:8787/api/contact -H "Content-Type: application/json" --data "{\"locale\":\"en\",\"full_name\":\"Test User\",\"email\":\"test@example.com\",\"topic\":\"General\",\"message\":\"I have a general question about Spain.\",\"consent\":true}"
curl -X POST http://localhost:8787/api/quiz/pathway -H "Content-Type: application/json" --data "{\"locale\":\"en\",\"target_country_preference\":\"Spain\",\"goal\":\"study\",\"budget_range\":\"50000 EUR\",\"income_range\":\"remote income\",\"timeline\":\"6 months\",\"documents_ready\":\"partial\"}"
curl -X POST http://localhost:8787/api/newsletter -H "Content-Type: application/json" --data "{\"locale\":\"en\",\"email\":\"test-news@example.com\",\"interest\":\"Spain\",\"source\":\"local\",\"consent\":true}"
curl -X POST http://localhost:8787/api/guides/unlock -H "Content-Type: application/json" --data "{\"locale\":\"en\",\"guide_slug\":\"spain-student-checklist\",\"email\":\"guide@example.com\",\"interest\":\"student visa\",\"consent\":true}"
curl http://localhost:8787/api/admin/stats
curl http://localhost:8787/api/admin/stats -H "Authorization: Bearer YOUR_LOCAL_ADMIN_TOKEN"
```

## Domain-ready status

Prepared in code:

- All production URLs, canonical metadata, social metadata, JSON-LD, sitemap, and robots rules
- Worker route/CORS plan for the production site and WWW alias
- Separate Pages-only and Worker/D1 Wrangler configs
- Pages project/build settings
- D1 migrations and seed data
- Environment examples without secrets
- Custom-domain and DNS handoff documentation

Requires owner action:

- Wait for Cloudflare activation
- Check Cloudflare Pages deployment for latest `origin/main`
- Attach `api.vidafamilia.es` to Worker `vida-familia-api`
- Attach `vidafamilia.es` and `www.vidafamilia.es` to Pages project `vida-familia-web`
- Configure Resend sender/domain and Worker email/admin secrets
- Set/confirm Pages production variables and wait for the newest Git deployment
- Submit a production test lead and verify its D1 row

See [PROJECT_CONFIG_FOR_OWNER.md](./PROJECT_CONFIG_FOR_OWNER.md) and [CLOUDFLARE_DEPLOYMENT_CHECKLIST.md](./CLOUDFLARE_DEPLOYMENT_CHECKLIST.md) for exact owner steps.

## Legal note

The included legal pages are production-oriented launch drafts, not legal advice. Before public launch, the owner should have a qualified professional confirm the legal identity/contact details, privacy retention period, cookie/analytics choices, and any jurisdiction-specific terms. The product never promises visa, residency, admission, work, or citizenship outcomes.

## Troubleshooting

- **Missing images:** confirm the three PNG files exist in `apps/web/public/assets/` with exact lowercase names.
- **Pages route returns 404:** confirm `apps/web/public/_redirects` reached `dist/_redirects`; it must contain `/* /index.html 200`.
- **D1 database ID error:** confirm `wrangler.worker.toml` contains production database ID `8efefb70-f96c-4fc6-b525-2b0300528b2a` and account `ca7869ce6645cfb64973a55c625e1419`.
- **Pages rejects Worker fields:** confirm root `wrangler.toml` is Pages-only; Worker fields belong only in `wrangler.worker.toml`.
- **CORS error:** ensure the browser origin is in `ALLOWED_ORIGINS`; do not use a trailing slash in an origin.
- **Lead submission fails locally:** run the Worker, apply local migrations, and confirm `VITE_API_BASE_URL=http://localhost:8787` in an untracked local env override if needed.
- **Pages calls localhost:** set the production `VITE_API_BASE_URL` in Pages and trigger a new deployment; Vite values are compiled at build time.
- **Wrangler authentication error:** run `pnpm exec wrangler login`, then `pnpm exec wrangler whoami` and confirm account `ca7869ce6645cfb64973a55c625e1419`.
