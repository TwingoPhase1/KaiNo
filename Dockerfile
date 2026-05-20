# Ultra-lightweight multi-stage Dockerfile for Kaino
# Target: <100MB final image size

FROM node:20-alpine AS base
# Install only essential dependencies for native modules
RUN apk add --no-cache libc6-compat

# Dependencies stage - install production dependencies only
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Builder stage - compile TypeScript and build Next.js
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js with standalone output for minimal size
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Ultra-lightweight runner stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy Next.js standalone build (minimal size)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

# Expose Next.js port
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start Next.js server
CMD ["node", "server.js"]
