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
- [x] Latest D1 configuration commit pushed to `origin/main`: `551cea4 Configure production D1 database`

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
- [x] GoDaddy nameservers are set to Cloudflare: `hayes.ns.cloudflare.com`, `novalee.ns.cloudflare.com`
- [ ] Wait for public DNS/Cloudflare activation to finish if still propagating
- [ ] Do not attach production domains until Cloudflare activation is complete

## Phase 3 — Cloudflare activation

Current state:

- [x] Cloudflare nameservers are known and set at GoDaddy
- [ ] Return to Cloudflare and wait until `vidafamilia.es` is **Active**
- [ ] Do not attach `vidafamilia.es`, `www.vidafamilia.es`, or `api.vidafamilia.es` before the zone is Active

## Phase 4 — D1 production database

Completed:

- [x] D1 database created: `vida-familia-db`
- [x] D1 region: `WEUR`
- [x] Real database ID configured in `wrangler.worker.toml`: `8efefb70-f96c-4fc6-b525-2b0300528b2a`
- [x] Binding remains `DB`
- [x] Worker binding confirmed as `env.DB (vida-familia-db)`

Production migrations were run successfully:

- [x] `0001_initial_schema.sql`
- [x] `0002_seed_catalog.sql`
- [x] `0003_lead_automation_platform.sql`

## Phase 5 — Configure Worker secrets/vars

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

Resend is not configured yet. Email notifications will not send until `RESEND_API_KEY`, `FROM_EMAIL`, `ADMIN_NOTIFICATION_EMAILS`, and `ADMIN_API_TOKEN` are configured. Missing email config should not prevent D1 saves where the Worker is designed to return success after persistence.

## Phase 6 — Worker deployment and API domain

Completed:

- [x] `pnpm deploy:worker` ran successfully
- [x] Worker deployed: `vida-familia-api`
- [x] Worker temporary URL: `https://vida-familia-api.natsu-dragneel13576.workers.dev`
- [x] Current Worker version ID: `bdd5c15e-00c9-4abf-ab7d-c84a217f26c1`
- [x] Worker upload succeeded
- [x] Worker has D1 binding `env.DB → vida-familia-db`

Still to do after Cloudflare zone is Active:

- [ ] Test `https://vida-familia-api.natsu-dragneel13576.workers.dev/api/health`
- [ ] Add custom domain `api.vidafamilia.es`
- [ ] Wait for certificate/route activation
- [ ] Test `https://api.vidafamilia.es/api/health`

## Phase 7 — Configure Cloudflare Pages

Check or confirm Pages project:

```text
Project name: vida-familia-web
Repository: albeen-sknight/vida-familia
Temporary URL: https://vida-familia-web.pages.dev
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
- [ ] Attach `vidafamilia.es` after Cloudflare zone is Active
- [ ] Attach `www.vidafamilia.es` after Cloudflare zone is Active
- [ ] Optionally redirect WWW to apex with a Cloudflare Redirect Rule

## Phase 8 — Production tests

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
- [ ] `https://vida-familia-api.natsu-dragneel13576.workers.dev/api/health` until API custom domain is attached

Submit test data:

- [ ] One `/apply` lead with obvious test name/email
- [ ] One `/contact` message
- [ ] One newsletter subscription
- [ ] One guide unlock
- [ ] One pathway quiz
- [ ] Confirm admin/applicant emails arrive after Resend is configured
- [ ] Confirm applicant confirmation email arrives after Resend is configured
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
