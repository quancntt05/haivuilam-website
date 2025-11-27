FROM node:20-alpine AS base

RUN apk add --no-cache openssl

FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

COPY docker-entrypoint.sh /app/docker-entrypoint.sh

RUN mkdir -p uploads/photos && \
    chmod +x /app/docker-entrypoint.sh && \
    chown -R nodejs:nodejs uploads && \
    chown -R nodejs:nodejs /app/node_modules && \
    chown -R nodejs:nodejs /app/prisma && \
    chown nodejs:nodejs /app/docker-entrypoint.sh

USER nodejs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

ENTRYPOINT ["/app/docker-entrypoint.sh"]

