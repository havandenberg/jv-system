FROM node:alpine

WORKDIR /cdi-service
COPY package.json yarn.lock ./
RUN yarn
COPY . .

EXPOSE 3002
CMD [ "yarn", "start" ]