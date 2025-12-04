FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN npm install turbo --global
COPY . .
RUN turbo prune --scope=@cantara/liquidator-bot --docker

FROM node:20-alpine AS installer
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn config set network-timeout 600000
RUN yarn install
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN turbo run build --filter=@cantara/liquidator-bot...

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

COPY --from=installer /app .

CMD ["node", "apps/liquidator-bot/dist/index.js"]
