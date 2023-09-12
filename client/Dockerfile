FROM node:18-bullseye as build

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
RUN yarn workspace client build


# Create client container
FROM nginx:1.21.3-alpine as client
COPY --from=build /base/client/build /usr/share/nginx/html/meeting
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
