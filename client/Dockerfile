FROM node:16-alpine

RUN apk add tzdata

WORKDIR /client
COPY package.json yarn.lock ./
RUN yarn
COPY . .

EXPOSE 3000
CMD [ "yarn", "start" ]