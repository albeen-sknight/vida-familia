# Cloudflare deployment checklist

Target account: `ca7869ce6645cfb64973a55c625e1419`

Target URLs:

- Site: `https://vidafamilia.es`
- WWW: `https://www.vidafamilia.es`
- API: `https://api.vidafamilia.es`

## Phase 1 — Code readiness

- [x] Production URLs prepared for `vidafamilia.es`, `www.vidafamilia.es`, and `api.vidafamilia.es`
- [x] SEO/canonical/Open Graph/JSON-LD prepared for `https://vidafamilia.es`
- [x] Root `wrangler.toml` remains Pages-only
- [x] `wrangler.worker.toml` remains Worker/D1-only
- [x] Worker API prepared for public submit endpoints and admin endpoints
- [x] D1 migration files prepared, including lead automation and admin/business-intelligence tables
- [x] Environment examples prepared without real secrets
- [x] Resend, Turnstile, and disabled-by-default SMS/WhatsApp behavior documented
- [ ] Confirm this latest commit is pushed to `main`

Local preflight:

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm db:migrate:local
git diff --check
```

## Phase 2 — GoDaddy domain registration

- [x] `vidafamilia.es` has been purchased from GoDaddy
- [ ] Wait for GoDaddy registration to complete if it still shows “Registro del dominio en curso.”
- [ ] Do not attach production domains until Cloudflare activation is complete

## Phase 3 — Add domain to Cloudflare

Owner action:

1. Open Cloudflare dashboard for account `ca7869ce6645cfb64973a55c625e1419`.
2. Add site/zone `vidafamilia.es`.
3. Let Cloudflare scan DNS.
4. Copy the exact two Cloudflare nameservers assigned to the zone.
5. Keep those nameservers visible for the GoDaddy step.

## Phase 4 — Replace nameservers at GoDaddy

Owner action:

1. Open GoDaddy domain management for `vidafamilia.es`.
2. Replace GoDaddy/default nameservers with the exact two Cloudflare nameservers.
3. Save the change.
4. Wait for propagation.
5. Return to Cloudflare and wait until `vidafamilia.es` is **Active**.

## Phase 5 — Create D1

Owner action after Wrangler login:

```bash
pnpm exec wrangler login
pnpm exec wrangler whoami
pnpm exec wrangler d1 create vida-familia-db -c wrangler.worker.toml
```

- [ ] Confirm Wrangler is using account `ca7869ce6645cfb64973a55c625e1419`
- [ ] Copy the returned real `database_id`
- [ ] Replace `REPLACE_WITH_REAL_D1_DATABASE_ID_AFTER_RUNNING_WRANGLER_D1_CREATE` in `wrangler.worker.toml`
- [ ] Keep binding name `DB`
- [ ] Keep database name `vida-familia-db`

Apply migrations:

```bash
pnpm db:migrate:local
pnpm exec wrangler d1 migrations list vida-familia-db --remote -c wrangler.worker.toml
pnpm db:migrate:prod
```

Expected migrations include:

- `0001_initial_schema.sql`
- `0002_seed_catalog.sql`
- `0003_lead_automation_platform.sql`

## Phase 6 — Configure Worker secrets/vars

Required for email/admin production behavior:

```bash
pnpm exec wrangler secret put RESEND_API_KEY -c wrangler.worker.toml
pnpm exec wrangler secret put ADMIN_API_TOKEN -c wrangler.worker.toml
```

Set Worker vars/secrets:

| Name | Production value |
|---|---|
| `PUBLIC_SITE_URL` | `https://vidafamilia.es` |
| `ALLOWED_ORIGINS` | `https://vidafamilia.es,https://www.vidafamilia.es` |
| `FROM_EMAIL` | `no-reply@vidafamilia.es` after Resend verification |
| `ADMIN_NOTIFICATION_EMAILS` | `albertosaeedi@gmail.com,saeediamirahmad8849@gmail.com,sharif.saeedi0709@gmail.com` |
| `SMS_CONFIRMATIONS_ENABLED` | `false` |
| `SMS_PROVIDER` | `disabled` |

Optional later:

```bash
pnpm exec wrangler secret put TURNSTILE_SECRET_KEY -c wrangler.worker.toml
pnpm exec wrangler secret put TWILIO_ACCOUNT_SID -c wrangler.worker.toml
pnpm exec wrangler secret put TWILIO_AUTH_TOKEN -c wrangler.worker.toml
pnpm exec wrangler secret put WHATSAPP_TOKEN -c wrangler.worker.toml
```

Do not pass secret values directly on the command line.

## Phase 7 — Deploy Worker and attach API domain

```bash
pnpm deploy:worker:dry
pnpm deploy:worker
```

Then:

- [ ] Test `https://vida-familia-api.<your-workers-subdomain>.workers.dev/api/health`
- [ ] Open Worker `vida-familia-api`
- [ ] Add custom domain `api.vidafamilia.es`
- [ ] Wait for certificate/route activation
- [ ] Test `https://api.vidafamilia.es/api/health`

## Phase 8 — Configure Cloudflare Pages

Create or confirm Pages project:

```text
Project name: vida-familia-web
Repository: albeen-sknight/vida-familia
Production branch: main
Framework preset: React (Vite), Vite, or None
Root directory: leave blank
Build command: pnpm --filter @vida-familia/web build
Build output directory: apps/web/dist
```

Production environment variables:

| Variable | Value |
|---|---|
| `PUBLIC_SITE_URL` | `https://vidafamilia.es` |
| `VITE_SITE_URL` | `https://vidafamilia.es` |
| `VITE_API_BASE_URL` | `https://api.vidafamilia.es` |
| `VITE_TURNSTILE_SITE_KEY` | Optional; empty until Turnstile is configured |
| `VITE_PUBLIC_WHATSAPP_NUMBER` | Optional public business WhatsApp number |

Then:

- [ ] Trigger/wait for a fresh production deployment from latest `main`
- [ ] Test the `pages.dev` URL
- [ ] Attach `vidafamilia.es`
- [ ] Attach `www.vidafamilia.es`
- [ ] Optionally redirect WWW to apex with a Cloudflare Redirect Rule

## Phase 9 — Production tests

- [ ] `https://vidafamilia.es`
- [ ] `https://www.vidafamilia.es`
- [ ] `https://vidafamilia.es/fa`
- [ ] `https://vidafamilia.es/en`
- [ ] `https://vidafamilia.es/es`
- [ ] `https://vidafamilia.es/contact`
- [ ] `https://vidafamilia.es/apply`
- [ ] `https://vidafamilia.es/resources`
- [ ] `https://vidafamilia.es/dashboard` shows token gate only
- [ ] `https://api.vidafamilia.es/api/health`

Submit test data:

- [ ] One `/apply` lead with obvious test name/email
- [ ] One `/contact` message
- [ ] One newsletter subscription
- [ ] One guide unlock
- [ ] One pathway quiz
- [ ] Confirm admin/applicant emails arrive after Resend is configured
- [ ] Confirm SMS/WhatsApp is skipped while disabled

Verify D1:

```bash
pnpm exec wrangler d1 execute vida-familia-db --remote --command "SELECT reference_code, created_at, email, priority, status FROM leads ORDER BY created_at DESC LIMIT 5" -c wrangler.worker.toml
pnpm exec wrangler d1 execute vida-familia-db --remote --command "SELECT created_at, email, topic FROM contact_messages ORDER BY created_at DESC LIMIT 5" -c wrangler.worker.toml
pnpm exec wrangler d1 execute vida-familia-db --remote --command "SELECT created_at, email, guide_slug FROM guide_unlocks ORDER BY created_at DESC LIMIT 5" -c wrangler.worker.toml
```

Admin smoke tests:

```bash
curl https://api.vidafamilia.es/api/admin/stats
curl https://api.vidafamilia.es/api/admin/stats -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

The first request should return `401`. The second should return stats.
