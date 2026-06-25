# Launch audit

Audit date: 25 June 2026
Target: production/domain-ready Vida Familia platform MVP

## Executive status

The codebase is prepared for `vidafamilia.es`, `www.vidafamilia.es`, and `api.vidafamilia.es`. The domain `vidafamilia.es` has been purchased from GoDaddy, but GoDaddy registration may still be processing. Cloudflare activation is still pending and the owner still needs to add the domain to Cloudflare, replace GoDaddy nameservers with Cloudflare nameservers, create D1, set secrets, deploy, and attach custom domains.

## Prepared in code

| Area | Status | Evidence |
|---|---|---|
| Production URLs | Ready | Site, WWW, and API URLs are documented and used in env examples |
| SEO/canonical | Ready | Canonical/Open Graph/Twitter/JSON-LD target `https://vidafamilia.es` |
| Frontend app | Ready | Persian-first React/Vite site with EN/ES localized routes |
| Visual system | Ready | Cinematic Vida Familia visual system preserved; feature UI added without redesign reset |
| Apply form | Ready | D1-backed submit, reference code result, polished next-step UI, optional WhatsApp deep link |
| Contact form | Ready | D1-backed `/contact` form with consent, success/error, optional WhatsApp link |
| Pathway quiz | Ready | Homepage quiz submits to Worker and returns suggested routes/readiness |
| Resources | Ready | Guide unlock and newsletter capture forms |
| Turnstile frontend | Ready | Optional `VITE_TURNSTILE_SITE_KEY`; no local-dev blocking |
| Worker API | Ready | Public submit endpoints, admin endpoints, analytics endpoint |
| D1 migrations | Ready | `0001`, `0002`, and `0003_lead_automation_platform.sql` |
| Email behavior | Ready in code | Resend admin/applicant emails after D1 save; safe skip/failure logging without applicant-facing provider errors |
| SMS/WhatsApp | Prepared/off | Provider abstraction exists; disabled unless explicitly configured |
| Admin/stats | Ready in code | Bearer-token admin APIs plus lightweight `/dashboard` scaffold |
| Wrangler split | Ready | `wrangler.toml` Pages-only; `wrangler.worker.toml` Worker/D1-only |
| Env examples | Ready | Only `.env.example` and `.dev.vars.example`; no real secrets |

## Public submit endpoints

- `GET /api/health`
- `POST /api/leads`
- `POST /api/contact`
- `POST /api/consultation-request`
- `POST /api/newsletter`
- `POST /api/quiz/pathway`
- `POST /api/guides/unlock`
- `POST /api/analytics/event`

All public POST endpoints use bounded JSON reads, validation, D1 prepared statements, origin checks, and optional Turnstile verification when `TURNSTILE_SECRET_KEY` is configured.

## Admin endpoints

All admin endpoints require:

```text
Authorization: Bearer ADMIN_API_TOKEN
```

Available endpoints:

- `GET /api/admin/stats`
- `GET /api/admin/leads`
- `GET /api/admin/leads/:id`
- `PATCH /api/admin/leads/:id/status`
- `POST /api/admin/leads/:id/notes`
- `GET /api/admin/contact-messages`
- `GET /api/admin/consultation-requests`

## Database migration audit

`migrations/0003_lead_automation_platform.sql` adds:

- Lead automation columns: `reference_code`, `lead_score`, `priority`, `recommended_next_step`, `source`, `campaign`, `assigned_to`, `last_contacted_at`, `next_follow_up_at`, `updated_at`
- Tables: `contact_messages`, `consultation_requests`, `newsletter_subscribers`, `quiz_results`, `guide_unlocks`, `lead_timeline`, `analytics_events`
- Indexes for lead lookup, admin filtering, contact/consultation/newsletter, guide unlock, quiz, and analytics reads

## Domain status

- Purchased: `vidafamilia.es`
- Registrar: GoDaddy
- Purchase message observed: “¡vidafamilia.es es tuyo!”
- Registration message observed: “Registro del dominio en curso.”
- Cloudflare activation: pending
- Custom domains attached: not yet

## Still blocked on owner action

1. Wait for GoDaddy registration to finish if it is still processing.
2. Add `vidafamilia.es` to Cloudflare.
3. Copy Cloudflare-assigned nameservers.
4. Replace GoDaddy nameservers with the Cloudflare nameservers.
5. Wait for Cloudflare to mark the zone Active.
6. Create D1 database `vida-familia-db`.
7. Paste real D1 `database_id` into `wrangler.worker.toml`.
8. Set Pages production variables.
9. Configure Resend and Worker secrets.
10. Apply production migrations.
11. Deploy Worker.
12. Attach `api.vidafamilia.es`.
13. Create/connect Pages project `vida-familia-web`.
14. Attach `vidafamilia.es` and `www.vidafamilia.es`.
15. Test real submissions into D1.

## Known MVP limitations / intentional choices

- No legal or visa outcome is promised by the product or emails.
- Resend is required for real email delivery, but local development skips email safely if secrets are missing.
- SMS/WhatsApp confirmations are disabled by default and should remain disabled until provider credentials and consent policy are ready.
- `/dashboard` is an internal token-gated scaffold, not a full identity/auth product.
- Final public business email aliases and legal entity/contact details still require owner/legal confirmation.
- Cloudflare Email Routing is documented as an owner dashboard setup, not configured from code.

## Verification record

This audit should be updated after each final verification run.

| Check | Latest result |
|---|---|
| `pnpm install` | **Pass** — lockfile already current, pnpm 10.12.4 |
| `pnpm -r --if-present typecheck` | **Pass** — shared, web, Worker bindings/typecheck |
| `pnpm -r --if-present build` | **Pass** — web production build and Worker dry-run bundle |
| `pnpm db:migrate:local` | **Pass** — `0003_lead_automation_platform.sql` applied locally |
| `git diff --check` | **Pass** — no whitespace errors |
| Local Worker smoke tests | **Pass** — health, contact, lead, quiz, newsletter, guide unlock, and admin no-token `401` |
| Admin with token smoke test | **Skipped** — no local `ADMIN_API_TOKEN` configured and no fake token was created |
| Commit | Pending |
| Push | Pending |

## Launch decision

Code status is production/domain-ready once the verification record passes. Public launch is still gated on the owner-side Cloudflare, D1, Resend, deployment, and domain attachment steps above.
