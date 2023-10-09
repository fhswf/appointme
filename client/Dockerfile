FROM node:18-bullseye as build
ARG REACT_APP_GOOGLE_ID=692793330469-6iupo55tt0kelejcie26m4njeckbmnv8.apps.googleusercontent.com
ARG REACT_BASE_PATH=/meeting
ARG REACT_APP_URL=https://hopper.fh-swf.de/meeting
ARG REACT_APP_API_URI=https://hopper.fh-swf.de/meeting/api/v1

ENV REACT_APP_GOOGLE_ID=${REACT_APP_GOOGLE_ID}
ENV REACT_BASE_PATH=${REACT_BASE_PATH}
ENV REACT_APP_URL=${REACT_APP_URL}
ENV REACT_APP_API_URI=${REACT_APP_API_URI}

WORKDIR /base
COPY .yarn .yarn
COPY .yarnrc.yml .
RUN yarn set version 4

COPY package.json .
COPY yarn.lock .
COPY ./common/package.json ./common/package.json 
COPY ./client/package.json ./client/package.json 
RUN yarn install 
RUN yarn --version

COPY ./common ./common
RUN yarn workspace common build

COPY ./client ./client
CMD ["yarn", "worspace", "client", "start"]
