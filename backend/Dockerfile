FROM oven/bun:1.3 AS builder
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY prisma ./prisma
RUN bunx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN bun run build

# ---- runtime ----
FROM oven/bun:1.3-slim AS runner
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY run.mjs ./

ENV NODE_ENV=production
EXPOSE 3000

# Migrate then start
CMD bunx prisma migrate deploy && bun run.mjs
