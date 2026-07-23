FROM node:22-bookworm-slim AS base

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS dependencies

COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder

ARG APP_VERSION=0.1.0-local
ARG APP_REVISION=unknown

ENV NODE_ENV=production
ENV NEXT_PHASE=phase-production-build
ENV APP_VERSION=${APP_VERSION}
ENV APP_REVISION=${APP_REVISION}

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS migration

COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json package-lock.json drizzle.config.ts tsconfig.json ./
COPY drizzle ./drizzle
COPY scripts/seed-demo.mjs ./scripts/seed-demo.mjs
COPY src/db ./src/db
CMD ["npm", "run", "db:migrate"]

FROM node:22-bookworm-slim AS runner

ARG APP_VERSION=0.1.0-local
ARG APP_REVISION=unknown

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV APP_VERSION=${APP_VERSION}
ENV APP_REVISION=${APP_REVISION}

LABEL org.opencontainers.image.title="Spity"
LABEL org.opencontainers.image.version=${APP_VERSION}
LABEL org.opencontainers.image.revision=${APP_REVISION}
LABEL org.opencontainers.image.source="https://github.com/Dorianyloj/spity"

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
