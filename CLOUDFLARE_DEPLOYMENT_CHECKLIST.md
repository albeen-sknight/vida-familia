# Cloudflare deployment checklist

Use the owner account at <https://dash.cloudflare.com/ca7869ce6645cfb64973a55c625e1419/workers-and-pages>. The domain is purchased and GoDaddy now delegates to Cloudflare; zone activation may still be propagating.

## Phase 1 — Repository readiness (prepared in code)

- [x] Monorepo, frontend, Worker, and shared package prepared
- [x] Production URLs set to `vidafamilia.es`, `www.vidafamilia.es`, and `api.vidafamilia.es`
- [x] SEO/canonical/social/JSON-LD URLs prepared
- [x] D1 migrations and seed catalog prepared
- [x] Environment examples prepared without secrets
- [x] Pages build and SPA routing prepared
- [x] Root `wrangler.toml` is Pages-only
- [x] `wrangler.worker.toml` contains Worker API + D1 configuration
- [x] Pages is connected to `albeen-sknight/vida-familia` on `main`
- [ ] Confirm the newest config-split commit reaches `main`

Local preflight:

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm db:migrate:local
```

## Phase 2 — GoDaddy and nameservers (completed)

- [x] `vidafamilia.es` was purchased from GoDaddy
- [x] GoDaddy nameservers were changed to `hayes.ns.cloudflare.com` and `novalee.ns.cloudflare.com`
- [ ] Wait for DNS propagation/Cloudflare activation if the zone is not yet active

## Phase 3 — Cloudflare domain activation (owner action)

1. Return to the `vidafamilia.es` zone in Cloudflare.
2. Confirm the assigned nameservers still match `hayes.ns.cloudflare.com` and `novalee.ns.cloudflare.com`.
3. Wait until the zone status is **Active**.
4. Do not attach production custom domains before Cloudflare recognizes the zone.

## Phase 4 — D1 (owner action)

```bash
pnpm exec wrangler login
pnpm exec wrangler whoami
```

- [ ] Confirm account ID is `ca7869ce6645cfb64973a55c625e1419`

```bash
pnpm exec wrangler d1 create vida-familia-db -c wrangler.worker.toml
```

- [ ] Copy the returned `database_id`
- [ ] Replace `REPLACE_WITH_REAL_D1_DATABASE_ID_AFTER_RUNNING_WRANGLER_D1_CREATE` in `wrangler.worker.toml`
- [ ] Do not change binding `DB` or database name `vida-familia-db`

```bash
pnpm db:migrate:local
pnpm exec wrangler d1 migrations list vida-familia-db --remote -c wrangler.worker.toml
pnpm db:migrate:prod
```

- [ ] Confirm migrations `0001_initial_schema.sql` and `0002_seed_catalog.sql` applied remotely

Both `pnpm db:migrate:local` and `pnpm db:migrate:prod` select `wrangler.worker.toml` automatically.

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

`pnpm deploy:worker` and `pnpm deploy:worker:dry` select `wrangler.worker.toml` automatically.

## Phase 6 — Cloudflare Pages (owner action)

1. Open the existing Pages project `vida-familia-web`, already connected to `albeen-sknight/vida-familia`.
2. Confirm production branch `main`.
3. Confirm build configuration:

```text
Framework preset: React (Vite), Vite, or None
Root directory: leave blank
Build command: pnpm --filter @vida-familia/web build
Build output directory: apps/web/dist
```

4. Confirm production environment variables:

| Variable name | Value |
|---|---|
| `PUBLIC_SITE_URL` | `https://vidafamilia.es` |
| `VITE_API_BASE_URL` | `https://api.vidafamilia.es` |
| `VITE_SITE_URL` | `https://vidafamilia.es` |
| `VITE_TURNSTILE_SITE_KEY` | Empty for MVP |

The variable name is exactly `VITE_TURNSTILE_SITE_KEY`; do not include `=` in the name. An empty value is okay.

5. After the config-split commit is pushed, wait for a **new deployment from that latest commit**. Do not retry an old failed deployment.
6. Test the generated `pages.dev` URL first.
7. After the zone is Active, attach `vidafamilia.es` and `www.vidafamilia.es`.
8. Optionally create a Redirect Rule to make WWW redirect permanently to the apex while preserving path/query.

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
pnpm exec wrangler d1 execute vida-familia-db --remote --command "SELECT id, created_at, email, target_country, status FROM leads ORDER BY created_at DESC LIMIT 5" -c wrangler.worker.toml
```

- [ ] Remove/archive the test lead according to the launch data policy
- [ ] Check browser console, mobile navigation, FA RTL, EN/ES LTR, legal links, favicon, sitemap, and robots
- [ ] Confirm no private email, `.env`, `.dev.vars`, token, or secret is in Git history
