FROM node:20-alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update

# Set working directory
WORKDIR /app

# Install turbo global
RUN npm install turbo --global

# Copy the entire monorepo
COPY . .

# Prune the workspace for the backend app
# This removes all unused packages for this specific app
RUN turbo prune --scope=@cantara/backend --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:20-alpine AS installer
RUN apk add --no-cache libc6-compat python3 make g++
RUN npm install turbo --global
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY tsconfig.base.json tsconfig.base.json
RUN yarn config set network-timeout 600000
RUN yarn install || yarn install || yarn install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Build the backend
RUN turbo run build --filter=@cantara/backend...

FROM node:20-alpine AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

COPY --from=installer /app .

CMD ["node", "apps/backend/dist/server.js"]
