# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY app/package.json app/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY shared ../shared
COPY app .

ARG UPSTASH_REDIS_REST_TOKEN
ARG UPSTASH_REDIS_REST_URL
ARG POSTHOG_KEY
ARG POSTHOG_HOST
ARG STRIPE_SECRET_KEY
ARG RESEND_API_KEY
ARG STRIPE_PUBLISHABLE_KEY
ARG STRIPE_PRICE_ID

ENV UPSTASH_REDIS_REST_TOKEN=$UPSTASH_REDIS_REST_TOKEN
ENV UPSTASH_REDIS_REST_URL=$UPSTASH_REDIS_REST_URL
ENV POSTHOG_KEY=$POSTHOG_KEY
ENV POSTHOG_HOST=$POSTHOG_HOST
ENV STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLISHABLE_KEY
ENV STRIPE_PRICE_ID=$STRIPE_PRICE_ID

RUN pnpm build

# Runtime stage
FROM node:20-alpine AS runtime

WORKDIR /app

COPY app/package.json app/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod && pnpm store prune

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY shared ../shared

USER nextjs

EXPOSE 3006

CMD ["pnpm", "start"]
