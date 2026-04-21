# Changelog

## [1.91.0](https://github.com/fhswf/appointme/compare/mcp-server-v1.90.12...mcp-server-v1.91.0) (2026-04-21)


### Improvements

* argocd refactoring ([409fe96](https://github.com/fhswf/appointme/commit/409fe96b9fa7e1af98cd792f17024c313bc7382f))
* encapsulate server creation and tool registration into dedicated functions. ([e2874d0](https://github.com/fhswf/appointme/commit/e2874d0583b6f2a9bb6ad941233a54be7acda0bf))
* tag different environments in sentry ([269a5bb](https://github.com/fhswf/appointme/commit/269a5bb8a317e06730f6f557c5a79f088bdd5cff))


### Fixes

* Await server connection and add server disconnection in tests to comply with SDK 1.26.0 requirements. ([2d35376](https://github.com/fhswf/appointme/commit/2d35376bc9149b404e4d0d9acd54472ec44f9cf7))
* **mcp-server:** Update readiness probe timing in deployment.yaml ([c2b9f10](https://github.com/fhswf/appointme/commit/c2b9f10ec89eba54a9f66798de268ce755541b3e))
* sentry import ([ee9b545](https://github.com/fhswf/appointme/commit/ee9b545ef9ebd751e6395fb981b78f5563eeca76))


### Patches

* **deploy:** update dev overlays to sha-33494968 [skip ci] ([9409178](https://github.com/fhswf/appointme/commit/94091788770e4f6424226de65d1ab8d0422216cb))
* **deploy:** update dev overlays to sha-400cd368 [skip ci] ([4dc9f98](https://github.com/fhswf/appointme/commit/4dc9f981fa9855183264ae1da0d5fae4765561d2))
* **deploy:** update dev overlays to sha-50a47b1c [skip ci] ([5856937](https://github.com/fhswf/appointme/commit/585693715a23a56d6459685799c97e0f7cc08c1c))
* **deploy:** update dev overlays to sha-5ec653f3 [skip ci] ([b3e359b](https://github.com/fhswf/appointme/commit/b3e359b9b4219b2cde29fdd33542c5c82473c698))
* **deploy:** update dev overlays to sha-81a5823b [skip ci] ([f9b19f1](https://github.com/fhswf/appointme/commit/f9b19f1e0aa1dbe7cad2a208baeca757ba0609d3))
* **deploy:** update dev overlays to sha-8db4baaf [skip ci] ([080ec13](https://github.com/fhswf/appointme/commit/080ec13f375e605b5a9cac1698a17061c2cdd7e6))
* **deploy:** update dev overlays to sha-90f406a6 [skip ci] ([3dacbb8](https://github.com/fhswf/appointme/commit/3dacbb831cc0f0d8fd045b95879c1e6ff90cb508))
* **deps-dev:** bump @types/node from 25.0.10 to 25.2.0 ([90ed05d](https://github.com/fhswf/appointme/commit/90ed05d1d41e5d20e871a2d3450a07c560b9fe2e))
* **deps-dev:** bump @types/node from 25.0.9 to 25.0.10 ([6f15e21](https://github.com/fhswf/appointme/commit/6f15e2196b38d5de22ceaae38103d948b5140c07))
* **deps-dev:** bump @vitest/coverage-v8 from 4.0.17 to 4.0.18 ([0aacc91](https://github.com/fhswf/appointme/commit/0aacc91568606da259253826d83757586cca32e0))
* **deps-dev:** bump vitest from 4.0.17 to 4.0.18 ([9c9ccb2](https://github.com/fhswf/appointme/commit/9c9ccb27c1feac8fb673b1bef60cdce059ca03a1))
* **deps:** bump @modelcontextprotocol/sdk from 1.25.3 to 1.26.0 ([2945967](https://github.com/fhswf/appointme/commit/29459679276ef777cddac6fa6fbc53abb54db5c1))
* **deps:** bump axios from 1.13.2 to 1.13.3 ([53bfb7c](https://github.com/fhswf/appointme/commit/53bfb7ca3c55d52ce0de03d8dbde7b8a201eec1e))
* **deps:** bump axios from 1.13.3 to 1.13.5 ([be174b3](https://github.com/fhswf/appointme/commit/be174b36624ebea6efd150fc9c18d24320b8d1a4))
* **deps:** bump axios from 1.13.5 to 1.15.0 ([84279d3](https://github.com/fhswf/appointme/commit/84279d3563fa920045014ed8f34e05ac5eafb14e))
* **deps:** bump cors from 2.8.5 to 2.8.6 ([c328dfe](https://github.com/fhswf/appointme/commit/c328dfe9b34cdef1dc846611b7f154443f4d3636))
* **deps:** bump dotenv from 17.2.3 to 17.3.1 ([81d0070](https://github.com/fhswf/appointme/commit/81d0070826f54455354eff2f3478028312838fab))
* **deps:** bump hono from 4.11.4 to 4.11.10 ([99875ba](https://github.com/fhswf/appointme/commit/99875bad123b20ea8b2a5fa687303eccdc7400ff))
* **deps:** bump hono from 4.11.4 to 4.11.5 ([16796da](https://github.com/fhswf/appointme/commit/16796da0ef561f0f471c45c6472e030940b7fb5d))
* **deps:** bump hono from 4.11.4 to 4.11.7 ([b65c66d](https://github.com/fhswf/appointme/commit/b65c66dbbc9406ffc45e5d5ff3d21a77f1307123))
* **deps:** bump hono from 4.11.4 to 4.12.14 ([6d640fa](https://github.com/fhswf/appointme/commit/6d640fa67225b1c20a75cc0a5875e16581bc3f86))
* **deps:** bump zod from 4.3.5 to 4.3.6 ([0ff960e](https://github.com/fhswf/appointme/commit/0ff960e08639e580ba49d153bea97e2ef823c47c))
* **release:** 1.0.1 [skip ci] ([837b8c9](https://github.com/fhswf/appointme/commit/837b8c9b074547e3248d99834d3acbcef3526824))
* **release:** 1.0.1-rc.1 [skip ci] ([8aaebe6](https://github.com/fhswf/appointme/commit/8aaebe678bbb4c0818d1acba967d2299ecf59e07))
* **release:** 1.0.2 [skip ci] ([223d230](https://github.com/fhswf/appointme/commit/223d2304b501d347351cc090a55a5db039810d0d))
* **release:** 1.0.2-rc.1 [skip ci] ([3360fd6](https://github.com/fhswf/appointme/commit/3360fd6a1b2b3066e2510696304e517407e8038f))
* **release:** 1.0.3 [skip ci] ([25e9859](https://github.com/fhswf/appointme/commit/25e9859194b02b8cd815069c51e49825e92d252c))
* **release:** 1.0.3-rc.1 [skip ci] ([9db747b](https://github.com/fhswf/appointme/commit/9db747b35cffb66826fffbb08455f7faf7b1a9c7))
* **release:** 1.1.0 [skip ci] ([c87d2f2](https://github.com/fhswf/appointme/commit/c87d2f20556435e55039e2ea982ad597e08cebc3))
* **release:** 1.1.0-rc.1 [skip ci] ([8a280c0](https://github.com/fhswf/appointme/commit/8a280c0f5fbe15a4f92e9eb47e44d2a632a7b8a1))
* **release:** 1.1.1 [skip ci] ([77be222](https://github.com/fhswf/appointme/commit/77be222a90cc7ec10a7349432666a5062e9f9051))
* **release:** 1.1.1-rc.1 [skip ci] ([50ef333](https://github.com/fhswf/appointme/commit/50ef3338e292830c7587f114f2ea0750d9c056b3))
* **release:** 1.1.2 [skip ci] ([2e65f35](https://github.com/fhswf/appointme/commit/2e65f35759b4bc58199bb777d175366fb47a4e96))
* **release:** 1.1.3 [skip ci] ([e0d62b7](https://github.com/fhswf/appointme/commit/e0d62b7c75d844b097a1798a362872618e568232))
* **release:** 1.1.3-rc.1 [skip ci] ([18c8810](https://github.com/fhswf/appointme/commit/18c881045a136cac25cb49b621cfa86f4eb8f607))
* **release:** 1.2.0 [skip ci] ([0e21da6](https://github.com/fhswf/appointme/commit/0e21da61efb31945c680ff77521c614ff0a7aa65))
* **release:** 1.2.0-rc.1 [skip ci] ([cda7d4e](https://github.com/fhswf/appointme/commit/cda7d4e49487fa94b51ebe709e4460aaccde1520))
* **release:** 1.2.1 [skip ci] ([41410e4](https://github.com/fhswf/appointme/commit/41410e4cada14bc8f5aac6101a5b27a8c1766092))
* **release:** 1.2.1-rc.1 [skip ci] ([5ac7152](https://github.com/fhswf/appointme/commit/5ac715244a42a53a1a0e95c5c3b191c41f217400))
* **release:** 1.2.2 [skip ci] ([61f77a8](https://github.com/fhswf/appointme/commit/61f77a8424428466334cd08dfc43d1015a9334f2))
* **release:** 1.2.2-rc.1 [skip ci] ([6225282](https://github.com/fhswf/appointme/commit/6225282a4d19f8c05a37d6e0218820adb73631fb))
* **release:** 1.2.2-rc.2 [skip ci] ([6decfc4](https://github.com/fhswf/appointme/commit/6decfc4a34d926266859be3711cdce67fb9d7108))
* **release:** 1.2.2-rc.3 [skip ci] ([1b56f0e](https://github.com/fhswf/appointme/commit/1b56f0ea3d7c1ea0a41b45d41e66b5b6b9a387cc))
* **release:** 1.2.2-rc.4 [skip ci] ([c387fe8](https://github.com/fhswf/appointme/commit/c387fe8fcc0d208388ade0ba0a324735f979b2ac))
* use `release-please` for release management ([7c01559](https://github.com/fhswf/appointme/commit/7c0155912b7e04954c483fc526e80b68be262d35))

## mcp-server [1.2.2](https://github.com/fhswf/appointme/compare/mcp-server@1.2.1...mcp-server@1.2.2) (2026-04-21)


### Bug Fixes

* Await server connection and add server disconnection in tests to comply with SDK 1.26.0 requirements. ([2d35376](https://github.com/fhswf/appointme/commit/2d35376bc9149b404e4d0d9acd54472ec44f9cf7))





### Dependencies

* **common:** upgraded to 1.16.3

## mcp-server [1.2.2-rc.4](https://github.com/fhswf/appointme/compare/mcp-server@1.2.2-rc.3...mcp-server@1.2.2-rc.4) (2026-04-21)





### Dependencies

* **common:** upgraded to 1.16.3-rc.3

## mcp-server [1.2.2-rc.3](https://github.com/fhswf/appointme/compare/mcp-server@1.2.2-rc.2...mcp-server@1.2.2-rc.3) (2026-02-21)


### Bug Fixes

* Await server connection and add server disconnection in tests to comply with SDK 1.26.0 requirements. ([2d35376](https://github.com/fhswf/appointme/commit/2d35376bc9149b404e4d0d9acd54472ec44f9cf7))

## mcp-server [1.2.2-rc.2](https://github.com/fhswf/appointme/compare/mcp-server@1.2.2-rc.1...mcp-server@1.2.2-rc.2) (2026-02-14)





### Dependencies

* **common:** upgraded to 1.16.3-rc.2

## mcp-server [1.2.2-rc.1](https://github.com/fhswf/appointme/compare/mcp-server@1.2.1...mcp-server@1.2.2-rc.1) (2026-02-13)





### Dependencies

* **common:** upgraded to 1.16.3-rc.1

## mcp-server [1.2.1](https://github.com/fhswf/appointme/compare/mcp-server@1.2.0...mcp-server@1.2.1) (2026-02-09)





### Dependencies

* **common:** upgraded to 1.16.2

## mcp-server [1.2.1-rc.1](https://github.com/fhswf/appointme/compare/mcp-server@1.2.0...mcp-server@1.2.1-rc.1) (2026-02-07)





### Dependencies

* **common:** upgraded to 1.16.2-rc.1

## mcp-server [1.2.0](https://github.com/fhswf/appointme/compare/mcp-server@1.1.3...mcp-server@1.2.0) (2026-01-29)


### Features

* argocd refactoring ([409fe96](https://github.com/fhswf/appointme/commit/409fe96b9fa7e1af98cd792f17024c313bc7382f))

## mcp-server [1.2.0-rc.1](https://github.com/fhswf/appointme/compare/mcp-server@1.1.3...mcp-server@1.2.0-rc.1) (2026-01-29)


### Features

* argocd refactoring ([409fe96](https://github.com/fhswf/appointme/commit/409fe96b9fa7e1af98cd792f17024c313bc7382f))

## mcp-server [1.1.3](https://github.com/fhswf/appointme/compare/mcp-server@1.1.2...mcp-server@1.1.3) (2026-01-29)





### Dependencies

* **common:** upgraded to 1.16.1

## mcp-server [1.1.3-rc.1](https://github.com/fhswf/appointme/compare/mcp-server@1.1.2...mcp-server@1.1.3-rc.1) (2026-01-29)





### Dependencies

* **common:** upgraded to 1.16.1-rc.1

## mcp-server [1.1.2](https://github.com/fhswf/appointme/compare/mcp-server@1.1.1...mcp-server@1.1.2) (2026-01-29)


### Bug Fixes

* **mcp-server:** Update readiness probe timing in deployment.yaml ([c2b9f10](https://github.com/fhswf/appointme/commit/c2b9f10ec89eba54a9f66798de268ce755541b3e))

## mcp-server [1.1.1](https://github.com/fhswf/appointme/compare/mcp-server@1.1.0...mcp-server@1.1.1) (2026-01-28)


### Bug Fixes

* sentry import ([ee9b545](https://github.com/fhswf/appointme/commit/ee9b545ef9ebd751e6395fb981b78f5563eeca76))

## mcp-server [1.1.1-rc.1](https://github.com/fhswf/appointme/compare/mcp-server@1.1.0...mcp-server@1.1.1-rc.1) (2026-01-28)


### Bug Fixes

* sentry import ([ee9b545](https://github.com/fhswf/appointme/commit/ee9b545ef9ebd751e6395fb981b78f5563eeca76))

## mcp-server [1.1.0](https://github.com/fhswf/appointme/compare/mcp-server@1.0.3...mcp-server@1.1.0) (2026-01-28)


### Features

* tag different environments in sentry ([269a5bb](https://github.com/fhswf/appointme/commit/269a5bb8a317e06730f6f557c5a79f088bdd5cff))

## mcp-server [1.1.0-rc.1](https://github.com/fhswf/appointme/compare/mcp-server@1.0.3...mcp-server@1.1.0-rc.1) (2026-01-28)


### Features

* tag different environments in sentry ([269a5bb](https://github.com/fhswf/appointme/commit/269a5bb8a317e06730f6f557c5a79f088bdd5cff))

## mcp-server [1.0.3](https://github.com/fhswf/appointme/compare/mcp-server@1.0.2...mcp-server@1.0.3) (2026-01-25)





### Dependencies

* **common:** upgraded to 1.16.0

## mcp-server [1.0.3-rc.1](https://github.com/fhswf/appointme/compare/mcp-server@1.0.2...mcp-server@1.0.3-rc.1) (2026-01-24)





### Dependencies

* **common:** upgraded to 1.16.0-rc.1

## mcp-server [1.0.2](https://github.com/fhswf/appointme/compare/mcp-server@1.0.1...mcp-server@1.0.2) (2026-01-23)





### Dependencies

* **common:** upgraded to 1.15.2

## mcp-server [1.0.2-rc.1](https://github.com/fhswf/appointme/compare/mcp-server@1.0.1...mcp-server@1.0.2-rc.1) (2026-01-23)





### Dependencies

* **common:** upgraded to 1.15.2-rc.1

## mcp-server [1.0.1](https://github.com/fhswf/appointme/compare/mcp-server@1.0.0...mcp-server@1.0.1) (2026-01-21)





### Dependencies

* **common:** upgraded to 1.15.1

## mcp-server [1.0.1-rc.1](https://github.com/fhswf/appointme/compare/mcp-server@1.0.0...mcp-server@1.0.1-rc.1) (2026-01-21)





### Dependencies

* **common:** upgraded to 1.15.1-rc.1

## mcp-server 1.0.0 (2026-01-20)


### Bug Fixes

* Add mcp-server kustomization and ingress rules for dev and prod environments. ([aec1fe4](https://github.com/fhswf/appointme/commit/aec1fe4ea99203cc1883052f21d3d66c55b15356))
* **mcp-server:** fix docker build for mcp-server ([72b0d60](https://github.com/fhswf/appointme/commit/72b0d60ce7cadc3b1931b980f37e5e343464bbd1))
* **mcp-server:** replace insecure version of hono ([4931d7d](https://github.com/fhswf/appointme/commit/4931d7dcfeb6510d4772e43220752e6c5c37a0eb))
* replace deprecated types ([a818160](https://github.com/fhswf/appointme/commit/a818160387fd4fee5fa926c8e75650895526ccf3))
* security updates of dependencies ([fabdec9](https://github.com/fhswf/appointme/commit/fabdec9bc67079b3898b794540e9a78508615ffd))


### Features

* add mcp-server ([eeadbd6](https://github.com/fhswf/appointme/commit/eeadbd6a17c08fa3e6a833d8c90011385c594892))
* centralize documentation generation ([976ac6d](https://github.com/fhswf/appointme/commit/976ac6db6123dbd19d1c31ab46737154b4f7b51a))
* improve `search_users` tool description and migrate HTTP/SSE transport to `StreamableHTTPServerTransport`. ([3cd5c80](https://github.com/fhswf/appointme/commit/3cd5c803c217885973a940706ae5570ca4d51ff2))
* mcp server ([24103e6](https://github.com/fhswf/appointme/commit/24103e6b42e37c763beb8eaeee9c3f0cb85d9f19))





### Dependencies

* **common:** upgraded to 1.15.0

## mcp-server [1.0.0-rc.8](https://github.com/fhswf/appointme/compare/mcp-server@1.0.0-rc.7...mcp-server@1.0.0-rc.8) (2026-01-16)





### Dependencies

* **common:** upgraded to 1.15.0-rc.4

## mcp-server [1.0.0-rc.7](https://github.com/fhswf/appointme/compare/mcp-server@1.0.0-rc.6...mcp-server@1.0.0-rc.7) (2026-01-14)


### Bug Fixes

* **mcp-server:** replace insecure version of hono ([4931d7d](https://github.com/fhswf/appointme/commit/4931d7dcfeb6510d4772e43220752e6c5c37a0eb))

## mcp-server [1.0.0-rc.6](https://github.com/fhswf/appointme/compare/mcp-server@1.0.0-rc.5...mcp-server@1.0.0-rc.6) (2026-01-04)


### Bug Fixes

* **mcp-server:** fix docker build for mcp-server ([72b0d60](https://github.com/fhswf/appointme/commit/72b0d60ce7cadc3b1931b980f37e5e343464bbd1))

## mcp-server [1.0.0-rc.5](https://github.com/fhswf/appointme/compare/mcp-server@1.0.0-rc.4...mcp-server@1.0.0-rc.5) (2026-01-04)


### Features

* centralize documentation generation ([976ac6d](https://github.com/fhswf/appointme/commit/976ac6db6123dbd19d1c31ab46737154b4f7b51a))

## mcp-server [1.0.0-rc.4](https://github.com/fhswf/appointme/compare/mcp-server@1.0.0-rc.3...mcp-server@1.0.0-rc.4) (2026-01-03)


### Bug Fixes

* replace deprecated types ([a818160](https://github.com/fhswf/appointme/commit/a818160387fd4fee5fa926c8e75650895526ccf3))
* security updates of dependencies ([fabdec9](https://github.com/fhswf/appointme/commit/fabdec9bc67079b3898b794540e9a78508615ffd))

## mcp-server [1.0.0-rc.3](https://github.com/fhswf/appointme/compare/mcp-server@1.0.0-rc.2...mcp-server@1.0.0-rc.3) (2026-01-03)


### Features

* improve `search_users` tool description and migrate HTTP/SSE transport to `StreamableHTTPServerTransport`. ([3cd5c80](https://github.com/fhswf/appointme/commit/3cd5c803c217885973a940706ae5570ca4d51ff2))

## mcp-server [1.0.0-rc.2](https://github.com/fhswf/appointme/compare/mcp-server@1.0.0-rc.1...mcp-server@1.0.0-rc.2) (2026-01-03)


### Bug Fixes

* Add mcp-server kustomization and ingress rules for dev and prod environments. ([aec1fe4](https://github.com/fhswf/appointme/commit/aec1fe4ea99203cc1883052f21d3d66c55b15356))

## mcp-server 1.0.0-rc.1 (2026-01-02)


### Features

* add mcp-server ([eeadbd6](https://github.com/fhswf/appointme/commit/eeadbd6a17c08fa3e6a833d8c90011385c594892))
* mcp server ([24103e6](https://github.com/fhswf/appointme/commit/24103e6b42e37c763beb8eaeee9c3f0cb85d9f19))
