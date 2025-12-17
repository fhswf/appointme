# common [1.12.0-rc.2](https://github.com/fhswf/appointme/compare/common@1.12.0-rc.1...common@1.12.0-rc.2) (2025-12-17)


### Features

* add about page ([3e40a69](https://github.com/fhswf/appointme/commit/3e40a69ab0d7c92f0be0bf3d51e94d131b4b51aa))
* impove main ui ([c0eda64](https://github.com/fhswf/appointme/commit/c0eda649695ac8ddc19f2ff258d0bd3fa695039b))
* ui improvements ([f7e88df](https://github.com/fhswf/appointme/commit/f7e88dfeb8b7341723a0e7718b89d094c847c015))
* ui improvements ([1e4f048](https://github.com/fhswf/appointme/commit/1e4f0484eeca7c5865af9bc45b941f611bf9bc7a))

# common [1.12.0-rc.1](https://github.com/fhswf/appointme/compare/common@1.11.0...common@1.12.0-rc.1) (2025-12-15)


### Features

* enhance login experience ([9d86c9c](https://github.com/fhswf/appointme/commit/9d86c9cab79ef2379e10e3ceb472bcbc79792f20))

# common [1.11.0](https://github.com/fhswf/appointme/compare/common@1.10.0...common@1.11.0) (2025-12-12)


### Bug Fixes

* rebranding ([a7e4c43](https://github.com/fhswf/appointme/commit/a7e4c4359c4791a3163abcb2f3916a24048c545c))


### Features

* rebranding to "appointme" ([d73ce59](https://github.com/fhswf/appointme/commit/d73ce597bc90a896a6787ce8cb5f2415594063c5))

# common [1.10.0](https://github.com/fhswf/appointme/compare/common@1.9.0...common@1.10.0) (2025-12-10)


### Features

* database migration ([c326a4c](https://github.com/fhswf/appointme/commit/c326a4c456a369bd45fe25f6c8f933b5c817dfd5))

# common [1.9.0](https://github.com/fhswf/appointme/compare/common@1.8.0...common@1.9.0) (2025-12-10)


### Features

* externalize contact information to environment variables and a new component, updating legal pages and i18n. ([5e9aa07](https://github.com/fhswf/appointme/commit/5e9aa0732d026874d77d1f58107ffddeb4befae1))

# common [1.8.0](https://github.com/fhswf/appointme/compare/common@1.7.0...common@1.8.0) (2025-12-10)


### Features

* Add i18n support to login and OIDC callback pages, including new translation keys and updated tests. ([eb54d13](https://github.com/fhswf/appointme/commit/eb54d13fb1f0db4ba6550cadecbb2e1329a8809e))
* branding update ([f101231](https://github.com/fhswf/appointme/commit/f101231fc8c8a3d54188a8ec03b3b85b0c81f5e5))
* Dynamically inject app title into i18n strings and add 'Step 1: Configure calendars' translation. ([b74d15d](https://github.com/fhswf/appointme/commit/b74d15de3e8f77e67d20c18a8c6360a5b0fd3983))
* introduce AuthProvider for centralized authentication and streamline root routing to use `/` instead of `/app`. ([679d71b](https://github.com/fhswf/appointme/commit/679d71b34dd2f26cb9df58c7408e8e47cbc20f7b))
* ui improvements ([bd566a4](https://github.com/fhswf/appointme/commit/bd566a4def557b95e47a5dc65ba369131af7b613))

# common [1.7.0](https://github.com/fhswf/appointme/compare/common@1.6.0...common@1.7.0) (2025-12-10)


### Features

* Add new localization strings for user profile management in French, Italian, German, and Spanish. ([99523ac](https://github.com/fhswf/appointme/commit/99523ac0bdbfe5b2b3e00d2bfdfb7ddd1047a5a8))
* Add user welcome field, update i18n password key, enhance user update security, and integrate new client icons. ([ac5aac0](https://github.com/fhswf/appointme/commit/ac5aac038d07ad84f167c787c47d062c47ddc7e8))
* Implement user profile page with Gravatar support, user URL updates, and i18n for navigation. ([1bfa2d6](https://github.com/fhswf/appointme/commit/1bfa2d64c04897dba6a99e6391cec0a5a51270d2))

# common [1.6.0](https://github.com/fhswf/appointme/compare/common@1.5.0...common@1.6.0) (2025-12-09)


### Features

* Add French, Italian, Japanese, Korean, Chinese, and Spanish locales and update i18n integration. ([ba21d93](https://github.com/fhswf/appointme/commit/ba21d93db3826e3ea2944da115e6ae64ad6abeae))

# common [1.5.0](https://github.com/fhswf/appointme/compare/common@1.4.0...common@1.5.0) (2025-12-09)


### Bug Fixes

* Adjust module resolution by adding `.js` extensions to i18n imports and Jest module mapping. ([84c51b6](https://github.com/fhswf/appointme/commit/84c51b663f8d35ead87c9f0449ab860066f691c9))


### Features

* Add optional email field to CalDAV accounts and use it for event organizers when creating events. ([6283fdc](https://github.com/fhswf/appointme/commit/6283fdc9f3c682e52cee82a4f859d90032928300))

# common [1.4.0](https://github.com/fhswf/appointme/compare/common@1.3.0...common@1.4.0) (2025-12-09)


### Features

* Add new i18n keys for booking and CalDav features, and refine iCal attendee RSVP logic. ([0c1872f](https://github.com/fhswf/appointme/commit/0c1872fa8fe7b4d15fe58dba5acb4166cfef8845))
* add OIDC controller tests and update Vitest dependencies. ([8d80865](https://github.com/fhswf/appointme/commit/8d8086527915a67e4868b62cf944a55a10794c32))
* i18n restructured ([2d25c89](https://github.com/fhswf/appointme/commit/2d25c895228f4c4ad17e4237ba5c45f229527fa9))

# common [1.3.0](https://github.com/fhswf/appointme/compare/common@1.2.0...common@1.3.0) (2025-12-08)


### Bug Fixes

* **build:** fix build of appointme-common ([2d4e274](https://github.com/fhswf/appointme/commit/2d4e27438e67b864bbb695181604e533136e248d))
* **build:** fix CI build ([aef4bcb](https://github.com/fhswf/appointme/commit/aef4bcb6905e3b73079a726231681c19a3214564))
* **build:** fix CI build on GitHub ([d27a4a0](https://github.com/fhswf/appointme/commit/d27a4a05b9d80a5358b18f9986ac75dd43bdc073))
* **common:** fix IntervalSet constructor ([34b14a9](https://github.com/fhswf/appointme/commit/34b14a9a28061a8aa34c404f906a08c63cda0561))
* deleting event types ([e7d07ca](https://github.com/fhswf/appointme/commit/e7d07caecb04fa8386bad559e0dfa123570c5e74))
* freeBusy service corrected ([ff80003](https://github.com/fhswf/appointme/commit/ff8000327717a67a42b326c1acce906112bbb250))
* improve readability ([83d9f91](https://github.com/fhswf/appointme/commit/83d9f917a429d7f57294f0db557442afcd30a2ee))
* improve readability ([d336b95](https://github.com/fhswf/appointme/commit/d336b95733d89bb282e63682aa7ae03748079e8f))
* improve readability ([2042b43](https://github.com/fhswf/appointme/commit/2042b43a8913619896d0428d7512d25e51e01a60))
* module deps ([04a913c](https://github.com/fhswf/appointme/commit/04a913c10f701e457e18987cf4b6a43fe0827b08))
* module resolution ([6b3eb2d](https://github.com/fhswf/appointme/commit/6b3eb2d032a7349c117ff738dd1c84c00e00d9e3))
* module resolution ([fdd128e](https://github.com/fhswf/appointme/commit/fdd128ee14ca2855c15b9353400166cd7fd3943f))
* Rename url field ([660773a](https://github.com/fhswf/appointme/commit/660773a1950ae368373651b0c6209c32f10187ab))
* **security:** remove password attribute ([a1fb3e5](https://github.com/fhswf/appointme/commit/a1fb3e5abdacd6037a76ee24b357c71658162f18))
* semantic release config ([b638ae1](https://github.com/fhswf/appointme/commit/b638ae1bf1f34ba6283a7ab61de5eaf406a27e20))
* semantic-release config ([e6b7a13](https://github.com/fhswf/appointme/commit/e6b7a1326964a2a7b5f3d088386e60deb6a3b077))
* semantic-release for common ([ecee172](https://github.com/fhswf/appointme/commit/ecee17292598b18157f25f9f82e2bc7c22b6f5e2))
* sonarqube issues ([1f5b8fe](https://github.com/fhswf/appointme/commit/1f5b8fe9bc1185cc1b3411b7afec0bcb65699b5a))
* **test:** test before sonarqube analysis ([50a3389](https://github.com/fhswf/appointme/commit/50a33892f69f3c0a82f8fb77d6c07b95a0dcc6b0))
* **test:** test before sonarqube analysis ([a5d856f](https://github.com/fhswf/appointme/commit/a5d856f1f4b55f543e5d3e21840fdad2001cff0d))
* **test:** test before sonarqube analysis ([a6d28c6](https://github.com/fhswf/appointme/commit/a6d28c6e4e3017c9716f2328e784fadc7c30550c))
* **test:** test before sonarqube analysis ([966b558](https://github.com/fhswf/appointme/commit/966b558099ccf7ec09f30c8676c0b1e9ba9cc9c1))
* **test:** timezone for tests ([672e71a](https://github.com/fhswf/appointme/commit/672e71a07d5f6d8f850fc60b35daf80311e1f0ed))
* **test:** unit tests ([40f775f](https://github.com/fhswf/appointme/commit/40f775ff8376d2cb971efd66dff42f4e2f73b132))
* **test:** version & config updates ([266684c](https://github.com/fhswf/appointme/commit/266684cc69a162ee968ac3ebcce8613df1f25244))
* timezone issue in interpretation of slots fixed ([fbc5722](https://github.com/fhswf/appointme/commit/fbc57220e7b4dfb377969014735c9b33be0686f9))
* UI glitches fixed ([14783e1](https://github.com/fhswf/appointme/commit/14783e13cd00b7e3d05aac64354ca30157a679c0))
* **ui:** changes for vite & mui 6 ([6fc7016](https://github.com/fhswf/appointme/commit/6fc701620d3c9931cbc072e62fb375a96928080d))
* yarn build/dependency management & docker ([5b491e6](https://github.com/fhswf/appointme/commit/5b491e6b0005db98837286b411d8de9a13fdbb7a))


### Features

* caldav integration ([ddc3773](https://github.com/fhswf/appointme/commit/ddc37730f4ccd50b57f70a60394276f3abd29273))
* common classes for handling free/busy intervals ([118f1ba](https://github.com/fhswf/appointme/commit/118f1ba7cc593681e4e3671f8a286c155d12b57e))
* **event type:** add min/max timespan for events, add maximum number of events per day ([23fa858](https://github.com/fhswf/appointme/commit/23fa858bc575a67fef4d27908107434298040071))
* **event type:** remove deprecated fields ([d81686f](https://github.com/fhswf/appointme/commit/d81686f3cc654e3a9388a5dbb055c9be3d21e9c1))
* Implement Google Calendar event insertion, improve free/busy time calculation, and add token revocation. ([c2e86b3](https://github.com/fhswf/appointme/commit/c2e86b34ae2923a598daa9e513c94a63926b4ccf))
* quality assurance ([#124](https://github.com/fhswf/appointme/issues/124)) ([87bf9a7](https://github.com/fhswf/appointme/commit/87bf9a7881825d21cf492ae37bb9359aa96d4d87))

# common [1.2.0](https://github.com/fhswf/appointme/compare/common@1.1.11...common@1.2.0) (2025-12-03)


### Features

* Implement Google Calendar event insertion, improve free/busy time calculation, and add token revocation. ([86ea2b8](https://github.com/fhswf/appointme/commit/86ea2b854fac7168b23d80711cd37e652f3eb0cc))

## common [1.1.11](https://github.com/fhswf/appointme/compare/common@1.1.10...common@1.1.11) (2024-10-09)


### Bug Fixes

* **test:** timezone for tests ([184bcd2](https://github.com/fhswf/appointme/commit/184bcd26fb3d854628f7bce42666e9adef26eb48))

## common [1.1.10](https://github.com/fhswf/appointme/compare/common@1.1.9...common@1.1.10) (2024-10-09)


### Bug Fixes

* improve readability ([0cd6574](https://github.com/fhswf/appointme/commit/0cd6574333d9357d76f89deb0d8a922370730db7))

## common [1.1.9](https://github.com/fhswf/appointme/compare/common@1.1.8...common@1.1.9) (2024-10-09)


### Bug Fixes

* improve readability ([ec10d8a](https://github.com/fhswf/appointme/commit/ec10d8a76af71fb70988c6509a8bfa416a3a81d4))

## common [1.1.8](https://github.com/fhswf/appointme/compare/common@1.1.7...common@1.1.8) (2024-10-09)


### Bug Fixes

* improve readability ([0789e2e](https://github.com/fhswf/appointme/commit/0789e2e089126adcf3e16c4198cbac45c4b609fd))

## common [1.1.7](https://github.com/fhswf/appointme/compare/common@1.1.6...common@1.1.7) (2024-10-08)


### Bug Fixes

* **security:** remove password attribute ([79c4584](https://github.com/fhswf/appointme/commit/79c4584e57c0f462c82ec3640fbd6b13faaeb311))
* sonarqube issues ([3ebe2a5](https://github.com/fhswf/appointme/commit/3ebe2a509d16e3da9c7d23c006d5ea81b14c918f))

## common [1.1.6](https://github.com/fhswf/appointme/compare/common@1.1.5...common@1.1.6) (2024-10-04)


### Bug Fixes

* **test:** test before sonarqube analysis ([d91fa5d](https://github.com/fhswf/appointme/commit/d91fa5d79ac2494b9f4e2f5ad76105897b4a6dab))
* **test:** test before sonarqube analysis ([c12d1e5](https://github.com/fhswf/appointme/commit/c12d1e58fcac663bd28f7c3476cf8df289c65b7c))
* **test:** test before sonarqube analysis ([a7ce602](https://github.com/fhswf/appointme/commit/a7ce602f1a7b81d51f181f40d874a50a364154a1))
* **test:** test before sonarqube analysis ([eb7b3bc](https://github.com/fhswf/appointme/commit/eb7b3bc9c313d5378324f728c8a0b088a34e8469))
* **test:** unit tests ([8514158](https://github.com/fhswf/appointme/commit/8514158888043487357416af98201300b33b9341))
* **test:** version & config updates ([0dbd7fd](https://github.com/fhswf/appointme/commit/0dbd7fdc9e79db5269f849912ccb91a16bebb618))

## common [1.1.5](https://github.com/fhswf/appointme/compare/common@1.1.4...common@1.1.5) (2024-09-24)


### Bug Fixes

* module resolution ([c2f37d6](https://github.com/fhswf/appointme/commit/c2f37d645eeab8bc85301736d24304f198f7496e))

## common [1.1.4](https://github.com/fhswf/appointme/compare/common@1.1.3...common@1.1.4) (2024-09-24)


### Bug Fixes

* module resolution ([6263324](https://github.com/fhswf/appointme/commit/6263324b72feff539720dffd264891b8dbd4b52d))

## common [1.1.3](https://github.com/fhswf/appointme/compare/common@1.1.2...common@1.1.3) (2024-09-24)


### Bug Fixes

* **ui:** changes for vite & mui 6 ([2aab61e](https://github.com/fhswf/appointme/commit/2aab61e7b67692c40872960b9f4d6fad35e239f9))

## common [1.1.2](https://github.com/fhswf/appointme/compare/common@1.1.1...common@1.1.2) (2024-09-24)


### Bug Fixes

* module deps ([630b92b](https://github.com/fhswf/appointme/commit/630b92b70e7ba1382d284fba0c80faa28276090c))

## common [1.1.1](https://github.com/fhswf/appointme/compare/common@1.1.0...common@1.1.1) (2024-06-17)


### Bug Fixes

* **common:** fix IntervalSet constructor ([bd113bb](https://github.com/fhswf/appointme/commit/bd113bbc1e0ef5fd4b613de53a16f4dae74ee98f))

# common [1.1.0](https://github.com/fhswf/appointme/compare/common@1.0.0...common@1.1.0) (2023-10-09)


### Features

* quality assurance ([#124](https://github.com/fhswf/appointme/issues/124)) ([2f457e5](https://github.com/fhswf/appointme/commit/2f457e52251110d6f6eb695e2467e41d2bfe9b73))

# common 1.0.0 (2023-09-10)


### Bug Fixes

* **build:** fix build of appointme-common ([01f4a8e](https://github.com/fhswf/appointme/commit/01f4a8e5475c8f425a0857b571b4735b1ddeb8b5))
* **build:** fix CI build ([b420d77](https://github.com/fhswf/appointme/commit/b420d7751eb1a4eb33b4ad4a3462ec52d0449b2c))
* **build:** fix CI build on GitHub ([f866ccd](https://github.com/fhswf/appointme/commit/f866ccdcf2cbbf455253491da7b0e699a8a5c2b2))
* deleting event types ([8ef7e37](https://github.com/fhswf/appointme/commit/8ef7e37f9b68679c48295c1bbd84fed869218c55))
* freeBusy service corrected ([c2d8590](https://github.com/fhswf/appointme/commit/c2d85904dfb2393faadf1caa4dd1b4af107e44f9))
* Rename url field ([f90c59c](https://github.com/fhswf/appointme/commit/f90c59c1f2dbe07f26282c02733940f3d610ba4b))
* semantic release config ([981919d](https://github.com/fhswf/appointme/commit/981919d114991237ba83a04dbc95e04f29ed30f1))
* semantic-release config ([7ac94ec](https://github.com/fhswf/appointme/commit/7ac94ec675b5b1a9644a013e208f214aeb7300fe))
* semantic-release for common ([26849ff](https://github.com/fhswf/appointme/commit/26849ffb30d86ad34015a7c58158f0a74803b6f1))
* timezone issue in interpretation of slots fixed ([1e22baf](https://github.com/fhswf/appointme/commit/1e22bafc1ab7322a32b5da85b78ef7e6fada4039))
* UI glitches fixed ([2720b9d](https://github.com/fhswf/appointme/commit/2720b9d26ee4779988d71275e1d7ff4e3cc94bb1))
* yarn build/dependency management & docker ([eaae025](https://github.com/fhswf/appointme/commit/eaae025680d1a840765406f2c3fb2eed9c238c43))


### Features

* common classes for handling free/busy intervals ([3a461f4](https://github.com/fhswf/appointme/commit/3a461f461b04f1a7bec12ee551ef6849cfb2afaf))
* **event type:** add min/max timespan for events, add maximum number of events per day ([59454e7](https://github.com/fhswf/appointme/commit/59454e7169da395f2bd071e77fb74f0eadf6557f))
* **event type:** remove deprecated fields ([4f85047](https://github.com/fhswf/appointme/commit/4f85047cf3f0520873785011b8071308218c7880))

# [@fhswf/appointme-common-v1.3.1](https://github.com/fhswf/appointme/compare/@fhswf/appointme-common-v1.3.0...@fhswf/appointme-common-v1.3.1) (2021-05-28)


### Bug Fixes

* **build:** fix CI build ([b420d77](https://github.com/fhswf/appointme/commit/b420d7751eb1a4eb33b4ad4a3462ec52d0449b2c))
* **build:** fix CI build on GitHub ([f866ccd](https://github.com/fhswf/appointme/commit/f866ccdcf2cbbf455253491da7b0e699a8a5c2b2))

# [@fhswf/appointme-common-v1.3.0](https://github.com/fhswf/appointme/compare/@fhswf/appointme-common-v1.2.1...@fhswf/appointme-common-v1.3.0) (2021-05-28)


### Features

* **event type:** remove deprecated fields ([4f85047](https://github.com/fhswf/appointme/commit/4f85047cf3f0520873785011b8071308218c7880))

# [@fhswf/appointme-common-v1.2.1](https://github.com/fhswf/appointme/compare/@fhswf/appointme-common-v1.2.0...@fhswf/appointme-common-v1.2.1) (2021-05-28)


### Bug Fixes

* **build:** fix build of appointme-common ([01f4a8e](https://github.com/fhswf/appointme/commit/01f4a8e5475c8f425a0857b571b4735b1ddeb8b5))

# [@fhswf/appointme-common-v1.2.0](https://github.com/fhswf/appointme/compare/@fhswf/appointme-common-v1.1.0...@fhswf/appointme-common-v1.2.0) (2021-05-28)


### Features

* **event type:** add min/max timespan for events, add maximum number of events per day ([59454e7](https://github.com/fhswf/appointme/commit/59454e7169da395f2bd071e77fb74f0eadf6557f))

# [@fhswf/appointme-common-v1.1.0](https://github.com/fhswf/appointme/compare/@fhswf/appointme-common-v1.0.0...@fhswf/appointme-common-v1.1.0) (2021-05-24)


### Bug Fixes

* deleting event types ([8ef7e37](https://github.com/fhswf/appointme/commit/8ef7e37f9b68679c48295c1bbd84fed869218c55))
* freeBusy service corrected ([c2d8590](https://github.com/fhswf/appointme/commit/c2d85904dfb2393faadf1caa4dd1b4af107e44f9))
* timezone issue in interpretation of slots fixed ([1e22baf](https://github.com/fhswf/appointme/commit/1e22bafc1ab7322a32b5da85b78ef7e6fada4039))
* UI glitches fixed ([2720b9d](https://github.com/fhswf/appointme/commit/2720b9d26ee4779988d71275e1d7ff4e3cc94bb1))


### Features

* common classes for handling free/busy intervals ([3a461f4](https://github.com/fhswf/appointme/commit/3a461f461b04f1a7bec12ee551ef6849cfb2afaf))

# @fhswf/appointme-common-v1.0.0 (2021-05-17)


### Bug Fixes

* Rename url field ([f90c59c](https://github.com/fhswf/appointme/commit/f90c59c1f2dbe07f26282c02733940f3d610ba4b))
* semantic-release for common ([26849ff](https://github.com/fhswf/appointme/commit/26849ffb30d86ad34015a7c58158f0a74803b6f1))
