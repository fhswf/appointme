FROM node:22-bullseye as build

WORKDIR /base
# COPY .yarn .yarn
# COPY .yarnrc.yml .
RUN corepack enable

COPY package.json .
COPY pnpm-lock.yaml .
COPY ./common/package.json ./common/package.json
COPY ./mcp-server/package.json ./mcp-server/package.json

RUN pnpm install --frozen-lockfile

COPY ./common ./common
RUN pnpm --filter common build

COPY ./mcp-server ./mcp-server
RUN pnpm --filter mcp-server build

# Create mcp-server container
FROM node:22-bullseye as mcp-server
ARG TZ=Europe/Berlin
ENV TZ=${TZ}
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/app
COPY --from=build /base/package.json .
COPY --from=build /base/pnpm-lock.yaml .
COPY --from=build /base/mcp-server mcp-server
COPY --from=build /base/common common
# COPY --from=build /base/.yarn .yarn
# COPY --from=build /base/.yarnrc.yml .yarnrc.yml

RUN corepack enable && pnpm install --prod --frozen-lockfile

EXPOSE 3000
CMD [ "pnpm", "--filter", "mcp-server", "start"]
