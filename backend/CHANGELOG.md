# backend [1.22.0](https://github.com/fhswf/book_me/compare/backend@1.21.0...backend@1.22.0) (2025-12-09)


### Features

* Add optional email field to CalDAV accounts and use it for event organizers when creating events. ([6283fdc](https://github.com/fhswf/book_me/commit/6283fdc9f3c682e52cee82a4f859d90032928300))





### Dependencies

* **common:** upgraded to 1.5.0

# backend [1.21.0](https://github.com/fhswf/book_me/compare/backend@1.20.0...backend@1.21.0) (2025-12-09)


### Features

* Allow SMTP configuration without authentication and update K8s manifests and tests. ([1a3dee0](https://github.com/fhswf/book_me/commit/1a3dee0ce116c6542236dfeda1e206ddb0f1467e))

# backend [1.20.0](https://github.com/fhswf/book_me/compare/backend@1.19.0...backend@1.20.0) (2025-12-09)


### Features

* Add ENCRYPTION_KEY environment variable for CalDAV password encryption to deployment, secret example, and README. ([12dc113](https://github.com/fhswf/book_me/commit/12dc113cb4f337c28fd6b313665bc362d090f62f))

# backend [1.19.0](https://github.com/fhswf/book_me/compare/backend@1.18.0...backend@1.19.0) (2025-12-09)


### Features

* add Kubernetes deployment examples for ConfigMap and Secret, update README and gitignore. ([beb7391](https://github.com/fhswf/book_me/commit/beb739184d4d3a91b660297ab9a9dd34ae453259))

# backend [1.18.0](https://github.com/fhswf/book_me/compare/backend@1.17.0...backend@1.18.0) (2025-12-09)


### Bug Fixes

* Correct 'Invitaion' typo in event invitation subject and feat: introduce navigation after calendar updates and internationalize CalDav UI text. ([0b2e7c4](https://github.com/fhswf/book_me/commit/0b2e7c4a211cf1054fd81110fa64e686a50c35a8))
* Refine TypeScript type annotations in CalDAV controller and authentication test mocks. ([129ff15](https://github.com/fhswf/book_me/commit/129ff152c9208e2d494d68039ac5a7a5d5c4d63f))
* Sanitize HTML in email invitation content for attendee name, event summary, and description, and add a corresponding test. ([d9d77fb](https://github.com/fhswf/book_me/commit/d9d77fbe543690ea85d4949015f0dfd6a4415d24))
* syntax error in deployment.yaml ([1ac2707](https://github.com/fhswf/book_me/commit/1ac2707de8e1c37639198291d5bd9d8d1addc9d8))


### Features

* add comprehensive tests for EventForm fields and submit button, refine Login and OidcCallback tests, and update EventList navigation tests. ([179f4d6](https://github.com/fhswf/book_me/commit/179f4d60678b97cdf88e69d1017c8e5c6e1078e7))
* Add configurable SMTP support to mailer, falling back to Gmail service. ([01767b1](https://github.com/fhswf/book_me/commit/01767b11d2853a199fad6a0e278a7e5a0489ae60))
* Add new i18n keys for booking and CalDav features, and refine iCal attendee RSVP logic. ([0c1872f](https://github.com/fhswf/book_me/commit/0c1872fa8fe7b4d15fe58dba5acb4166cfef8845))
* add OIDC controller tests and update Vitest dependencies. ([8d80865](https://github.com/fhswf/book_me/commit/8d8086527915a67e4868b62cf944a55a10794c32))
* Add rate limiting to OIDC `/url` and `/login` endpoints. ([ba54e48](https://github.com/fhswf/book_me/commit/ba54e488da832e7204ad719ae32af98c674e0dd0))
* Add scheduler utility, OIDC callback tests, Google event insertion, and enable event controller tests. ([83ade1d](https://github.com/fhswf/book_me/commit/83ade1dba8966463cab7aec894cf651785ff576c))
* i18n restructured ([2d25c89](https://github.com/fhswf/book_me/commit/2d25c895228f4c4ad17e4237ba5c45f229527fa9))
* Implement OIDC authentication flow ([d8e4cdd](https://github.com/fhswf/book_me/commit/d8e4cdd073a99338257b2ee90721bd91afa0b633))
* Introduce iCal utility to centralize ICS generation and enhance event creation with user comments for CalDAV, Google Calendar, and email invitations. ([657c969](https://github.com/fhswf/book_me/commit/657c969d61806e674e57d1ea075df8e1ba8cc7b2))
* Prevent Mongoose model re-compilation, enhance OIDC controller tests for unconfigured scenarios, and include `.tsx` files in SonarQube test inclusions. ([f8d0b7f](https://github.com/fhswf/book_me/commit/f8d0b7f47ef8fe4a6ed239a75664bbd4fb684b9d))
* test duplicate `user_url` ([f730e0b](https://github.com/fhswf/book_me/commit/f730e0b27ab7aaa3bf17bd10ef0fcbad3b9fb353))

# backend [1.18.0](https://github.com/fhswf/book_me/compare/backend@1.17.0...backend@1.18.0) (2025-12-09)


### Bug Fixes

* Correct 'Invitaion' typo in event invitation subject and feat: introduce navigation after calendar updates and internationalize CalDav UI text. ([0b2e7c4](https://github.com/fhswf/book_me/commit/0b2e7c4a211cf1054fd81110fa64e686a50c35a8))
* Sanitize HTML in email invitation content for attendee name, event summary, and description, and add a corresponding test. ([d9d77fb](https://github.com/fhswf/book_me/commit/d9d77fbe543690ea85d4949015f0dfd6a4415d24))
* syntax error in deployment.yaml ([1ac2707](https://github.com/fhswf/book_me/commit/1ac2707de8e1c37639198291d5bd9d8d1addc9d8))


### Features

* add comprehensive tests for EventForm fields and submit button, refine Login and OidcCallback tests, and update EventList navigation tests. ([179f4d6](https://github.com/fhswf/book_me/commit/179f4d60678b97cdf88e69d1017c8e5c6e1078e7))
* Add configurable SMTP support to mailer, falling back to Gmail service. ([01767b1](https://github.com/fhswf/book_me/commit/01767b11d2853a199fad6a0e278a7e5a0489ae60))
* Add new i18n keys for booking and CalDav features, and refine iCal attendee RSVP logic. ([0c1872f](https://github.com/fhswf/book_me/commit/0c1872fa8fe7b4d15fe58dba5acb4166cfef8845))
* add OIDC controller tests and update Vitest dependencies. ([8d80865](https://github.com/fhswf/book_me/commit/8d8086527915a67e4868b62cf944a55a10794c32))
* Add rate limiting to OIDC `/url` and `/login` endpoints. ([ba54e48](https://github.com/fhswf/book_me/commit/ba54e488da832e7204ad719ae32af98c674e0dd0))
* Add scheduler utility, OIDC callback tests, Google event insertion, and enable event controller tests. ([83ade1d](https://github.com/fhswf/book_me/commit/83ade1dba8966463cab7aec894cf651785ff576c))
* i18n restructured ([2d25c89](https://github.com/fhswf/book_me/commit/2d25c895228f4c4ad17e4237ba5c45f229527fa9))
* Implement OIDC authentication flow ([d8e4cdd](https://github.com/fhswf/book_me/commit/d8e4cdd073a99338257b2ee90721bd91afa0b633))
* Introduce iCal utility to centralize ICS generation and enhance event creation with user comments for CalDAV, Google Calendar, and email invitations. ([657c969](https://github.com/fhswf/book_me/commit/657c969d61806e674e57d1ea075df8e1ba8cc7b2))
* Prevent Mongoose model re-compilation, enhance OIDC controller tests for unconfigured scenarios, and include `.tsx` files in SonarQube test inclusions. ([f8d0b7f](https://github.com/fhswf/book_me/commit/f8d0b7f47ef8fe4a6ed239a75664bbd4fb684b9d))
* test duplicate `user_url` ([f730e0b](https://github.com/fhswf/book_me/commit/f730e0b27ab7aaa3bf17bd10ef0fcbad3b9fb353))

# backend [1.17.0](https://github.com/fhswf/book_me/compare/backend@1.16.0...backend@1.17.0) (2025-12-08)


### Bug Fixes

* **auth:** default for API_URL ([ff39be6](https://github.com/fhswf/book_me/commit/ff39be61286082a80562668360927eacd5fcbf0f))
* **auth:** default for API_URL ([a0da198](https://github.com/fhswf/book_me/commit/a0da1988df228c30e80cd2ed3c76ed89890531bf))
* **authentication:** remove client-accessible token ([3e371cc](https://github.com/fhswf/book_me/commit/3e371cc811581404e3d5e2ae3563e8f86880c4c4))
* automated docker build ([c1f2de3](https://github.com/fhswf/book_me/commit/c1f2de3cbd41a2c65f21a3d861901db710f6da65))
* **backend:** change type to module ([dc52879](https://github.com/fhswf/book_me/commit/dc52879130a7b0bd4d222670d228d7222f726c5c))
* **backend:** config warnings ([13b571a](https://github.com/fhswf/book_me/commit/13b571a1b48feef6f5b4c1da8de4f792485700e1))
* **backend:** import in test spec ([a2d997a](https://github.com/fhswf/book_me/commit/a2d997ad16b0bdbd8b82c1a19d9c849f219bf02c))
* **backend:** JWT_SECRET and email passwords ([63596b0](https://github.com/fhswf/book_me/commit/63596b02e3996bc721784954a4dc341b4446e07a))
* **backend:** quality improvement ([5cc5862](https://github.com/fhswf/book_me/commit/5cc58625aabf612078a4d725c4e0e5a3670b08cd))
* **backend:** token verification ([4172337](https://github.com/fhswf/book_me/commit/41723375ab877eead79c6b24bfed51da37819dbe))
* **backend:** typescript config ([06f4656](https://github.com/fhswf/book_me/commit/06f46565111fdd5b7d7c86f2d3d58aac3c523926))
* build backend image via gh action ([7226d2d](https://github.com/fhswf/book_me/commit/7226d2dd0ed040b082c30061fbe9f8ddd2560370))
* build backend image via gh action ([eec81e5](https://github.com/fhswf/book_me/commit/eec81e555588fd90177a300d99d7a1c117f30e0e))
* build backend image via gh action ([7a418a9](https://github.com/fhswf/book_me/commit/7a418a9609f7dd3f4a2acbb8563c72ddcd17e898))
* build backend image via gh action ([1d1a733](https://github.com/fhswf/book_me/commit/1d1a733a3ff55ce1746cb068c776cbf0a39fe4c6))
* **bump dependencies:** upgrade several dependencies ([39d06e3](https://github.com/fhswf/book_me/commit/39d06e3986ec8911d03cfe50286e6a09e494dbea))
* **client:** docker deployment & typing ([13ddc53](https://github.com/fhswf/book_me/commit/13ddc53aad4afb5bb627f35063b3f1c856c51424))
* **config:** update config values ([6ced70e](https://github.com/fhswf/book_me/commit/6ced70eba462830ce7d42c55ad75669a99e05fcb))
* controller should not return a promise ([2070fd5](https://github.com/fhswf/book_me/commit/2070fd56f195187ca35e03e838d9b259a6431710))
* correct api url configuration ([1c65124](https://github.com/fhswf/book_me/commit/1c6512411ed3a6cc2026b7c37fcb0f1192c3a8e6))
* CORS for debugging ([74f56f1](https://github.com/fhswf/book_me/commit/74f56f19ee966adb72db0120e00e9e8b058cea1a))
* deployment on appoint.gawron.cloud ([9023b45](https://github.com/fhswf/book_me/commit/9023b4517a11275bccd881597f3b3dbfd1f71cdd))
* **deployment:** resource limits ([e59b219](https://github.com/fhswf/book_me/commit/e59b219caf9dfc04b05d5d23a925afac430e303d))
* **deployment:** separate deployment & ingress config ([2cc83f5](https://github.com/fhswf/book_me/commit/2cc83f5f698c063c84f8515c82afa85d2e66e91f))
* **deployment:** update via semantic release ([8dd703e](https://github.com/fhswf/book_me/commit/8dd703ea931d01d4b1eaf911ee56e8c85f24a606))
* do not overwrite calendar settings upon login ([195f7fe](https://github.com/fhswf/book_me/commit/195f7fe0d8685f06b87a53f23336b4bee88dc605))
* do not update google tokens via user controller ([6c9eee3](https://github.com/fhswf/book_me/commit/6c9eee3ce070cf07ebad92e4d66020a07ade935c))
* dotenv config for backend ([714a7c0](https://github.com/fhswf/book_me/commit/714a7c06eeff750278a0fa6e851ff31798be362c))
* edit available times ([#5](https://github.com/fhswf/book_me/issues/5)) ([74f1d3a](https://github.com/fhswf/book_me/commit/74f1d3aab871a27b1f66dcf9e4854f0221c99b74))
* enable cookies for CORS requests ([c49e148](https://github.com/fhswf/book_me/commit/c49e1485b4faaebd6f2738733eacb20eca3fa0bd))
* enable cookies for CORS requests ([4a20b82](https://github.com/fhswf/book_me/commit/4a20b82bc48d2d511c5eef59960395bdfb961540))
* Enhance CalDAV error reporting and introduce a manual testing script for CalDAV integration. ([4fbb38b](https://github.com/fhswf/book_me/commit/4fbb38bab25af0aed6fc81b59a5748781e2b2a6a))
* freeBusy service corrected ([ff80003](https://github.com/fhswf/book_me/commit/ff8000327717a67a42b326c1acce906112bbb250))
* **freeBusy:** filter out free slots shorter than the event duration ([4179f8b](https://github.com/fhswf/book_me/commit/4179f8b8a2681a00a09919a9027a888c5f91fc8d))
* github actions for semantic release fixed ([7789df7](https://github.com/fhswf/book_me/commit/7789df7d31d491bd876ce2d93272f1c4c5452ced))
* improve quality ([c82d164](https://github.com/fhswf/book_me/commit/c82d164c48163ba884e602391492c3683a2bcad7))
* **insertEvent:** check availablility of requested slot in backend ([ddaa7f7](https://github.com/fhswf/book_me/commit/ddaa7f7088bfac17abff8f4d1706d8d2ebcdc0fe)), closes [#27](https://github.com/fhswf/book_me/issues/27)
* **k8s:** security settings ([5a4b1a4](https://github.com/fhswf/book_me/commit/5a4b1a4f4c87e231ea17ca9837a4638022565cfe))
* **logging:** log CORS config ([7872a72](https://github.com/fhswf/book_me/commit/7872a7255dcef772ec2242745326e56ad291e6e4))
* **logging:** log CORS config ([c9b7cc0](https://github.com/fhswf/book_me/commit/c9b7cc019391160a4cc05ef63be069e52247d9fa))
* make redirect URL configurable ([4ceea0c](https://github.com/fhswf/book_me/commit/4ceea0c4e26599b758402cc96b23eac9c62b72aa))
* Migrate to Google Sign In ([fcda431](https://github.com/fhswf/book_me/commit/fcda431c95c118368a5e1a4abed2ad7eee5cc2b7))
* module deps ([1e746bb](https://github.com/fhswf/book_me/commit/1e746bb38f6ea4242ba4a379ab761d7ffc46c361))
* module import ([6a42b74](https://github.com/fhswf/book_me/commit/6a42b7490f4153a95c8c11a5814c07a1acc7523d))
* module import ([36b1f5b](https://github.com/fhswf/book_me/commit/36b1f5be7ed35abdf6b53ef581841a310a537a11))
* module resolution ([6b3eb2d](https://github.com/fhswf/book_me/commit/6b3eb2d032a7349c117ff738dd1c84c00e00d9e3))
* module resolution ([fdd128e](https://github.com/fhswf/book_me/commit/fdd128ee14ca2855c15b9353400166cd7fd3943f))
* multi-release ([0e18282](https://github.com/fhswf/book_me/commit/0e18282ceac0b39840802682101c132c8896eec2))
* multi-release ([8ab5317](https://github.com/fhswf/book_me/commit/8ab531792d16509166c49b3aba82d242d41ed500))
* rate limiting ([c3c89bd](https://github.com/fhswf/book_me/commit/c3c89bd6b7411c40d415f2a0deb5a65af1fa6cf0))
* redirect to calendar integration ([e305329](https://github.com/fhswf/book_me/commit/e305329a86cc80158ad604940c045261ff9bd4c2))
* redirect to calendar integration ([89f8597](https://github.com/fhswf/book_me/commit/89f85972fb8e4c30eaece662db1c559e12960286))
* refactor event controller ([b3eb06e](https://github.com/fhswf/book_me/commit/b3eb06e30bbec8b29094d00131deff4bff0ea8d0))
* refactor event controller ([c94aec7](https://github.com/fhswf/book_me/commit/c94aec7ed60bb0868cce158cb643a8ce45b00e12))
* refactor user type ([991dd29](https://github.com/fhswf/book_me/commit/991dd2924d71373ed667ca862aa36d6245021d20))
* remove unused routes ([a29a54e](https://github.com/fhswf/book_me/commit/a29a54e995d66054b42979e1bf2dc6b1f2f1afda))
* resource limits ([04b261c](https://github.com/fhswf/book_me/commit/04b261c4f9738f4d173feaf5c929f22147703bf0))
* security updates ([f96e262](https://github.com/fhswf/book_me/commit/f96e26276bf4a0dc5013971c4094ee3a64fbdcf7))
* **security:** enforce TLS with nodemailer ([bfbfa5f](https://github.com/fhswf/book_me/commit/bfbfa5fd6bceb9147dc0eb35f41d8ba89d761b96))
* **security:** remove password attribute ([a1fb3e5](https://github.com/fhswf/book_me/commit/a1fb3e5abdacd6037a76ee24b357c71658162f18))
* **security:** remove secret from docker image ([0c9d6f3](https://github.com/fhswf/book_me/commit/0c9d6f3940153244c16fb6f3b23bd437049e7cd9))
* semantic release config ([b638ae1](https://github.com/fhswf/book_me/commit/b638ae1bf1f34ba6283a7ab61de5eaf406a27e20))
* semantic-release config ([e6b7a13](https://github.com/fhswf/book_me/commit/e6b7a1326964a2a7b5f3d088386e60deb6a3b077))
* set domain for cookie ([c876638](https://github.com/fhswf/book_me/commit/c8766385d00388a332b5bcf0f633db65c2954c0b))
* set sameSite: lax in development ([6a18a47](https://github.com/fhswf/book_me/commit/6a18a47fb53f4f0da65b95e1362296da43a29f2e))
* set sameSite: none in development ([bc3279d](https://github.com/fhswf/book_me/commit/bc3279d42a148be61374d6b044221853f26c13a3))
* sonarqube issues ([9f61182](https://github.com/fhswf/book_me/commit/9f6118235ffc9868413403b21cac0a36b1bac8e4))
* sonarqube issues ([e5d870b](https://github.com/fhswf/book_me/commit/e5d870b40da04c12cc277c1cdcfede15ddd09913))
* sonarqube issues ([89c0456](https://github.com/fhswf/book_me/commit/89c0456526614a2e10976ce45706baa5489c9d21))
* **test:** coverage for cypress tests ([ec5499d](https://github.com/fhswf/book_me/commit/ec5499d6b909a7e04010b7fb5b97aa8c30d16a8b))
* **test:** coverage for cypress tests ([505550d](https://github.com/fhswf/book_me/commit/505550dfd722a13a13c1568990602df982cec66e))
* testing ([d74b86f](https://github.com/fhswf/book_me/commit/d74b86ff227c26cc6e1e1d40b92b32c2fc3c6a63))
* **test:** mock google calendar ([ffc15fb](https://github.com/fhswf/book_me/commit/ffc15fba1453368bd35489c879c00ddc59d76869))
* **test:** test before sonarqube analysis ([50a3389](https://github.com/fhswf/book_me/commit/50a33892f69f3c0a82f8fb77d6c07b95a0dcc6b0))
* **test:** test before sonarqube analysis ([a5d856f](https://github.com/fhswf/book_me/commit/a5d856f1f4b55f543e5d3e21840fdad2001cff0d))
* **test:** test before sonarqube analysis ([a6d28c6](https://github.com/fhswf/book_me/commit/a6d28c6e4e3017c9716f2328e784fadc7c30550c))
* **test:** test before sonarqube analysis ([966b558](https://github.com/fhswf/book_me/commit/966b558099ccf7ec09f30c8676c0b1e9ba9cc9c1))
* **test:** version & config updates ([266684c](https://github.com/fhswf/book_me/commit/266684cc69a162ee968ac3ebcce8613df1f25244))
* transfer timestamp as integer ([4753bd4](https://github.com/fhswf/book_me/commit/4753bd45e879a5f1f56748cedfc8a92c12a938a4))
* typescript issues ([15a4cc1](https://github.com/fhswf/book_me/commit/15a4cc1c5caf2c14d4d4c0a60695c155b08f6d57))
* UI glitches fixed ([14783e1](https://github.com/fhswf/book_me/commit/14783e13cd00b7e3d05aac64354ca30157a679c0))
* **ui:** changes for vite & mui 6 ([6fc7016](https://github.com/fhswf/book_me/commit/6fc701620d3c9931cbc072e62fb375a96928080d))
* update docker build to use yarn ([5b5ed89](https://github.com/fhswf/book_me/commit/5b5ed8996b9e9a6fb6386da935a4f8c95d878251))
* **workflow:** delete obsolete workflow files ([7fa0e67](https://github.com/fhswf/book_me/commit/7fa0e678227763bbc0c02efd9dbf2c3fad7435d4))
* **workflow:** update version in package.json ([e0037a7](https://github.com/fhswf/book_me/commit/e0037a7dde4aeaf4f4ed6c31958a4f050e0f94b3))
* yarn build/dependency management & docker ([5b491e6](https://github.com/fhswf/book_me/commit/5b491e6b0005db98837286b411d8de9a13fdbb7a))


### Features

* Add authentication and event controller tests and fix authentication flow. ([e9089d5](https://github.com/fhswf/book_me/commit/e9089d5d7153caaa7fb17fa0ce5868174f8aca41))
* **backend:** calender events ([6262e39](https://github.com/fhswf/book_me/commit/6262e394c914de06600c493fe406e1f0ee5ef49f))
* **backend:** CORS entry for appoint.gawron.cloud ([b0ed4b5](https://github.com/fhswf/book_me/commit/b0ed4b5364b266a80ddeeca7f733a16b4e6d003c))
* **backend:** store access token in cookie ([8241926](https://github.com/fhswf/book_me/commit/824192629bec518322d562578ba0451ef9b464d8))
* caldav integration ([ddc3773](https://github.com/fhswf/book_me/commit/ddc37730f4ccd50b57f70a60394276f3abd29273))
* caldav integration ([5b7fb4d](https://github.com/fhswf/book_me/commit/5b7fb4d62acd3ccb94e4da94dad1585d9df9c716))
* CalDAV integration ([3d42396](https://github.com/fhswf/book_me/commit/3d423964f8417aa8df136ed84c9bb92d6fb16024))
* **calendar:** allow guests to modify an event ([f815931](https://github.com/fhswf/book_me/commit/f81593101d2633a6d38f8bf8e532c6e42cb53945))
* docker build in release ([b6b7b43](https://github.com/fhswf/book_me/commit/b6b7b430ba6d05d73366f45f00e87f03bfadcfc4))
* docker build in release ([dc61033](https://github.com/fhswf/book_me/commit/dc61033d30f1cae5acef61feacd3afbe479ffabb))
* docker build in release ([845feae](https://github.com/fhswf/book_me/commit/845feae2e366527d28f6a65c869efbf96d0e7043))
* docker build in release ([d7ac528](https://github.com/fhswf/book_me/commit/d7ac5284923a7cac9a9ece4ef5ce6e7dff31ac61))
* docker build in release ([24dc4b2](https://github.com/fhswf/book_me/commit/24dc4b249ed6141caf9838b159e4a23d0a6e9b0a))
* docker build in release ([f8ad783](https://github.com/fhswf/book_me/commit/f8ad783b66842bef7a11217d42c556463ac97b40))
* docker build in release ([6b3d4f7](https://github.com/fhswf/book_me/commit/6b3d4f741eadfe376ec0bf285d3b6422570ea4a4))
* docker build in release ([75f655f](https://github.com/fhswf/book_me/commit/75f655f57953a5ebd1dc5e22164fe182f743840d))
* docker build in release ([45bb72f](https://github.com/fhswf/book_me/commit/45bb72f47bf7f0eb88f5ff6547a8cd67aed98496))
* docker build in release ([c87aab2](https://github.com/fhswf/book_me/commit/c87aab26f5f064bb30e592d7c4c08fbba04d75a4))
* docker build in release ([827d4c8](https://github.com/fhswf/book_me/commit/827d4c860f7c95425470cf5be48a0bf31a72b1b0))
* docker build in release ([072330c](https://github.com/fhswf/book_me/commit/072330c19ea33aee7775db346008ae0f0adeb0ce))
* docker build in release ([d60907c](https://github.com/fhswf/book_me/commit/d60907c8f9205fdc4efdd8582debe870b4964e18))
* docker build in release ([3bf3c12](https://github.com/fhswf/book_me/commit/3bf3c123c0e59618ced40eb5a5ae5192b20bb5fd))
* docker build in release ([5834136](https://github.com/fhswf/book_me/commit/5834136b16d3cdb20f89f450acab79f40a1ce739))
* docker build in release ([6bb006e](https://github.com/fhswf/book_me/commit/6bb006e04d0b6cc5829d680bca41c8c92235e5c8))
* **freeBusy:** check maxPerDay constraint ([2f4c391](https://github.com/fhswf/book_me/commit/2f4c3919be4616b0375044ac08ee411aa1fff544))
* **freeBusy:** freeBusy should observe minFuture and maxFuture restrictictions of an event ([93847d1](https://github.com/fhswf/book_me/commit/93847d15685d370bb58a4a19b522b72d24e946aa))
* Implement CSRF protection by adding a new CSRF service and integrating CSRF tokens into client requests and backend server logic. ([1ccd011](https://github.com/fhswf/book_me/commit/1ccd011a6cfbf7848db4479715c96533764de837))
* implement email event invitations with ICS attachments via new mailer utility. ([40a72c0](https://github.com/fhswf/book_me/commit/40a72c0bfc61a3c893cb60c48b8bf74c420c952a))
* Implement Google Calendar event insertion, improve free/busy time calculation, and add token revocation. ([c2e86b3](https://github.com/fhswf/book_me/commit/c2e86b34ae2923a598daa9e513c94a63926b4ccf))
* Implement per-user OAuth2Client creation with automatic token refresh and refine token update logic, adding new tests. ([19b0f8b](https://github.com/fhswf/book_me/commit/19b0f8bb57e807dd843e1a2c35bb49bc38cc07bc))
* improve test coverage ([04cb13a](https://github.com/fhswf/book_me/commit/04cb13a303fce553cb33226b912314cc6fa43f4f))
* Integrate `sonner` for client-side toast notifications, enhance backend authentication error handling, and update ESLint configuration. ([ec29e58](https://github.com/fhswf/book_me/commit/ec29e58aca49a9da67e7a6b6442015fbeae59514))
* Integrate CalDAV busy slot fetching into free slot calculation and improve environment variable loading. ([7983f06](https://github.com/fhswf/book_me/commit/7983f0612090a5628865bf4723c1575b6d6fd3a9))
* local development ([406bd5f](https://github.com/fhswf/book_me/commit/406bd5f219cd22420c0a4bffa16c73460828c91f))
* **logging:** use winston for logging ([6a0e299](https://github.com/fhswf/book_me/commit/6a0e2991e8859366f4a1b1a92683adbd7ebec36e))
* **logging:** use winston for logging ([1d6d130](https://github.com/fhswf/book_me/commit/1d6d130cf3942c1ce5943ef599f670b307f974da))
* **markdown:** handle event type description as markdown. ([87731b1](https://github.com/fhswf/book_me/commit/87731b1288460ebff551da5f77d5b080a799fc89))
* new rest api ([a8f823f](https://github.com/fhswf/book_me/commit/a8f823f8aec8116a302cf7e326f2edbc81b97218))
* new rest api ([f4e42c3](https://github.com/fhswf/book_me/commit/f4e42c3cad3202c54114fbbea64d4f7ca583c879))
* refactoring CORS & dev container ([75596f7](https://github.com/fhswf/book_me/commit/75596f70cf7cdc9bd2d061c7733971a74bda2ac0))
* store access token in cookie ([32daf4e](https://github.com/fhswf/book_me/commit/32daf4ea65d415c2bce5eb2d276829f6fca96bf8))
* store access token in cookie ([0d1e499](https://github.com/fhswf/book_me/commit/0d1e49926e85fed710456e8b241aaf307e74a3e2))
* ui improvements ([2cd8dfe](https://github.com/fhswf/book_me/commit/2cd8dfee5038775ebb1c122a5bab0a8a2ecd62c4))
* Update encryption algorithm from AES-256-CBC to AES-256-GCM. ([04ccf64](https://github.com/fhswf/book_me/commit/04ccf6496eab32d6df67155531448e3ee17b8c5f))
* update encryption utility to use authentication tags and refine `Event` document type ([1b7db71](https://github.com/fhswf/book_me/commit/1b7db7125ac90c672cfa050cfc407496c0fad6a9))

# backend [1.17.0](https://github.com/fhswf/book_me/compare/backend@1.16.0...backend@1.17.0) (2025-12-08)


### Bug Fixes

* **auth:** default for API_URL ([ff39be6](https://github.com/fhswf/book_me/commit/ff39be61286082a80562668360927eacd5fcbf0f))
* **auth:** default for API_URL ([a0da198](https://github.com/fhswf/book_me/commit/a0da1988df228c30e80cd2ed3c76ed89890531bf))
* **authentication:** remove client-accessible token ([3e371cc](https://github.com/fhswf/book_me/commit/3e371cc811581404e3d5e2ae3563e8f86880c4c4))
* automated docker build ([c1f2de3](https://github.com/fhswf/book_me/commit/c1f2de3cbd41a2c65f21a3d861901db710f6da65))
* **backend:** change type to module ([dc52879](https://github.com/fhswf/book_me/commit/dc52879130a7b0bd4d222670d228d7222f726c5c))
* **backend:** config warnings ([13b571a](https://github.com/fhswf/book_me/commit/13b571a1b48feef6f5b4c1da8de4f792485700e1))
* **backend:** import in test spec ([a2d997a](https://github.com/fhswf/book_me/commit/a2d997ad16b0bdbd8b82c1a19d9c849f219bf02c))
* **backend:** JWT_SECRET and email passwords ([63596b0](https://github.com/fhswf/book_me/commit/63596b02e3996bc721784954a4dc341b4446e07a))
* **backend:** quality improvement ([5cc5862](https://github.com/fhswf/book_me/commit/5cc58625aabf612078a4d725c4e0e5a3670b08cd))
* **backend:** token verification ([4172337](https://github.com/fhswf/book_me/commit/41723375ab877eead79c6b24bfed51da37819dbe))
* **backend:** typescript config ([06f4656](https://github.com/fhswf/book_me/commit/06f46565111fdd5b7d7c86f2d3d58aac3c523926))
* build backend image via gh action ([7226d2d](https://github.com/fhswf/book_me/commit/7226d2dd0ed040b082c30061fbe9f8ddd2560370))
* build backend image via gh action ([eec81e5](https://github.com/fhswf/book_me/commit/eec81e555588fd90177a300d99d7a1c117f30e0e))
* build backend image via gh action ([7a418a9](https://github.com/fhswf/book_me/commit/7a418a9609f7dd3f4a2acbb8563c72ddcd17e898))
* build backend image via gh action ([1d1a733](https://github.com/fhswf/book_me/commit/1d1a733a3ff55ce1746cb068c776cbf0a39fe4c6))
* **bump dependencies:** upgrade several dependencies ([39d06e3](https://github.com/fhswf/book_me/commit/39d06e3986ec8911d03cfe50286e6a09e494dbea))
* **client:** docker deployment & typing ([13ddc53](https://github.com/fhswf/book_me/commit/13ddc53aad4afb5bb627f35063b3f1c856c51424))
* **config:** update config values ([6ced70e](https://github.com/fhswf/book_me/commit/6ced70eba462830ce7d42c55ad75669a99e05fcb))
* controller should not return a promise ([2070fd5](https://github.com/fhswf/book_me/commit/2070fd56f195187ca35e03e838d9b259a6431710))
* correct api url configuration ([1c65124](https://github.com/fhswf/book_me/commit/1c6512411ed3a6cc2026b7c37fcb0f1192c3a8e6))
* CORS for debugging ([74f56f1](https://github.com/fhswf/book_me/commit/74f56f19ee966adb72db0120e00e9e8b058cea1a))
* deployment on appoint.gawron.cloud ([9023b45](https://github.com/fhswf/book_me/commit/9023b4517a11275bccd881597f3b3dbfd1f71cdd))
* **deployment:** resource limits ([e59b219](https://github.com/fhswf/book_me/commit/e59b219caf9dfc04b05d5d23a925afac430e303d))
* **deployment:** separate deployment & ingress config ([2cc83f5](https://github.com/fhswf/book_me/commit/2cc83f5f698c063c84f8515c82afa85d2e66e91f))
* **deployment:** update via semantic release ([8dd703e](https://github.com/fhswf/book_me/commit/8dd703ea931d01d4b1eaf911ee56e8c85f24a606))
* do not overwrite calendar settings upon login ([195f7fe](https://github.com/fhswf/book_me/commit/195f7fe0d8685f06b87a53f23336b4bee88dc605))
* do not update google tokens via user controller ([6c9eee3](https://github.com/fhswf/book_me/commit/6c9eee3ce070cf07ebad92e4d66020a07ade935c))
* dotenv config for backend ([714a7c0](https://github.com/fhswf/book_me/commit/714a7c06eeff750278a0fa6e851ff31798be362c))
* edit available times ([#5](https://github.com/fhswf/book_me/issues/5)) ([74f1d3a](https://github.com/fhswf/book_me/commit/74f1d3aab871a27b1f66dcf9e4854f0221c99b74))
* enable cookies for CORS requests ([c49e148](https://github.com/fhswf/book_me/commit/c49e1485b4faaebd6f2738733eacb20eca3fa0bd))
* enable cookies for CORS requests ([4a20b82](https://github.com/fhswf/book_me/commit/4a20b82bc48d2d511c5eef59960395bdfb961540))
* Enhance CalDAV error reporting and introduce a manual testing script for CalDAV integration. ([4fbb38b](https://github.com/fhswf/book_me/commit/4fbb38bab25af0aed6fc81b59a5748781e2b2a6a))
* freeBusy service corrected ([ff80003](https://github.com/fhswf/book_me/commit/ff8000327717a67a42b326c1acce906112bbb250))
* **freeBusy:** filter out free slots shorter than the event duration ([4179f8b](https://github.com/fhswf/book_me/commit/4179f8b8a2681a00a09919a9027a888c5f91fc8d))
* github actions for semantic release fixed ([7789df7](https://github.com/fhswf/book_me/commit/7789df7d31d491bd876ce2d93272f1c4c5452ced))
* improve quality ([c82d164](https://github.com/fhswf/book_me/commit/c82d164c48163ba884e602391492c3683a2bcad7))
* **insertEvent:** check availablility of requested slot in backend ([ddaa7f7](https://github.com/fhswf/book_me/commit/ddaa7f7088bfac17abff8f4d1706d8d2ebcdc0fe)), closes [#27](https://github.com/fhswf/book_me/issues/27)
* **k8s:** security settings ([5a4b1a4](https://github.com/fhswf/book_me/commit/5a4b1a4f4c87e231ea17ca9837a4638022565cfe))
* **logging:** log CORS config ([7872a72](https://github.com/fhswf/book_me/commit/7872a7255dcef772ec2242745326e56ad291e6e4))
* **logging:** log CORS config ([c9b7cc0](https://github.com/fhswf/book_me/commit/c9b7cc019391160a4cc05ef63be069e52247d9fa))
* make redirect URL configurable ([4ceea0c](https://github.com/fhswf/book_me/commit/4ceea0c4e26599b758402cc96b23eac9c62b72aa))
* Migrate to Google Sign In ([fcda431](https://github.com/fhswf/book_me/commit/fcda431c95c118368a5e1a4abed2ad7eee5cc2b7))
* module deps ([1e746bb](https://github.com/fhswf/book_me/commit/1e746bb38f6ea4242ba4a379ab761d7ffc46c361))
* module import ([6a42b74](https://github.com/fhswf/book_me/commit/6a42b7490f4153a95c8c11a5814c07a1acc7523d))
* module import ([36b1f5b](https://github.com/fhswf/book_me/commit/36b1f5be7ed35abdf6b53ef581841a310a537a11))
* module resolution ([6b3eb2d](https://github.com/fhswf/book_me/commit/6b3eb2d032a7349c117ff738dd1c84c00e00d9e3))
* module resolution ([fdd128e](https://github.com/fhswf/book_me/commit/fdd128ee14ca2855c15b9353400166cd7fd3943f))
* multi-release ([0e18282](https://github.com/fhswf/book_me/commit/0e18282ceac0b39840802682101c132c8896eec2))
* multi-release ([8ab5317](https://github.com/fhswf/book_me/commit/8ab531792d16509166c49b3aba82d242d41ed500))
* rate limiting ([c3c89bd](https://github.com/fhswf/book_me/commit/c3c89bd6b7411c40d415f2a0deb5a65af1fa6cf0))
* redirect to calendar integration ([e305329](https://github.com/fhswf/book_me/commit/e305329a86cc80158ad604940c045261ff9bd4c2))
* redirect to calendar integration ([89f8597](https://github.com/fhswf/book_me/commit/89f85972fb8e4c30eaece662db1c559e12960286))
* refactor event controller ([b3eb06e](https://github.com/fhswf/book_me/commit/b3eb06e30bbec8b29094d00131deff4bff0ea8d0))
* refactor event controller ([c94aec7](https://github.com/fhswf/book_me/commit/c94aec7ed60bb0868cce158cb643a8ce45b00e12))
* refactor user type ([991dd29](https://github.com/fhswf/book_me/commit/991dd2924d71373ed667ca862aa36d6245021d20))
* remove unused routes ([a29a54e](https://github.com/fhswf/book_me/commit/a29a54e995d66054b42979e1bf2dc6b1f2f1afda))
* resource limits ([04b261c](https://github.com/fhswf/book_me/commit/04b261c4f9738f4d173feaf5c929f22147703bf0))
* security updates ([f96e262](https://github.com/fhswf/book_me/commit/f96e26276bf4a0dc5013971c4094ee3a64fbdcf7))
* **security:** enforce TLS with nodemailer ([bfbfa5f](https://github.com/fhswf/book_me/commit/bfbfa5fd6bceb9147dc0eb35f41d8ba89d761b96))
* **security:** remove password attribute ([a1fb3e5](https://github.com/fhswf/book_me/commit/a1fb3e5abdacd6037a76ee24b357c71658162f18))
* **security:** remove secret from docker image ([0c9d6f3](https://github.com/fhswf/book_me/commit/0c9d6f3940153244c16fb6f3b23bd437049e7cd9))
* semantic release config ([b638ae1](https://github.com/fhswf/book_me/commit/b638ae1bf1f34ba6283a7ab61de5eaf406a27e20))
* semantic-release config ([e6b7a13](https://github.com/fhswf/book_me/commit/e6b7a1326964a2a7b5f3d088386e60deb6a3b077))
* set domain for cookie ([c876638](https://github.com/fhswf/book_me/commit/c8766385d00388a332b5bcf0f633db65c2954c0b))
* set sameSite: lax in development ([6a18a47](https://github.com/fhswf/book_me/commit/6a18a47fb53f4f0da65b95e1362296da43a29f2e))
* set sameSite: none in development ([bc3279d](https://github.com/fhswf/book_me/commit/bc3279d42a148be61374d6b044221853f26c13a3))
* sonarqube issues ([9f61182](https://github.com/fhswf/book_me/commit/9f6118235ffc9868413403b21cac0a36b1bac8e4))
* sonarqube issues ([e5d870b](https://github.com/fhswf/book_me/commit/e5d870b40da04c12cc277c1cdcfede15ddd09913))
* sonarqube issues ([89c0456](https://github.com/fhswf/book_me/commit/89c0456526614a2e10976ce45706baa5489c9d21))
* **test:** coverage for cypress tests ([ec5499d](https://github.com/fhswf/book_me/commit/ec5499d6b909a7e04010b7fb5b97aa8c30d16a8b))
* **test:** coverage for cypress tests ([505550d](https://github.com/fhswf/book_me/commit/505550dfd722a13a13c1568990602df982cec66e))
* testing ([d74b86f](https://github.com/fhswf/book_me/commit/d74b86ff227c26cc6e1e1d40b92b32c2fc3c6a63))
* **test:** mock google calendar ([ffc15fb](https://github.com/fhswf/book_me/commit/ffc15fba1453368bd35489c879c00ddc59d76869))
* **test:** test before sonarqube analysis ([50a3389](https://github.com/fhswf/book_me/commit/50a33892f69f3c0a82f8fb77d6c07b95a0dcc6b0))
* **test:** test before sonarqube analysis ([a5d856f](https://github.com/fhswf/book_me/commit/a5d856f1f4b55f543e5d3e21840fdad2001cff0d))
* **test:** test before sonarqube analysis ([a6d28c6](https://github.com/fhswf/book_me/commit/a6d28c6e4e3017c9716f2328e784fadc7c30550c))
* **test:** test before sonarqube analysis ([966b558](https://github.com/fhswf/book_me/commit/966b558099ccf7ec09f30c8676c0b1e9ba9cc9c1))
* **test:** version & config updates ([266684c](https://github.com/fhswf/book_me/commit/266684cc69a162ee968ac3ebcce8613df1f25244))
* transfer timestamp as integer ([4753bd4](https://github.com/fhswf/book_me/commit/4753bd45e879a5f1f56748cedfc8a92c12a938a4))
* typescript issues ([15a4cc1](https://github.com/fhswf/book_me/commit/15a4cc1c5caf2c14d4d4c0a60695c155b08f6d57))
* UI glitches fixed ([14783e1](https://github.com/fhswf/book_me/commit/14783e13cd00b7e3d05aac64354ca30157a679c0))
* **ui:** changes for vite & mui 6 ([6fc7016](https://github.com/fhswf/book_me/commit/6fc701620d3c9931cbc072e62fb375a96928080d))
* update docker build to use yarn ([5b5ed89](https://github.com/fhswf/book_me/commit/5b5ed8996b9e9a6fb6386da935a4f8c95d878251))
* **workflow:** delete obsolete workflow files ([7fa0e67](https://github.com/fhswf/book_me/commit/7fa0e678227763bbc0c02efd9dbf2c3fad7435d4))
* **workflow:** update version in package.json ([e0037a7](https://github.com/fhswf/book_me/commit/e0037a7dde4aeaf4f4ed6c31958a4f050e0f94b3))
* yarn build/dependency management & docker ([5b491e6](https://github.com/fhswf/book_me/commit/5b491e6b0005db98837286b411d8de9a13fdbb7a))


### Features

* Add authentication and event controller tests and fix authentication flow. ([e9089d5](https://github.com/fhswf/book_me/commit/e9089d5d7153caaa7fb17fa0ce5868174f8aca41))
* **backend:** calender events ([6262e39](https://github.com/fhswf/book_me/commit/6262e394c914de06600c493fe406e1f0ee5ef49f))
* **backend:** CORS entry for appoint.gawron.cloud ([b0ed4b5](https://github.com/fhswf/book_me/commit/b0ed4b5364b266a80ddeeca7f733a16b4e6d003c))
* **backend:** store access token in cookie ([8241926](https://github.com/fhswf/book_me/commit/824192629bec518322d562578ba0451ef9b464d8))
* caldav integration ([ddc3773](https://github.com/fhswf/book_me/commit/ddc37730f4ccd50b57f70a60394276f3abd29273))
* caldav integration ([5b7fb4d](https://github.com/fhswf/book_me/commit/5b7fb4d62acd3ccb94e4da94dad1585d9df9c716))
* CalDAV integration ([3d42396](https://github.com/fhswf/book_me/commit/3d423964f8417aa8df136ed84c9bb92d6fb16024))
* **calendar:** allow guests to modify an event ([f815931](https://github.com/fhswf/book_me/commit/f81593101d2633a6d38f8bf8e532c6e42cb53945))
* docker build in release ([b6b7b43](https://github.com/fhswf/book_me/commit/b6b7b430ba6d05d73366f45f00e87f03bfadcfc4))
* docker build in release ([dc61033](https://github.com/fhswf/book_me/commit/dc61033d30f1cae5acef61feacd3afbe479ffabb))
* docker build in release ([845feae](https://github.com/fhswf/book_me/commit/845feae2e366527d28f6a65c869efbf96d0e7043))
* docker build in release ([d7ac528](https://github.com/fhswf/book_me/commit/d7ac5284923a7cac9a9ece4ef5ce6e7dff31ac61))
* docker build in release ([24dc4b2](https://github.com/fhswf/book_me/commit/24dc4b249ed6141caf9838b159e4a23d0a6e9b0a))
* docker build in release ([f8ad783](https://github.com/fhswf/book_me/commit/f8ad783b66842bef7a11217d42c556463ac97b40))
* docker build in release ([6b3d4f7](https://github.com/fhswf/book_me/commit/6b3d4f741eadfe376ec0bf285d3b6422570ea4a4))
* docker build in release ([75f655f](https://github.com/fhswf/book_me/commit/75f655f57953a5ebd1dc5e22164fe182f743840d))
* docker build in release ([45bb72f](https://github.com/fhswf/book_me/commit/45bb72f47bf7f0eb88f5ff6547a8cd67aed98496))
* docker build in release ([c87aab2](https://github.com/fhswf/book_me/commit/c87aab26f5f064bb30e592d7c4c08fbba04d75a4))
* docker build in release ([827d4c8](https://github.com/fhswf/book_me/commit/827d4c860f7c95425470cf5be48a0bf31a72b1b0))
* docker build in release ([072330c](https://github.com/fhswf/book_me/commit/072330c19ea33aee7775db346008ae0f0adeb0ce))
* docker build in release ([d60907c](https://github.com/fhswf/book_me/commit/d60907c8f9205fdc4efdd8582debe870b4964e18))
* docker build in release ([3bf3c12](https://github.com/fhswf/book_me/commit/3bf3c123c0e59618ced40eb5a5ae5192b20bb5fd))
* docker build in release ([5834136](https://github.com/fhswf/book_me/commit/5834136b16d3cdb20f89f450acab79f40a1ce739))
* docker build in release ([6bb006e](https://github.com/fhswf/book_me/commit/6bb006e04d0b6cc5829d680bca41c8c92235e5c8))
* **freeBusy:** check maxPerDay constraint ([2f4c391](https://github.com/fhswf/book_me/commit/2f4c3919be4616b0375044ac08ee411aa1fff544))
* **freeBusy:** freeBusy should observe minFuture and maxFuture restrictictions of an event ([93847d1](https://github.com/fhswf/book_me/commit/93847d15685d370bb58a4a19b522b72d24e946aa))
* Implement CSRF protection by adding a new CSRF service and integrating CSRF tokens into client requests and backend server logic. ([1ccd011](https://github.com/fhswf/book_me/commit/1ccd011a6cfbf7848db4479715c96533764de837))
* implement email event invitations with ICS attachments via new mailer utility. ([40a72c0](https://github.com/fhswf/book_me/commit/40a72c0bfc61a3c893cb60c48b8bf74c420c952a))
* Implement Google Calendar event insertion, improve free/busy time calculation, and add token revocation. ([c2e86b3](https://github.com/fhswf/book_me/commit/c2e86b34ae2923a598daa9e513c94a63926b4ccf))
* Implement per-user OAuth2Client creation with automatic token refresh and refine token update logic, adding new tests. ([19b0f8b](https://github.com/fhswf/book_me/commit/19b0f8bb57e807dd843e1a2c35bb49bc38cc07bc))
* improve test coverage ([04cb13a](https://github.com/fhswf/book_me/commit/04cb13a303fce553cb33226b912314cc6fa43f4f))
* Integrate `sonner` for client-side toast notifications, enhance backend authentication error handling, and update ESLint configuration. ([ec29e58](https://github.com/fhswf/book_me/commit/ec29e58aca49a9da67e7a6b6442015fbeae59514))
* Integrate CalDAV busy slot fetching into free slot calculation and improve environment variable loading. ([7983f06](https://github.com/fhswf/book_me/commit/7983f0612090a5628865bf4723c1575b6d6fd3a9))
* local development ([406bd5f](https://github.com/fhswf/book_me/commit/406bd5f219cd22420c0a4bffa16c73460828c91f))
* **logging:** use winston for logging ([6a0e299](https://github.com/fhswf/book_me/commit/6a0e2991e8859366f4a1b1a92683adbd7ebec36e))
* **logging:** use winston for logging ([1d6d130](https://github.com/fhswf/book_me/commit/1d6d130cf3942c1ce5943ef599f670b307f974da))
* **markdown:** handle event type description as markdown. ([87731b1](https://github.com/fhswf/book_me/commit/87731b1288460ebff551da5f77d5b080a799fc89))
* new rest api ([a8f823f](https://github.com/fhswf/book_me/commit/a8f823f8aec8116a302cf7e326f2edbc81b97218))
* new rest api ([f4e42c3](https://github.com/fhswf/book_me/commit/f4e42c3cad3202c54114fbbea64d4f7ca583c879))
* refactoring CORS & dev container ([75596f7](https://github.com/fhswf/book_me/commit/75596f70cf7cdc9bd2d061c7733971a74bda2ac0))
* store access token in cookie ([32daf4e](https://github.com/fhswf/book_me/commit/32daf4ea65d415c2bce5eb2d276829f6fca96bf8))
* store access token in cookie ([0d1e499](https://github.com/fhswf/book_me/commit/0d1e49926e85fed710456e8b241aaf307e74a3e2))
* ui improvements ([2cd8dfe](https://github.com/fhswf/book_me/commit/2cd8dfee5038775ebb1c122a5bab0a8a2ecd62c4))
* Update encryption algorithm from AES-256-CBC to AES-256-GCM. ([04ccf64](https://github.com/fhswf/book_me/commit/04ccf6496eab32d6df67155531448e3ee17b8c5f))

# backend [1.17.0](https://github.com/fhswf/book_me/compare/backend@1.16.0...backend@1.17.0) (2025-12-08)


### Bug Fixes

* **auth:** default for API_URL ([ff39be6](https://github.com/fhswf/book_me/commit/ff39be61286082a80562668360927eacd5fcbf0f))
* **auth:** default for API_URL ([a0da198](https://github.com/fhswf/book_me/commit/a0da1988df228c30e80cd2ed3c76ed89890531bf))
* **authentication:** remove client-accessible token ([3e371cc](https://github.com/fhswf/book_me/commit/3e371cc811581404e3d5e2ae3563e8f86880c4c4))
* automated docker build ([c1f2de3](https://github.com/fhswf/book_me/commit/c1f2de3cbd41a2c65f21a3d861901db710f6da65))
* **backend:** change type to module ([dc52879](https://github.com/fhswf/book_me/commit/dc52879130a7b0bd4d222670d228d7222f726c5c))
* **backend:** config warnings ([13b571a](https://github.com/fhswf/book_me/commit/13b571a1b48feef6f5b4c1da8de4f792485700e1))
* **backend:** import in test spec ([a2d997a](https://github.com/fhswf/book_me/commit/a2d997ad16b0bdbd8b82c1a19d9c849f219bf02c))
* **backend:** JWT_SECRET and email passwords ([63596b0](https://github.com/fhswf/book_me/commit/63596b02e3996bc721784954a4dc341b4446e07a))
* **backend:** quality improvement ([5cc5862](https://github.com/fhswf/book_me/commit/5cc58625aabf612078a4d725c4e0e5a3670b08cd))
* **backend:** token verification ([4172337](https://github.com/fhswf/book_me/commit/41723375ab877eead79c6b24bfed51da37819dbe))
* **backend:** typescript config ([06f4656](https://github.com/fhswf/book_me/commit/06f46565111fdd5b7d7c86f2d3d58aac3c523926))
* build backend image via gh action ([7226d2d](https://github.com/fhswf/book_me/commit/7226d2dd0ed040b082c30061fbe9f8ddd2560370))
* build backend image via gh action ([eec81e5](https://github.com/fhswf/book_me/commit/eec81e555588fd90177a300d99d7a1c117f30e0e))
* build backend image via gh action ([7a418a9](https://github.com/fhswf/book_me/commit/7a418a9609f7dd3f4a2acbb8563c72ddcd17e898))
* build backend image via gh action ([1d1a733](https://github.com/fhswf/book_me/commit/1d1a733a3ff55ce1746cb068c776cbf0a39fe4c6))
* **bump dependencies:** upgrade several dependencies ([39d06e3](https://github.com/fhswf/book_me/commit/39d06e3986ec8911d03cfe50286e6a09e494dbea))
* **client:** docker deployment & typing ([13ddc53](https://github.com/fhswf/book_me/commit/13ddc53aad4afb5bb627f35063b3f1c856c51424))
* **config:** update config values ([6ced70e](https://github.com/fhswf/book_me/commit/6ced70eba462830ce7d42c55ad75669a99e05fcb))
* controller should not return a promise ([2070fd5](https://github.com/fhswf/book_me/commit/2070fd56f195187ca35e03e838d9b259a6431710))
* correct api url configuration ([1c65124](https://github.com/fhswf/book_me/commit/1c6512411ed3a6cc2026b7c37fcb0f1192c3a8e6))
* CORS for debugging ([74f56f1](https://github.com/fhswf/book_me/commit/74f56f19ee966adb72db0120e00e9e8b058cea1a))
* deployment on appoint.gawron.cloud ([9023b45](https://github.com/fhswf/book_me/commit/9023b4517a11275bccd881597f3b3dbfd1f71cdd))
* **deployment:** resource limits ([e59b219](https://github.com/fhswf/book_me/commit/e59b219caf9dfc04b05d5d23a925afac430e303d))
* **deployment:** separate deployment & ingress config ([2cc83f5](https://github.com/fhswf/book_me/commit/2cc83f5f698c063c84f8515c82afa85d2e66e91f))
* **deployment:** update via semantic release ([8dd703e](https://github.com/fhswf/book_me/commit/8dd703ea931d01d4b1eaf911ee56e8c85f24a606))
* do not overwrite calendar settings upon login ([195f7fe](https://github.com/fhswf/book_me/commit/195f7fe0d8685f06b87a53f23336b4bee88dc605))
* do not update google tokens via user controller ([6c9eee3](https://github.com/fhswf/book_me/commit/6c9eee3ce070cf07ebad92e4d66020a07ade935c))
* dotenv config for backend ([714a7c0](https://github.com/fhswf/book_me/commit/714a7c06eeff750278a0fa6e851ff31798be362c))
* edit available times ([#5](https://github.com/fhswf/book_me/issues/5)) ([74f1d3a](https://github.com/fhswf/book_me/commit/74f1d3aab871a27b1f66dcf9e4854f0221c99b74))
* enable cookies for CORS requests ([c49e148](https://github.com/fhswf/book_me/commit/c49e1485b4faaebd6f2738733eacb20eca3fa0bd))
* enable cookies for CORS requests ([4a20b82](https://github.com/fhswf/book_me/commit/4a20b82bc48d2d511c5eef59960395bdfb961540))
* Enhance CalDAV error reporting and introduce a manual testing script for CalDAV integration. ([4fbb38b](https://github.com/fhswf/book_me/commit/4fbb38bab25af0aed6fc81b59a5748781e2b2a6a))
* freeBusy service corrected ([ff80003](https://github.com/fhswf/book_me/commit/ff8000327717a67a42b326c1acce906112bbb250))
* **freeBusy:** filter out free slots shorter than the event duration ([4179f8b](https://github.com/fhswf/book_me/commit/4179f8b8a2681a00a09919a9027a888c5f91fc8d))
* github actions for semantic release fixed ([7789df7](https://github.com/fhswf/book_me/commit/7789df7d31d491bd876ce2d93272f1c4c5452ced))
* improve quality ([c82d164](https://github.com/fhswf/book_me/commit/c82d164c48163ba884e602391492c3683a2bcad7))
* **insertEvent:** check availablility of requested slot in backend ([ddaa7f7](https://github.com/fhswf/book_me/commit/ddaa7f7088bfac17abff8f4d1706d8d2ebcdc0fe)), closes [#27](https://github.com/fhswf/book_me/issues/27)
* **k8s:** security settings ([5a4b1a4](https://github.com/fhswf/book_me/commit/5a4b1a4f4c87e231ea17ca9837a4638022565cfe))
* **logging:** log CORS config ([7872a72](https://github.com/fhswf/book_me/commit/7872a7255dcef772ec2242745326e56ad291e6e4))
* **logging:** log CORS config ([c9b7cc0](https://github.com/fhswf/book_me/commit/c9b7cc019391160a4cc05ef63be069e52247d9fa))
* make redirect URL configurable ([4ceea0c](https://github.com/fhswf/book_me/commit/4ceea0c4e26599b758402cc96b23eac9c62b72aa))
* Migrate to Google Sign In ([fcda431](https://github.com/fhswf/book_me/commit/fcda431c95c118368a5e1a4abed2ad7eee5cc2b7))
* module deps ([1e746bb](https://github.com/fhswf/book_me/commit/1e746bb38f6ea4242ba4a379ab761d7ffc46c361))
* module import ([6a42b74](https://github.com/fhswf/book_me/commit/6a42b7490f4153a95c8c11a5814c07a1acc7523d))
* module import ([36b1f5b](https://github.com/fhswf/book_me/commit/36b1f5be7ed35abdf6b53ef581841a310a537a11))
* module resolution ([6b3eb2d](https://github.com/fhswf/book_me/commit/6b3eb2d032a7349c117ff738dd1c84c00e00d9e3))
* module resolution ([fdd128e](https://github.com/fhswf/book_me/commit/fdd128ee14ca2855c15b9353400166cd7fd3943f))
* multi-release ([0e18282](https://github.com/fhswf/book_me/commit/0e18282ceac0b39840802682101c132c8896eec2))
* multi-release ([8ab5317](https://github.com/fhswf/book_me/commit/8ab531792d16509166c49b3aba82d242d41ed500))
* rate limiting ([c3c89bd](https://github.com/fhswf/book_me/commit/c3c89bd6b7411c40d415f2a0deb5a65af1fa6cf0))
* redirect to calendar integration ([e305329](https://github.com/fhswf/book_me/commit/e305329a86cc80158ad604940c045261ff9bd4c2))
* redirect to calendar integration ([89f8597](https://github.com/fhswf/book_me/commit/89f85972fb8e4c30eaece662db1c559e12960286))
* refactor event controller ([b3eb06e](https://github.com/fhswf/book_me/commit/b3eb06e30bbec8b29094d00131deff4bff0ea8d0))
* refactor event controller ([c94aec7](https://github.com/fhswf/book_me/commit/c94aec7ed60bb0868cce158cb643a8ce45b00e12))
* refactor user type ([991dd29](https://github.com/fhswf/book_me/commit/991dd2924d71373ed667ca862aa36d6245021d20))
* remove unused routes ([a29a54e](https://github.com/fhswf/book_me/commit/a29a54e995d66054b42979e1bf2dc6b1f2f1afda))
* resource limits ([04b261c](https://github.com/fhswf/book_me/commit/04b261c4f9738f4d173feaf5c929f22147703bf0))
* security updates ([f96e262](https://github.com/fhswf/book_me/commit/f96e26276bf4a0dc5013971c4094ee3a64fbdcf7))
* **security:** enforce TLS with nodemailer ([bfbfa5f](https://github.com/fhswf/book_me/commit/bfbfa5fd6bceb9147dc0eb35f41d8ba89d761b96))
* **security:** remove password attribute ([a1fb3e5](https://github.com/fhswf/book_me/commit/a1fb3e5abdacd6037a76ee24b357c71658162f18))
* **security:** remove secret from docker image ([0c9d6f3](https://github.com/fhswf/book_me/commit/0c9d6f3940153244c16fb6f3b23bd437049e7cd9))
* semantic release config ([b638ae1](https://github.com/fhswf/book_me/commit/b638ae1bf1f34ba6283a7ab61de5eaf406a27e20))
* semantic-release config ([e6b7a13](https://github.com/fhswf/book_me/commit/e6b7a1326964a2a7b5f3d088386e60deb6a3b077))
* set domain for cookie ([c876638](https://github.com/fhswf/book_me/commit/c8766385d00388a332b5bcf0f633db65c2954c0b))
* set sameSite: lax in development ([6a18a47](https://github.com/fhswf/book_me/commit/6a18a47fb53f4f0da65b95e1362296da43a29f2e))
* set sameSite: none in development ([bc3279d](https://github.com/fhswf/book_me/commit/bc3279d42a148be61374d6b044221853f26c13a3))
* sonarqube issues ([9f61182](https://github.com/fhswf/book_me/commit/9f6118235ffc9868413403b21cac0a36b1bac8e4))
* sonarqube issues ([e5d870b](https://github.com/fhswf/book_me/commit/e5d870b40da04c12cc277c1cdcfede15ddd09913))
* sonarqube issues ([89c0456](https://github.com/fhswf/book_me/commit/89c0456526614a2e10976ce45706baa5489c9d21))
* **test:** coverage for cypress tests ([ec5499d](https://github.com/fhswf/book_me/commit/ec5499d6b909a7e04010b7fb5b97aa8c30d16a8b))
* **test:** coverage for cypress tests ([505550d](https://github.com/fhswf/book_me/commit/505550dfd722a13a13c1568990602df982cec66e))
* testing ([d74b86f](https://github.com/fhswf/book_me/commit/d74b86ff227c26cc6e1e1d40b92b32c2fc3c6a63))
* **test:** mock google calendar ([ffc15fb](https://github.com/fhswf/book_me/commit/ffc15fba1453368bd35489c879c00ddc59d76869))
* **test:** test before sonarqube analysis ([50a3389](https://github.com/fhswf/book_me/commit/50a33892f69f3c0a82f8fb77d6c07b95a0dcc6b0))
* **test:** test before sonarqube analysis ([a5d856f](https://github.com/fhswf/book_me/commit/a5d856f1f4b55f543e5d3e21840fdad2001cff0d))
* **test:** test before sonarqube analysis ([a6d28c6](https://github.com/fhswf/book_me/commit/a6d28c6e4e3017c9716f2328e784fadc7c30550c))
* **test:** test before sonarqube analysis ([966b558](https://github.com/fhswf/book_me/commit/966b558099ccf7ec09f30c8676c0b1e9ba9cc9c1))
* **test:** version & config updates ([266684c](https://github.com/fhswf/book_me/commit/266684cc69a162ee968ac3ebcce8613df1f25244))
* transfer timestamp as integer ([4753bd4](https://github.com/fhswf/book_me/commit/4753bd45e879a5f1f56748cedfc8a92c12a938a4))
* typescript issues ([15a4cc1](https://github.com/fhswf/book_me/commit/15a4cc1c5caf2c14d4d4c0a60695c155b08f6d57))
* UI glitches fixed ([14783e1](https://github.com/fhswf/book_me/commit/14783e13cd00b7e3d05aac64354ca30157a679c0))
* **ui:** changes for vite & mui 6 ([6fc7016](https://github.com/fhswf/book_me/commit/6fc701620d3c9931cbc072e62fb375a96928080d))
* update docker build to use yarn ([5b5ed89](https://github.com/fhswf/book_me/commit/5b5ed8996b9e9a6fb6386da935a4f8c95d878251))
* **workflow:** delete obsolete workflow files ([7fa0e67](https://github.com/fhswf/book_me/commit/7fa0e678227763bbc0c02efd9dbf2c3fad7435d4))
* **workflow:** update version in package.json ([e0037a7](https://github.com/fhswf/book_me/commit/e0037a7dde4aeaf4f4ed6c31958a4f050e0f94b3))
* yarn build/dependency management & docker ([5b491e6](https://github.com/fhswf/book_me/commit/5b491e6b0005db98837286b411d8de9a13fdbb7a))


### Features

* Add authentication and event controller tests and fix authentication flow. ([e9089d5](https://github.com/fhswf/book_me/commit/e9089d5d7153caaa7fb17fa0ce5868174f8aca41))
* **backend:** calender events ([6262e39](https://github.com/fhswf/book_me/commit/6262e394c914de06600c493fe406e1f0ee5ef49f))
* **backend:** CORS entry for appoint.gawron.cloud ([b0ed4b5](https://github.com/fhswf/book_me/commit/b0ed4b5364b266a80ddeeca7f733a16b4e6d003c))
* **backend:** store access token in cookie ([8241926](https://github.com/fhswf/book_me/commit/824192629bec518322d562578ba0451ef9b464d8))
* caldav integration ([ddc3773](https://github.com/fhswf/book_me/commit/ddc37730f4ccd50b57f70a60394276f3abd29273))
* caldav integration ([5b7fb4d](https://github.com/fhswf/book_me/commit/5b7fb4d62acd3ccb94e4da94dad1585d9df9c716))
* CalDAV integration ([3d42396](https://github.com/fhswf/book_me/commit/3d423964f8417aa8df136ed84c9bb92d6fb16024))
* **calendar:** allow guests to modify an event ([f815931](https://github.com/fhswf/book_me/commit/f81593101d2633a6d38f8bf8e532c6e42cb53945))
* docker build in release ([b6b7b43](https://github.com/fhswf/book_me/commit/b6b7b430ba6d05d73366f45f00e87f03bfadcfc4))
* docker build in release ([dc61033](https://github.com/fhswf/book_me/commit/dc61033d30f1cae5acef61feacd3afbe479ffabb))
* docker build in release ([845feae](https://github.com/fhswf/book_me/commit/845feae2e366527d28f6a65c869efbf96d0e7043))
* docker build in release ([d7ac528](https://github.com/fhswf/book_me/commit/d7ac5284923a7cac9a9ece4ef5ce6e7dff31ac61))
* docker build in release ([24dc4b2](https://github.com/fhswf/book_me/commit/24dc4b249ed6141caf9838b159e4a23d0a6e9b0a))
* docker build in release ([f8ad783](https://github.com/fhswf/book_me/commit/f8ad783b66842bef7a11217d42c556463ac97b40))
* docker build in release ([6b3d4f7](https://github.com/fhswf/book_me/commit/6b3d4f741eadfe376ec0bf285d3b6422570ea4a4))
* docker build in release ([75f655f](https://github.com/fhswf/book_me/commit/75f655f57953a5ebd1dc5e22164fe182f743840d))
* docker build in release ([45bb72f](https://github.com/fhswf/book_me/commit/45bb72f47bf7f0eb88f5ff6547a8cd67aed98496))
* docker build in release ([c87aab2](https://github.com/fhswf/book_me/commit/c87aab26f5f064bb30e592d7c4c08fbba04d75a4))
* docker build in release ([827d4c8](https://github.com/fhswf/book_me/commit/827d4c860f7c95425470cf5be48a0bf31a72b1b0))
* docker build in release ([072330c](https://github.com/fhswf/book_me/commit/072330c19ea33aee7775db346008ae0f0adeb0ce))
* docker build in release ([d60907c](https://github.com/fhswf/book_me/commit/d60907c8f9205fdc4efdd8582debe870b4964e18))
* docker build in release ([3bf3c12](https://github.com/fhswf/book_me/commit/3bf3c123c0e59618ced40eb5a5ae5192b20bb5fd))
* docker build in release ([5834136](https://github.com/fhswf/book_me/commit/5834136b16d3cdb20f89f450acab79f40a1ce739))
* docker build in release ([6bb006e](https://github.com/fhswf/book_me/commit/6bb006e04d0b6cc5829d680bca41c8c92235e5c8))
* **freeBusy:** check maxPerDay constraint ([2f4c391](https://github.com/fhswf/book_me/commit/2f4c3919be4616b0375044ac08ee411aa1fff544))
* **freeBusy:** freeBusy should observe minFuture and maxFuture restrictictions of an event ([93847d1](https://github.com/fhswf/book_me/commit/93847d15685d370bb58a4a19b522b72d24e946aa))
* Implement CSRF protection by adding a new CSRF service and integrating CSRF tokens into client requests and backend server logic. ([1ccd011](https://github.com/fhswf/book_me/commit/1ccd011a6cfbf7848db4479715c96533764de837))
* implement email event invitations with ICS attachments via new mailer utility. ([40a72c0](https://github.com/fhswf/book_me/commit/40a72c0bfc61a3c893cb60c48b8bf74c420c952a))
* Implement Google Calendar event insertion, improve free/busy time calculation, and add token revocation. ([c2e86b3](https://github.com/fhswf/book_me/commit/c2e86b34ae2923a598daa9e513c94a63926b4ccf))
* Implement per-user OAuth2Client creation with automatic token refresh and refine token update logic, adding new tests. ([19b0f8b](https://github.com/fhswf/book_me/commit/19b0f8bb57e807dd843e1a2c35bb49bc38cc07bc))
* improve test coverage ([04cb13a](https://github.com/fhswf/book_me/commit/04cb13a303fce553cb33226b912314cc6fa43f4f))
* Integrate `sonner` for client-side toast notifications, enhance backend authentication error handling, and update ESLint configuration. ([ec29e58](https://github.com/fhswf/book_me/commit/ec29e58aca49a9da67e7a6b6442015fbeae59514))
* Integrate CalDAV busy slot fetching into free slot calculation and improve environment variable loading. ([7983f06](https://github.com/fhswf/book_me/commit/7983f0612090a5628865bf4723c1575b6d6fd3a9))
* local development ([406bd5f](https://github.com/fhswf/book_me/commit/406bd5f219cd22420c0a4bffa16c73460828c91f))
* **logging:** use winston for logging ([6a0e299](https://github.com/fhswf/book_me/commit/6a0e2991e8859366f4a1b1a92683adbd7ebec36e))
* **logging:** use winston for logging ([1d6d130](https://github.com/fhswf/book_me/commit/1d6d130cf3942c1ce5943ef599f670b307f974da))
* **markdown:** handle event type description as markdown. ([87731b1](https://github.com/fhswf/book_me/commit/87731b1288460ebff551da5f77d5b080a799fc89))
* new rest api ([a8f823f](https://github.com/fhswf/book_me/commit/a8f823f8aec8116a302cf7e326f2edbc81b97218))
* new rest api ([f4e42c3](https://github.com/fhswf/book_me/commit/f4e42c3cad3202c54114fbbea64d4f7ca583c879))
* refactoring CORS & dev container ([75596f7](https://github.com/fhswf/book_me/commit/75596f70cf7cdc9bd2d061c7733971a74bda2ac0))
* store access token in cookie ([32daf4e](https://github.com/fhswf/book_me/commit/32daf4ea65d415c2bce5eb2d276829f6fca96bf8))
* store access token in cookie ([0d1e499](https://github.com/fhswf/book_me/commit/0d1e49926e85fed710456e8b241aaf307e74a3e2))
* ui improvements ([2cd8dfe](https://github.com/fhswf/book_me/commit/2cd8dfee5038775ebb1c122a5bab0a8a2ecd62c4))





### Dependencies

* **common:** upgraded to 1.3.0

# backend [1.16.0](https://github.com/fhswf/book_me/compare/backend@1.15.0...backend@1.16.0) (2025-12-04)


### Features

* Add authentication and event controller tests and fix authentication flow. ([ac27ac6](https://github.com/fhswf/book_me/commit/ac27ac6c16249b338c97f7d9ca54693b59d18bb8))

# backend [1.15.0](https://github.com/fhswf/book_me/compare/backend@1.14.0...backend@1.15.0) (2025-12-03)


### Features

* Implement CSRF protection by adding a new CSRF service and integrating CSRF tokens into client requests and backend server logic. ([ddb896e](https://github.com/fhswf/book_me/commit/ddb896e41b7bac29fb67f24b3ba2f1db728c8a6d))
* Implement Google Calendar event insertion, improve free/busy time calculation, and add token revocation. ([86ea2b8](https://github.com/fhswf/book_me/commit/86ea2b854fac7168b23d80711cd37e652f3eb0cc))
* Implement per-user OAuth2Client creation with automatic token refresh and refine token update logic, adding new tests. ([6d6f304](https://github.com/fhswf/book_me/commit/6d6f3041fde4fa001605da8a03c87df5bee5b6ea))





### Dependencies

* **common:** upgraded to 1.2.0

# backend [1.14.0](https://github.com/fhswf/book_me/compare/backend@1.13.0...backend@1.14.0) (2024-11-04)


### Bug Fixes

* remove unused routes ([87eb614](https://github.com/fhswf/book_me/commit/87eb6142a119fc359b1753278f1ca253e1790288))
* set domain for cookie ([ff919ee](https://github.com/fhswf/book_me/commit/ff919eeba9069edf1a0fa2590b965b7358c1e8a1))
* **test:** mock google calendar ([272fdcb](https://github.com/fhswf/book_me/commit/272fdcbc44783090785b6f4940bb9b92fd9fec1d))


### Features

* **logging:** use winston for logging ([7b865d3](https://github.com/fhswf/book_me/commit/7b865d38b61382cca0f9bcab6c3a44636436e581))
* **logging:** use winston for logging ([b1c8ac0](https://github.com/fhswf/book_me/commit/b1c8ac041e6891ef8c3b45e4847f6d225753d41a))

# backend [1.13.0](https://github.com/fhswf/book_me/compare/backend@1.12.0...backend@1.13.0) (2024-10-17)


### Features

* new rest api ([93ec39b](https://github.com/fhswf/book_me/commit/93ec39bedfe704cf6c26ba72078b108c7498248a))

# backend [1.12.0](https://github.com/fhswf/book_me/compare/backend@1.11.9...backend@1.12.0) (2024-10-16)


### Bug Fixes

* rate limiting ([229aa17](https://github.com/fhswf/book_me/commit/229aa17f2acbab0105ade1b9a6daa6dfbee1074f))


### Features

* new rest api ([6e5a9d3](https://github.com/fhswf/book_me/commit/6e5a9d3c3ab928a020e166e09be89c713c7cdd3f))

## backend [1.11.9](https://github.com/fhswf/book_me/compare/backend@1.11.8...backend@1.11.9) (2024-10-16)


### Bug Fixes

* improve quality ([f22c507](https://github.com/fhswf/book_me/commit/f22c507b8afa1939c1735b4b62a7ebea42dc2e36))
* refactor event controller ([085d544](https://github.com/fhswf/book_me/commit/085d5446af0d8f07e7ca06762acf2c83932b89f8))
* refactor event controller ([acac350](https://github.com/fhswf/book_me/commit/acac350b725d770f73f501e593852de375276893))

## backend [1.11.8](https://github.com/fhswf/book_me/compare/backend@1.11.7...backend@1.11.8) (2024-10-15)


### Bug Fixes

* set sameSite: none in development ([28c9152](https://github.com/fhswf/book_me/commit/28c91520a6c1551f2c09b8627a48f111cc64a0c9))

## backend [1.11.7](https://github.com/fhswf/book_me/compare/backend@1.11.6...backend@1.11.7) (2024-10-15)


### Bug Fixes

* set sameSite: lax in development ([b7229b0](https://github.com/fhswf/book_me/commit/b7229b072f5bd06ebd3a514ce843496ae044167b))

## backend [1.11.6](https://github.com/fhswf/book_me/compare/backend@1.11.5...backend@1.11.6) (2024-10-15)


### Bug Fixes

* **authentication:** remove client-accessible token ([65171ef](https://github.com/fhswf/book_me/commit/65171ef3dcea85e637eebbb7901d10c4a3769e53))

## backend [1.11.5](https://github.com/fhswf/book_me/compare/backend@1.11.4...backend@1.11.5) (2024-10-14)


### Bug Fixes

* redirect to calendar integration ([cb9338b](https://github.com/fhswf/book_me/commit/cb9338b85220cffc0cf8bcb4d2cf9cc773d1b5cc))

## backend [1.11.4](https://github.com/fhswf/book_me/compare/backend@1.11.3...backend@1.11.4) (2024-10-14)


### Bug Fixes

* redirect to calendar integration ([5e9563d](https://github.com/fhswf/book_me/commit/5e9563d483e10b4cd048e8949d3cb9f12fbb9b7f))

## backend [1.11.3](https://github.com/fhswf/book_me/compare/backend@1.11.2...backend@1.11.3) (2024-10-11)


### Bug Fixes

* enable cookies for CORS requests ([3b5b5dc](https://github.com/fhswf/book_me/commit/3b5b5dc41c7b666874dd2f97b5f4298bccf0d792))

## backend [1.11.2](https://github.com/fhswf/book_me/compare/backend@1.11.1...backend@1.11.2) (2024-10-11)


### Bug Fixes

* enable cookies for CORS requests ([0188059](https://github.com/fhswf/book_me/commit/0188059edf52d5eeb8c0cab06ffa2caeb8bebc65))

## backend [1.11.1](https://github.com/fhswf/book_me/compare/backend@1.11.0...backend@1.11.1) (2024-10-11)


### Bug Fixes

* testing ([7e1022c](https://github.com/fhswf/book_me/commit/7e1022c848a7f7cf7033e2610326b8d38197321b))

# backend [1.11.0](https://github.com/fhswf/book_me/compare/backend@1.10.0...backend@1.11.0) (2024-10-11)


### Bug Fixes

* **backend:** import in test spec ([88c78d8](https://github.com/fhswf/book_me/commit/88c78d828c3023a257ef37941799c93911a42add))


### Features

* **backend:** store access token in cookie ([3b58072](https://github.com/fhswf/book_me/commit/3b58072ded26205ba01edaaf951aebc2012125fd))
* store access token in cookie ([27990d7](https://github.com/fhswf/book_me/commit/27990d7e86de82d3f6d5e9ba97e4f785e9e26ea2))

# backend [1.11.0](https://github.com/fhswf/book_me/compare/backend@1.10.0...backend@1.11.0) (2024-10-11)


### Features

* **backend:** store access token in cookie ([3b58072](https://github.com/fhswf/book_me/commit/3b58072ded26205ba01edaaf951aebc2012125fd))
* store access token in cookie ([27990d7](https://github.com/fhswf/book_me/commit/27990d7e86de82d3f6d5e9ba97e4f785e9e26ea2))

# backend [1.10.0](https://github.com/fhswf/book_me/compare/backend@1.9.0...backend@1.10.0) (2024-10-10)


### Features

* store access token in cookie ([fbd2706](https://github.com/fhswf/book_me/commit/fbd27066b4e3d016c4053197b551d46555df68c1))

# backend [1.9.0](https://github.com/fhswf/book_me/compare/backend@1.8.0...backend@1.9.0) (2024-10-09)


### Features

* **calendar:** allow guests to modify an event ([dbba656](https://github.com/fhswf/book_me/commit/dbba6566db19783759f980ede8463b81246d4f2f))

# backend [1.8.0](https://github.com/fhswf/book_me/compare/backend@1.7.17...backend@1.8.0) (2024-10-09)


### Features

* **backend:** calender events ([beaa138](https://github.com/fhswf/book_me/commit/beaa138df7112321dbe30a9e809d43c3d56b992a))

## backend [1.7.17](https://github.com/fhswf/book_me/compare/backend@1.7.16...backend@1.7.17) (2024-10-09)





### Dependencies

* **common:** upgraded to 1.1.11

## backend [1.7.16](https://github.com/fhswf/book_me/compare/backend@1.7.15...backend@1.7.16) (2024-10-09)





### Dependencies

* **common:** upgraded to 1.1.10

## backend [1.7.15](https://github.com/fhswf/book_me/compare/backend@1.7.14...backend@1.7.15) (2024-10-09)





### Dependencies

* **common:** upgraded to 1.1.9

## backend [1.7.14](https://github.com/fhswf/book_me/compare/backend@1.7.13...backend@1.7.14) (2024-10-09)





### Dependencies

* **common:** upgraded to 1.1.8

## backend [1.7.13](https://github.com/fhswf/book_me/compare/backend@1.7.12...backend@1.7.13) (2024-10-08)


### Bug Fixes

* **security:** enforce TLS with nodemailer ([0777972](https://github.com/fhswf/book_me/commit/07779728b5a807ed3b755887ddbf4b866bcd5852))

## backend [1.7.12](https://github.com/fhswf/book_me/compare/backend@1.7.11...backend@1.7.12) (2024-10-08)


### Bug Fixes

* module import ([40234c5](https://github.com/fhswf/book_me/commit/40234c5bd91cbc50a8c8fe2db999aa334a4eff80))
* module import ([22e6605](https://github.com/fhswf/book_me/commit/22e6605fdf3e6a4022976a3fd0d098bbd49d1107))

## backend [1.7.12](https://github.com/fhswf/book_me/compare/backend@1.7.11...backend@1.7.12) (2024-10-08)


### Bug Fixes

* module import ([22e6605](https://github.com/fhswf/book_me/commit/22e6605fdf3e6a4022976a3fd0d098bbd49d1107))

## backend [1.7.11](https://github.com/fhswf/book_me/compare/backend@1.7.10...backend@1.7.11) (2024-10-08)


### Bug Fixes

* **auth:** default for API_URL ([0698329](https://github.com/fhswf/book_me/commit/0698329f4b7b208293bcf2ae63e7cb4cd9f037ad))
* **auth:** default for API_URL ([23b8df9](https://github.com/fhswf/book_me/commit/23b8df9cd31dc512491299e3021bf6109cd909f2))
* **deployment:** resource limits ([b9fc3d2](https://github.com/fhswf/book_me/commit/b9fc3d2f38b4c0490542f7d874307fd528627743))
* **k8s:** security settings ([311c449](https://github.com/fhswf/book_me/commit/311c44912ca9dd82533ef1855cb1b3b5b0b99cd2))
* refactor user type ([09abe71](https://github.com/fhswf/book_me/commit/09abe7130e4d380985572f8535924c439bad13d4))
* resource limits ([4f26ed7](https://github.com/fhswf/book_me/commit/4f26ed7a5cc35d19f8a8c740c91e4907a274b442))
* **security:** remove password attribute ([79c4584](https://github.com/fhswf/book_me/commit/79c4584e57c0f462c82ec3640fbd6b13faaeb311))
* sonarqube issues ([6c8e66d](https://github.com/fhswf/book_me/commit/6c8e66d181f1f902583db3445bc99574164db68b))
* sonarqube issues ([3f05807](https://github.com/fhswf/book_me/commit/3f05807085837e747e90ced0e4aeaafe0e9cc5d4))
* sonarqube issues ([3e28fd5](https://github.com/fhswf/book_me/commit/3e28fd51cd5fe5e89144c5df70a8c1394d31a021))
* **test:** coverage for cypress tests ([353638e](https://github.com/fhswf/book_me/commit/353638ecc49079b9fae69cda835c80fb66acba3e))
* **test:** coverage for cypress tests ([542cf93](https://github.com/fhswf/book_me/commit/542cf93830992589da7b68ca4d48d8a47f15bf80))
* **test:** test before sonarqube analysis ([d91fa5d](https://github.com/fhswf/book_me/commit/d91fa5d79ac2494b9f4e2f5ad76105897b4a6dab))
* **test:** test before sonarqube analysis ([c12d1e5](https://github.com/fhswf/book_me/commit/c12d1e58fcac663bd28f7c3476cf8df289c65b7c))
* **test:** test before sonarqube analysis ([a7ce602](https://github.com/fhswf/book_me/commit/a7ce602f1a7b81d51f181f40d874a50a364154a1))
* **test:** test before sonarqube analysis ([eb7b3bc](https://github.com/fhswf/book_me/commit/eb7b3bc9c313d5378324f728c8a0b088a34e8469))
* **test:** version & config updates ([0dbd7fd](https://github.com/fhswf/book_me/commit/0dbd7fdc9e79db5269f849912ccb91a16bebb618))

## backend [1.7.11](https://github.com/fhswf/book_me/compare/backend@1.7.10...backend@1.7.11) (2024-10-08)


### Bug Fixes

* **auth:** default for API_URL ([0698329](https://github.com/fhswf/book_me/commit/0698329f4b7b208293bcf2ae63e7cb4cd9f037ad))
* **auth:** default for API_URL ([23b8df9](https://github.com/fhswf/book_me/commit/23b8df9cd31dc512491299e3021bf6109cd909f2))
* **deployment:** resource limits ([b9fc3d2](https://github.com/fhswf/book_me/commit/b9fc3d2f38b4c0490542f7d874307fd528627743))
* **k8s:** security settings ([311c449](https://github.com/fhswf/book_me/commit/311c44912ca9dd82533ef1855cb1b3b5b0b99cd2))
* resource limits ([4f26ed7](https://github.com/fhswf/book_me/commit/4f26ed7a5cc35d19f8a8c740c91e4907a274b442))
* **security:** remove password attribute ([79c4584](https://github.com/fhswf/book_me/commit/79c4584e57c0f462c82ec3640fbd6b13faaeb311))
* sonarqube issues ([6c8e66d](https://github.com/fhswf/book_me/commit/6c8e66d181f1f902583db3445bc99574164db68b))
* sonarqube issues ([3f05807](https://github.com/fhswf/book_me/commit/3f05807085837e747e90ced0e4aeaafe0e9cc5d4))
* sonarqube issues ([3e28fd5](https://github.com/fhswf/book_me/commit/3e28fd51cd5fe5e89144c5df70a8c1394d31a021))
* **test:** coverage for cypress tests ([353638e](https://github.com/fhswf/book_me/commit/353638ecc49079b9fae69cda835c80fb66acba3e))
* **test:** coverage for cypress tests ([542cf93](https://github.com/fhswf/book_me/commit/542cf93830992589da7b68ca4d48d8a47f15bf80))
* **test:** test before sonarqube analysis ([d91fa5d](https://github.com/fhswf/book_me/commit/d91fa5d79ac2494b9f4e2f5ad76105897b4a6dab))
* **test:** test before sonarqube analysis ([c12d1e5](https://github.com/fhswf/book_me/commit/c12d1e58fcac663bd28f7c3476cf8df289c65b7c))
* **test:** test before sonarqube analysis ([a7ce602](https://github.com/fhswf/book_me/commit/a7ce602f1a7b81d51f181f40d874a50a364154a1))
* **test:** test before sonarqube analysis ([eb7b3bc](https://github.com/fhswf/book_me/commit/eb7b3bc9c313d5378324f728c8a0b088a34e8469))
* **test:** version & config updates ([0dbd7fd](https://github.com/fhswf/book_me/commit/0dbd7fdc9e79db5269f849912ccb91a16bebb618))





### Dependencies

* **common:** upgraded to 1.1.7

## backend [1.7.11](https://github.com/fhswf/book_me/compare/backend@1.7.10...backend@1.7.11) (2024-10-04)


### Bug Fixes

* **auth:** default for API_URL ([0698329](https://github.com/fhswf/book_me/commit/0698329f4b7b208293bcf2ae63e7cb4cd9f037ad))
* **auth:** default for API_URL ([23b8df9](https://github.com/fhswf/book_me/commit/23b8df9cd31dc512491299e3021bf6109cd909f2))
* **deployment:** resource limits ([b9fc3d2](https://github.com/fhswf/book_me/commit/b9fc3d2f38b4c0490542f7d874307fd528627743))
* **k8s:** security settings ([311c449](https://github.com/fhswf/book_me/commit/311c44912ca9dd82533ef1855cb1b3b5b0b99cd2))
* sonarqube issues ([3f05807](https://github.com/fhswf/book_me/commit/3f05807085837e747e90ced0e4aeaafe0e9cc5d4))
* sonarqube issues ([3e28fd5](https://github.com/fhswf/book_me/commit/3e28fd51cd5fe5e89144c5df70a8c1394d31a021))
* **test:** test before sonarqube analysis ([d91fa5d](https://github.com/fhswf/book_me/commit/d91fa5d79ac2494b9f4e2f5ad76105897b4a6dab))
* **test:** test before sonarqube analysis ([c12d1e5](https://github.com/fhswf/book_me/commit/c12d1e58fcac663bd28f7c3476cf8df289c65b7c))
* **test:** test before sonarqube analysis ([a7ce602](https://github.com/fhswf/book_me/commit/a7ce602f1a7b81d51f181f40d874a50a364154a1))
* **test:** test before sonarqube analysis ([eb7b3bc](https://github.com/fhswf/book_me/commit/eb7b3bc9c313d5378324f728c8a0b088a34e8469))
* **test:** version & config updates ([0dbd7fd](https://github.com/fhswf/book_me/commit/0dbd7fdc9e79db5269f849912ccb91a16bebb618))

## backend [1.7.11](https://github.com/fhswf/book_me/compare/backend@1.7.10...backend@1.7.11) (2024-10-04)


### Bug Fixes

* **auth:** default for API_URL ([0698329](https://github.com/fhswf/book_me/commit/0698329f4b7b208293bcf2ae63e7cb4cd9f037ad))
* **auth:** default for API_URL ([23b8df9](https://github.com/fhswf/book_me/commit/23b8df9cd31dc512491299e3021bf6109cd909f2))
* **deployment:** resource limits ([b9fc3d2](https://github.com/fhswf/book_me/commit/b9fc3d2f38b4c0490542f7d874307fd528627743))
* **k8s:** security settings ([311c449](https://github.com/fhswf/book_me/commit/311c44912ca9dd82533ef1855cb1b3b5b0b99cd2))
* sonarqube issues ([3f05807](https://github.com/fhswf/book_me/commit/3f05807085837e747e90ced0e4aeaafe0e9cc5d4))
* sonarqube issues ([3e28fd5](https://github.com/fhswf/book_me/commit/3e28fd51cd5fe5e89144c5df70a8c1394d31a021))
* **test:** test before sonarqube analysis ([d91fa5d](https://github.com/fhswf/book_me/commit/d91fa5d79ac2494b9f4e2f5ad76105897b4a6dab))
* **test:** test before sonarqube analysis ([c12d1e5](https://github.com/fhswf/book_me/commit/c12d1e58fcac663bd28f7c3476cf8df289c65b7c))
* **test:** test before sonarqube analysis ([a7ce602](https://github.com/fhswf/book_me/commit/a7ce602f1a7b81d51f181f40d874a50a364154a1))
* **test:** test before sonarqube analysis ([eb7b3bc](https://github.com/fhswf/book_me/commit/eb7b3bc9c313d5378324f728c8a0b088a34e8469))
* **test:** version & config updates ([0dbd7fd](https://github.com/fhswf/book_me/commit/0dbd7fdc9e79db5269f849912ccb91a16bebb618))

## backend [1.7.10](https://github.com/fhswf/book_me/compare/backend@1.7.9...backend@1.7.10) (2024-09-29)


### Bug Fixes

* deployment on appoint.gawron.cloud ([ecf8498](https://github.com/fhswf/book_me/commit/ecf849879389344b76d398913dc205203fd83668))

## backend [1.7.9](https://github.com/fhswf/book_me/compare/backend@1.7.8...backend@1.7.9) (2024-09-24)


### Bug Fixes

* module resolution ([c2f37d6](https://github.com/fhswf/book_me/commit/c2f37d645eeab8bc85301736d24304f198f7496e))
* module resolution ([6263324](https://github.com/fhswf/book_me/commit/6263324b72feff539720dffd264891b8dbd4b52d))





### Dependencies

* **common:** upgraded to 1.1.5

## backend [1.7.8](https://github.com/fhswf/book_me/compare/backend@1.7.7...backend@1.7.8) (2024-09-24)


### Bug Fixes

* **backend:** change type to module ([f80c257](https://github.com/fhswf/book_me/commit/f80c25736bfc9be332b35d704fd976712fbba119))

## backend [1.7.7](https://github.com/fhswf/book_me/compare/backend@1.7.6...backend@1.7.7) (2024-09-24)


### Bug Fixes

* **ui:** changes for vite & mui 6 ([2aab61e](https://github.com/fhswf/book_me/commit/2aab61e7b67692c40872960b9f4d6fad35e239f9))





### Dependencies

* **common:** upgraded to 1.1.3

## backend [1.7.6](https://github.com/fhswf/book_me/compare/backend@1.7.5...backend@1.7.6) (2024-09-24)


### Bug Fixes

* module deps ([d12fc5b](https://github.com/fhswf/book_me/commit/d12fc5b4db2447ea0db16519964797a023fd549d))

## backend [1.7.5](https://github.com/fhswf/book_me/compare/backend@1.7.4...backend@1.7.5) (2024-09-24)


### Bug Fixes

* CORS for debugging ([59b7983](https://github.com/fhswf/book_me/commit/59b798336f7959bd77e5ad2b35ad23244bc95847))

## backend [1.7.4](https://github.com/fhswf/book_me/compare/backend@1.7.3...backend@1.7.4) (2024-09-23)


### Bug Fixes

* **config:** update config values ([a2d2e63](https://github.com/fhswf/book_me/commit/a2d2e639d3667c186142fcd6f6b7d28823551680))

## backend [1.7.3](https://github.com/fhswf/book_me/compare/backend@1.7.2...backend@1.7.3) (2024-09-23)


### Bug Fixes

* **logging:** log CORS config ([ebfd5d1](https://github.com/fhswf/book_me/commit/ebfd5d1b413137a3d5c79b0dec7eab7ae4ee34b2))

## backend [1.7.2](https://github.com/fhswf/book_me/compare/backend@1.7.1...backend@1.7.2) (2024-09-23)


### Bug Fixes

* **logging:** log CORS config ([c449f3f](https://github.com/fhswf/book_me/commit/c449f3fadc3ddfcab05bb0ac65e6b69143692b21))

## backend [1.7.1](https://github.com/fhswf/book_me/compare/backend@1.7.0...backend@1.7.1) (2024-09-23)


### Bug Fixes

* **deployment:** update via semantic release ([52619ba](https://github.com/fhswf/book_me/commit/52619bad54f3eb702164d2909f01c52b1c7e7425))

# backend [1.7.0](https://github.com/fhswf/book_me/compare/backend@1.6.8...backend@1.7.0) (2024-09-23)


### Bug Fixes

* **deployment:** separate deployment & ingress config ([bd3b800](https://github.com/fhswf/book_me/commit/bd3b8006d94567282f2f2e636ab83b5e7a775915))


### Features

* **backend:** CORS entry for appoint.gawron.cloud ([c629be7](https://github.com/fhswf/book_me/commit/c629be707d33facc2135995aa72494a4db72f435))





config: {"name":"backend","version":"1.6.8","description":"","repository":{"type":"git","url":"git@github.com:fhswf/book_me.git"},"main":"server.js","scripts":{"test":"vitest run src/**/*.spec.ts --coverage","ci":"vitest run src/**/*.spec.ts --coverage","start":"node build/server.js","server":"nodemon src/server.ts","dev":"concurrently \"npm run server\" \"npm run client\"","build":"tsc","doc":"jsdoc -c jsdoc.json"},"contributors":[{"name":"Felix Hinnemann"},{"name":"Christian Gawron","email":"gawron.christian@fh-swf.de"}],"license":"MIT","dependencies":{"bcrypt":"^5.0.1","bcryptjs":"^2.4.3","body-parser":"^1.20.1","common":"workspace:*","concurrently":"^8.2.1","cookie-parser":"^1.4.5","cors":"^2.8.5","date-fns":"^2.30.0","date-fns-tz":"^1.1.1","dotenv":"^16.3.1","express":"^4.18.2","express-jwt":"^8.4.1","express-validator":"^7.0.1","google-auth-library":"9.0.0","googleapis":"^126.0.1","ical-generator":"^5.0.1","jsonwebtoken":"^9.0.2","moment":"^2.29.1","mongoose":"^7.5.0","nodemailer":"^6.4.14","remark":"15.0.1","remark-html":"16.0.1"},"devDependencies":{"@babel/core":"^7.23.3","@babel/preset-typescript":"^7.23.3","@jest/globals":"^29.7.0","@types/babel__core":"^7","@types/bcrypt":"^5.0.0","@types/bcryptjs":"^2.4.2","@types/express":"^4.17.11","@types/jest":"^29.5.8","@types/jsonwebtoken":"^9.0.3","@types/node":"^20.5.9","@types/nodemailer":"^6.4.0","@vitest/coverage-v8":"^0.34.6","eslint":"^8.48.0","eslint-config-prettier":"^8.3.0","eslint-config-react-app":"^7.0.1","jest":"^29.7.0","nodemon":"^3.0.1","supertest":"^6.3.3","ts-jest":"^29.1.1","ts-node":"^10.9.1","typescript":"^5.2.2","vitest":"^0.34.6"},"eslintConfig":{"extends":["react-app","react-app/jest"]},"release":{"plugins":["@semantic-release/commit-analyzer","@semantic-release/release-notes-generator","@semantic-release/changelog",["@semantic-release/exec",{"execCwd":"..","prepareCmd":"yarn exec node utility/patch-workspace-versions.js"}],["@dmeents/semantic-release-yarn",{"npmPublish":false,"changeVersion":true,"tarballDir":"build"}],["@semantic-release/exec",{"execCwd":".","generateNotesCmd":"yarn exec node ../utility/patch-k8s.js k8s/deployment.yaml"}],["@semantic-release/git",{"assets":["package.json","CHANGELOG.md","k8s/deployment.yaml"],"message":"chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"}],"@semantic-release/github",["@codedependant/semantic-release-docker",{"dockerTags":["latest","{{major}}-latest","{{version}}","{{git_sha}}"],"dockerImage":"backend","dockerRegistry":"ghcr.io","dockerProject":"fhswf/book_me","dockerContext":".."}]]},"gitHead":"a4b1d2cc78703828c99149277115e8434b675afc"}
Patching k8s config...
ghcr.io/fhswf/book_me/backend:1.6.8

## backend [1.6.8](https://github.com/fhswf/book_me/compare/backend@1.6.7...backend@1.6.8) (2024-06-19)


### Bug Fixes

* multi-release ([bbb6a72](https://github.com/fhswf/book_me/commit/bbb6a72964206a302f044db078575ae093d0cc10))

## backend [1.6.7](https://github.com/fhswf/book_me/compare/backend@1.6.6...backend@1.6.7) (2024-06-19)


### Bug Fixes

* multi-release ([15f0acf](https://github.com/fhswf/book_me/commit/15f0acf4854398bbccd8b28e679a568729b8ab7a))

## backend [1.6.6](https://github.com/fhswf/book_me/compare/backend@1.6.5...backend@1.6.6) (2024-06-17)


### Bug Fixes

* **backend:** quality improvement ([3836ca6](https://github.com/fhswf/book_me/commit/3836ca673f1f01639902bbbdcedca5a8cbab4ac2))
* controller should not return a promise ([91a0bb1](https://github.com/fhswf/book_me/commit/91a0bb1bbea3ab68a506c77c9632d4bac15fb84d))
* dotenv config for backend ([02df94c](https://github.com/fhswf/book_me/commit/02df94c4cdb1b85b7d52edea491d515e14f91ece))





### Dependencies

* **common:** upgraded to 1.1.1

## backend [1.6.5](https://github.com/fhswf/book_me/compare/backend@1.6.4...backend@1.6.5) (2023-10-13)


### Bug Fixes

* **security:** remove secret from docker image ([64446b5](https://github.com/fhswf/book_me/commit/64446b53362e89dd2aa9b9b1dc2f874dc103738e))

## backend [1.6.4](https://github.com/fhswf/book_me/compare/backend@1.6.3...backend@1.6.4) (2023-10-13)


### Bug Fixes

* **backend:** token verification ([6b95be6](https://github.com/fhswf/book_me/commit/6b95be610ccc77f788917d5cec35e8133b15c0fb))

## backend [1.6.3](https://github.com/fhswf/book_me/compare/backend@1.6.2...backend@1.6.3) (2023-10-11)


### Bug Fixes

* **backend:** JWT_SECRET and email passwords ([032df16](https://github.com/fhswf/book_me/commit/032df1659925782e2e91dfa7e061cde3ba5655be))

## backend [1.6.2](https://github.com/fhswf/book_me/compare/backend@1.6.1...backend@1.6.2) (2023-10-09)


### Bug Fixes

* **backend:** config warnings ([6c004e4](https://github.com/fhswf/book_me/commit/6c004e47ce927e66ba4470ec79f930c572fe8982))

## backend [1.6.1](https://github.com/fhswf/book_me/compare/backend@1.6.0...backend@1.6.1) (2023-10-09)


### Bug Fixes

* **backend:** typescript config ([48376f7](https://github.com/fhswf/book_me/commit/48376f7fb2b36535fa037ea76c8f8e32a1c403ae))

# backend [1.6.0](https://github.com/fhswf/book_me/compare/backend@1.5.6...backend@1.6.0) (2023-10-09)


### Bug Fixes

* **client:** docker deployment & typing ([57111e9](https://github.com/fhswf/book_me/commit/57111e909d4abce2f2df79f5d830ec78dbfafed5))


### Features

* local development ([867fd81](https://github.com/fhswf/book_me/commit/867fd81d834a5c47bf57e9b2ef3ce3f17ce2048b))





### Dependencies

* **common:** upgraded to 1.1.0

## backend [1.5.6](https://github.com/fhswf/book_me/compare/backend@1.5.5...backend@1.5.6) (2023-09-14)


### Bug Fixes

* correct api url configuration ([8afb172](https://github.com/fhswf/book_me/commit/8afb1726902e67c12b9a6f3485142d4adb050b49))

## backend [1.5.5](https://github.com/fhswf/book_me/compare/backend@1.5.4...backend@1.5.5) (2023-09-14)


### Bug Fixes

* **workflow:** update version in package.json ([c0d9d2f](https://github.com/fhswf/book_me/commit/c0d9d2fcc609c6e0fe56d3377bae0450fcb10701))

## backend [1.5.4](https://github.com/fhswf/book_me/compare/backend@1.5.3...backend@1.5.4) (2023-09-14)


### Bug Fixes

* **workflow:** delete obsolete workflow files ([f98ed45](https://github.com/fhswf/book_me/commit/f98ed4583dd5c440be19e832e1517fde6405cfad))

## backend [1.5.3](https://github.com/fhswf/book_me/compare/backend@1.5.2...backend@1.5.3) (2023-09-14)


### Bug Fixes

* build backend image via gh action ([debf186](https://github.com/fhswf/book_me/commit/debf18672509d5bd0610c9a9c80bddd315430c4a))
* make redirect URL configurable ([b2fe616](https://github.com/fhswf/book_me/commit/b2fe616e62a4f14910fe22e412537e771471ecd9))

## backend [1.5.2](https://github.com/fhswf/book_me/compare/backend@1.5.1...backend@1.5.2) (2023-09-13)


### Bug Fixes

* build backend image via gh action ([956d375](https://github.com/fhswf/book_me/commit/956d375f95a69e2b1b21461fbf1832411b2bab94))
* build backend image via gh action ([3110467](https://github.com/fhswf/book_me/commit/3110467f8a6fb65ec3081e863ccd7e070248b070))
* build backend image via gh action ([64cc709](https://github.com/fhswf/book_me/commit/64cc7099d0613010aba03c75a8b4169915dbd767))

## backend [1.5.2](https://github.com/fhswf/book_me/compare/backend@1.5.1...backend@1.5.2) (2023-09-13)


### Bug Fixes

* build backend image via gh action ([3110467](https://github.com/fhswf/book_me/commit/3110467f8a6fb65ec3081e863ccd7e070248b070))
* build backend image via gh action ([64cc709](https://github.com/fhswf/book_me/commit/64cc7099d0613010aba03c75a8b4169915dbd767))

## backend [1.5.2](https://github.com/fhswf/book_me/compare/backend@1.5.1...backend@1.5.2) (2023-09-13)


### Bug Fixes

* build backend image via gh action ([64cc709](https://github.com/fhswf/book_me/commit/64cc7099d0613010aba03c75a8b4169915dbd767))

## backend [1.5.1](https://github.com/fhswf/book_me/compare/backend@1.5.0...backend@1.5.1) (2023-09-12)


### Bug Fixes

* automated docker build ([3647c57](https://github.com/fhswf/book_me/commit/3647c579e5e261f60d503f3989a591043d8288a6))

# backend [1.5.0](https://github.com/fhswf/book_me/compare/backend@1.4.0...backend@1.5.0) (2023-09-11)


### Features

* docker build in release ([408acff](https://github.com/fhswf/book_me/commit/408acff2177b69a7745c925f7e944859400b1b0d))
* docker build in release ([c697153](https://github.com/fhswf/book_me/commit/c697153957f3ddac263f110fad88ce1fb612c55b))
* docker build in release ([4f05ee3](https://github.com/fhswf/book_me/commit/4f05ee3f72cc8ab6482a22498bb2069b1b1a03c4))

# backend [1.4.0](https://github.com/fhswf/book_me/compare/backend@1.3.0...backend@1.4.0) (2023-09-11)


### Features

* docker build in release ([8302272](https://github.com/fhswf/book_me/commit/8302272c2f07a72dff498b9da46eec034e10fa37))

# backend [1.3.0](https://github.com/fhswf/book_me/compare/backend@1.2.0...backend@1.3.0) (2023-09-10)


### Features

* docker build in release ([1437407](https://github.com/fhswf/book_me/commit/1437407f5b96b06ec538e2c870f1e592a5d28ebb))

# backend [1.2.0](https://github.com/fhswf/book_me/compare/backend@1.1.0...backend@1.2.0) (2023-09-10)


### Features

* docker build in release ([cce03b0](https://github.com/fhswf/book_me/commit/cce03b0ca8a8970b4d65fa1e8729227035c95108))
* docker build in release ([a2e1c1f](https://github.com/fhswf/book_me/commit/a2e1c1feae44eae6987a016a6f73a4f4991a20ef))
* docker build in release ([891bb01](https://github.com/fhswf/book_me/commit/891bb017ef0580385696d1c6f84bb810a027e25f))
* docker build in release ([f1c3366](https://github.com/fhswf/book_me/commit/f1c3366e78a3e6cbe8c048572dd49b664fb1c980))
* docker build in release ([af3b7c4](https://github.com/fhswf/book_me/commit/af3b7c449225e7ef9c26181c0a21482856521644))

# backend [1.2.0](https://github.com/fhswf/book_me/compare/backend@1.1.0...backend@1.2.0) (2023-09-10)


### Features

* docker build in release ([891bb01](https://github.com/fhswf/book_me/commit/891bb017ef0580385696d1c6f84bb810a027e25f))
* docker build in release ([f1c3366](https://github.com/fhswf/book_me/commit/f1c3366e78a3e6cbe8c048572dd49b664fb1c980))
* docker build in release ([af3b7c4](https://github.com/fhswf/book_me/commit/af3b7c449225e7ef9c26181c0a21482856521644))

# backend [1.2.0](https://github.com/fhswf/book_me/compare/backend@1.1.0...backend@1.2.0) (2023-09-10)


### Features

* docker build in release ([f1c3366](https://github.com/fhswf/book_me/commit/f1c3366e78a3e6cbe8c048572dd49b664fb1c980))
* docker build in release ([af3b7c4](https://github.com/fhswf/book_me/commit/af3b7c449225e7ef9c26181c0a21482856521644))

# backend [1.1.0](https://github.com/fhswf/book_me/compare/backend@1.0.0...backend@1.1.0) (2023-09-10)


### Features

* docker build in release ([000ce1c](https://github.com/fhswf/book_me/commit/000ce1cb8162a30c43d43d24ddb59aa54c28efb2))
* docker build in release ([2205739](https://github.com/fhswf/book_me/commit/2205739080523259c7ec345a5482f792d3f22e3d))
* docker build in release ([920652b](https://github.com/fhswf/book_me/commit/920652bec227fec613fb8eec7dbc4b8b13eee566))
* docker build in release ([ca47fa9](https://github.com/fhswf/book_me/commit/ca47fa9e1b21eccc7d75ab8eb5936d468516f10b))
* docker build in release ([b1610e3](https://github.com/fhswf/book_me/commit/b1610e3c6a7bd013e58107e9f53f8b2b9a6a6c0f))
* docker build in release ([e856a5c](https://github.com/fhswf/book_me/commit/e856a5c1c1b03d7e258bd14c36dba9c67c08e768))

# backend [1.1.0](https://github.com/fhswf/book_me/compare/backend@1.0.0...backend@1.1.0) (2023-09-10)


### Features

* docker build in release ([920652b](https://github.com/fhswf/book_me/commit/920652bec227fec613fb8eec7dbc4b8b13eee566))
* docker build in release ([ca47fa9](https://github.com/fhswf/book_me/commit/ca47fa9e1b21eccc7d75ab8eb5936d468516f10b))
* docker build in release ([b1610e3](https://github.com/fhswf/book_me/commit/b1610e3c6a7bd013e58107e9f53f8b2b9a6a6c0f))
* docker build in release ([e856a5c](https://github.com/fhswf/book_me/commit/e856a5c1c1b03d7e258bd14c36dba9c67c08e768))

# backend [1.1.0](https://github.com/fhswf/book_me/compare/backend@1.0.0...backend@1.1.0) (2023-09-10)


### Features

* docker build in release ([b1610e3](https://github.com/fhswf/book_me/commit/b1610e3c6a7bd013e58107e9f53f8b2b9a6a6c0f))
* docker build in release ([e856a5c](https://github.com/fhswf/book_me/commit/e856a5c1c1b03d7e258bd14c36dba9c67c08e768))

# backend 1.0.0 (2023-09-10)


### Bug Fixes

* **bump dependencies:** upgrade several dependencies ([ca905e2](https://github.com/fhswf/book_me/commit/ca905e241e31bbbe69d05a7e4bec76b0bd4a9bcc))
* do not overwrite calendar settings upon login ([8923777](https://github.com/fhswf/book_me/commit/892377784cc94f2243c193f0763c82e7e58e7c16))
* do not update google tokens via user controller ([c1a04da](https://github.com/fhswf/book_me/commit/c1a04dad850e091a217fc06e7976c1f6fc1f603a))
* edit available times ([#5](https://github.com/fhswf/book_me/issues/5)) ([46500a9](https://github.com/fhswf/book_me/commit/46500a9c33da1279c612938652eb765c0dd76b91))
* freeBusy service corrected ([c2d8590](https://github.com/fhswf/book_me/commit/c2d85904dfb2393faadf1caa4dd1b4af107e44f9))
* **freeBusy:** filter out free slots shorter than the event duration ([2eedf77](https://github.com/fhswf/book_me/commit/2eedf7789c6158827c6ffc2d9ebf61c6c4682879))
* github actions for semantic release fixed ([72ac08f](https://github.com/fhswf/book_me/commit/72ac08ff062d91c2e05b1671c31eaa64d11de74f))
* **insertEvent:** check availablility of requested slot in backend ([54c9e92](https://github.com/fhswf/book_me/commit/54c9e92b3b7d4c452954e30c8442bc483e654ed1)), closes [#27](https://github.com/fhswf/book_me/issues/27)
* Migrate to Google Sign In ([e3e51e4](https://github.com/fhswf/book_me/commit/e3e51e4dde061b522641194ef2c1374e924797ba))
* security updates ([9e359b1](https://github.com/fhswf/book_me/commit/9e359b187ca2f5496fc1ef384172c49ff562ae3f))
* semantic release config ([981919d](https://github.com/fhswf/book_me/commit/981919d114991237ba83a04dbc95e04f29ed30f1))
* semantic-release config ([7ac94ec](https://github.com/fhswf/book_me/commit/7ac94ec675b5b1a9644a013e208f214aeb7300fe))
* transfer timestamp as integer ([37dd14a](https://github.com/fhswf/book_me/commit/37dd14a5b0ddfa4a9e5126eb345616cf3e6e5c64))
* typescript issues ([46e85ca](https://github.com/fhswf/book_me/commit/46e85cab96b0180b999151d8909b5afaaf69a2fd))
* UI glitches fixed ([2720b9d](https://github.com/fhswf/book_me/commit/2720b9d26ee4779988d71275e1d7ff4e3cc94bb1))
* update docker build to use yarn ([e0618f7](https://github.com/fhswf/book_me/commit/e0618f71e36062ae0745df42a87139aaf432ec26))
* yarn build/dependency management & docker ([eaae025](https://github.com/fhswf/book_me/commit/eaae025680d1a840765406f2c3fb2eed9c238c43))


### Features

* **freeBusy:** check maxPerDay constraint ([ad49b95](https://github.com/fhswf/book_me/commit/ad49b957181a2717b179b4c52ce4ab84f1ddca34))
* **freeBusy:** freeBusy should observe minFuture and maxFuture restrictictions of an event ([a670b7d](https://github.com/fhswf/book_me/commit/a670b7d8eadf01547009c35121bbe3062b545931))
* **markdown:** handle event type description as markdown. ([4bedade](https://github.com/fhswf/book_me/commit/4bedade846876fe6eedb5b0f4d986a33c8d283b2))





### Dependencies

* **common:** upgraded to 1.0.0

# [@fhswf/bookme-backend-v1.3.2](https://github.com/fhswf/book_me/compare/@fhswf/bookme-backend-v1.3.1...@fhswf/bookme-backend-v1.3.2) (2021-08-10)


### Bug Fixes

* **bump dependencies:** upgrade several dependencies ([ca905e2](https://github.com/fhswf/book_me/commit/ca905e241e31bbbe69d05a7e4bec76b0bd4a9bcc))

# [@fhswf/bookme-backend-v1.3.1](https://github.com/fhswf/book_me/compare/@fhswf/bookme-backend-v1.3.0...@fhswf/bookme-backend-v1.3.1) (2021-06-06)


### Bug Fixes

* **insertEvent:** check availablility of requested slot in backend ([54c9e92](https://github.com/fhswf/book_me/commit/54c9e92b3b7d4c452954e30c8442bc483e654ed1)), closes [#27](https://github.com/fhswf/book_me/issues/27)

# [@fhswf/bookme-backend-v1.3.0](https://github.com/fhswf/book_me/compare/@fhswf/bookme-backend-v1.2.1...@fhswf/bookme-backend-v1.3.0) (2021-06-06)


### Features

* **markdown:** handle event type description as markdown. ([4bedade](https://github.com/fhswf/book_me/commit/4bedade846876fe6eedb5b0f4d986a33c8d283b2))

# [@fhswf/bookme-backend-v1.2.1](https://github.com/fhswf/book_me/compare/@fhswf/bookme-backend-v1.2.0...@fhswf/bookme-backend-v1.2.1) (2021-06-05)


### Bug Fixes

* **freeBusy:** filter out free slots shorter than the event duration ([2eedf77](https://github.com/fhswf/book_me/commit/2eedf7789c6158827c6ffc2d9ebf61c6c4682879))

# [@fhswf/bookme-backend-v1.2.0](https://github.com/fhswf/book_me/compare/@fhswf/bookme-backend-v1.1.0...@fhswf/bookme-backend-v1.2.0) (2021-05-31)


### Features

* **freeBusy:** check maxPerDay constraint ([ad49b95](https://github.com/fhswf/book_me/commit/ad49b957181a2717b179b4c52ce4ab84f1ddca34))

# [@fhswf/bookme-backend-v1.1.0](https://github.com/fhswf/book_me/compare/@fhswf/bookme-backend-v1.0.1...@fhswf/bookme-backend-v1.1.0) (2021-05-29)


### Features

* **freeBusy:** freeBusy should observe minFuture and maxFuture restrictictions of an event ([a670b7d](https://github.com/fhswf/book_me/commit/a670b7d8eadf01547009c35121bbe3062b545931))

# [@fhswf/bookme-backend-v1.0.1](https://github.com/fhswf/book_me/compare/@fhswf/bookme-backend-v1.0.0...@fhswf/bookme-backend-v1.0.1) (2021-05-26)


### Bug Fixes

* do not overwrite calendar settings upon login ([8923777](https://github.com/fhswf/book_me/commit/892377784cc94f2243c193f0763c82e7e58e7c16))

# @fhswf/bookme-backend-v1.0.0 (2021-05-26)


### Bug Fixes

* do not update google tokens via user controller ([c1a04da](https://github.com/fhswf/book_me/commit/c1a04dad850e091a217fc06e7976c1f6fc1f603a))
* edit available times ([238d799](https://github.com/fhswf/book_me/commit/238d7995005bfd7fca0ed25abc56f23dfc06567a))
* edit available times ([#5](https://github.com/fhswf/book_me/issues/5)) ([46500a9](https://github.com/fhswf/book_me/commit/46500a9c33da1279c612938652eb765c0dd76b91))
* freeBusy service corrected ([c2d8590](https://github.com/fhswf/book_me/commit/c2d85904dfb2393faadf1caa4dd1b4af107e44f9))
* github actions for semantic release fixed ([72ac08f](https://github.com/fhswf/book_me/commit/72ac08ff062d91c2e05b1671c31eaa64d11de74f))
* transfer timestamp as integer ([37dd14a](https://github.com/fhswf/book_me/commit/37dd14a5b0ddfa4a9e5126eb345616cf3e6e5c64))
* typescript issues ([46e85ca](https://github.com/fhswf/book_me/commit/46e85cab96b0180b999151d8909b5afaaf69a2fd))
* UI glitches fixed ([2720b9d](https://github.com/fhswf/book_me/commit/2720b9d26ee4779988d71275e1d7ff4e3cc94bb1))


### Features

* add profile image ([e291705](https://github.com/fhswf/book_me/commit/e291705a560d006301a515877a04a7c6a34c6d7c))
