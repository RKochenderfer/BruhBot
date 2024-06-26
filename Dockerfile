# FROM node:lts-alpine
# LABEL org.opencontainers.image.source https://github.com/RKochenderfer/BruhBot
# RUN apk add --no-cache ffmpeg && npm install typescript -g && npm install -g pnpm
# #RUN apk add python3 make gcc g++ && apk add --no-cache ffmpeg && npm install typescript -g
# WORKDIR /usr/src/app
# COPY . .
# # RUN npm install --production && tsc && apk del python3 make gcc g++
# RUN pnpm install --production && tsc && rm -rf src/

# CMD ["node", "./build/index.js"]
FROM node:lts-alpine
LABEL org.opencontainers.image.source https://github.com/RKochenderfer/BruhBot
RUN apk add --no-cache ffmpeg && npm install typescript -g && npm install -g pnpm
#RUN apk add python3 make gcc g++ && apk add --no-cache ffmpeg && npm install typescript -g
WORKDIR /usr/src/app
COPY . .
# RUN npm install --production && tsc && apk del python3 make gcc g++
RUN pnpm install --production --silent && tsc && rm -rf src/
RUN chown -R node /usr/src/app
USER node
CMD ["node", "./build/index.js"]