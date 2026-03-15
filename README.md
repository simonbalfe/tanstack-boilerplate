# TanStack Start Boilerplate

Full-stack TypeScript boilerplate with auth, a Hono API, and Postgres. Built for shipping personal tools and demos fast.

**Stack:** TanStack Start (Vite + React 19), Hono, BetterAuth, Drizzle ORM, PostgreSQL, Tailwind CSS v4, shadcn/ui

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+ (`corepack enable && corepack prepare pnpm@9.15.0 --activate`)
- A PostgreSQL database (Neon free tier works great)

### 1. Clone and install

```bash
git clone <repo-url> && cd tanstack-boilerplate
pnpm install
```

### 2. Set up environment

Copy `.env.example` (or create `.env` at the root) and fill in the **required** values:

```env
DATABASE_URL=postgresql://user:password@host/db
BETTER_AUTH_SECRET=your-random-secret-here
VITE_APP_URL=http://localhost:3000
```

| Variable | What it is | How to get it |
|---|---|---|
| `DATABASE_URL` | Postgres connection string | [neon.tech](https://neon.tech) (free), Supabase, or any Postgres provider |
| `BETTER_AUTH_SECRET` | Random 32+ char string for signing sessions | `openssl rand -base64 32` |

That's it for the minimum setup. Everything else is optional.

### 3. Push the database schema

```bash
pnpm db:push
```

Creates the auth tables (user, session, account, verification, jwks).

### 4. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Email/password auth works immediately with just the two required vars.

## Optional Services

The boilerplate includes packages for Stripe, Redis, email, analytics, and error tracking. They all default to empty strings and the app runs fine without them. Enable what you need.

### Google OAuth

For "Sign in with Google" on the auth page.

| Variable | Where to get it |
|---|---|
| `GOOGLE_CLIENT_ID` | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `GOOGLE_CLIENT_SECRET` | Same |

Set the OAuth redirect URI to `http://localhost:3000/api/auth/callback/google` (swap for your production URL when deploying).

### Email (Resend)

Enables email verification, password reset, and welcome emails.

| Variable | Where to get it |
|---|---|
| `RESEND_API_KEY` | [resend.com](https://resend.com) (free tier: 100 emails/day) |
| `RESEND_FROM` | Your verified sender address in Resend |

Without this, email/password signups still work. The `emailVerified` field stays false but users can sign in.

### Stripe (Payments)

Full checkout, subscription, and webhook handling. Skip entirely for personal tools.

| Variable | Where to get it |
|---|---|
| `STRIPE_SECRET_KEY` | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | Stripe CLI or Dashboard webhook settings |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard |
| `VITE_STRIPE_PRICE_ID` | Create a price in Stripe Dashboard |

Local webhook testing: `pnpm --filter @repo/web stripe` (requires Stripe CLI).

### Redis (Upstash)

Caches Stripe subscription state. Only needed if you enable Stripe.

| Variable | Where to get it |
|---|---|
| `UPSTASH_REDIS_REST_URL` | [upstash.com](https://upstash.com) (free tier) |
| `UPSTASH_REDIS_REST_TOKEN` | Same |

### Analytics (PostHog)

| Variable | Where to get it |
|---|---|
| `VITE_POSTHOG_KEY` | [posthog.com](https://posthog.com) (generous free tier) |
| `VITE_POSTHOG_HOST` | Defaults to `https://us.i.posthog.com` |

### Error Tracking (Sentry)

| Variable | Where to get it |
|---|---|
| `VITE_SENTRY_DSN` | [sentry.io](https://sentry.io) |

## Project Structure

```
apps/web/             TanStack Start app (routes, pages, UI)
packages/api/         Hono API server (mounted at /api)
packages/auth/        BetterAuth config
packages/db/          Drizzle ORM + PostgreSQL schema
packages/email/       Resend + React Email templates       (optional)
packages/redis/       Upstash Redis client                 (optional)
packages/stripe/      Stripe checkout/subscriptions        (optional)
config/               Centralized env validation (Zod)
tooling/typescript/   Shared tsconfig
tooling/tailwind/     Shared Tailwind config
```

## Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Build everything
pnpm lint             # Biome lint + format check
pnpm type-check       # TypeScript checking
```

### Database

```bash
pnpm db:push          # Push schema changes to database
pnpm db:generate      # Generate Drizzle client after schema changes
pnpm db:migrate       # Run Drizzle migrations
pnpm db:studio        # Open Drizzle Studio (database GUI)
```

### API Docs

Auto-generated OpenAPI docs at [http://localhost:3000/api/docs](http://localhost:3000/api/docs).

## Deployment

### Docker (Railway, Fly.io, any VPS)

```bash
pnpm docker:build
pnpm docker:run
```

Produces a minimal Node.js 20 Alpine image running on port 3000.

`VITE_*` vars are baked in at build time (client bundle). Server vars (`DATABASE_URL`, `BETTER_AUTH_SECRET`, etc.) are read at runtime.

**Build with only the vars you need:**

```bash
docker build \
  --build-arg VITE_APP_URL=https://yourdomain.com \
  -t your-app .
```

Skip any `VITE_*` build args you don't use. They default to empty strings.

**Runtime env:** pass via `--env-file .env` or your platform's env config.

### Cloudflare Workers

Wrangler support is wired in. Build and deploy:

```bash
cd apps/web
pnpm build
npx wrangler deploy
```

Set server-side secrets via `wrangler secret put`:

```bash
cd apps/web
echo "your-value" | npx wrangler secret put DATABASE_URL
echo "your-value" | npx wrangler secret put BETTER_AUTH_SECRET
```

Only set the secrets for services you're actually using. `DATABASE_URL` and `BETTER_AUTH_SECRET` are the only required ones.

Add your custom domain in the Cloudflare dashboard under Workers & Pages > your worker > Settings > Domains & Routes.

### Production Checklist

- [ ] `VITE_APP_URL` set to production URL
- [ ] `BETTER_AUTH_SECRET` is a strong random value (different from dev)
- [ ] `DATABASE_URL` points to production database
- [ ] Google OAuth redirect URI updated to production URL (if using)
- [ ] Stripe webhook endpoint set to `https://yourdomain.com/api/webhooks/stripe` (if using)

## Working With the Code

**New pages:** Add route files in `apps/web/src/app/` (file-based routing via TanStack Router).

**New API routes:** Add to `packages/api/src/routes/`, register in `packages/api/src/app.ts`.

**New database tables:** Add to `packages/db/src/schema.ts`, then `pnpm db:push`.

**UI components:** shadcn/ui patterns in `apps/web/src/components/ui/`.

## Linting and Formatting

Biome handles both (not ESLint/Prettier). 2-space indent, single quotes, no semicolons, 100 char line width.

```bash
pnpm lint             # Check
pnpm lint --write     # Auto-fix
```
