# -------- Build stage --------
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache python3 make g++ openssl

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma
COPY prisma.config.ts ./

# ✅ Dummy URL ONLY for type generation
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"

# ✅ Generate Prisma Client so TypeScript can compile
RUN npx prisma generate --config ./prisma.config.ts

# ✅ Now TypeScript will succeed
RUN npm run build

# -------- Runtime stage --------
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY package*.json ./

EXPOSE 3000
CMD ["node", "dist/server.js"]
