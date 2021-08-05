 FROM node:16-alpine
 RUN apk add python3 make gcc g++ && apk add --no-cache ffmpeg
 WORKDIR /usr/src/app
 COPY . .
 RUN npm install --production && apk del python3 make gcc g++
 CMD ["node", "index.js"]