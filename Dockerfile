# Base stage for shared configurations
FROM node:23.6.0 AS base
WORKDIR /app
COPY package*.json ./

# Development stage
FROM base AS development
RUN npm install
COPY . .
RUN npx prisma generate
# Fix Prisma engine symlink for Debian-based Node.js
RUN cd /app/node_modules/.prisma/client && \
    if [ -f "libquery_engine-debian-openssl-3.0.x.so.node" ]; then \
        ln -sf libquery_engine-debian-openssl-3.0.x.so.node libquery_engine-linux-musl.so.node; \
    elif [ -f "libquery_engine-linux-glibc.so.node" ]; then \
        ln -sf libquery_engine-linux-glibc.so.node libquery_engine-linux-musl.so.node; \
    elif [ -f "libquery_engine-linux-musl-openssl-3.0.x.so.node" ]; then \
        ln -sf libquery_engine-linux-musl-openssl-3.0.x.so.node libquery_engine-linux-musl.so.node; \
    fi
EXPOSE 3000
CMD ["npm", "run", "dev"]