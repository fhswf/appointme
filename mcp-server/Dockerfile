FROM node:22-bullseye as build

WORKDIR /base
COPY .yarn .yarn
COPY .yarnrc.yml .

COPY package.json .
COPY yarn.lock .
COPY ./common/package.json ./common/package.json
COPY ./mcp-server/package.json ./mcp-server/package.json

RUN yarn install

COPY ./common ./common
RUN yarn workspace common build

COPY ./mcp-server ./mcp-server
RUN yarn workspace mcp-server build

# Create mcp-server container
FROM node:22-bullseye as mcp-server
ARG TZ=Europe/Berlin
ENV TZ=${TZ}
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/app
COPY --from=build /base/package.json .
COPY --from=build /base/yarn.lock .
COPY --from=build /base/mcp-server mcp-server
COPY --from=build /base/common common
COPY --from=build /base/.yarn .yarn
COPY --from=build /base/.yarnrc.yml .yarnrc.yml

RUN yarn install

EXPOSE 3000
CMD [ "yarn", "workspace", "mcp-server", "start"]
