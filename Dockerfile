FROM node:alpine

EXPOSE 1337

WORKDIR /var/www
COPY package.json /var/www
RUN npm install
COPY api.js /var/www
COPY auth.js /var/www
COPY config.js /var/www
