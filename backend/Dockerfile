FROM node:18-bullseye as build
ARG CLIENT_ID=692793330469-6iupo55tt0kelejcie26m4njeckbmnv8.apps.googleusercontent.com
ARG CLIENT_SECRET
ARG APP_URL=/meeting
ARG APP_API_URL=https://hopper.fh-swf.de/meeting/api/v1

ENV CLIENT_ID=${CLIENT_ID}
ENV CLIENT_SECRET=${CLIENT_SECRET}
ENV APP_URL=${APP_URL}
ENV APP_API_URL=${APP_API_URL}

WORKDIR /base
COPY .yarn .yarn
COPY .yarnrc.yml .
RUN yarn set version 4

COPY package.json .
COPY yarn.lock .
COPY ./common/package.json ./common/package.json 
COPY ./backend/package.json ./backend/package.json 
RUN yarn install 
RUN yarn --version

COPY ./common ./common
RUN yarn workspace common build

COPY ./backend ./backend
RUN yarn workspace backend build

# Create backend container
FROM node:18-bullseye as backend
ARG TZ=Europe/Berlin
ENV TZ=${TZ}
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/app 
COPY --from=build /base/package.json .
COPY --from=build /base/yarn.lock .
COPY --from=build /base/backend backend
COPY --from=build /base/common common
COPY --from=build /base/.yarn .yarn
COPY --from=build /base/.yarnrc.yml .yarnrc.yml
RUN yarn set version 4
RUN yarn install
EXPOSE 5000
CMD [ "yarn", "workspace", "backend", "start"]
