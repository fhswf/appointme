FROM node:18-alpine

ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ARG NPM_TOKEN
COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app
#COPY .npmrc /usr/src/app
RUN yarn set version 3.6.3 
RUN yarn install 

COPY backend /usr/src/app
WORKDIR /usr/src/app/backend
EXPOSE 5000
RUN yarn install 
RUN yarn run-script build
CMD [ "yarn", "start" ]