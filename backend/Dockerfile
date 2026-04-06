FROM node:20-alpine AS builder
WORKDIR /app

# Install bun
RUN npm install -g bun

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY prisma ./prisma
RUN bunx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN bun run build

# ---- runtime ----
FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app

# Install bun for runtime
RUN npm install -g bun

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY run.mjs ./

ENV NODE_ENV=production
EXPOSE 3000

# Migrate then start
CMD bunx prisma migrate deploy && bun run.mjs
