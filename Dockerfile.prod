# ===============================================
# Multi-stage Dockerfile for Production
# English Learning MCP Server
# ===============================================

# ===============================================
# Stage 1: Base - Common dependencies and setup
# ===============================================
FROM node:20-alpine AS base

# Install system dependencies including OpenSSL for Prisma
RUN apk add --no-cache \
    dumb-init \
    curl \
    openssl \
    libssl3 \
    libcrypto3 \
    && rm -rf /var/cache/apk/*

# Create app directory and user
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# ===============================================
# Stage 2: Dependencies - Install all dependencies
# ===============================================
FROM base AS dependencies

# Install all dependencies (including devDependencies for build)
RUN npm ci --only=production --silent && \
    npm cache clean --force

# ===============================================
# Stage 3: Build - Build the application
# ===============================================
FROM base AS build

# Install all dependencies including devDependencies
RUN npm ci --silent && \
    npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# ===============================================
# Stage 4: Production - Final runtime image
# ===============================================
FROM node:20-alpine AS production

# Install runtime dependencies including OpenSSL for Prisma
RUN apk add --no-cache \
    dumb-init \
    curl \
    openssl \
    libssl3 \
    libcrypto3 \
    && rm -rf /var/cache/apk/*

# Create app directory and user
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3003
ENV NODE_OPTIONS="--max-old-space-size=512"

# Copy package files and install production dependencies
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --only=production --silent && \
    npm cache clean --force

# Copy built application from build stage
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=build --chown=nestjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Fix Prisma engine symlink for Alpine Linux
RUN cd /app/node_modules/.prisma/client && \
    if [ -f "libquery_engine-linux-musl-openssl-3.0.x.so.node" ]; then \
        ln -sf libquery_engine-linux-musl-openssl-3.0.x.so.node libquery_engine-linux-musl.so.node; \
    fi

# Create logs directory
RUN mkdir -p /app/logs && \
    chown -R nestjs:nodejs /app/logs

# Switch to non-root user
USER nestjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT} || exit 1

# Expose port
EXPOSE 3003

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/main.js"]