FROM node:18-bullseye as build
ARG REACT_APP_GOOGLE_ID=692793330469-6iupo55tt0kelejcie26m4njeckbmnv8.apps.googleusercontent.com
ARG REACT_APP_URL=/meeting
ARG REACT_APP_API_URL=https://www.ki.fh-swf.de/meeting/api/v1

ENV REACT_APP_GOOGLE_ID=${REACT_APP_GOOGLE_ID}
ENV REACT_APP_URL=${REACT_APP_URL}
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

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

COPY ./backend ./backend
RUN yarn workspace backend build

# Create backend container
FROM node:18-bullseye as backend
ARG TZ=Europe/Berlin
ENV TZ=${TZ}

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN yarn set version 4

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