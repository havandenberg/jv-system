FROM node:16

RUN apt install tzdata make gcc g++

WORKDIR /worker
COPY package.json yarn.lock ./
RUN yarn
RUN yarn add ibm_db
COPY . .
COPY ./db2consv_ee.lic ./node_modules/ibm_db/installer/clidriver/license/db2consv_ee.lic

EXPOSE 3002
CMD [ "yarn", "start" ]