# Vida Familia

Vida Familia is a Persian-first, family-led relocation, education, lifestyle, and advisory platform for Spain and Argentina. This repository contains a multilingual React site, a Cloudflare Worker lead API, a D1 schema, and the deployment handoff for `vidafamilia.es`.

The domain **has been purchased from GoDaddy**. GoDaddy may still show the registration as processing. The domain is not considered live until registration completes, Cloudflare activates the zone, nameservers are delegated, and the Pages/Worker custom domains are attached.

## Architecture

```text
apps/web       React 19 + Vite + TypeScript + Tailwind CSS
apps/worker    Cloudflare Worker API
packages/shared  Shared types and constants
migrations     Cloudflare D1 schema and seed catalog
```

Production plan:

- Site: `https://vidafamilia.es`
- WWW alias: `https://www.vidafamilia.es`
- API: `https://api.vidafamilia.es`
- GitHub: <https://github.com/albeen-sknight/vida-familia>
- Pages project: `vida-familia-web`
- Worker: `vida-familia-api`
- D1 database/binding: `vida-familia-db` / `DB`

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

For local Worker overrides, create an untracked `.dev.vars` from `.dev.vars.example`. Never commit the real file. The MVP needs no secrets for the public health/lead routes. `ADMIN_API_TOKEN` is required only for the temporary admin route.

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
| `pnpm dev:worker` | Run Wrangler on port 8787 |
| `pnpm typecheck` | Type-check all packages and generate Worker bindings |
| `pnpm build` | Build shared types, frontend, and Worker dry-run bundle |
| `pnpm lint` | Run strict TypeScript checks |
| `pnpm format` | Format source/docs with Prettier |
| `pnpm preview` | Preview the built frontend |
| `pnpm db:migrate:local` | Apply D1 migrations locally |
| `pnpm db:migrate:prod` | Apply migrations to remote D1 |
| `pnpm deploy:worker` | Deploy `vida-familia-api` |
| `pnpm deploy:worker:dry` | Validate the Worker bundle without deployment |

## Frontend

- `/` and `/fa` are Persian and RTL-first.
- `/en` and `/es` are LTR English and Spanish homepages.
- Every main page also works with a locale prefix, for example `/en/about`.
- Five detailed service routes include audience, meaning, scope, mistakes, timeline, documents, packages, FAQ, qualification, and legal disclaimers.
- `/apply` validates qualification data in the browser and submits to `${VITE_API_BASE_URL}/api/leads`.
- SEO metadata, Open Graph, Twitter cards, canonical URLs, Organization/Service JSON-LD, `robots.txt`, and `sitemap.xml` use `https://vidafamilia.es`.

Translations live in `apps/web/src/data/i18n.ts` and localized content in `apps/web/src/data/siteData.ts`. Add a key for `fa`, `en`, and `es` together. Add a service by extending `servicePages`, then seed the corresponding database record if it should be database-managed later.

The current resources UI is an editorial launch slate. Publishable resource records are prepared in D1 but a resource CMS/API is intentionally out of MVP scope.

## Worker API

### `GET /api/health`

Returns service health and an ISO timestamp. No D1 read is required.

### `POST /api/leads`

Accepts the shared `LeadPayload`, validates and normalizes it, enforces a 32 KiB body limit, checks consent, uses a honeypot, blocks rapid duplicate-email submissions, enforces the origin allowlist, and inserts with a prepared D1 statement. Database details are never returned to clients.

### `GET /api/admin/leads?limit=25&before=<ISO timestamp>`

Optional temporary admin endpoint. It returns `404` while `ADMIN_API_TOKEN` is unset and requires `Authorization: Bearer <token>` when enabled. Set the production token with the Cloudflare dashboard or the interactive command `pnpm exec wrangler secret put ADMIN_API_TOKEN`. Replace this route with real identity/auth before exposing an operational admin UI.

## D1

The migrations create `leads`, `services`, `packages`, and `resources`, all requested indexes, constraints, and a seed catalog.

Local:

```bash
pnpm db:migrate:local
```

Remote (after the owner creates D1 and replaces the placeholder ID in `wrangler.toml`):

```bash
pnpm exec wrangler d1 migrations list vida-familia-db --remote
pnpm db:migrate:prod
```

Inspect local leads:

```bash
pnpm exec wrangler d1 execute vida-familia-db --local --command "SELECT id, created_at, email, status FROM leads ORDER BY created_at DESC LIMIT 10"
```

## Environment values

Frontend builds read `VITE_*` values. Metadata uses `VITE_SITE_URL` with a production-safe fallback of `https://vidafamilia.es`; the API uses a local fallback of `http://localhost:8787`.

Cloudflare Pages production variables:

```text
VITE_API_BASE_URL=https://api.vidafamilia.es
VITE_SITE_URL=https://vidafamilia.es
PUBLIC_SITE_URL=https://vidafamilia.es
VITE_TURNSTILE_SITE_KEY=
```

Preview values should point to the deployed `workers.dev` API and current Pages preview URL. Turnstile is an optional prepared variable and is not required by the MVP.

## Cloudflare Pages

Create `vida-familia-web` and connect `albeen-sknight/vida-familia`:

```text
Framework preset: Vite
Root directory: (leave blank)
Build command: pnpm --filter @vida-familia/web build
Build output directory: apps/web/dist
```

The `_redirects` file provides the SPA fallback. `_headers` provides baseline browser security headers and immutable caching for versioned asset output. Attach `vidafamilia.es` and `www.vidafamilia.es` only after Cloudflare shows the purchased zone as active.

## Worker deployment

After the D1 ID is in `wrangler.toml` and migrations are applied:

```bash
pnpm exec wrangler login
pnpm exec wrangler whoami
pnpm deploy:worker:dry
pnpm deploy:worker
```

Test the returned `workers.dev` URL first, then attach `api.vidafamilia.es` under the Worker's Domains & Routes settings.

## Domain-ready status

Prepared in code:

- All production URLs, canonical metadata, social metadata, JSON-LD, sitemap, and robots rules
- Worker route/CORS plan for the production site and WWW alias
- Pages project/build settings
- D1 migrations and seed data
- Environment examples without secrets
- Custom-domain and DNS handoff documentation

Requires owner action:

- Wait for GoDaddy registration to finish if it still says “Registro del dominio en curso”
- Add `vidafamilia.es` to Cloudflare, copy its two assigned nameservers, and replace the GoDaddy nameservers
- Wait for Cloudflare to mark the zone active
- Create D1, paste its real ID, migrate, and deploy the Worker
- Connect GitHub to Pages and set production variables
- Attach apex, WWW, and API custom domains
- Submit a production test lead and verify its D1 row

See [PROJECT_CONFIG_FOR_OWNER.md](./PROJECT_CONFIG_FOR_OWNER.md) and [CLOUDFLARE_DEPLOYMENT_CHECKLIST.md](./CLOUDFLARE_DEPLOYMENT_CHECKLIST.md) for exact owner steps.

## Legal note

The included legal pages are production-oriented launch drafts, not legal advice. Before public launch, the owner should have a qualified professional confirm the legal identity/contact details, privacy retention period, cookie/analytics choices, and any jurisdiction-specific terms. The product never promises visa, residency, admission, work, or citizenship outcomes.

## Troubleshooting

- **Missing images:** confirm the three PNG files exist in `apps/web/public/assets/` with exact lowercase names.
- **Pages route returns 404:** confirm `apps/web/public/_redirects` reached `dist/_redirects`; it must contain `/* /index.html 200`.
- **D1 database ID error:** create `vida-familia-db`, replace the placeholder in `wrangler.toml`, and retry remote commands.
- **CORS error:** ensure the browser origin is in `ALLOWED_ORIGINS`; do not use a trailing slash in an origin.
- **Lead submission fails locally:** run the Worker, apply local migrations, and confirm `VITE_API_BASE_URL=http://localhost:8787` in an untracked local env override if needed.
- **Pages calls localhost:** set the production `VITE_API_BASE_URL` in Pages and trigger a new deployment; Vite values are compiled at build time.
- **Wrangler authentication error:** run `pnpm exec wrangler login`, then `pnpm exec wrangler whoami` and confirm account `ca7869ce6645cfb64973a55c625e1419`.
