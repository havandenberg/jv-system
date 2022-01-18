FROM node:16-alpine

RUN apk add tzdata

WORKDIR /worker
COPY package.json yarn.lock ./
RUN yarn
COPY . .

EXPOSE 3002
CMD [ "yarn", "start" ]