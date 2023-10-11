FROM node:18-bullseye AS build
ARG CLIENT_ID=692793330469-6iupo55tt0kelejcie26m4njeckbmnv8.apps.googleusercontent.com
ARG BASE_PATH=/meeting
ARG APP_URL=https://hopper.fh-swf.de/meeting
ARG API_URL=https://hopper.fh-swf.de/meeting/api/v1

ENV REACT_APP_CLIENT_ID=${CLIENT_ID}
ENV REACT_APP_BASE_PATH=${BASE_PATH}
ENV REACT_APP_URL=${APP_URL}
ENV REACT_APP_API_URL=${API_URL}

WORKDIR /base
COPY .yarn .yarn
COPY .yarnrc.yml .
RUN yarn set version 4

COPY package.json .
COPY yarn.lock .
COPY ./common/package.json ./common/package.json 
COPY ./client/package.json ./client/package.json 
RUN yarn install && yarn --version

COPY ./common ./common
RUN yarn workspace common build

COPY ./client ./client
RUN yarn workspace client build

FROM nginx:1.21.3-alpine
COPY --from=build /base/client/build /usr/share/nginx/html/meeting
COPY ./client/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
