# 1) Builder stage
FROM node:lts-alpine AS builder
RUN apk add --no-cache python3 make g++ libc-dev ffmpeg \
    && npm install -g typescript pnpm

WORKDIR /usr/src/app
COPY . .
RUN pnpm install --production --silent \
    && tsc \
    && rm -rf src/

# 2) Runtime stage
FROM node:lts-alpine
RUN apk add --no-cache ffmpeg

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/node_modules ./node_modules

USER node
CMD ["node", "build/index.js"]
