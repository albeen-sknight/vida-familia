# Launch audit

Audit date: 24 June 2026
Target: first domain-ready production MVP

## Executive status

The codebase is prepared for `vidafamilia.es`. The domain has been purchased and GoDaddy now uses Cloudflare nameservers. Cloudflare zone activation/propagation, resource creation, deployment, and custom-domain attachment remain owner actions.

## Prepared in code

| Area | Status | Evidence |
|---|---|---|
| Persian RTL homepage | Ready | `/`, `/fa`; story, family, destinations, services, packages, qualification, content, trust |
| English/Spanish | Ready | `/en`, `/es`, locale switcher, localized core/service content |
| Routes | Ready | Required pages plus locale-prefixed equivalents and 404 |
| Five service pages | Ready | Full required information architecture and disclaimers |
| Apply form | Ready | Client validation, consent, responsive UI, loading/success/error, honeypot |
| Worker API | Ready in code | Health, lead insert, optional bearer-protected admin list |
| API security | Ready in code | Bounded body, validation, prepared SQL, safe CORS, duplicate throttle, conservative errors |
| D1 | Ready in code | Schema, checks, indexes, seed catalog |
| SEO/domain | Ready in code | Canonical, OG, Twitter, Organization/Service JSON-LD, sitemap, robots |
| Static delivery | Ready in code | Pages SPA redirect, security headers, asset caching |
| Wrangler config split | Ready in code | Root `wrangler.toml` is Pages-only; `wrangler.worker.toml` owns Worker/D1 |
| Owner docs | Ready | README, config handoff, phased deployment checklist |
| Secrets hygiene | Ready | Only example env files; real env/vars ignored |

## Domain status

- **Purchased:** `vidafamilia.es` at GoDaddy.
- **Nameservers delegated:** `hayes.ns.cloudflare.com`, `novalee.ns.cloudflare.com`.
- **Not yet assumed active:** Cloudflare may still be propagating/activating the zone.
- **Not yet attached:** apex/WWW Pages domains and API Worker domain.

## Owner-gated launch items

1. Wait for Cloudflare to mark the delegated zone **Active**.
2. Create D1 and replace the placeholder in `wrangler.worker.toml` with the real ID.
3. Apply remote migrations and deploy the Worker using the Worker-specific scripts.
4. Confirm Pages build-time variables and wait for the newest `main` deployment.
5. Attach `api.vidafamilia.es`, `vidafamilia.es`, and `www.vidafamilia.es`.
6. Submit and verify a production test lead.

## Known MVP limitations / deliberate placeholders

- Final public business email, legal entity identity, address, and data-retention period are owner/legal-review inputs. No private Cloudflare email was committed.
- Social icons are visual placeholders until official profile URLs are supplied.
- Resource cards are an editorial slate; no CMS or public resources API is included in MVP.
- Turnstile variables are prepared, but Turnstile is not required or wired until real keys/widget ownership exist. Honeypot and duplicate throttling cover the initial form.
- Email notifications are not active. Leads are stored in D1; `LEADS_NOTIFICATION_EMAIL` is reserved for a later approved email workflow.
- The admin endpoint uses a temporary bearer token and should be replaced by identity-based auth before a staff-facing admin product.
- Legal pages are strong launch drafts, not a substitute for review by a qualified professional for the final operating entity.
- The source banner includes embedded text and iconography. The responsive CSS uses it cinematically, but future art direction may benefit from a text-free background master.

## Verification record

This section is updated after the local verification run.

| Check | Result |
|---|---|
| `pnpm install` | **Pass** — workspace installed with pnpm 10.12.4 via Corepack |
| `pnpm typecheck` | **Pass** — shared, web, generated Worker bindings, and Worker TypeScript |
| `pnpm build` | **Pass** — Vite production output and Wrangler dry-run bundle |
| `pnpm db:migrate:local` | **Pass** — both migrations applied successfully |
| Worker `/api/health` | **Pass** — correct service payload and ISO timestamp |
| Worker `POST /api/leads` into local D1 | **Pass** — browser form success plus verified D1 row |
| CORS / throttling / admin-off checks | **Pass** — allowed preflight 204, disallowed origin 403, duplicate 429, unset admin token 404 |
| Worker startup profile | **Pass** — Wrangler startup analysis completed; temporary profile removed |
| Desktop visual check | **Pass** — Persian hero, navigation, banner, and hierarchy reviewed at 1280 × 720 |
| Mobile visual/navigation check | **Pass** — 390 × 844 layout, menu, language switch, RTL/LTR direction |
| Browser console | **Pass** — no warnings or errors after final navigation checks |
| Pages/Worker config separation | **Pass** — recursive typecheck/build and local D1 migration use the correct explicit configs |

## Launch decision

**Code status:** verified and domain-ready.
**Public launch status:** blocked only on owner-side domain/Cloudflare actions and final legal/contact values listed above.
