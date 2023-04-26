# First stage: build the app
FROM node:18-alpine AS build
RUN apk add --no-cache ffmpeg
RUN npm install typescript -g && npm install -g pnpm
WORKDIR /app
COPY . .
RUN pnpm install --production && tsc && rm -rf src/

# Second stage: create the final image
FROM node:18-alpine
RUN apk add --no-cache ffmpeg
WORKDIR /app
COPY --from=build /app/build /app/build
CMD ["node", "./build/index.js"]