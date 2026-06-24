# Project configuration for the owner

Last updated: 24 June 2026

## Current status

| Item | Status |
|---|---|
| `vidafamilia.es` purchase | **Purchased at GoDaddy** |
| GoDaddy registration | May still show **“Registro del dominio en curso”**; wait for completion |
| Cloudflare zone | **Requires owner action** — not yet treated as active |
| Cloudflare nameservers at GoDaddy | **Requires owner action** |
| GitHub repository | Prepared: <https://github.com/albeen-sknight/vida-familia> |
| D1 database | **Requires owner action** |
| Pages/Worker custom domains | **Requires owner action after deployment** |

Do not interpret “purchased” as “live.” DNS and custom domains remain pending.

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

The account ID is not a secret and is included in `wrangler.toml` to target the intended account. No Cloudflare email address is stored anywhere in the repository.

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

Current placeholder in `wrangler.toml`:

```text
REPLACE_WITH_REAL_D1_DATABASE_ID_AFTER_RUNNING_WRANGLER_D1_CREATE
```

Create D1 and replace only that value. Do not invent an ID.

### Cloudflare Pages production variables

```text
VITE_API_BASE_URL=https://api.vidafamilia.es
VITE_SITE_URL=https://vidafamilia.es
PUBLIC_SITE_URL=https://vidafamilia.es
VITE_TURNSTILE_SITE_KEY=
```

Preview variables:

```text
VITE_API_BASE_URL=https://vida-familia-api.YOUR_WORKERS_SUBDOMAIN.workers.dev
VITE_SITE_URL=https://YOUR_PAGES_PREVIEW_URL
```

### Worker values/secrets

`PUBLIC_SITE_URL` and `ALLOWED_ORIGINS` are prepared in `wrangler.toml`. Set `ADMIN_API_TOKEN` as a Cloudflare secret only if using the temporary admin endpoint. `ADMIN_EMAIL`, `LEADS_NOTIFICATION_EMAIL`, and `TURNSTILE_SECRET_KEY` are placeholders for later features and are not required by the MVP.

Never put actual secret values in `.env.example`, `.dev.vars.example`, source code, documentation, or `wrangler.toml`.

## Domain plan

- `vidafamilia.es` → Cloudflare Pages project `vida-familia-web`
- `www.vidafamilia.es` → same Pages project, optionally redirected to the apex
- `api.vidafamilia.es` → Cloudflare Worker `vida-familia-api`

### Owner action: GoDaddy

1. Wait until the purchased `vidafamilia.es` registration is complete if it remains in progress.
2. Open GoDaddy Domain Portfolio and select `vidafamilia.es`.
3. Open DNS / Nameservers and choose the option to use custom nameservers.
4. Remove the GoDaddy nameservers.
5. Paste the **two exact nameservers Cloudflare assigns to this zone**.
6. Save and wait for propagation. Do not add guessed nameserver values.

### Owner action: Cloudflare

1. Add `vidafamilia.es` as a website using full DNS setup.
2. Copy the two assigned Cloudflare nameservers into GoDaddy as above.
3. Wait for Cloudflare to show the zone as **Active**.
4. Create D1, insert its ID in `wrangler.toml`, and apply migrations.
5. Deploy `vida-familia-api`; attach `api.vidafamilia.es` under Domains & Routes.
6. Connect `albeen-sknight/vida-familia` to Pages project `vida-familia-web`.
7. Set the production build variables and deploy.
8. Attach `vidafamilia.es` and `www.vidafamilia.es` to Pages.
9. If both hostnames should not serve duplicate pages, create a Cloudflare Redirect Rule from `www.vidafamilia.es/*` to `https://vidafamilia.es/${1}` while preserving path and query.

## GitHub and Pages settings

```text
Repository: albeen-sknight/vida-familia
Production branch: main
Framework preset: Vite
Root directory: leave blank
Build command: pnpm --filter @vida-familia/web build
Build output: apps/web/dist
```

GitHub-to-Cloudflare authorization and repository selection are owner-side actions.

## Before public launch

- Add the final public contact email and business/legal identity without exposing a private Cloudflare login email.
- Have the privacy/terms/legal launch drafts reviewed for the operating legal entity and applicable jurisdictions.
- Decide analytics/cookie behavior before adding any non-essential tracking.
- Set an operational lead-retention/deletion policy.
- Replace the temporary bearer-token admin route with a real authenticated admin product before broader staff use.
