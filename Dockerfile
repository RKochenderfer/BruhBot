FROM node:16-alpine
RUN apk add --no-cache ffmpeg
#  RUN apk add python3 make gcc g++ && apk add --no-cache ffmpeg && npm install typescript -g
RUN npm install typescript -g
WORKDIR /app
COPY . .
# RUN npm install --production && tsc && apk del python3 make gcc g++
RUN npm install --production && tsc

CMD ["node", "./build/src/index.js"]