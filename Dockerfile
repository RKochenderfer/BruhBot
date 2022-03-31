 FROM node:16-alpine
 RUN apk add python3 make gcc g++ && apk add --no-cache ffmpeg && npm install typescript -g
 WORKDIR /usr/src/app
 COPY . .
 RUN npm install --production && tsc && apk del python3 make gcc g++
 CMD ["node", "./build/index.js"]