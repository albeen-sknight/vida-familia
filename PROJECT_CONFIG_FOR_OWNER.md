# Project configuration for the owner

Last updated: 24 June 2026

## Current status

| Item | Status |
|---|---|
| `vidafamilia.es` purchase | **Purchased at GoDaddy** |
| GoDaddy nameservers | **Completed** — changed to Cloudflare |
| Cloudflare zone | Activation/propagation may still be pending; wait for **Active** |
| Cloudflare nameservers at GoDaddy | `hayes.ns.cloudflare.com`, `novalee.ns.cloudflare.com` |
| GitHub / Pages connection | **Completed** — `albeen-sknight/vida-familia`, branch `main` |
| D1 database | **Requires owner action** |
| Pages/Worker custom domains | **Requires owner action after deployment** |

Do not interpret “purchased and delegated” as “live.” Cloudflare activation and custom domains can still be pending.

## Fixed project values

- GitHub repository: <https://github.com/albeen-sknight/vida-familia>
- Cloudflare dashboard: <https://dash.cloudflare.com/ca7869ce6645cfb64973a55c625e1419/workers-and-pages>
- Cloudflare account ID: `ca7869ce6645cfb64973a55c625e1419`
- Pages project: `vida-familia-web`
- Worker: `vida-familia-api`
- D1 database: `vida-familia-db`
- D1 binding: `DB`
- Production frontend: `https://vidafamilia.es`
- WWW alias: `https://www.vidafamilia.es`
- Production API: `https://api.vidafamilia.es`
- Local frontend: `http://localhost:5173`
- Local API: `http://localhost:8787`

The account ID is not a secret and is included in `wrangler.worker.toml` to target the intended Worker account. No Cloudflare email address is stored anywhere in the repository.

Config ownership is strict: root `wrangler.toml` is for Pages only; root `wrangler.worker.toml` is for the Worker API and D1 only.

## Prepared in code

- [x] Production URL fallbacks and environment examples
- [x] Canonical, Open Graph, Twitter card, Organization JSON-LD, and Service JSON-LD URLs
- [x] `sitemap.xml` and `robots.txt` for `vidafamilia.es`
- [x] Public Worker endpoints and restricted temporary admin endpoint
- [x] CORS for local, apex, and WWW origins
- [x] D1 schema, indexes, constraints, and seed catalog
- [x] Cloudflare Pages SPA fallback and security headers
- [x] Pages, Worker, D1, DNS, and test instructions

## Values the owner must set

### D1 database ID

Current placeholder in `wrangler.worker.toml`:

```text
REPLACE_WITH_REAL_D1_DATABASE_ID_AFTER_RUNNING_WRANGLER_D1_CREATE
```

Create D1 and replace only that value. Do not invent an ID.

### Cloudflare Pages production variables

| Variable name | Value |
|---|---|
| `PUBLIC_SITE_URL` | `https://vidafamilia.es` |
| `VITE_API_BASE_URL` | `https://api.vidafamilia.es` |
| `VITE_SITE_URL` | `https://vidafamilia.es` |
| `VITE_TURNSTILE_SITE_KEY` | Empty for MVP |

The Cloudflare variable name is `VITE_TURNSTILE_SITE_KEY`. Do not put `=` in the variable name; an empty value is okay.

Preview variables:

```text
VITE_API_BASE_URL=https://vida-familia-api.YOUR_WORKERS_SUBDOMAIN.workers.dev
VITE_SITE_URL=https://YOUR_PAGES_PREVIEW_URL
```

### Worker values/secrets

The Worker has safe built-in defaults for `PUBLIC_SITE_URL`/allowed public origins and supports local overrides through untracked variables. Set `ADMIN_API_TOKEN` as a Cloudflare secret only if using the temporary admin endpoint. `ADMIN_EMAIL`, `LEADS_NOTIFICATION_EMAIL`, and `TURNSTILE_SECRET_KEY` are placeholders for later features and are not required by the MVP.

Never put actual secret values in `.env.example`, `.dev.vars.example`, source code, documentation, `wrangler.toml`, or `wrangler.worker.toml`.

## Domain plan

- `vidafamilia.es` → Cloudflare Pages project `vida-familia-web`
- `www.vidafamilia.es` → same Pages project, optionally redirected to the apex
- `api.vidafamilia.es` → Cloudflare Worker `vida-familia-api`

### GoDaddy (completed)

The nameservers have already been replaced with:

- `hayes.ns.cloudflare.com`
- `novalee.ns.cloudflare.com`

No further nameserver edit is needed unless Cloudflare explicitly changes the assigned pair. Wait for propagation/activation.

### Owner action: Cloudflare

1. Wait for Cloudflare to show the delegated zone as **Active**.
2. Create D1, insert its ID in `wrangler.worker.toml`, and apply migrations.
3. Deploy `vida-familia-api`; attach `api.vidafamilia.es` under Domains & Routes.
4. In the connected Pages project, confirm production variables and wait for the newest `main` deployment.
5. Attach `vidafamilia.es` and `www.vidafamilia.es` to Pages.
6. If both hostnames should not serve duplicate pages, create a Cloudflare Redirect Rule from `www.vidafamilia.es/*` to `https://vidafamilia.es/${1}` while preserving path and query.

## GitHub and Pages settings

```text
Repository: albeen-sknight/vida-familia
Production branch: main
Framework preset: React (Vite), Vite, or None
Root directory: leave blank
Build command: pnpm --filter @vida-familia/web build
Build output: apps/web/dist
```

GitHub-to-Cloudflare authorization and repository selection are already complete for this Pages project.

Root `wrangler.toml` is Pages-only. Worker deployment and D1 commands always use `wrangler.worker.toml` through the provided pnpm scripts.

## Before public launch

- Add the final public contact email and business/legal identity without exposing a private Cloudflare login email.
- Have the privacy/terms/legal launch drafts reviewed for the operating legal entity and applicable jurisdictions.
- Decide analytics/cookie behavior before adding any non-essential tracking.
- Set an operational lead-retention/deletion policy.
- Replace the temporary bearer-token admin route with a real authenticated admin product before broader staff use.
