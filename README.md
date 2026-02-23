# SaaS Boilerplate

TanStack Start + BetterAuth + Drizzle ORM + Stripe, deployed to Cloudflare Workers.

## Deploy to Cloudflare Workers

### 1. Authenticate with Cloudflare

```bash
npx wrangler login
```

### 2. Set up external services

Before deploying you need accounts and credentials for each service. Work through these in order:

**Domain (Cloudflare)**
- Register a domain in [Cloudflare Registrar](https://www.cloudflare.com/) or point an existing domain's nameservers to Cloudflare.

**Database (PostgreSQL)**
- Provision a PostgreSQL database — Neon, Supabase, or a Hetzner VPS work well.
- Get your connection string: `postgres://user:password@host:port/db`

**Resend (Email)**
- Sign up at [Resend](https://resend.com), add your domain, verify DNS records in Cloudflare.
- Create an API key and note your sending address.

**Upstash (Redis)**
- Create a Redis database at [Upstash](https://upstash.com/).
- Copy the REST URL and token.

**Google OAuth**
- In [Google Cloud Console](https://console.cloud.google.com/), create a project → APIs & Services → Credentials → OAuth client ID.
- Set authorized redirect URI to `https://yourdomain.com/api/auth/callback/google`.
- Copy the client ID and secret.

**Stripe (Payments)**
- In the [Stripe Dashboard](https://stripe.com/), copy your secret key and publishable key.
- Create a Product and Price, copy the Price ID (`price_...`).
- Add a webhook endpoint pointing to `https://yourdomain.com/api/webhooks/stripe` and copy the signing secret.

### 3. Configure build-time environment variables

Client-side `VITE_` variables are baked into the bundle at build time. Create a `.env` file at the root:

```env
VITE_APP_URL=https://yourdomain.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_STRIPE_PRICE_ID=price_...
VITE_POSTHOG_KEY=phc_...
VITE_POSTHOG_HOST=https://us.i.posthog.com
```

### 4. Build

```bash
pnpm install
pnpm db:push
cd apps/web && pnpm build
```

### 5. Set Worker secrets

Server-side secrets are stored in Cloudflare Workers — never in `.env` for production. Set each one:

```bash
cd apps/web

echo "your-value" | npx wrangler secret put DATABASE_URL
echo "your-value" | npx wrangler secret put BETTER_AUTH_SECRET
echo "your-value" | npx wrangler secret put GOOGLE_CLIENT_ID
echo "your-value" | npx wrangler secret put GOOGLE_CLIENT_SECRET
echo "your-value" | npx wrangler secret put STRIPE_SECRET_KEY
echo "your-value" | npx wrangler secret put STRIPE_WEBHOOK_SECRET
echo "your-value" | npx wrangler secret put UPSTASH_REDIS_REST_URL
echo "your-value" | npx wrangler secret put UPSTASH_REDIS_REST_TOKEN
echo "your-value" | npx wrangler secret put RESEND_API_KEY
echo "your-value" | npx wrangler secret put RESEND_FROM
```

Generate a strong `BETTER_AUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 6. Deploy

```bash
cd apps/web && npx wrangler deploy
```

Or from the root (builds and deploys in one step):

```bash
cd apps/web && pnpm deploy
```

### 7. Set your custom domain

In the Cloudflare dashboard → Workers & Pages → your worker → Settings → Domains & Routes, add your custom domain.

---

## Local Development

Create a `.env` file at the root with all variables (server-side included):

```env
NODE_ENV=development
VITE_APP_URL=http://localhost:3000

DATABASE_URL=postgres://user:password@host:port/db
BETTER_AUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PRICE_ID=price_...

RESEND_API_KEY=
RESEND_FROM=onboarding@yourdomain.com

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

VITE_POSTHOG_KEY=
VITE_POSTHOG_HOST=https://us.i.posthog.com
```

```bash
pnpm install
pnpm db:push
pnpm dev
```

For local Stripe webhook testing:

```bash
cd apps/web && pnpm stripe
```

---

## Docker / VPS Deployment

```bash
pnpm docker:build
pnpm docker:run
```

Pushes to `main` automatically build and push a Docker image to `ghcr.io` via GitHub Actions.
