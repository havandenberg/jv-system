FROM node:alpine

WORKDIR /server
COPY package.json yarn.lock ./
RUN yarn
COPY . .

EXPOSE 3001
CMD [ "yarn", "start" ]