FROM node:18-bullseye AS build
ARG CLIENT_ID=692793330469-6iupo55tt0kelejcie26m4njeckbmnv8.apps.googleusercontent.com
ARG BASE_PATH=/
ARG APP_URL=https://appointme.example.com
ARG API_URL=https://appointme.example.com/api/v1

ENV REACT_APP_CLIENT_ID=${CLIENT_ID}
ENV REACT_APP_BASE_PATH=${BASE_PATH}
ENV REACT_APP_URL=${APP_URL}
ENV REACT_APP_API_URL=${API_URL}

WORKDIR /base
# COPY .yarn .yarn
# COPY .yarnrc.yml .
RUN corepack enable

COPY package.json .
COPY pnpm-lock.yaml .
COPY ./common/package.json ./common/package.json 
COPY ./client/package.json ./client/package.json 
RUN pnpm install --frozen-lockfile

COPY ./common ./common
RUN pnpm --filter common build

COPY ./client ./client
RUN pnpm --filter client build

FROM nginx:1.21.3-alpine
ARG CLIENT_ID=692793330469-6iupo55tt0kelejcie26m4njeckbmnv8.apps.googleusercontent.com
ARG BASE_PATH=/
ARG APP_URL=https://appointme.example.com
ARG API_URL=https://appointme.example.com/api/v1

ENV REACT_APP_CLIENT_ID=${CLIENT_ID}
ENV REACT_APP_BASE_PATH=${BASE_PATH}
ENV REACT_APP_URL=${APP_URL}
ENV REACT_APP_API_URL=${API_URL}

COPY --from=build /base/client/build /usr/share/nginx/html/meeting
COPY ./client/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./client/scripts/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN apk add --no-cache curl bash \
    && curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin \
    && syft . -o spdx-json=sbom.spdx.json

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
