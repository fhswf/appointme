FROM node:18-bullseye as build

WORKDIR /base
COPY .yarn .yarn
COPY .yarnrc.yml .
RUN yarn set version 3.6.3

COPY package.json .
COPY yarn.lock .
COPY ./common/package.json ./common/package.json 
COPY ./backend/package.json ./backend/package.json
COPY ./client/package.json ./client/package.json 
RUN yarn install 
RUN yarn --version

COPY ./common ./common
RUN yarn workspace common build

COPY ./client ./client
RUN yarn workspace client build

COPY ./backend ./backend
RUN yarn workspace backend build

# Create backend container
FROM node:18-bullseye as backend
ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN yarn set version 3.6.3
WORKDIR /usr/src/app 
COPY --from=build /base/package.json .
COPY --from=build /base/yarn.lock .
COPY --from=build /base/backend backend
COPY --from=build /base/common common
COPY --from=build /base/.yarn .yarn
COPY --from=build /base/.yarnrc.yml .yarnrc.yml
RUN yarn install
EXPOSE 5000
CMD [ "yarn", "run", "backend"]

# Create client container
FROM nginx:1.21.3-alpine as client
COPY --from=build /base/client/build /usr/share/nginx/html/meeting
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
