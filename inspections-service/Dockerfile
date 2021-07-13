FROM node:alpine

RUN apk add tzdata

WORKDIR /inspections-service
COPY package.json yarn.lock ./
RUN yarn
COPY . .

EXPOSE 3002
CMD [ "yarn", "start" ]