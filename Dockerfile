FROM node:20-alpine AS build
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json turbo.json ./
COPY apps/web/package.json apps/web/
COPY packages/config/package.json packages/config/
COPY packages/db/package.json packages/db/
COPY packages/redis/package.json packages/redis/
COPY packages/email/package.json packages/email/
COPY packages/auth/package.json packages/auth/
COPY packages/stripe/package.json packages/stripe/
COPY tooling/typescript/package.json tooling/typescript/
COPY tooling/tailwind/package.json tooling/tailwind/
RUN pnpm install --frozen-lockfile
COPY . .

ARG VITE_STRIPE_PUBLISHABLE_KEY
ARG VITE_STRIPE_PRICE_ID
ARG VITE_POSTHOG_KEY
ARG VITE_POSTHOG_HOST
ARG VITE_APP_URL
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY
ENV VITE_STRIPE_PRICE_ID=$VITE_STRIPE_PRICE_ID
ENV VITE_POSTHOG_KEY=$VITE_POSTHOG_KEY
ENV VITE_POSTHOG_HOST=$VITE_POSTHOG_HOST
ENV VITE_APP_URL=$VITE_APP_URL

ENV BUILD_TARGET=node
RUN pnpm --filter @repo/web build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/apps/web/.output .output
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
