FROM node:alpine

RUN npm install -g tslib
RUN npm install -g postgraphile
RUN npm install -g postgraphile-plugin-connection-filter
RUN npm install -g postgraphile-plugin-atomic-mutations
RUN npm install -g postgraphile-plugin-nested-mutations
RUN npm install -g @graphile-contrib/pg-simplify-inflector
RUN npm install -g @graphile-contrib/pg-many-to-many

COPY ./custom-plugin /tmp/custom-plugin
RUN cd /tmp/custom-plugin && npm pack
RUN npm install -g /tmp/custom-plugin/custom-plugin-0.0.1.tgz
RUN rm -rf /tmp/custom-plugin

COPY ./.postgraphilerc.js ./

EXPOSE 5000
ENTRYPOINT ["postgraphile", "-n", "0.0.0.0"]