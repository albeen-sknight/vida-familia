# Project configuration for the owner

Last updated: 25 June 2026

## Current status

| Item | Status |
|---|---|
| `vidafamilia.es` purchase | **Purchased at GoDaddy** |
| GoDaddy registration | **May still be processing** — GoDaddy showed “¡vidafamilia.es es tuyo!” and “Registro del dominio en curso.” |
| Cloudflare zone | **Pending owner action** — add `vidafamilia.es` to Cloudflare if it is not already present |
| GoDaddy nameservers | **Pending owner action** — replace GoDaddy nameservers with the nameservers Cloudflare assigns for this zone |
| Cloudflare activation | **Pending** until nameservers propagate and Cloudflare marks the zone Active |
| Pages/Worker custom domains | **Pending** until deployment and Cloudflare activation |
| GitHub repository | `https://github.com/albeen-sknight/vida-familia` |
| D1 database | **Pending owner action** — create `vida-familia-db`, then paste its real `database_id` into `wrangler.worker.toml` |

Do not treat “domain purchased” as “site live.” The site becomes live only after Cloudflare activation, Worker/Pages deployment, and custom-domain attachment.

## Fixed project values

- Primary site: `https://vidafamilia.es`
- WWW site: `https://www.vidafamilia.es`
- API: `https://api.vidafamilia.es`
- Cloudflare account ID: `ca7869ce6645cfb64973a55c625e1419`
- Cloudflare Pages project: `vida-familia-web`
- Cloudflare Worker: `vida-familia-api`
- Cloudflare D1 database: `vida-familia-db`
- D1 binding: `DB`
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
- Environment examples prepared without secrets: `.env.example` and `.dev.vars.example`.
- Resend email integration prepared, but inactive until real secrets are set.
- Optional Turnstile integration prepared, but inactive until real site/secret keys are set.
- Optional SMS/WhatsApp provider abstraction prepared, disabled by default.
- Lightweight token-gated admin dashboard scaffold prepared at `/dashboard`.

## Still requires owner action

1. Wait for GoDaddy registration to complete if the domain is still processing.
2. Add `vidafamilia.es` to Cloudflare under account `ca7869ce6645cfb64973a55c625e1419`.
3. Copy the exact Cloudflare nameservers assigned to `vidafamilia.es`.
4. Replace the GoDaddy nameservers with those Cloudflare nameservers.
5. Wait for Cloudflare to mark the zone **Active**.
6. Create D1 database `vida-familia-db`.
7. Paste the real D1 `database_id` into `wrangler.worker.toml`; do not invent one.
8. Set Cloudflare Pages production environment variables.
9. Set Worker secrets/vars for Resend/admin notifications.
10. Apply production D1 migrations.
11. Deploy Worker `vida-familia-api`.
12. Attach `api.vidafamilia.es` to the Worker.
13. Create/connect Cloudflare Pages project `vida-familia-web` if not already connected.
14. Attach `vidafamilia.es` and `www.vidafamilia.es` to Pages.
15. Submit a real production test lead and verify the row in D1.

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

## Owner launch command sequence

After Cloudflare is active and the real D1 ID is in `wrangler.worker.toml`:

```bash
pnpm install
pnpm typecheck
pnpm build
pnpm db:migrate:prod
pnpm deploy:worker
```

Then attach:

- `api.vidafamilia.es` to Worker `vida-familia-api`.
- `vidafamilia.es` to Pages project `vida-familia-web`.
- `www.vidafamilia.es` to Pages project `vida-familia-web`.

Finally, submit a production test lead and verify D1.
