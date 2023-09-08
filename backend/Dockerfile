FROM node:16-buster

ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ARG NPM_TOKEN
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
COPY .npmrc /usr/src/app
RUN yarn install 
COPY . /usr/src/app
EXPOSE 5000
RUN yarn run-script build
CMD [ "yarn", "start" ]