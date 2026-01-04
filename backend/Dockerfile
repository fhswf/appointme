FROM node:22-bullseye as build
ARG CLIENT_ID=692793330469-6iupo55tt0kelejcie26m4njeckbmnv8.apps.googleusercontent.com
ARG APP_URL=/
ARG APP_API_URL=https://appointme.example.com/api/v1

ENV CLIENT_ID=${CLIENT_ID}
# Not set via ARG to prevent it from being stored in the image!
# ENV CLIENT_SECRET
ENV APP_URL=${APP_URL}
ENV APP_API_URL=${APP_API_URL}

WORKDIR /base
RUN corepack enable

COPY package.json .
COPY pnpm-lock.yaml .
# Copy workspace definitions if needed, or ensure package.json workspace structure is valid for pnpm
COPY ./common/package.json ./common/package.json 
COPY ./backend/package.json ./backend/package.json 
RUN pnpm install --frozen-lockfile

COPY ./common ./common
RUN pnpm --filter common build

COPY ./backend ./backend
RUN pnpm --filter backend build

# Create backend container
FROM node:22-bullseye as backend
ARG TZ=Europe/Berlin
ENV TZ=${TZ}
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENV APP_URL=${APP_URL}
ENV APP_API_URL=${APP_API_URL}

WORKDIR /usr/src/app 
COPY --from=build /base/package.json .
COPY --from=build /base/pnpm-lock.yaml .
COPY --from=build /base/backend backend
COPY --from=build /base/common common

RUN corepack enable && pnpm install --prod --frozen-lockfile

RUN curl -sSfL https://raw.githubusercontent.com/anchore/syft/main/install.sh | sh -s -- -b /usr/local/bin \
    && syft . -o spdx-json=sbom.spdx.json

EXPOSE 5000
CMD [ "pnpm", "--filter", "backend", "start"]
