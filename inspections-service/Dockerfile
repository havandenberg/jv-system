FROM node:alpine

WORKDIR /inspections-service
COPY package.json yarn.lock ./
RUN yarn
COPY . .

EXPOSE 3002
CMD [ "yarn", "start" ]