FROM node:16-alpine

RUN apk add tzdata

WORKDIR /server
COPY package.json yarn.lock ./
RUN yarn
COPY . .

EXPOSE 3001
CMD [ "yarn", "start" ]