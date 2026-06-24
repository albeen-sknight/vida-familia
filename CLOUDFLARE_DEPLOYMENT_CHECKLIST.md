# Cloudflare deployment checklist

Use the owner account at <https://dash.cloudflare.com/ca7869ce6645cfb64973a55c625e1419/workers-and-pages>. The domain is purchased, but GoDaddy registration may still be processing and Cloudflare activation is pending.

## Phase 1 — Repository readiness (prepared in code)

- [x] Monorepo, frontend, Worker, and shared package prepared
- [x] Production URLs set to `vidafamilia.es`, `www.vidafamilia.es`, and `api.vidafamilia.es`
- [x] SEO/canonical/social/JSON-LD URLs prepared
- [x] D1 migrations and seed catalog prepared
- [x] Environment examples prepared without secrets
- [x] Pages build and SPA routing prepared
- [ ] Owner: confirm the latest commit is on `main` at <https://github.com/albeen-sknight/vida-familia>

Local preflight:

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm db:migrate:local
```

## Phase 2 — GoDaddy registration (purchased; completion may be pending)

- [x] `vidafamilia.es` was purchased from GoDaddy
- [ ] Wait until GoDaddy no longer shows “Registro del dominio en curso,” if still present
- [ ] Confirm the domain is visible and manageable in Domain Portfolio
- [ ] Do not keep GoDaddy DNS as the long-term authoritative DNS; Cloudflare nameservers will replace it

## Phase 3 — Cloudflare domain and nameservers (owner action)

1. In Cloudflare, go to **Websites → Add a domain/site**.
2. Enter `vidafamilia.es` and choose the standard/full DNS setup.
3. Review imported DNS records; no production app records are expected yet.
4. Cloudflare will show two assigned nameservers. Copy both exactly.
5. In GoDaddy: **Domain Portfolio → vidafamilia.es → DNS → Nameservers → Change nameservers**.
6. Choose custom/own nameservers, remove GoDaddy's, and paste the two Cloudflare values.
7. Save. DNS propagation may take time.
8. Return to Cloudflare and wait until the zone status is **Active**.

Do not create guessed nameserver values, and do not attach custom domains before Cloudflare recognizes the zone.

## Phase 4 — D1 (owner action)

```bash
pnpm exec wrangler login
pnpm exec wrangler whoami
```

- [ ] Confirm account ID is `ca7869ce6645cfb64973a55c625e1419`

```bash
pnpm exec wrangler d1 create vida-familia-db
```

- [ ] Copy the returned `database_id`
- [ ] Replace `REPLACE_WITH_REAL_D1_DATABASE_ID_AFTER_RUNNING_WRANGLER_D1_CREATE` in `wrangler.toml`
- [ ] Do not change binding `DB` or database name `vida-familia-db`

```bash
pnpm db:migrate:local
pnpm exec wrangler d1 migrations list vida-familia-db --remote
pnpm db:migrate:prod
```

- [ ] Confirm migrations `0001_initial_schema.sql` and `0002_seed_catalog.sql` applied remotely

## Phase 5 — Worker (owner action)

```bash
pnpm deploy:worker:dry
pnpm deploy:worker
```

- [ ] Copy the deployed `workers.dev` URL
- [ ] Test `https://vida-familia-api.YOUR_SUBDOMAIN.workers.dev/api/health`
- [ ] In **Workers & Pages → vida-familia-api → Settings → Domains & Routes**, add custom domain `api.vidafamilia.es`
- [ ] Wait for its certificate/route to become active
- [ ] Test <https://api.vidafamilia.es/api/health>
- [ ] Optional: set `ADMIN_API_TOKEN` as a Worker secret; never store it in Git

## Phase 6 — Cloudflare Pages (owner action)

1. Open **Workers & Pages → Create → Pages → Connect to Git**.
2. Authorize/select GitHub repository `albeen-sknight/vida-familia`.
3. Project name: `vida-familia-web`.
4. Production branch: `main`.
5. Configure:

```text
Framework preset: Vite
Root directory: leave blank
Build command: pnpm --filter @vida-familia/web build
Build output directory: apps/web/dist
```

6. Set production environment variables:

```text
VITE_API_BASE_URL=https://api.vidafamilia.es
VITE_SITE_URL=https://vidafamilia.es
PUBLIC_SITE_URL=https://vidafamilia.es
VITE_TURNSTILE_SITE_KEY=
```

7. Deploy and test the generated `pages.dev` URL first.
8. Under **Custom domains**, attach `vidafamilia.es`.
9. Attach `www.vidafamilia.es`.
10. Optionally create a Redirect Rule to make WWW redirect permanently to the apex while preserving path/query.

Preview variables should use the real Worker `workers.dev` URL and the preview Pages URL, not the production apex.

## Phase 7 — Final production tests

- [ ] <https://vidafamilia.es>
- [ ] <https://www.vidafamilia.es> (serves or redirects correctly)
- [ ] <https://vidafamilia.es/fa>
- [ ] <https://vidafamilia.es/en>
- [ ] <https://vidafamilia.es/es>
- [ ] <https://vidafamilia.es/about>
- [ ] <https://vidafamilia.es/services/spain/student-visa>
- [ ] <https://vidafamilia.es/services/argentina/student-residency>
- [ ] <https://vidafamilia.es/apply>
- [ ] <https://api.vidafamilia.es/api/health>
- [ ] Submit one clearly labeled production test lead with consent
- [ ] Verify it in D1:

```bash
pnpm exec wrangler d1 execute vida-familia-db --remote --command "SELECT id, created_at, email, target_country, status FROM leads ORDER BY created_at DESC LIMIT 5"
```

- [ ] Remove/archive the test lead according to the launch data policy
- [ ] Check browser console, mobile navigation, FA RTL, EN/ES LTR, legal links, favicon, sitemap, and robots
- [ ] Confirm no private email, `.env`, `.dev.vars`, token, or secret is in Git history
