# Project configuration for the owner

Last updated: 25 June 2026

## Current status

| Item | Status |
|---|---|
| `vidafamilia.es` purchase | **Purchased at GoDaddy** |
| GoDaddy nameservers | **Set to Cloudflare** — `hayes.ns.cloudflare.com`, `novalee.ns.cloudflare.com` |
| Cloudflare activation | **May still be propagating** — do not assume live until Cloudflare shows **Active** |
| GitHub repository | **Pushed to origin/main** — latest D1 config commit `551cea4 Configure production D1 database` |
| D1 database | **Created and migrated** — `vida-familia-db`, region `WEUR`, ID `8efefb70-f96c-4fc6-b525-2b0300528b2a` |
| Worker deployment | **Deployed** — `vida-familia-api`, version `bdd5c15e-00c9-4abf-ab7d-c84a217f26c1` |
| Worker temporary URL | `https://vida-familia-api.natsu-dragneel13576.workers.dev` |
| Pages deployment | **Needs check** — project `vida-familia-web`, temporary URL `https://vida-familia-web.pages.dev` |
| Pages/Worker custom domains | **Pending** until Cloudflare activation |
| Resend/email secrets | **Pending owner action** |

Do not treat “domain purchased” or “Worker deployed” as “site live.” The public site becomes live only after Cloudflare activation, latest Pages deployment, and custom-domain attachment.

## Fixed project values

- Primary site: `https://vidafamilia.es`
- WWW site: `https://www.vidafamilia.es`
- API: `https://api.vidafamilia.es`
- Cloudflare account ID: `ca7869ce6645cfb64973a55c625e1419`
- Cloudflare Pages project: `vida-familia-web`
- Cloudflare Worker: `vida-familia-api`
- Cloudflare D1 database: `vida-familia-db`
- D1 database ID: `8efefb70-f96c-4fc6-b525-2b0300528b2a`
- D1 database region: `WEUR`
- D1 binding: `DB`
- Worker temporary URL: `https://vida-familia-api.natsu-dragneel13576.workers.dev`
- Worker version ID: `bdd5c15e-00c9-4abf-ab7d-c84a217f26c1`
- Pages temporary URL: `https://vida-familia-web.pages.dev`
- GitHub repository: `https://github.com/albeen-sknight/vida-familia`
- Local frontend: `http://localhost:5173`
- Local Worker API: `http://localhost:8787`

Config ownership is intentionally split:

- `wrangler.toml` is Pages-only.
- `wrangler.worker.toml` is Worker/D1-only.
- Worker and D1 commands must use `-c wrangler.worker.toml` or the provided pnpm scripts.

## Prepared in code

- Production URLs prepared for `vidafamilia.es`, `www.vidafamilia.es`, and `api.vidafamilia.es`.
- SEO/canonical/Open Graph/Twitter/JSON-LD URLs prepared for `https://vidafamilia.es`.
- Worker API route and CORS allowlist prepared for `api.vidafamilia.es`.
- Cloudflare Pages project settings documented.
- D1 migrations prepared, including lead automation, contact messages, consultation requests, newsletter, quiz, guide unlock, timeline, and analytics tables.
- Production D1 database created and configured in `wrangler.worker.toml`.
- Production D1 migrations applied successfully: `0001_initial_schema.sql`, `0002_seed_catalog.sql`, and `0003_lead_automation_platform.sql`.
- Worker `vida-familia-api` deployed successfully with D1 binding `env.DB → vida-familia-db`.
- Environment examples prepared without secrets: `.env.example` and `.dev.vars.example`.
- Resend email integration prepared, but inactive until real secrets are set.
- Optional Turnstile integration prepared, but inactive until real site/secret keys are set.
- Optional SMS/WhatsApp provider abstraction prepared, disabled by default.
- Lightweight token-gated admin dashboard scaffold prepared at `/dashboard`.

## Still requires owner action

1. Wait for Cloudflare to mark `vidafamilia.es` **Active** if activation is still propagating.
2. Check Cloudflare Pages project `vida-familia-web` and make sure the latest `origin/main` deployment succeeds.
3. Set Cloudflare Pages production environment variables.
4. Attach `api.vidafamilia.es` to Worker `vida-familia-api` after the zone is Active.
5. Attach `vidafamilia.es` and `www.vidafamilia.es` to Pages after the zone is Active.
6. Configure Resend and Worker email/admin secrets.
7. Test Worker health at `https://vida-familia-api.natsu-dragneel13576.workers.dev/api/health`.
8. Submit a real production test lead after Pages/API are connected.
9. Verify the lead row exists in production D1.
10. Verify admin/applicant confirmation emails after Resend secrets are configured.

## Cloudflare Pages production variables

| Variable | Production value |
|---|---|
| `PUBLIC_SITE_URL` | `https://vidafamilia.es` |
| `VITE_SITE_URL` | `https://vidafamilia.es` |
| `VITE_API_BASE_URL` | `https://api.vidafamilia.es` |
| `VITE_TURNSTILE_SITE_KEY` | Optional Turnstile site key; leave empty until configured |
| `VITE_PUBLIC_WHATSAPP_NUMBER` | Optional public business WhatsApp number |

Do not put `=` in the Cloudflare variable name. The variable name is `VITE_TURNSTILE_SITE_KEY`, and the value may be empty.

## Worker vars and secrets

Use Cloudflare Worker secrets for real sensitive values. Do not commit real `.env`, `.dev.vars`, API keys, private tokens, or provider credentials.

Recommended production values:

| Name | Value / notes |
|---|---|
| `PUBLIC_SITE_URL` | `https://vidafamilia.es` |
| `ALLOWED_ORIGINS` | `https://vidafamilia.es,https://www.vidafamilia.es` |
| `ADMIN_NOTIFICATION_EMAILS` | `albertosaeedi@gmail.com,saeediamirahmad8849@gmail.com,sharif.saeedi0709@gmail.com` |
| `FROM_EMAIL` | `no-reply@vidafamilia.es` after Resend sender/domain verification |
| `RESEND_API_KEY` | Real Resend API key, set as a Worker secret |
| `ADMIN_API_TOKEN` | Real admin token, set as a Worker secret |
| `TURNSTILE_SECRET_KEY` | Optional Turnstile secret key, set as a Worker secret |
| `SMS_CONFIRMATIONS_ENABLED` | `false` for MVP |
| `SMS_PROVIDER` | `disabled` for MVP; future values: `twilio` or `whatsapp` |

Set secrets interactively:

```bash
pnpm exec wrangler secret put RESEND_API_KEY -c wrangler.worker.toml
pnpm exec wrangler secret put ADMIN_API_TOKEN -c wrangler.worker.toml
pnpm exec wrangler secret put TURNSTILE_SECRET_KEY -c wrangler.worker.toml
```

## Resend setup

1. Create or verify the owner’s Resend account.
2. Verify `vidafamilia.es` as a sending domain or verify an approved sender address.
3. Use `FROM_EMAIL=no-reply@vidafamilia.es` only after sender/domain verification succeeds.
4. Add `RESEND_API_KEY` as a Worker secret.
5. Add `ADMIN_NOTIFICATION_EMAILS` as a Worker var/secret with the three owner-family recipients.

If D1 saves a lead but Resend fails, the Worker still returns success to the applicant and logs a safe provider failure.

## Future email aliases

The code does not configure Cloudflare Email Routing. The owner can later configure these aliases in the Cloudflare dashboard and forward them to Gmail inboxes:

- `info@vidafamilia.es`
- `apply@vidafamilia.es`
- `spain@vidafamilia.es`
- `argentina@vidafamilia.es`

## Turnstile and SMS

Turnstile is optional. When `VITE_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` are both configured, public submit forms render/verify Turnstile. When not configured, local development and MVP submissions continue without blocking.

SMS/WhatsApp provider logic is prepared but disabled by default. Do not enable it until real Twilio or WhatsApp Cloud API credentials exist and the owner has decided the operational message policy.

## Owner launch sequence from current state

D1 creation, production migrations, and Worker deployment are already complete. From here:

- `api.vidafamilia.es` to Worker `vida-familia-api`.
- `vidafamilia.es` to Pages project `vida-familia-web`.
- `www.vidafamilia.es` to Pages project `vida-familia-web`.

Before custom-domain attachment, use `https://vida-familia-api.natsu-dragneel13576.workers.dev` for API testing and `https://vida-familia-web.pages.dev` for Pages testing.

Finally, submit a production test lead, verify D1, and verify emails after Resend is configured.
