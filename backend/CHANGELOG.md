## backend [1.38.2](https://github.com/fhswf/appointme/compare/backend@1.38.1...backend@1.38.2) (2026-01-21)


### Bug Fixes

* mongodb performance improvements ([0e6265f](https://github.com/fhswf/appointme/commit/0e6265f3fadd1836b174510d9da6c8186ad6917d))
* mongodb performance improvements ([757fe59](https://github.com/fhswf/appointme/commit/757fe59b3122862edad62f3a25facda8e60e8c96))

## backend [1.38.2-rc.1](https://github.com/fhswf/appointme/compare/backend@1.38.1...backend@1.38.2-rc.1) (2026-01-21)


### Bug Fixes

* mongodb performance improvements ([0e6265f](https://github.com/fhswf/appointme/commit/0e6265f3fadd1836b174510d9da6c8186ad6917d))
* mongodb performance improvements ([757fe59](https://github.com/fhswf/appointme/commit/757fe59b3122862edad62f3a25facda8e60e8c96))

## backend [1.38.1](https://github.com/fhswf/appointme/compare/backend@1.38.0...backend@1.38.1) (2026-01-21)


### Bug Fixes

* add csrf tokens for the booking endpoint ([83fad2f](https://github.com/fhswf/appointme/commit/83fad2f98e5d4a421d872ebe84ecf5ce14c3d321))
* refine csrf exemption rules ([f88e5c8](https://github.com/fhswf/appointme/commit/f88e5c80d526596a7dd673f0d46b782f600f20cd))

## backend [1.38.1-rc.2](https://github.com/fhswf/appointme/compare/backend@1.38.1-rc.1...backend@1.38.1-rc.2) (2026-01-21)


### Bug Fixes

* add csrf tokens for the booking endpoint ([83fad2f](https://github.com/fhswf/appointme/commit/83fad2f98e5d4a421d872ebe84ecf5ce14c3d321))

## backend [1.38.1-rc.1](https://github.com/fhswf/appointme/compare/backend@1.38.0...backend@1.38.1-rc.1) (2026-01-21)


### Bug Fixes

* refine csrf exemption rules ([f88e5c8](https://github.com/fhswf/appointme/commit/f88e5c80d526596a7dd673f0d46b782f600f20cd))

# backend [1.38.0](https://github.com/fhswf/appointme/compare/backend@1.37.0...backend@1.38.0) (2026-01-21)


### Bug Fixes

* add smtp config in k8s ([502551e](https://github.com/fhswf/appointme/commit/502551e9b01cb676230de8c201882d73497868a7))
* authentication handling ([e25b793](https://github.com/fhswf/appointme/commit/e25b7938be4225be4bf3851de036fe3b79da8c4a))
* authentication handling ([264b701](https://github.com/fhswf/appointme/commit/264b701d3aa38d680879ea214e77f208f05f958b))
* avoid accidentally overwriting google tokens on oidc login ([e075f07](https://github.com/fhswf/appointme/commit/e075f07b0b5f77300a6bc405dd451018a331f682))
* **backend:** use production env for backend ([f7d9eb4](https://github.com/fhswf/appointme/commit/f7d9eb499e0d1ebe1e5352f2201545a40b651a93))
* check uniqueness constrains before importing settings ([852d73f](https://github.com/fhswf/appointme/commit/852d73f51d7170c54b241531d920c66e676241fe))
* do not require csrf token on booking endpoint ([fef0331](https://github.com/fhswf/appointme/commit/fef03315c681108337993d5d76e9d6a8420cadc1))
* improve csrf handling ([8660929](https://github.com/fhswf/appointme/commit/8660929e419d7b0f693cd9820c1247213dc54c1f))
* narrowing csrf exclusions ([a964a46](https://github.com/fhswf/appointme/commit/a964a461dbd3bf880f501746e4303bc2a23babf4))
* sanitize settings before importing them ([8b31f27](https://github.com/fhswf/appointme/commit/8b31f27c9d3757a0eaadbcfd67f64a92f5ffb909))
* use mongoose schema validion for settings import ([83feac8](https://github.com/fhswf/appointme/commit/83feac89f581776f87a570e865783eb3b5f94b8d))
* visibility of restricted events ([1af3f3e](https://github.com/fhswf/appointme/commit/1af3f3e71d2445de55197f866380bda320ca5187))


### Features

* filter transient fields in settings export ([50cde89](https://github.com/fhswf/appointme/commit/50cde897b505ac6886a6851213bd0d2c317b0c32))
* import/export user settings ([72ed714](https://github.com/fhswf/appointme/commit/72ed7142b51026d7f03081b4c6a403507f9e02ac))
* separate access token from "transient" lti token ([da9e2e7](https://github.com/fhswf/appointme/commit/da9e2e7a6362ab65fd2c07b6cc12c685fc349d1e))
* separate access token from "transient" lti token ([a8d1482](https://github.com/fhswf/appointme/commit/a8d1482b1429a3b8b6a0710183d2f24f67c6798a))





### Dependencies

* **common:** upgraded to 1.15.1

# backend [1.38.0-rc.6](https://github.com/fhswf/appointme/compare/backend@1.38.0-rc.5...backend@1.38.0-rc.6) (2026-01-21)





### Dependencies

* **common:** upgraded to 1.15.1-rc.1

# backend [1.38.0-rc.5](https://github.com/fhswf/appointme/compare/backend@1.38.0-rc.4...backend@1.38.0-rc.5) (2026-01-21)


### Bug Fixes

* add smtp config in k8s ([502551e](https://github.com/fhswf/appointme/commit/502551e9b01cb676230de8c201882d73497868a7))
* check uniqueness constrains before importing settings ([852d73f](https://github.com/fhswf/appointme/commit/852d73f51d7170c54b241531d920c66e676241fe))
* do not require csrf token on booking endpoint ([fef0331](https://github.com/fhswf/appointme/commit/fef03315c681108337993d5d76e9d6a8420cadc1))
* narrowing csrf exclusions ([a964a46](https://github.com/fhswf/appointme/commit/a964a461dbd3bf880f501746e4303bc2a23babf4))
* sanitize settings before importing them ([8b31f27](https://github.com/fhswf/appointme/commit/8b31f27c9d3757a0eaadbcfd67f64a92f5ffb909))
* use mongoose schema validion for settings import ([83feac8](https://github.com/fhswf/appointme/commit/83feac89f581776f87a570e865783eb3b5f94b8d))


### Features

* filter transient fields in settings export ([50cde89](https://github.com/fhswf/appointme/commit/50cde897b505ac6886a6851213bd0d2c317b0c32))
* import/export user settings ([72ed714](https://github.com/fhswf/appointme/commit/72ed7142b51026d7f03081b4c6a403507f9e02ac))

# backend [1.38.0-rc.4](https://github.com/fhswf/appointme/compare/backend@1.38.0-rc.3...backend@1.38.0-rc.4) (2026-01-20)


### Bug Fixes

* avoid accidentally overwriting google tokens on oidc login ([e075f07](https://github.com/fhswf/appointme/commit/e075f07b0b5f77300a6bc405dd451018a331f682))

# backend [1.38.0-rc.3](https://github.com/fhswf/appointme/compare/backend@1.38.0-rc.2...backend@1.38.0-rc.3) (2026-01-20)


### Bug Fixes

* **backend:** use production env for backend ([f7d9eb4](https://github.com/fhswf/appointme/commit/f7d9eb499e0d1ebe1e5352f2201545a40b651a93))
* visibility of restricted events ([1af3f3e](https://github.com/fhswf/appointme/commit/1af3f3e71d2445de55197f866380bda320ca5187))

# backend [1.38.0-rc.2](https://github.com/fhswf/appointme/compare/backend@1.38.0-rc.1...backend@1.38.0-rc.2) (2026-01-20)


### Bug Fixes

* authentication handling ([e25b793](https://github.com/fhswf/appointme/commit/e25b7938be4225be4bf3851de036fe3b79da8c4a))
* authentication handling ([264b701](https://github.com/fhswf/appointme/commit/264b701d3aa38d680879ea214e77f208f05f958b))
* improve csrf handling ([8660929](https://github.com/fhswf/appointme/commit/8660929e419d7b0f693cd9820c1247213dc54c1f))


### Features

* separate access token from "transient" lti token ([da9e2e7](https://github.com/fhswf/appointme/commit/da9e2e7a6362ab65fd2c07b6cc12c685fc349d1e))

# backend [1.38.0-rc.1](https://github.com/fhswf/appointme/compare/backend@1.37.0...backend@1.38.0-rc.1) (2026-01-20)


### Features

* separate access token from "transient" lti token ([a8d1482](https://github.com/fhswf/appointme/commit/a8d1482b1429a3b8b6a0710183d2f24f67c6798a))

# backend [1.37.0](https://github.com/fhswf/appointme/compare/backend@1.36.0...backend@1.37.0) (2026-01-20)


### Bug Fixes

* Add input type validation for user identifiers to prevent NoSQL injection and include a test for `getUserByUrl`. ([3026c58](https://github.com/fhswf/appointme/commit/3026c584a7b9ac352a79a6e3d62d0653fb2a87d5))
* add user rate limiter and update authentication middleware for the /me route ([d62241c](https://github.com/fhswf/appointme/commit/d62241c5c9a2f28a628d0b41dad7af57d36ea600))
* **auth:** default for API_URL ([fe2bc48](https://github.com/fhswf/appointme/commit/fe2bc4817fba7fdc3706d97b1ae5b49c6bd0e2a4))
* **auth:** default for API_URL ([7ff4ba9](https://github.com/fhswf/appointme/commit/7ff4ba905ef5b5ed1c818070b5146ca7b64c5dba))
* **authentication:** remove client-accessible token ([cfafeba](https://github.com/fhswf/appointme/commit/cfafebaaab1fb3e64a6d089b67a15d85ec62501e))
* automated docker build ([1faee3d](https://github.com/fhswf/appointme/commit/1faee3d51b606fad2218e99bf5ee047de0a14084))
* avoid silent change of email address ([674f212](https://github.com/fhswf/appointme/commit/674f21219f744960d4c2cdf03f59eb747f9d5e8f))
* avoid silent change of email address ([b648c1b](https://github.com/fhswf/appointme/commit/b648c1be78924104539fc879855f943ada2618da))
* **backend:** change type to module ([aa75e33](https://github.com/fhswf/appointme/commit/aa75e335514dcccf07daca5bfa0d6d0cccc28b5b))
* **backend:** config warnings ([472cbb9](https://github.com/fhswf/appointme/commit/472cbb938efc9075d5fead4e0fff4dd89f973218))
* **backend:** fix Dockerfile dependencies and trigger release ([4d14d4f](https://github.com/fhswf/appointme/commit/4d14d4f0fd057065b03ed68ebc29fc49c9db4c93))
* **backend:** handle changes in `rrule.between()` ([9b375d5](https://github.com/fhswf/appointme/commit/9b375d5d165da3eb08ff8940cc3c33315ab48af0))
* **backend:** import in test spec ([1333b4a](https://github.com/fhswf/appointme/commit/1333b4aa4b10cfacc0df4c0e75033e8849c5d9d7))
* **backend:** JWT_SECRET and email passwords ([8039273](https://github.com/fhswf/appointme/commit/8039273db62430adde844e0f07bfa20dafe1996f))
* **backend:** quality improvement ([e0fff97](https://github.com/fhswf/appointme/commit/e0fff976ad5dbcd3f9defb0de0334e856c9d88af))
* **backend:** token verification ([3f6a304](https://github.com/fhswf/appointme/commit/3f6a304167435114bcc0747c35d612f3aa27578d))
* **backend:** typescript config ([8ae7834](https://github.com/fhswf/appointme/commit/8ae78343e9b00dcda2c95710f5b9b7f1b5905aa1))
* **backend:** upgrade Docker base image from Bullseye to Bookworm. ([49895b3](https://github.com/fhswf/appointme/commit/49895b3300227bf9a951a382afec4770a7dd00ba))
* **backend:** use dynamic import for instrumentation ([0199f2a](https://github.com/fhswf/appointme/commit/0199f2a403b3eab8c7afa458e0a087900564d3b7))
* base url configuration ([c482362](https://github.com/fhswf/appointme/commit/c48236208ce136c537f692439f1425f625c50a78))
* build backend image via gh action ([ea5a66a](https://github.com/fhswf/appointme/commit/ea5a66acf4f9dff7dd19b14074e9b03c551dd43b))
* build backend image via gh action ([23f1a63](https://github.com/fhswf/appointme/commit/23f1a633a56ddf6ce93ff0cc6ba96da60c459417))
* build backend image via gh action ([c82f89c](https://github.com/fhswf/appointme/commit/c82f89ce47ddbc1771eb0b195d7b169d0b6fb156))
* build backend image via gh action ([246f9cb](https://github.com/fhswf/appointme/commit/246f9cb9ff0da59dde61aaab203e5f53bc427074))
* build issues ([75427f1](https://github.com/fhswf/appointme/commit/75427f1417117029f0e7eda6c85ab34904395914))
* build issues ([1b416b4](https://github.com/fhswf/appointme/commit/1b416b4d99eb9890be37a2b9508681ba7cd7b5a8))
* **build:** release configuration ([ef9aacf](https://github.com/fhswf/appointme/commit/ef9aacf96529ace73db39969373daa8652c21e57))
* **build:** Remove explicit `yarn set version 4` command from Dockerfile. ([5fb5aec](https://github.com/fhswf/appointme/commit/5fb5aec25517b7c6ec52a27bfaef866aaf5e0671))
* **bump dependencies:** upgrade several dependencies ([e12f326](https://github.com/fhswf/appointme/commit/e12f3263f763ee58e30cb0f1ad78f7f1cf0876da))
* bump openid-client to v6 ([1eb727a](https://github.com/fhswf/appointme/commit/1eb727a5fa95267d8e8d3c5c6055920c8b04db1d))
* ci build errors ([1668269](https://github.com/fhswf/appointme/commit/1668269bd933f8ca2ef21cbf94d8fe3803227006))
* **client:** docker deployment & typing ([4a13512](https://github.com/fhswf/appointme/commit/4a135126e82c46cad40ab24d068a6d0f0d8eb5a1))
* CodeQL issues ([88bf072](https://github.com/fhswf/appointme/commit/88bf072793c757c0495f1b08d7fb0402fd148cb2))
* config update ([4860846](https://github.com/fhswf/appointme/commit/486084600a9197e1e3ee6ef08835e70394013e14))
* config update ([909117a](https://github.com/fhswf/appointme/commit/909117a6eb7b3f91c7279f193e6a0f7326393ab0))
* **config:** update config values ([422bc58](https://github.com/fhswf/appointme/commit/422bc58e125e1588f9bca071d1bd06fa40f69ccd))
* configuration ([787d311](https://github.com/fhswf/appointme/commit/787d311d12e5622456b507e8bb676902d0383f7b))
* controller should not return a promise ([e646f33](https://github.com/fhswf/appointme/commit/e646f335ac8251573a745920a6b66ab25f596fea))
* Correct 'Invitaion' typo in event invitation subject and feat: introduce navigation after calendar updates and internationalize CalDav UI text. ([a9ad145](https://github.com/fhswf/appointme/commit/a9ad1456cfda1ec0c441ba671a76c33573afdcd9))
* correct api url configuration ([98b91dc](https://github.com/fhswf/appointme/commit/98b91dc0a9b5bd31fd07e4cf48d76708dcf65a79))
* Correct type assertion for Client property in test mock. ([ea73a39](https://github.com/fhswf/appointme/commit/ea73a394ee98bdfa73a14aa3af9149d178b9d596))
* CORS for debugging ([e2e9d3a](https://github.com/fhswf/appointme/commit/e2e9d3ad3930f2270067f2d365f11e1637dc26e4))
* deployment on appoint.gawron.cloud ([8005aed](https://github.com/fhswf/appointme/commit/8005aedccc3c0f185a25f6bdb60e54f663ec0f37))
* **deployment:** resource limits ([eaeec6f](https://github.com/fhswf/appointme/commit/eaeec6f5c44c3c95d59be9acb503106d7801b963))
* **deployment:** separate deployment & ingress config ([786ef37](https://github.com/fhswf/appointme/commit/786ef37b72848d6de49f69b1c5be4617708816d7))
* **deployment:** update via semantic release ([148c38c](https://github.com/fhswf/appointme/commit/148c38c138da53e6aa4e5a57d922ec2ccc031625))
* do not overwrite calendar settings upon login ([2cfaa2b](https://github.com/fhswf/appointme/commit/2cfaa2b044c18c66c61dde23d909f1e46010b506))
* dotenv config for backend ([2ca1294](https://github.com/fhswf/appointme/commit/2ca1294a0e4c468852230bfb13c43d5457b79742))
* enable cookies for CORS requests ([a737ee6](https://github.com/fhswf/appointme/commit/a737ee604fc6fa97eee6930dd276ef04e3c93d38))
* enable cookies for CORS requests ([eedae21](https://github.com/fhswf/appointme/commit/eedae21eba187a07844612017fa3fbdc7d08f3fa))
* Enhance CalDAV error reporting and introduce a manual testing script for CalDAV integration. ([a722789](https://github.com/fhswf/appointme/commit/a72278971f0ddd00603586390d8e6e96f6202174))
* escape user search queries to prevent regular expression injection and add a corresponding test. ([0ed6861](https://github.com/fhswf/appointme/commit/0ed6861e9978619a17cc60c9de78bdc289b4ea0c))
* exempt lti login from csrf ([e7f9fbd](https://github.com/fhswf/appointme/commit/e7f9fbd6cb7fc8009de29d105a8159e4d6e58002))
* **freeBusy:** filter out free slots shorter than the event duration ([e8870aa](https://github.com/fhswf/appointme/commit/e8870aab7d9f8925f616c00823d25815bcb76a43))
* google login ([11804a9](https://github.com/fhswf/appointme/commit/11804a90fde41e82e66a7e3ee8c43c3c686610a8))
* google login library update ([dc7f589](https://github.com/fhswf/appointme/commit/dc7f58980937435e51a209d7040914bda202991f))
* handle multiple push calendars ([4444c8b](https://github.com/fhswf/appointme/commit/4444c8b01127550fde494f3be653bc7a8e705123))
* handle optional authorization for `insertEvent` endpoint ([09795fd](https://github.com/fhswf/appointme/commit/09795fdbd496abba323a58aa44fbb745d641b4ea))
* image tagging ([6682a43](https://github.com/fhswf/appointme/commit/6682a43ff80e9d8e715cb63febffc018a89a3c66))
* improve csrf protection ([e33fb05](https://github.com/fhswf/appointme/commit/e33fb05c5dd9bae97d8953fd006bd61df1d60752))
* improve error handling ([cbe197b](https://github.com/fhswf/appointme/commit/cbe197bce89563de646e288e5661b5173e86c7b3))
* improve quality ([264e6e5](https://github.com/fhswf/appointme/commit/264e6e58258171bc896ef947174e9128d07e658c))
* improve sentry instrumentation ([2166525](https://github.com/fhswf/appointme/commit/2166525393c6e066ce2e9f9a9f44e153689c8e61))
* increase rate limit in backend ([e41ce18](https://github.com/fhswf/appointme/commit/e41ce188dc53f9183538de45d14a01bc409b9515))
* **insertEvent:** check availablility of requested slot in backend ([4f8f25b](https://github.com/fhswf/appointme/commit/4f8f25b83b57dce69b92d90655809296f91cc65c)), closes [#27](https://github.com/fhswf/appointme/issues/27)
* issues due to mongoose version bump ([cdcf89b](https://github.com/fhswf/appointme/commit/cdcf89bacaede9be877344d5b8dc15f8d4cc3d67))
* **k8s:** security settings ([d96f1ec](https://github.com/fhswf/appointme/commit/d96f1ec16a7f8b0c4d587069de8ff3c6b9362eb5))
* linting issues ([54e9305](https://github.com/fhswf/appointme/commit/54e9305d4269a7ecef1a5508cfc54c5107c2c8df))
* **logging:** log CORS config ([301811c](https://github.com/fhswf/appointme/commit/301811cd94280d873e0041b6a9e24eda23f89711))
* **logging:** log CORS config ([f237edc](https://github.com/fhswf/appointme/commit/f237edc52807a6c946c0111a098cf7bb525029c3))
* LTI authentication ([8ffeff4](https://github.com/fhswf/appointme/commit/8ffeff40cf23828f8f571085df02324dc324d4f3))
* LTI authentication ([fda74ac](https://github.com/fhswf/appointme/commit/fda74ac1d42a2b73647ae0f420cc0a915247ade2))
* LTI authentication ([05207f9](https://github.com/fhswf/appointme/commit/05207f987cbb826ceaddd91982761236e1bcfd72))
* LTI authentication ([2e3fba3](https://github.com/fhswf/appointme/commit/2e3fba33905102a1b56a12afcdfd778c3e048042))
* LTI authentication ([09e638b](https://github.com/fhswf/appointme/commit/09e638b18bf5bd4a144f48b9c32975de885c6e80))
* lti login configuration ([23aa70b](https://github.com/fhswf/appointme/commit/23aa70b1bdf4788b1ae911f7f21cd6a3c5b572d8))
* make redirect URL configurable ([e8463cd](https://github.com/fhswf/appointme/commit/e8463cd3828428ffecf752f4301d3c27ab36230e))
* make sure LTI users cannot access protected routes ([7817eec](https://github.com/fhswf/appointme/commit/7817eec7118cd1682d4079d00395a9ac82f13d12))
* Migrate to Google Sign In ([31f6854](https://github.com/fhswf/appointme/commit/31f685416be4120b0e871689f0d7364428b3a9f7))
* module deps ([6846797](https://github.com/fhswf/appointme/commit/6846797bfe06a2c32fd19d918cfd51d15934ba4a))
* module import ([fbfbb29](https://github.com/fhswf/appointme/commit/fbfbb299a7e19b992ed43268196bbf67d4a95dfe))
* module import ([7b23f33](https://github.com/fhswf/appointme/commit/7b23f3335210723e6d362722fd28ae82e9c6a20e))
* module resolution ([9e25fb4](https://github.com/fhswf/appointme/commit/9e25fb488c36626ba29a9ef3efb089a111312e1f))
* module resolution ([b886471](https://github.com/fhswf/appointme/commit/b886471967213756a7a92adfab7071e67d864d54))
* mongoose import ([6222035](https://github.com/fhswf/appointme/commit/622203575b91ebd2920f4f259e1a5d1a760430cf))
* moving images ([352ccb3](https://github.com/fhswf/appointme/commit/352ccb30cc4a8077fec8e717dc9d42977df8563a))
* multi-release ([484dee9](https://github.com/fhswf/appointme/commit/484dee9fa846cea897c0a68156fd40e1c3b5d051))
* multi-release ([d332082](https://github.com/fhswf/appointme/commit/d33208282afdfff4414ffa4184d88da943512b69))
* nosql injection ([a3cac1a](https://github.com/fhswf/appointme/commit/a3cac1a355d433991ed3431e366d60b42dfbbccb))
* OIDC login ([be1f9a0](https://github.com/fhswf/appointme/commit/be1f9a0f94baa7750f914c59c5d773548d6d3271))
* Potential fix for code scanning alert no. 140: Database query built from user-controlled sources ([24a79e1](https://github.com/fhswf/appointme/commit/24a79e1519a2f648ffe364287f32d0b5b40b52d8))
* rate limiting ([fb71fb6](https://github.com/fhswf/appointme/commit/fb71fb6be04aac1fcacfa67109ba8cf3c0c5197a))
* redirect to calendar integration ([824ac74](https://github.com/fhswf/appointme/commit/824ac7457f21418a437019c5da6b25a53e29de94))
* redirect to calendar integration ([654f942](https://github.com/fhswf/appointme/commit/654f9421ba411275bf5fd57157974114f3c4e8c3))
* refactor event controller ([e37a6f5](https://github.com/fhswf/appointme/commit/e37a6f5c086257fc5e82445b1ac1af0968e572f6))
* refactor event controller ([8a34cc4](https://github.com/fhswf/appointme/commit/8a34cc4288d08490eee5f918a5e28a9f1c3a5481))
* refactor user type ([429f60c](https://github.com/fhswf/appointme/commit/429f60c25ca820e90d09c94cc8995bcb8c68507b))
* Refine TypeScript type annotations in CalDAV controller and authentication test mocks. ([cdc496d](https://github.com/fhswf/appointme/commit/cdc496df983f862222e03bb9db9f429ff75424cd))
* regression error due to optional chaining ([586f3b8](https://github.com/fhswf/appointme/commit/586f3b840831dba64329b8fb95b7620dea9decd2))
* remove unused code ([176c201](https://github.com/fhswf/appointme/commit/176c201fb75799e1a9c16c505ba79413a382a4b7))
* remove unused routes ([a2ab16e](https://github.com/fhswf/appointme/commit/a2ab16eb75185776a02c20d3e09905b46b9f4933))
* replace yarn in init container ([b72addb](https://github.com/fhswf/appointme/commit/b72addb1bfe4596982143f34e9f89a8e07259c24))
* resource limits ([618b900](https://github.com/fhswf/appointme/commit/618b9001bc3a7842f82177f5f0958dba84cb3bd6))
* runtime configuration of URLs ([304b9d4](https://github.com/fhswf/appointme/commit/304b9d421d1dde89ae1bfa4f8e2562f44045f80c))
* Sanitize HTML in email invitation content for attendee name, event summary, and description, and add a corresponding test. ([8d8cd4d](https://github.com/fhswf/appointme/commit/8d8cd4d00b8588ed9563296bd2f9dd1ea8ef786f))
* security updates ([06616d3](https://github.com/fhswf/appointme/commit/06616d3f167b6f9efaddf13b0af5b777bfd854c2))
* **security:** enforce TLS with nodemailer ([9e3444b](https://github.com/fhswf/appointme/commit/9e3444b2d6275753bf0c1f5a775bab73cc4f47e4))
* **security:** remove password attribute ([ac32061](https://github.com/fhswf/appointme/commit/ac320615741880b15261b0b81357c61ef680dbee))
* **security:** remove secret from docker image ([90da15c](https://github.com/fhswf/appointme/commit/90da15c2b7d478ccc3c103679e0cfd351fae6e5f))
* semantic release config ([89938b0](https://github.com/fhswf/appointme/commit/89938b027319ef9733c38028b279f8a6163fb821))
* semantic-release config ([2d6b838](https://github.com/fhswf/appointme/commit/2d6b838a947a8d260f0b6a7ba85e7ca7a1bf4358))
* separate Swagger server configurations for production and development environments ([b258b7d](https://github.com/fhswf/appointme/commit/b258b7d680877b2f81480f4fad87bc28840ff48f))
* set domain for cookie ([9fdc82d](https://github.com/fhswf/appointme/commit/9fdc82d9ad2e461d8362c6045e69918e80ea5f4c))
* set sameSite: lax in development ([6e8f853](https://github.com/fhswf/appointme/commit/6e8f853668d087eb8a2aba28de9772195d6813a0))
* set sameSite: none in development ([e806de3](https://github.com/fhswf/appointme/commit/e806de39ea0ba29c41b5adecbca79e05255f8059))
* simplify common package import paths by removing `/src/types` suffix. ([93f2a73](https://github.com/fhswf/appointme/commit/93f2a73bae8a71bd716be1a0a10f5078fa9981ee))
* simplify health check endpoint ([bdb8e27](https://github.com/fhswf/appointme/commit/bdb8e270cceffc47586861d5f742e321e22118f7))
* sonarqube issues ([b883e69](https://github.com/fhswf/appointme/commit/b883e693a9411ce8d8d5652c9fa37b40dfd31cbe))
* sonarqube issues ([a97f608](https://github.com/fhswf/appointme/commit/a97f608ad2dfee150726d2367bcd35f4e1fc471e))
* sonarqube issues ([994e246](https://github.com/fhswf/appointme/commit/994e246061525bcbcc3da929ae54acbd004483a4))
* syntax error in deployment.yaml ([6f07c54](https://github.com/fhswf/appointme/commit/6f07c54f98818e537b3bf70871e1faa1bb9a8d55))
* **test:** coverage for cypress tests ([ccf55dc](https://github.com/fhswf/appointme/commit/ccf55dc92b9277290be3a0afaf9c1643952aae77))
* **test:** coverage for cypress tests ([0e602e5](https://github.com/fhswf/appointme/commit/0e602e5e41b38ec93d0c32343390d40013e90da1))
* testing ([5a083f9](https://github.com/fhswf/appointme/commit/5a083f99545b8cd7a2dd3ea8e81d81d6a2e01c06))
* **test:** mock google calendar ([e73ed0b](https://github.com/fhswf/appointme/commit/e73ed0b0fe48879f709f1fe374825be518ca0517))
* **test:** test before sonarqube analysis ([a899845](https://github.com/fhswf/appointme/commit/a899845e9ab5f57d5838ad3d202e3a01bb946870))
* **test:** test before sonarqube analysis ([39397df](https://github.com/fhswf/appointme/commit/39397df84273848a53eb0268ddf8abb1ecc5cdfb))
* **test:** test before sonarqube analysis ([a32133d](https://github.com/fhswf/appointme/commit/a32133d90022774f884f0f81274c088f7c7063ec))
* **test:** test before sonarqube analysis ([f57ecbd](https://github.com/fhswf/appointme/commit/f57ecbde0dee86b00f8adad043547f76e6393e54))
* **test:** version & config updates ([ef8142a](https://github.com/fhswf/appointme/commit/ef8142a205dfb04ea97be1fca1819b0c76bbf0e1))
* trust proxy ([fe158b3](https://github.com/fhswf/appointme/commit/fe158b3e2c33942687cdf08edf33f71758ed0969))
* type issues ([3fc939c](https://github.com/fhswf/appointme/commit/3fc939c759488257ff47387ee21565d211e63ee0))
* **ui:** changes for vite & mui 6 ([1dbc21b](https://github.com/fhswf/appointme/commit/1dbc21bc870d693a60721d7580c91ad5064e969e))
* update docker build to use yarn ([f63d72c](https://github.com/fhswf/appointme/commit/f63d72c6a5831853e06ba9b699290416806ccbc5))
* update ical generation ([c138a25](https://github.com/fhswf/appointme/commit/c138a25dc7143de2f12d7ccab52ae35379d9bfb9))
* update release build ([6954750](https://github.com/fhswf/appointme/commit/6954750edfa14262add897b09164e073cbd2eebd))
* update Swagger server URL environment variable from `REACT_APP_URL` to `CLIENT_URL` ([a957b3b](https://github.com/fhswf/appointme/commit/a957b3b77a41f5b3c0c01dae6f425f0893236062))
* use correct booking page deep link ([c11e1e8](https://github.com/fhswf/appointme/commit/c11e1e8efb82df4245e68e471e6633b24935e553))
* use top-level await & try/catch ([cf1ec87](https://github.com/fhswf/appointme/commit/cf1ec872bdfcd04d878ec800a7a766094d8ba1c9))
* version bumps ([0478b48](https://github.com/fhswf/appointme/commit/0478b4854e28b31914f9a40657485a661924b3ec))
* **workflow:** delete obsolete workflow files ([0b95010](https://github.com/fhswf/appointme/commit/0b95010573ee0af243b3778f510ef3d7f1477691))
* **workflow:** update version in package.json ([c289782](https://github.com/fhswf/appointme/commit/c2897828afd46de533f69f3f3b85e306b2fa4be1))
* yarn build/dependency management & docker ([ffd0688](https://github.com/fhswf/appointme/commit/ffd0688c5262ad019259076c3c2d6299f829f972))


### Features

* add agenda view with all appointments ([e0954cb](https://github.com/fhswf/appointme/commit/e0954cbca1733b5ed3986a4328d6ed57240669ab))
* add agenda view with all appointments ([39dfe81](https://github.com/fhswf/appointme/commit/39dfe813abf0c25e8839c6e2b147bc7b362cf029))
* Add authentication and event controller tests and fix authentication flow. ([4d380cd](https://github.com/fhswf/appointme/commit/4d380cdab6266d92832f4d7dc123cc2d4d3af4e1))
* add comprehensive tests for EventForm fields and submit button, refine Login and OidcCallback tests, and update EventList navigation tests. ([ed51002](https://github.com/fhswf/appointme/commit/ed51002339060ad7e40596d23302dbb4a8150d60))
* Add configurable SMTP support to mailer, falling back to Gmail service. ([10f1d83](https://github.com/fhswf/appointme/commit/10f1d833945922d0c44a08e4c75c1b37ae2ed2d5))
* Add ENCRYPTION_KEY environment variable for CalDAV password encryption to deployment, secret example, and README. ([99d592a](https://github.com/fhswf/appointme/commit/99d592adffad76c53193e181dfe825b7f8617d81))
* add health check ([d4615e3](https://github.com/fhswf/appointme/commit/d4615e32ec398aa561f61a124d3e8dee703e0f2c))
* add Kubernetes deployment examples for ConfigMap and Secret, update README and gitignore. ([49c4123](https://github.com/fhswf/appointme/commit/49c4123e30e0cd50029cf98588dad9fe02d0bfa9))
* add LTI tool endpoints ([c11e9b7](https://github.com/fhswf/appointme/commit/c11e9b7557b2dac4e5565c5c5bdac8e4d967773f))
* Add new i18n keys for booking and CalDav features, and refine iCal attendee RSVP logic. ([e07ea98](https://github.com/fhswf/appointme/commit/e07ea98f014c76026a97e60903f459709232e3f8))
* add OIDC controller tests and update Vitest dependencies. ([68bdfd3](https://github.com/fhswf/appointme/commit/68bdfd3c6431feeede71a427d333d178d1f4b7bb))
* Add optional email field to CalDAV accounts and use it for event organizers when creating events. ([37988dc](https://github.com/fhswf/appointme/commit/37988dc6934b49749cfd160133629e2d008c0a27))
* Add persistent agenda visible calendars to user profiles and integrate them into the appointments page. ([bb626d8](https://github.com/fhswf/appointme/commit/bb626d896257da4e731ce2928308bd89c6de639d))
* Add rate limiting to OIDC `/url` and `/login` endpoints. ([e8f6b35](https://github.com/fhswf/appointme/commit/e8f6b35607b80543dcfdeb23642beabe72c57ef4))
* Add rate limiting to user update route and enhance `updateUser` controller with ID validation, field lookup optimization, and improved error handling. ([c7d8942](https://github.com/fhswf/appointme/commit/c7d8942c920cf3b057759e5fc2504960af7d78c6))
* add SBOM in docker images ([6c493c8](https://github.com/fhswf/appointme/commit/6c493c8986a0ac63ed3d8143c57c939a93c15658))
* Add scheduler utility, OIDC callback tests, Google event insertion, and enable event controller tests. ([9d58aaf](https://github.com/fhswf/appointme/commit/9d58aaf2be48fe5cf057cd0134a217b4562ee5bb))
* Add Sentry instrumentation and ignore Kubernetes secret file. ([106140f](https://github.com/fhswf/appointme/commit/106140f2fceba70f5d8964ee536d00f9e82f3210))
* add swagger ui ([37b6e8d](https://github.com/fhswf/appointme/commit/37b6e8d0c951e5d76db6958a06d99e366aea57db))
* Add user welcome field, update i18n password key, enhance user update security, and integrate new client icons. ([3c451a1](https://github.com/fhswf/appointme/commit/3c451a18b4b367385bd43934a35d3d4a02bfe24b))
* Add utility to patch JUnit XML timestamps and integrate into client unit and backend CI workflows. ([cdeb0e6](https://github.com/fhswf/appointme/commit/cdeb0e6004ce2b3fe7c5b43e6d090abf3c09ca67))
* Allow SMTP configuration without authentication and update K8s manifests and tests. ([3ad78e1](https://github.com/fhswf/appointme/commit/3ad78e1c0c773e1d5284c6df9f412f3852ccb87a))
* **backend:** calender events ([87c7b20](https://github.com/fhswf/appointme/commit/87c7b206a7362461bc6f9c16e6cd0967aa06ef77))
* **backend:** CORS entry for appoint.gawron.cloud ([165b045](https://github.com/fhswf/appointme/commit/165b04549cb4b16a8eceb2e07ef61baf518e6145))
* **backend:** store access token in cookie ([68a857b](https://github.com/fhswf/appointme/commit/68a857bb780031396a8058a8b15f4e5ad2ad8c9d))
* branding update ([737222c](https://github.com/fhswf/appointme/commit/737222c4093527476eab7aee046502f71738a281))
* caldav integration ([981ad71](https://github.com/fhswf/appointme/commit/981ad71cce8a06dc9930e98f023dee73fcb00443))
* caldav integration ([1e61cc6](https://github.com/fhswf/appointme/commit/1e61cc67400e9c4076069d29b73a97c5711c5bad))
* CalDAV integration ([3193db9](https://github.com/fhswf/appointme/commit/3193db9924487eb31d6bbac62fc71fc675e5f470))
* **calendar:** allow guests to modify an event ([6fa8dd2](https://github.com/fhswf/appointme/commit/6fa8dd27852ea7969786932a71bc73db3bd3e001))
* centralize documentation generation ([3e5822c](https://github.com/fhswf/appointme/commit/3e5822c5262aa4121e114d95aa8a98308b58ede4))
* database migration ([3940180](https://github.com/fhswf/appointme/commit/39401802ff5da3bc6f8eb0b49b09d7f46654478d))
* docker build in release ([fd8b9d0](https://github.com/fhswf/appointme/commit/fd8b9d0f14079bedb6fd969ace705d9d51fabe41))
* docker build in release ([82a5c7a](https://github.com/fhswf/appointme/commit/82a5c7af2f57a5bbecc2227f76825aa95080d363))
* docker build in release ([2440730](https://github.com/fhswf/appointme/commit/2440730dac1c3ee68faf7a183e3484bf83c5c926))
* docker build in release ([5cdec1c](https://github.com/fhswf/appointme/commit/5cdec1cb0a0953cf265689ff9e68d82e0e938ac5))
* docker build in release ([6b50d9f](https://github.com/fhswf/appointme/commit/6b50d9f3987714fc092907226962ead5566247ab))
* docker build in release ([4f16bd8](https://github.com/fhswf/appointme/commit/4f16bd82b9afef9ea6b5cb9885afcd7371b6856a))
* docker build in release ([4945a9e](https://github.com/fhswf/appointme/commit/4945a9ee8d9a92ec290848f3705c3c154969ed62))
* docker build in release ([aa281c4](https://github.com/fhswf/appointme/commit/aa281c40738caa23cb5a850e087612710f045249))
* docker build in release ([e773045](https://github.com/fhswf/appointme/commit/e773045957ba2234dc9a87609dbd915612ffc9ce))
* docker build in release ([3c407c2](https://github.com/fhswf/appointme/commit/3c407c24a64e2a3fde2090bdeff321394a1438b6))
* docker build in release ([dd4a147](https://github.com/fhswf/appointme/commit/dd4a147ec41c62f5e1abbe68560165bd3b5efaf5))
* docker build in release ([6d4feb7](https://github.com/fhswf/appointme/commit/6d4feb7ed660940b74c98ee5513730a57c7d370c))
* docker build in release ([7f64dca](https://github.com/fhswf/appointme/commit/7f64dca49959947d91f0fa573fbdb090f95aa53b))
* docker build in release ([02c217d](https://github.com/fhswf/appointme/commit/02c217d9497e9c6133f1df28b94e6e5db27e17ab))
* docker build in release ([5967c35](https://github.com/fhswf/appointme/commit/5967c35182dd741592c6cd4872d361901d430491))
* docker build in release ([a42f584](https://github.com/fhswf/appointme/commit/a42f58435945f067204f6b0e420c226b62d50ab3))
* Enhance CalDAV compatibility with a configured client utility and direct access fallback for account setup. ([dc922fb](https://github.com/fhswf/appointme/commit/dc922fb19832c4a015ecc057ceed677590eab2e2))
* Enhance health check endpoint to report database connection status with error handling. ([3e6882f](https://github.com/fhswf/appointme/commit/3e6882f8c5125c9b10c0c1bd2447e3aa9087e5da))
* enhance login experience ([e066c5f](https://github.com/fhswf/appointme/commit/e066c5f703c32958dca4d5b8300264a3ba215dfb))
* enhanced availability management ([ccb7cfe](https://github.com/fhswf/appointme/commit/ccb7cfe2a2d4f481f07dfcf7c2c2466b03a17a9c))
* externalize contact information to environment variables and a new component, updating legal pages and i18n. ([55b4c01](https://github.com/fhswf/appointme/commit/55b4c01823072d73a80523c322bcd7a6a806641f))
* **freeBusy:** check maxPerDay constraint ([6a3bb7f](https://github.com/fhswf/appointme/commit/6a3bb7fc4b5fb4a8f70b70681169d10219be6153))
* **freeBusy:** freeBusy should observe minFuture and maxFuture restrictictions of an event ([77fb36a](https://github.com/fhswf/appointme/commit/77fb36a23dbdff090cce5e5fc4212f00a7c614d8))
* gracefully handle missing Google tokens in calendar and event queries and add corresponding tests. ([a4c69b9](https://github.com/fhswf/appointme/commit/a4c69b9d621db92cb9fa5237591596ce4293b590))
* handling of free slots for recurrent events ([734f717](https://github.com/fhswf/appointme/commit/734f7173fb76be158e60e17d1f309c67e2577cf4))
* i18n restructured ([9ef1bb8](https://github.com/fhswf/appointme/commit/9ef1bb890ab708e2ef806920473e758d21458484))
* Implement 404 response and cache control for `GET /api/v1/user/me` and add a new test case. ([d83abdc](https://github.com/fhswf/appointme/commit/d83abdc909368091a6edece63dee7394ae4548a3))
* Implement CSRF protection by adding a new CSRF service and integrating CSRF tokens into client requests and backend server logic. ([1d40329](https://github.com/fhswf/appointme/commit/1d403296b08d9f5b52bddedbb235b32d7c2f3a76))
* Implement default event availability and refine scheduling logic to correctly apply buffers and include exact duration slots. ([9beb3da](https://github.com/fhswf/appointme/commit/9beb3da1477221f12c2ab6e5ac2f61de70494302))
* Implement default event availability and refine scheduling logic to correctly apply buffers and include exact duration slots. ([5d41c6c](https://github.com/fhswf/appointme/commit/5d41c6ca87c9b27a710685c0f20bc9bbdb4511fb))
* implement email event invitations with ICS attachments via new mailer utility. ([bedda09](https://github.com/fhswf/appointme/commit/bedda09c664b072efee0906ddc9c344e28549af9))
* Implement event tagging and refactor the public planning page with dark mode support. ([e4c5aa7](https://github.com/fhswf/appointme/commit/e4c5aa7c2d3bab7b4e0b5f874c5b6b1b536ef933))
* Implement Google Calendar event insertion, improve free/busy time calculation, and add token revocation. ([2bc5aa7](https://github.com/fhswf/appointme/commit/2bc5aa7a2697425a91e673459474c52ea4e22503))
* Implement OIDC authentication flow ([84d06c3](https://github.com/fhswf/appointme/commit/84d06c3aacc64685460b3de934c718c519b5e0d9))
* Implement per-user OAuth2Client creation with automatic token refresh and refine token update logic, adding new tests. ([18eb17f](https://github.com/fhswf/appointme/commit/18eb17f66c54e4e13d9be5a0a54a2353907f594c))
* Implement user profile page with Gravatar support, user URL updates, and i18n for navigation. ([5be5398](https://github.com/fhswf/appointme/commit/5be5398482a0d2637354adbe3ec327ae4a13767c))
* improve Google Calendar integration ([6cc2fad](https://github.com/fhswf/appointme/commit/6cc2fad2c7f3ff51a3b7b8400dd46edcf4c96482))
* improve login/logout ([d5967ab](https://github.com/fhswf/appointme/commit/d5967ab588845e170112a575ac195ec735369e60))
* improve OIDC user creation with email check and `user_url` collision retry, and redirect to login on client-side errors ([354550a](https://github.com/fhswf/appointme/commit/354550aba39dfac3583d02df38d48b82a6eef23b))
* improve test coverage ([605a611](https://github.com/fhswf/appointme/commit/605a611d1035631088fa76d807e7c7b7d5629a89))
* Improve user identification by email or provider ID, enforce unique email addresses, and add tests for cross-provider linking. ([109698a](https://github.com/fhswf/appointme/commit/109698ab944c37b2cf2d600013619dce6370d64e))
* Integrate `sonner` for client-side toast notifications, enhance backend authentication error handling, and update ESLint configuration. ([4812d62](https://github.com/fhswf/appointme/commit/4812d6293223ec04a1e4f57c20e2651458c76179))
* Integrate CalDAV busy slot fetching into free slot calculation and improve environment variable loading. ([f0d6f57](https://github.com/fhswf/appointme/commit/f0d6f575a1f6b9b3dd5c753ba0efb2b2a54a718a))
* integrate Sentry for error tracking and performance monitoring ([0c9cb11](https://github.com/fhswf/appointme/commit/0c9cb119dd615f09569c199745c4dc34f9e0575a))
* introduce calendar integration settings for Google and CalDAV with event fetching API. ([eb2a10c](https://github.com/fhswf/appointme/commit/eb2a10c4e7b33038696fa14d4acf5d412f59ec5e))
* Introduce iCal utility to centralize ICS generation and enhance event creation with user comments for CalDAV, Google Calendar, and email invitations. ([4f0f5a6](https://github.com/fhswf/appointme/commit/4f0f5a6566e26bc216b0d39903f7d585e0356aa6))
* introduce role-based access control for events and OIDC user role integration ([84a7db7](https://github.com/fhswf/appointme/commit/84a7db7b8a034a5747a0ab8777be9472f1bafa75))
* introduce role-based access control for events and OIDC user role integration ([afac97c](https://github.com/fhswf/appointme/commit/afac97cc6960c8f0c64409b3d2910777d3810bf8))
* introduce role-based access control for events and OIDC user role integration ([50defd5](https://github.com/fhswf/appointme/commit/50defd589dbcd93608d0337c79637db401086d94))
* local development ([b51c7b2](https://github.com/fhswf/appointme/commit/b51c7b26bbe3747ad37e766c6fa26d214c80d7d5))
* **logging:** use winston for logging ([8293696](https://github.com/fhswf/appointme/commit/82936968d64ce8a06876c8a388a2bc2b1030e0c5))
* **logging:** use winston for logging ([50f8780](https://github.com/fhswf/appointme/commit/50f87800288c00023917619d2f7ca22beba24918))
* LTI integration ([91b02dc](https://github.com/fhswf/appointme/commit/91b02dc0b7d3f66066576ed880dc8df0d0a483dc))
* LTI integration ([e877ff1](https://github.com/fhswf/appointme/commit/e877ff150167c225075fa4d51e2c2c7b2cdbf852))
* LTI integration ([194bedc](https://github.com/fhswf/appointme/commit/194bedc13a1bf0dbe267a2c9f46ecf6b1e55b45a))
* **markdown:** handle event type description as markdown. ([9bba8bf](https://github.com/fhswf/appointme/commit/9bba8bf8e0042ac2f99f84a28926119ff0118f0c))
* mcp server ([cf0885b](https://github.com/fhswf/appointme/commit/cf0885b58e6a2e2a6af416378e282d47ee44f26c))
* new rest api ([8486809](https://github.com/fhswf/appointme/commit/84868098c0111cb620fcd6be1401fbbb59d26479))
* new rest api ([e6d493b](https://github.com/fhswf/appointme/commit/e6d493b327d13b2989fba58138de6634de3a6e7b))
* Prevent Mongoose model re-compilation, enhance OIDC controller tests for unconfigured scenarios, and include `.tsx` files in SonarQube test inclusions. ([afc9d02](https://github.com/fhswf/appointme/commit/afc9d02000c6f0de9578ac63c15d567905624685))
* rebranding to "appointme" ([0b15e47](https://github.com/fhswf/appointme/commit/0b15e47859c0ae0b12c4f22506714ab705618548))
* recurring events ([e98d4b8](https://github.com/fhswf/appointme/commit/e98d4b826b7e04abb187368b0074ebc877173f71))
* recurring events ([a5ac86e](https://github.com/fhswf/appointme/commit/a5ac86e8e4c315ff89283187a31f5e6f5ea6fa38))
* refactor api & swagger docs ([bb7228d](https://github.com/fhswf/appointme/commit/bb7228dca3a59fc0c11d40b65f3d82b3b3d24f34))
* refactor calendar endpoint to use VEVENT data for CalDAV calendars ([01d477d](https://github.com/fhswf/appointme/commit/01d477d7c0c7c8dab7d7d46e63a7eb062e0a49bd))
* Refactor event booking logic into modular functions and introduce client-side configuration for environment variables. ([e2b89be](https://github.com/fhswf/appointme/commit/e2b89befd98f09b176aa52ed029ea9c01b79815c))
* refactoring CORS & dev container ([9d7862d](https://github.com/fhswf/appointme/commit/9d7862da860c555d729ba0a8edbd42692e48cd3a))
* simplify event availability modes ([be666e3](https://github.com/fhswf/appointme/commit/be666e30baea07a75e9cef43c02270f60418a2ee))
* store access token in cookie ([f00f11a](https://github.com/fhswf/appointme/commit/f00f11a611d3b3762fb2c4c8935d9b776655c995))
* store access token in cookie ([48c9d3f](https://github.com/fhswf/appointme/commit/48c9d3f39700a99514a71abcbf07a84d220a9ad7))
* test duplicate `user_url` ([798c2da](https://github.com/fhswf/appointme/commit/798c2da659481f2a6847c33222e91d2332e0a55f))
* token handling ([b50a057](https://github.com/fhswf/appointme/commit/b50a057ea02a5359ca53f69fa4ca6dd883a56cd8))
* ui improvements ([8a9bf18](https://github.com/fhswf/appointme/commit/8a9bf183fec5d58eff336bb7a593fa586a78c16e))
* ui improvements ([3cbfb64](https://github.com/fhswf/appointme/commit/3cbfb646e12022e39821f2b708b2e73d6878e346))
* Update encryption algorithm from AES-256-CBC to AES-256-GCM. ([5571809](https://github.com/fhswf/appointme/commit/5571809eadc321e7a8b2854aedd3454248c899ed))
* update encryption utility to use authentication tags and refine `Event` document type ([582b0cc](https://github.com/fhswf/appointme/commit/582b0ccc41b550849b6c45371580c138348fa934))
* use kustomization for separate stagin/prod environments ([a491378](https://github.com/fhswf/appointme/commit/a49137885ea29cd6df022771aa1cafb0fa941173))





### Dependencies

* **common:** upgraded to 1.15.0

# backend [1.37.0-rc.22](https://github.com/fhswf/appointme/compare/backend@1.37.0-rc.21...backend@1.37.0-rc.22) (2026-01-20)


### Bug Fixes

* improve csrf protection ([e33fb05](https://github.com/fhswf/appointme/commit/e33fb05c5dd9bae97d8953fd006bd61df1d60752))

# backend [1.37.0-rc.21](https://github.com/fhswf/appointme/compare/backend@1.37.0-rc.20...backend@1.37.0-rc.21) (2026-01-19)


### Bug Fixes

* make sure LTI users cannot access protected routes ([7817eec](https://github.com/fhswf/appointme/commit/7817eec7118cd1682d4079d00395a9ac82f13d12))
* use correct booking page deep link ([c11e1e8](https://github.com/fhswf/appointme/commit/c11e1e8efb82df4245e68e471e6633b24935e553))


### Features

* LTI integration ([91b02dc](https://github.com/fhswf/appointme/commit/91b02dc0b7d3f66066576ed880dc8df0d0a483dc))
* LTI integration ([e877ff1](https://github.com/fhswf/appointme/commit/e877ff150167c225075fa4d51e2c2c7b2cdbf852))
* LTI integration ([194bedc](https://github.com/fhswf/appointme/commit/194bedc13a1bf0dbe267a2c9f46ecf6b1e55b45a))

# backend [1.37.0-rc.20](https://github.com/fhswf/appointme/compare/backend@1.37.0-rc.19...backend@1.37.0-rc.20) (2026-01-19)


### Bug Fixes

* LTI authentication ([8ffeff4](https://github.com/fhswf/appointme/commit/8ffeff40cf23828f8f571085df02324dc324d4f3))
* LTI authentication ([fda74ac](https://github.com/fhswf/appointme/commit/fda74ac1d42a2b73647ae0f420cc0a915247ade2))

# backend [1.37.0-rc.19](https://github.com/fhswf/appointme/compare/backend@1.37.0-rc.18...backend@1.37.0-rc.19) (2026-01-19)


### Bug Fixes

* LTI authentication ([05207f9](https://github.com/fhswf/appointme/commit/05207f987cbb826ceaddd91982761236e1bcfd72))

# backend [1.37.0-rc.18](https://github.com/fhswf/appointme/compare/backend@1.37.0-rc.17...backend@1.37.0-rc.18) (2026-01-19)


### Bug Fixes

* LTI authentication ([2e3fba3](https://github.com/fhswf/appointme/commit/2e3fba33905102a1b56a12afcdfd778c3e048042))
* LTI authentication ([09e638b](https://github.com/fhswf/appointme/commit/09e638b18bf5bd4a144f48b9c32975de885c6e80))

# backend [1.37.0-rc.17](https://github.com/fhswf/appointme/compare/backend@1.37.0-rc.16...backend@1.37.0-rc.17) (2026-01-17)


### Bug Fixes

* lti login configuration ([23aa70b](https://github.com/fhswf/appointme/commit/23aa70b1bdf4788b1ae911f7f21cd6a3c5b572d8))

# backend [1.37.0-rc.16](https://github.com/fhswf/appointme/compare/backend@1.37.0-rc.15...backend@1.37.0-rc.16) (2026-01-17)


### Bug Fixes

* exempt lti login from csrf ([e7f9fbd](https://github.com/fhswf/appointme/commit/e7f9fbd6cb7fc8009de29d105a8159e4d6e58002))

# backend [1.37.0-rc.15](https://github.com/fhswf/appointme/compare/backend@1.37.0-rc.14...backend@1.37.0-rc.15) (2026-01-16)


### Bug Fixes

* avoid silent change of email address ([674f212](https://github.com/fhswf/appointme/commit/674f21219f744960d4c2cdf03f59eb747f9d5e8f))
* avoid silent change of email address ([b648c1b](https://github.com/fhswf/appointme/commit/b648c1be78924104539fc879855f943ada2618da))
* ci build errors ([1668269](https://github.com/fhswf/appointme/commit/1668269bd933f8ca2ef21cbf94d8fe3803227006))
* handle optional authorization for `insertEvent` endpoint ([09795fd](https://github.com/fhswf/appointme/commit/09795fdbd496abba323a58aa44fbb745d641b4ea))


### Features

* add LTI tool endpoints ([c11e9b7](https://github.com/fhswf/appointme/commit/c11e9b7557b2dac4e5565c5c5bdac8e4d967773f))
* introduce role-based access control for events and OIDC user role integration ([84a7db7](https://github.com/fhswf/appointme/commit/84a7db7b8a034a5747a0ab8777be9472f1bafa75))
* introduce role-based access control for events and OIDC user role integration ([afac97c](https://github.com/fhswf/appointme/commit/afac97cc6960c8f0c64409b3d2910777d3810bf8))
* introduce role-based access control for events and OIDC user role integration ([50defd5](https://github.com/fhswf/appointme/commit/50defd589dbcd93608d0337c79637db401086d94))





### Dependencies

* **common:** upgraded to 1.15.0-rc.4

# backend [1.37.0-rc.14](https://github.com/fhswf/appointme/compare/backend@1.37.0-rc.13...backend@1.37.0-rc.14) (2026-01-13)


### Bug Fixes

* **backend:** handle changes in `rrule.between()` ([9b375d5](https://github.com/fhswf/appointme/commit/9b375d5d165da3eb08ff8940cc3c33315ab48af0))

# backend [1.37.0-rc.13](https://github.com/fhswf/appointme/compare/backend@1.37.0-rc.12...backend@1.37.0-rc.13) (2026-01-11)


### Bug Fixes

* **backend:** use dynamic import for instrumentation ([0199f2a](https://github.com/fhswf/appointme/commit/0199f2a403b3eab8c7afa458e0a087900564d3b7))

# backend [1.37.0-rc.12](https://github.com/fhswf/appointme/compare/backend@1.37.0-rc.11...backend@1.37.0-rc.12) (2026-01-10)


### Bug Fixes

* improve sentry instrumentation ([2166525](https://github.com/fhswf/appointme/commit/2166525393c6e066ce2e9f9a9f44e153689c8e61))
* update ical generation ([c138a25](https://github.com/fhswf/appointme/commit/c138a25dc7143de2f12d7ccab52ae35379d9bfb9))

# backend [1.37.0-rc.11](https://github.com/fhswf/appointme/compare/backend@1.37.0-rc.10...backend@1.37.0-rc.11) (2026-01-09)


### Bug Fixes

* issues due to mongoose version bump ([cdcf89b](https://github.com/fhswf/appointme/commit/cdcf89bacaede9be877344d5b8dc15f8d4cc3d67))

# backend [1.37.0-rc.10](https://github.com/fhswf/appointme/compare/backend@1.37.0-rc.9...backend@1.37.0-rc.10) (2026-01-07)


### Bug Fixes

* **backend:** upgrade Docker base image from Bullseye to Bookworm. ([49895b3](https://github.com/fhswf/appointme/commit/49895b3300227bf9a951a382afec4770a7dd00ba))

# backend [1.37.0-rc.9](https://github.com/fhswf/appointme/compare/backend@1.37.0-rc.8...backend@1.37.0-rc.9) (2026-01-07)


### Bug Fixes

* Add input type validation for user identifiers to prevent NoSQL injection and include a test for `getUserByUrl`. ([3026c58](https://github.com/fhswf/appointme/commit/3026c584a7b9ac352a79a6e3d62d0653fb2a87d5))
* add user rate limiter and update authentication middleware for the /me route ([d62241c](https://github.com/fhswf/appointme/commit/d62241c5c9a2f28a628d0b41dad7af57d36ea600))
* **auth:** default for API_URL ([fe2bc48](https://github.com/fhswf/appointme/commit/fe2bc4817fba7fdc3706d97b1ae5b49c6bd0e2a4))
* **auth:** default for API_URL ([7ff4ba9](https://github.com/fhswf/appointme/commit/7ff4ba905ef5b5ed1c818070b5146ca7b64c5dba))
* **authentication:** remove client-accessible token ([cfafeba](https://github.com/fhswf/appointme/commit/cfafebaaab1fb3e64a6d089b67a15d85ec62501e))
* automated docker build ([1faee3d](https://github.com/fhswf/appointme/commit/1faee3d51b606fad2218e99bf5ee047de0a14084))
* **backend:** change type to module ([aa75e33](https://github.com/fhswf/appointme/commit/aa75e335514dcccf07daca5bfa0d6d0cccc28b5b))
* **backend:** config warnings ([472cbb9](https://github.com/fhswf/appointme/commit/472cbb938efc9075d5fead4e0fff4dd89f973218))
* **backend:** fix Dockerfile dependencies and trigger release ([4d14d4f](https://github.com/fhswf/appointme/commit/4d14d4f0fd057065b03ed68ebc29fc49c9db4c93))
* **backend:** import in test spec ([1333b4a](https://github.com/fhswf/appointme/commit/1333b4aa4b10cfacc0df4c0e75033e8849c5d9d7))
* **backend:** JWT_SECRET and email passwords ([8039273](https://github.com/fhswf/appointme/commit/8039273db62430adde844e0f07bfa20dafe1996f))
* **backend:** quality improvement ([e0fff97](https://github.com/fhswf/appointme/commit/e0fff976ad5dbcd3f9defb0de0334e856c9d88af))
* **backend:** token verification ([3f6a304](https://github.com/fhswf/appointme/commit/3f6a304167435114bcc0747c35d612f3aa27578d))
* **backend:** typescript config ([8ae7834](https://github.com/fhswf/appointme/commit/8ae78343e9b00dcda2c95710f5b9b7f1b5905aa1))
* base url configuration ([c482362](https://github.com/fhswf/appointme/commit/c48236208ce136c537f692439f1425f625c50a78))
* build backend image via gh action ([ea5a66a](https://github.com/fhswf/appointme/commit/ea5a66acf4f9dff7dd19b14074e9b03c551dd43b))
* build backend image via gh action ([23f1a63](https://github.com/fhswf/appointme/commit/23f1a633a56ddf6ce93ff0cc6ba96da60c459417))
* build backend image via gh action ([c82f89c](https://github.com/fhswf/appointme/commit/c82f89ce47ddbc1771eb0b195d7b169d0b6fb156))
* build backend image via gh action ([246f9cb](https://github.com/fhswf/appointme/commit/246f9cb9ff0da59dde61aaab203e5f53bc427074))
* build issues ([75427f1](https://github.com/fhswf/appointme/commit/75427f1417117029f0e7eda6c85ab34904395914))
* build issues ([1b416b4](https://github.com/fhswf/appointme/commit/1b416b4d99eb9890be37a2b9508681ba7cd7b5a8))
* **build:** release configuration ([ef9aacf](https://github.com/fhswf/appointme/commit/ef9aacf96529ace73db39969373daa8652c21e57))
* **build:** Remove explicit `yarn set version 4` command from Dockerfile. ([5fb5aec](https://github.com/fhswf/appointme/commit/5fb5aec25517b7c6ec52a27bfaef866aaf5e0671))
* **bump dependencies:** upgrade several dependencies ([e12f326](https://github.com/fhswf/appointme/commit/e12f3263f763ee58e30cb0f1ad78f7f1cf0876da))
* bump openid-client to v6 ([1eb727a](https://github.com/fhswf/appointme/commit/1eb727a5fa95267d8e8d3c5c6055920c8b04db1d))
* **client:** docker deployment & typing ([4a13512](https://github.com/fhswf/appointme/commit/4a135126e82c46cad40ab24d068a6d0f0d8eb5a1))
* CodeQL issues ([88bf072](https://github.com/fhswf/appointme/commit/88bf072793c757c0495f1b08d7fb0402fd148cb2))
* config update ([4860846](https://github.com/fhswf/appointme/commit/486084600a9197e1e3ee6ef08835e70394013e14))
* config update ([909117a](https://github.com/fhswf/appointme/commit/909117a6eb7b3f91c7279f193e6a0f7326393ab0))
* **config:** update config values ([422bc58](https://github.com/fhswf/appointme/commit/422bc58e125e1588f9bca071d1bd06fa40f69ccd))
* configuration ([787d311](https://github.com/fhswf/appointme/commit/787d311d12e5622456b507e8bb676902d0383f7b))
* controller should not return a promise ([e646f33](https://github.com/fhswf/appointme/commit/e646f335ac8251573a745920a6b66ab25f596fea))
* Correct 'Invitaion' typo in event invitation subject and feat: introduce navigation after calendar updates and internationalize CalDav UI text. ([a9ad145](https://github.com/fhswf/appointme/commit/a9ad1456cfda1ec0c441ba671a76c33573afdcd9))
* correct api url configuration ([98b91dc](https://github.com/fhswf/appointme/commit/98b91dc0a9b5bd31fd07e4cf48d76708dcf65a79))
* Correct type assertion for Client property in test mock. ([ea73a39](https://github.com/fhswf/appointme/commit/ea73a394ee98bdfa73a14aa3af9149d178b9d596))
* CORS for debugging ([e2e9d3a](https://github.com/fhswf/appointme/commit/e2e9d3ad3930f2270067f2d365f11e1637dc26e4))
* deployment on appoint.gawron.cloud ([8005aed](https://github.com/fhswf/appointme/commit/8005aedccc3c0f185a25f6bdb60e54f663ec0f37))
* **deployment:** resource limits ([eaeec6f](https://github.com/fhswf/appointme/commit/eaeec6f5c44c3c95d59be9acb503106d7801b963))
* **deployment:** separate deployment & ingress config ([786ef37](https://github.com/fhswf/appointme/commit/786ef37b72848d6de49f69b1c5be4617708816d7))
* **deployment:** update via semantic release ([148c38c](https://github.com/fhswf/appointme/commit/148c38c138da53e6aa4e5a57d922ec2ccc031625))
* do not overwrite calendar settings upon login ([2cfaa2b](https://github.com/fhswf/appointme/commit/2cfaa2b044c18c66c61dde23d909f1e46010b506))
* dotenv config for backend ([2ca1294](https://github.com/fhswf/appointme/commit/2ca1294a0e4c468852230bfb13c43d5457b79742))
* enable cookies for CORS requests ([a737ee6](https://github.com/fhswf/appointme/commit/a737ee604fc6fa97eee6930dd276ef04e3c93d38))
* enable cookies for CORS requests ([eedae21](https://github.com/fhswf/appointme/commit/eedae21eba187a07844612017fa3fbdc7d08f3fa))
* Enhance CalDAV error reporting and introduce a manual testing script for CalDAV integration. ([a722789](https://github.com/fhswf/appointme/commit/a72278971f0ddd00603586390d8e6e96f6202174))
* escape user search queries to prevent regular expression injection and add a corresponding test. ([0ed6861](https://github.com/fhswf/appointme/commit/0ed6861e9978619a17cc60c9de78bdc289b4ea0c))
* **freeBusy:** filter out free slots shorter than the event duration ([e8870aa](https://github.com/fhswf/appointme/commit/e8870aab7d9f8925f616c00823d25815bcb76a43))
* google login ([11804a9](https://github.com/fhswf/appointme/commit/11804a90fde41e82e66a7e3ee8c43c3c686610a8))
* google login library update ([dc7f589](https://github.com/fhswf/appointme/commit/dc7f58980937435e51a209d7040914bda202991f))
* handle multiple push calendars ([4444c8b](https://github.com/fhswf/appointme/commit/4444c8b01127550fde494f3be653bc7a8e705123))
* image tagging ([6682a43](https://github.com/fhswf/appointme/commit/6682a43ff80e9d8e715cb63febffc018a89a3c66))
* improve error handling ([cbe197b](https://github.com/fhswf/appointme/commit/cbe197bce89563de646e288e5661b5173e86c7b3))
* improve quality ([264e6e5](https://github.com/fhswf/appointme/commit/264e6e58258171bc896ef947174e9128d07e658c))
* increase rate limit in backend ([e41ce18](https://github.com/fhswf/appointme/commit/e41ce188dc53f9183538de45d14a01bc409b9515))
* **insertEvent:** check availablility of requested slot in backend ([4f8f25b](https://github.com/fhswf/appointme/commit/4f8f25b83b57dce69b92d90655809296f91cc65c)), closes [#27](https://github.com/fhswf/appointme/issues/27)
* **k8s:** security settings ([d96f1ec](https://github.com/fhswf/appointme/commit/d96f1ec16a7f8b0c4d587069de8ff3c6b9362eb5))
* linting issues ([54e9305](https://github.com/fhswf/appointme/commit/54e9305d4269a7ecef1a5508cfc54c5107c2c8df))
* **logging:** log CORS config ([301811c](https://github.com/fhswf/appointme/commit/301811cd94280d873e0041b6a9e24eda23f89711))
* **logging:** log CORS config ([f237edc](https://github.com/fhswf/appointme/commit/f237edc52807a6c946c0111a098cf7bb525029c3))
* make redirect URL configurable ([e8463cd](https://github.com/fhswf/appointme/commit/e8463cd3828428ffecf752f4301d3c27ab36230e))
* Migrate to Google Sign In ([31f6854](https://github.com/fhswf/appointme/commit/31f685416be4120b0e871689f0d7364428b3a9f7))
* module deps ([6846797](https://github.com/fhswf/appointme/commit/6846797bfe06a2c32fd19d918cfd51d15934ba4a))
* module import ([fbfbb29](https://github.com/fhswf/appointme/commit/fbfbb299a7e19b992ed43268196bbf67d4a95dfe))
* module import ([7b23f33](https://github.com/fhswf/appointme/commit/7b23f3335210723e6d362722fd28ae82e9c6a20e))
* module resolution ([9e25fb4](https://github.com/fhswf/appointme/commit/9e25fb488c36626ba29a9ef3efb089a111312e1f))
* module resolution ([b886471](https://github.com/fhswf/appointme/commit/b886471967213756a7a92adfab7071e67d864d54))
* mongoose import ([6222035](https://github.com/fhswf/appointme/commit/622203575b91ebd2920f4f259e1a5d1a760430cf))
* moving images ([352ccb3](https://github.com/fhswf/appointme/commit/352ccb30cc4a8077fec8e717dc9d42977df8563a))
* multi-release ([484dee9](https://github.com/fhswf/appointme/commit/484dee9fa846cea897c0a68156fd40e1c3b5d051))
* multi-release ([d332082](https://github.com/fhswf/appointme/commit/d33208282afdfff4414ffa4184d88da943512b69))
* nosql injection ([a3cac1a](https://github.com/fhswf/appointme/commit/a3cac1a355d433991ed3431e366d60b42dfbbccb))
* OIDC login ([be1f9a0](https://github.com/fhswf/appointme/commit/be1f9a0f94baa7750f914c59c5d773548d6d3271))
* Potential fix for code scanning alert no. 140: Database query built from user-controlled sources ([24a79e1](https://github.com/fhswf/appointme/commit/24a79e1519a2f648ffe364287f32d0b5b40b52d8))
* rate limiting ([fb71fb6](https://github.com/fhswf/appointme/commit/fb71fb6be04aac1fcacfa67109ba8cf3c0c5197a))
* redirect to calendar integration ([824ac74](https://github.com/fhswf/appointme/commit/824ac7457f21418a437019c5da6b25a53e29de94))
* redirect to calendar integration ([654f942](https://github.com/fhswf/appointme/commit/654f9421ba411275bf5fd57157974114f3c4e8c3))
* refactor event controller ([e37a6f5](https://github.com/fhswf/appointme/commit/e37a6f5c086257fc5e82445b1ac1af0968e572f6))
* refactor event controller ([8a34cc4](https://github.com/fhswf/appointme/commit/8a34cc4288d08490eee5f918a5e28a9f1c3a5481))
* refactor user type ([429f60c](https://github.com/fhswf/appointme/commit/429f60c25ca820e90d09c94cc8995bcb8c68507b))
* Refine TypeScript type annotations in CalDAV controller and authentication test mocks. ([cdc496d](https://github.com/fhswf/appointme/commit/cdc496df983f862222e03bb9db9f429ff75424cd))
* regression error due to optional chaining ([586f3b8](https://github.com/fhswf/appointme/commit/586f3b840831dba64329b8fb95b7620dea9decd2))
* remove unused code ([176c201](https://github.com/fhswf/appointme/commit/176c201fb75799e1a9c16c505ba79413a382a4b7))
* remove unused routes ([a2ab16e](https://github.com/fhswf/appointme/commit/a2ab16eb75185776a02c20d3e09905b46b9f4933))
* replace yarn in init container ([b72addb](https://github.com/fhswf/appointme/commit/b72addb1bfe4596982143f34e9f89a8e07259c24))
* resource limits ([618b900](https://github.com/fhswf/appointme/commit/618b9001bc3a7842f82177f5f0958dba84cb3bd6))
* runtime configuration of URLs ([304b9d4](https://github.com/fhswf/appointme/commit/304b9d421d1dde89ae1bfa4f8e2562f44045f80c))
* Sanitize HTML in email invitation content for attendee name, event summary, and description, and add a corresponding test. ([8d8cd4d](https://github.com/fhswf/appointme/commit/8d8cd4d00b8588ed9563296bd2f9dd1ea8ef786f))
* security updates ([06616d3](https://github.com/fhswf/appointme/commit/06616d3f167b6f9efaddf13b0af5b777bfd854c2))
* **security:** enforce TLS with nodemailer ([9e3444b](https://github.com/fhswf/appointme/commit/9e3444b2d6275753bf0c1f5a775bab73cc4f47e4))
* **security:** remove password attribute ([ac32061](https://github.com/fhswf/appointme/commit/ac320615741880b15261b0b81357c61ef680dbee))
* **security:** remove secret from docker image ([90da15c](https://github.com/fhswf/appointme/commit/90da15c2b7d478ccc3c103679e0cfd351fae6e5f))
* semantic release config ([89938b0](https://github.com/fhswf/appointme/commit/89938b027319ef9733c38028b279f8a6163fb821))
* semantic-release config ([2d6b838](https://github.com/fhswf/appointme/commit/2d6b838a947a8d260f0b6a7ba85e7ca7a1bf4358))
* separate Swagger server configurations for production and development environments ([b258b7d](https://github.com/fhswf/appointme/commit/b258b7d680877b2f81480f4fad87bc28840ff48f))
* set domain for cookie ([9fdc82d](https://github.com/fhswf/appointme/commit/9fdc82d9ad2e461d8362c6045e69918e80ea5f4c))
* set sameSite: lax in development ([6e8f853](https://github.com/fhswf/appointme/commit/6e8f853668d087eb8a2aba28de9772195d6813a0))
* set sameSite: none in development ([e806de3](https://github.com/fhswf/appointme/commit/e806de39ea0ba29c41b5adecbca79e05255f8059))
* simplify common package import paths by removing `/src/types` suffix. ([93f2a73](https://github.com/fhswf/appointme/commit/93f2a73bae8a71bd716be1a0a10f5078fa9981ee))
* simplify health check endpoint ([bdb8e27](https://github.com/fhswf/appointme/commit/bdb8e270cceffc47586861d5f742e321e22118f7))
* sonarqube issues ([b883e69](https://github.com/fhswf/appointme/commit/b883e693a9411ce8d8d5652c9fa37b40dfd31cbe))
* sonarqube issues ([a97f608](https://github.com/fhswf/appointme/commit/a97f608ad2dfee150726d2367bcd35f4e1fc471e))
* sonarqube issues ([994e246](https://github.com/fhswf/appointme/commit/994e246061525bcbcc3da929ae54acbd004483a4))
* syntax error in deployment.yaml ([6f07c54](https://github.com/fhswf/appointme/commit/6f07c54f98818e537b3bf70871e1faa1bb9a8d55))
* **test:** coverage for cypress tests ([ccf55dc](https://github.com/fhswf/appointme/commit/ccf55dc92b9277290be3a0afaf9c1643952aae77))
* **test:** coverage for cypress tests ([0e602e5](https://github.com/fhswf/appointme/commit/0e602e5e41b38ec93d0c32343390d40013e90da1))
* testing ([5a083f9](https://github.com/fhswf/appointme/commit/5a083f99545b8cd7a2dd3ea8e81d81d6a2e01c06))
* **test:** mock google calendar ([e73ed0b](https://github.com/fhswf/appointme/commit/e73ed0b0fe48879f709f1fe374825be518ca0517))
* **test:** test before sonarqube analysis ([a899845](https://github.com/fhswf/appointme/commit/a899845e9ab5f57d5838ad3d202e3a01bb946870))
* **test:** test before sonarqube analysis ([39397df](https://github.com/fhswf/appointme/commit/39397df84273848a53eb0268ddf8abb1ecc5cdfb))
* **test:** test before sonarqube analysis ([a32133d](https://github.com/fhswf/appointme/commit/a32133d90022774f884f0f81274c088f7c7063ec))
* **test:** test before sonarqube analysis ([f57ecbd](https://github.com/fhswf/appointme/commit/f57ecbde0dee86b00f8adad043547f76e6393e54))
* **test:** version & config updates ([ef8142a](https://github.com/fhswf/appointme/commit/ef8142a205dfb04ea97be1fca1819b0c76bbf0e1))
* trust proxy ([fe158b3](https://github.com/fhswf/appointme/commit/fe158b3e2c33942687cdf08edf33f71758ed0969))
* type issues ([3fc939c](https://github.com/fhswf/appointme/commit/3fc939c759488257ff47387ee21565d211e63ee0))
* **ui:** changes for vite & mui 6 ([1dbc21b](https://github.com/fhswf/appointme/commit/1dbc21bc870d693a60721d7580c91ad5064e969e))
* update docker build to use yarn ([f63d72c](https://github.com/fhswf/appointme/commit/f63d72c6a5831853e06ba9b699290416806ccbc5))
* update release build ([6954750](https://github.com/fhswf/appointme/commit/6954750edfa14262add897b09164e073cbd2eebd))
* update Swagger server URL environment variable from `REACT_APP_URL` to `CLIENT_URL` ([a957b3b](https://github.com/fhswf/appointme/commit/a957b3b77a41f5b3c0c01dae6f425f0893236062))
* use top-level await & try/catch ([cf1ec87](https://github.com/fhswf/appointme/commit/cf1ec872bdfcd04d878ec800a7a766094d8ba1c9))
* version bumps ([0478b48](https://github.com/fhswf/appointme/commit/0478b4854e28b31914f9a40657485a661924b3ec))
* **workflow:** delete obsolete workflow files ([0b95010](https://github.com/fhswf/appointme/commit/0b95010573ee0af243b3778f510ef3d7f1477691))
* **workflow:** update version in package.json ([c289782](https://github.com/fhswf/appointme/commit/c2897828afd46de533f69f3f3b85e306b2fa4be1))
* yarn build/dependency management & docker ([ffd0688](https://github.com/fhswf/appointme/commit/ffd0688c5262ad019259076c3c2d6299f829f972))


### Features

* add agenda view with all appointments ([e0954cb](https://github.com/fhswf/appointme/commit/e0954cbca1733b5ed3986a4328d6ed57240669ab))
* add agenda view with all appointments ([39dfe81](https://github.com/fhswf/appointme/commit/39dfe813abf0c25e8839c6e2b147bc7b362cf029))
* Add authentication and event controller tests and fix authentication flow. ([4d380cd](https://github.com/fhswf/appointme/commit/4d380cdab6266d92832f4d7dc123cc2d4d3af4e1))
* add comprehensive tests for EventForm fields and submit button, refine Login and OidcCallback tests, and update EventList navigation tests. ([ed51002](https://github.com/fhswf/appointme/commit/ed51002339060ad7e40596d23302dbb4a8150d60))
* Add configurable SMTP support to mailer, falling back to Gmail service. ([10f1d83](https://github.com/fhswf/appointme/commit/10f1d833945922d0c44a08e4c75c1b37ae2ed2d5))
* Add ENCRYPTION_KEY environment variable for CalDAV password encryption to deployment, secret example, and README. ([99d592a](https://github.com/fhswf/appointme/commit/99d592adffad76c53193e181dfe825b7f8617d81))
* add health check ([d4615e3](https://github.com/fhswf/appointme/commit/d4615e32ec398aa561f61a124d3e8dee703e0f2c))
* add Kubernetes deployment examples for ConfigMap and Secret, update README and gitignore. ([49c4123](https://github.com/fhswf/appointme/commit/49c4123e30e0cd50029cf98588dad9fe02d0bfa9))
* Add new i18n keys for booking and CalDav features, and refine iCal attendee RSVP logic. ([e07ea98](https://github.com/fhswf/appointme/commit/e07ea98f014c76026a97e60903f459709232e3f8))
* add OIDC controller tests and update Vitest dependencies. ([68bdfd3](https://github.com/fhswf/appointme/commit/68bdfd3c6431feeede71a427d333d178d1f4b7bb))
* Add optional email field to CalDAV accounts and use it for event organizers when creating events. ([37988dc](https://github.com/fhswf/appointme/commit/37988dc6934b49749cfd160133629e2d008c0a27))
* Add persistent agenda visible calendars to user profiles and integrate them into the appointments page. ([bb626d8](https://github.com/fhswf/appointme/commit/bb626d896257da4e731ce2928308bd89c6de639d))
* Add rate limiting to OIDC `/url` and `/login` endpoints. ([e8f6b35](https://github.com/fhswf/appointme/commit/e8f6b35607b80543dcfdeb23642beabe72c57ef4))
* Add rate limiting to user update route and enhance `updateUser` controller with ID validation, field lookup optimization, and improved error handling. ([c7d8942](https://github.com/fhswf/appointme/commit/c7d8942c920cf3b057759e5fc2504960af7d78c6))
* add SBOM in docker images ([6c493c8](https://github.com/fhswf/appointme/commit/6c493c8986a0ac63ed3d8143c57c939a93c15658))
* Add scheduler utility, OIDC callback tests, Google event insertion, and enable event controller tests. ([9d58aaf](https://github.com/fhswf/appointme/commit/9d58aaf2be48fe5cf057cd0134a217b4562ee5bb))
* Add Sentry instrumentation and ignore Kubernetes secret file. ([106140f](https://github.com/fhswf/appointme/commit/106140f2fceba70f5d8964ee536d00f9e82f3210))
* add swagger ui ([37b6e8d](https://github.com/fhswf/appointme/commit/37b6e8d0c951e5d76db6958a06d99e366aea57db))
* Add user welcome field, update i18n password key, enhance user update security, and integrate new client icons. ([3c451a1](https://github.com/fhswf/appointme/commit/3c451a18b4b367385bd43934a35d3d4a02bfe24b))
* Add utility to patch JUnit XML timestamps and integrate into client unit and backend CI workflows. ([cdeb0e6](https://github.com/fhswf/appointme/commit/cdeb0e6004ce2b3fe7c5b43e6d090abf3c09ca67))
* Allow SMTP configuration without authentication and update K8s manifests and tests. ([3ad78e1](https://github.com/fhswf/appointme/commit/3ad78e1c0c773e1d5284c6df9f412f3852ccb87a))
* **backend:** calender events ([87c7b20](https://github.com/fhswf/appointme/commit/87c7b206a7362461bc6f9c16e6cd0967aa06ef77))
* **backend:** CORS entry for appoint.gawron.cloud ([165b045](https://github.com/fhswf/appointme/commit/165b04549cb4b16a8eceb2e07ef61baf518e6145))
* **backend:** store access token in cookie ([68a857b](https://github.com/fhswf/appointme/commit/68a857bb780031396a8058a8b15f4e5ad2ad8c9d))
* branding update ([737222c](https://github.com/fhswf/appointme/commit/737222c4093527476eab7aee046502f71738a281))
* caldav integration ([981ad71](https://github.com/fhswf/appointme/commit/981ad71cce8a06dc9930e98f023dee73fcb00443))
* caldav integration ([1e61cc6](https://github.com/fhswf/appointme/commit/1e61cc67400e9c4076069d29b73a97c5711c5bad))
* CalDAV integration ([3193db9](https://github.com/fhswf/appointme/commit/3193db9924487eb31d6bbac62fc71fc675e5f470))
* **calendar:** allow guests to modify an event ([6fa8dd2](https://github.com/fhswf/appointme/commit/6fa8dd27852ea7969786932a71bc73db3bd3e001))
* centralize documentation generation ([3e5822c](https://github.com/fhswf/appointme/commit/3e5822c5262aa4121e114d95aa8a98308b58ede4))
* database migration ([3940180](https://github.com/fhswf/appointme/commit/39401802ff5da3bc6f8eb0b49b09d7f46654478d))
* docker build in release ([fd8b9d0](https://github.com/fhswf/appointme/commit/fd8b9d0f14079bedb6fd969ace705d9d51fabe41))
* docker build in release ([82a5c7a](https://github.com/fhswf/appointme/commit/82a5c7af2f57a5bbecc2227f76825aa95080d363))
* docker build in release ([2440730](https://github.com/fhswf/appointme/commit/2440730dac1c3ee68faf7a183e3484bf83c5c926))
* docker build in release ([5cdec1c](https://github.com/fhswf/appointme/commit/5cdec1cb0a0953cf265689ff9e68d82e0e938ac5))
* docker build in release ([6b50d9f](https://github.com/fhswf/appointme/commit/6b50d9f3987714fc092907226962ead5566247ab))
* docker build in release ([4f16bd8](https://github.com/fhswf/appointme/commit/4f16bd82b9afef9ea6b5cb9885afcd7371b6856a))
* docker build in release ([4945a9e](https://github.com/fhswf/appointme/commit/4945a9ee8d9a92ec290848f3705c3c154969ed62))
* docker build in release ([aa281c4](https://github.com/fhswf/appointme/commit/aa281c40738caa23cb5a850e087612710f045249))
* docker build in release ([e773045](https://github.com/fhswf/appointme/commit/e773045957ba2234dc9a87609dbd915612ffc9ce))
* docker build in release ([3c407c2](https://github.com/fhswf/appointme/commit/3c407c24a64e2a3fde2090bdeff321394a1438b6))
* docker build in release ([dd4a147](https://github.com/fhswf/appointme/commit/dd4a147ec41c62f5e1abbe68560165bd3b5efaf5))
* docker build in release ([6d4feb7](https://github.com/fhswf/appointme/commit/6d4feb7ed660940b74c98ee5513730a57c7d370c))
* docker build in release ([7f64dca](https://github.com/fhswf/appointme/commit/7f64dca49959947d91f0fa573fbdb090f95aa53b))
* docker build in release ([02c217d](https://github.com/fhswf/appointme/commit/02c217d9497e9c6133f1df28b94e6e5db27e17ab))
* docker build in release ([5967c35](https://github.com/fhswf/appointme/commit/5967c35182dd741592c6cd4872d361901d430491))
* docker build in release ([a42f584](https://github.com/fhswf/appointme/commit/a42f58435945f067204f6b0e420c226b62d50ab3))
* Enhance CalDAV compatibility with a configured client utility and direct access fallback for account setup. ([dc922fb](https://github.com/fhswf/appointme/commit/dc922fb19832c4a015ecc057ceed677590eab2e2))
* Enhance health check endpoint to report database connection status with error handling. ([3e6882f](https://github.com/fhswf/appointme/commit/3e6882f8c5125c9b10c0c1bd2447e3aa9087e5da))
* enhance login experience ([e066c5f](https://github.com/fhswf/appointme/commit/e066c5f703c32958dca4d5b8300264a3ba215dfb))
* enhanced availability management ([ccb7cfe](https://github.com/fhswf/appointme/commit/ccb7cfe2a2d4f481f07dfcf7c2c2466b03a17a9c))
* externalize contact information to environment variables and a new component, updating legal pages and i18n. ([55b4c01](https://github.com/fhswf/appointme/commit/55b4c01823072d73a80523c322bcd7a6a806641f))
* **freeBusy:** check maxPerDay constraint ([6a3bb7f](https://github.com/fhswf/appointme/commit/6a3bb7fc4b5fb4a8f70b70681169d10219be6153))
* **freeBusy:** freeBusy should observe minFuture and maxFuture restrictictions of an event ([77fb36a](https://github.com/fhswf/appointme/commit/77fb36a23dbdff090cce5e5fc4212f00a7c614d8))
* gracefully handle missing Google tokens in calendar and event queries and add corresponding tests. ([a4c69b9](https://github.com/fhswf/appointme/commit/a4c69b9d621db92cb9fa5237591596ce4293b590))
* handling of free slots for recurrent events ([734f717](https://github.com/fhswf/appointme/commit/734f7173fb76be158e60e17d1f309c67e2577cf4))
* i18n restructured ([9ef1bb8](https://github.com/fhswf/appointme/commit/9ef1bb890ab708e2ef806920473e758d21458484))
* Implement 404 response and cache control for `GET /api/v1/user/me` and add a new test case. ([d83abdc](https://github.com/fhswf/appointme/commit/d83abdc909368091a6edece63dee7394ae4548a3))
* Implement CSRF protection by adding a new CSRF service and integrating CSRF tokens into client requests and backend server logic. ([1d40329](https://github.com/fhswf/appointme/commit/1d403296b08d9f5b52bddedbb235b32d7c2f3a76))
* Implement default event availability and refine scheduling logic to correctly apply buffers and include exact duration slots. ([9beb3da](https://github.com/fhswf/appointme/commit/9beb3da1477221f12c2ab6e5ac2f61de70494302))
* Implement default event availability and refine scheduling logic to correctly apply buffers and include exact duration slots. ([5d41c6c](https://github.com/fhswf/appointme/commit/5d41c6ca87c9b27a710685c0f20bc9bbdb4511fb))
* implement email event invitations with ICS attachments via new mailer utility. ([bedda09](https://github.com/fhswf/appointme/commit/bedda09c664b072efee0906ddc9c344e28549af9))
* Implement event tagging and refactor the public planning page with dark mode support. ([e4c5aa7](https://github.com/fhswf/appointme/commit/e4c5aa7c2d3bab7b4e0b5f874c5b6b1b536ef933))
* Implement Google Calendar event insertion, improve free/busy time calculation, and add token revocation. ([2bc5aa7](https://github.com/fhswf/appointme/commit/2bc5aa7a2697425a91e673459474c52ea4e22503))
* Implement OIDC authentication flow ([84d06c3](https://github.com/fhswf/appointme/commit/84d06c3aacc64685460b3de934c718c519b5e0d9))
* Implement per-user OAuth2Client creation with automatic token refresh and refine token update logic, adding new tests. ([18eb17f](https://github.com/fhswf/appointme/commit/18eb17f66c54e4e13d9be5a0a54a2353907f594c))
* Implement user profile page with Gravatar support, user URL updates, and i18n for navigation. ([5be5398](https://github.com/fhswf/appointme/commit/5be5398482a0d2637354adbe3ec327ae4a13767c))
* improve Google Calendar integration ([6cc2fad](https://github.com/fhswf/appointme/commit/6cc2fad2c7f3ff51a3b7b8400dd46edcf4c96482))
* improve login/logout ([d5967ab](https://github.com/fhswf/appointme/commit/d5967ab588845e170112a575ac195ec735369e60))
* improve OIDC user creation with email check and `user_url` collision retry, and redirect to login on client-side errors ([354550a](https://github.com/fhswf/appointme/commit/354550aba39dfac3583d02df38d48b82a6eef23b))
* improve test coverage ([605a611](https://github.com/fhswf/appointme/commit/605a611d1035631088fa76d807e7c7b7d5629a89))
* Improve user identification by email or provider ID, enforce unique email addresses, and add tests for cross-provider linking. ([109698a](https://github.com/fhswf/appointme/commit/109698ab944c37b2cf2d600013619dce6370d64e))
* Integrate `sonner` for client-side toast notifications, enhance backend authentication error handling, and update ESLint configuration. ([4812d62](https://github.com/fhswf/appointme/commit/4812d6293223ec04a1e4f57c20e2651458c76179))
* Integrate CalDAV busy slot fetching into free slot calculation and improve environment variable loading. ([f0d6f57](https://github.com/fhswf/appointme/commit/f0d6f575a1f6b9b3dd5c753ba0efb2b2a54a718a))
* integrate Sentry for error tracking and performance monitoring ([0c9cb11](https://github.com/fhswf/appointme/commit/0c9cb119dd615f09569c199745c4dc34f9e0575a))
* introduce calendar integration settings for Google and CalDAV with event fetching API. ([eb2a10c](https://github.com/fhswf/appointme/commit/eb2a10c4e7b33038696fa14d4acf5d412f59ec5e))
* Introduce iCal utility to centralize ICS generation and enhance event creation with user comments for CalDAV, Google Calendar, and email invitations. ([4f0f5a6](https://github.com/fhswf/appointme/commit/4f0f5a6566e26bc216b0d39903f7d585e0356aa6))
* local development ([b51c7b2](https://github.com/fhswf/appointme/commit/b51c7b26bbe3747ad37e766c6fa26d214c80d7d5))
* **logging:** use winston for logging ([8293696](https://github.com/fhswf/appointme/commit/82936968d64ce8a06876c8a388a2bc2b1030e0c5))
* **logging:** use winston for logging ([50f8780](https://github.com/fhswf/appointme/commit/50f87800288c00023917619d2f7ca22beba24918))
* **markdown:** handle event type description as markdown. ([9bba8bf](https://github.com/fhswf/appointme/commit/9bba8bf8e0042ac2f99f84a28926119ff0118f0c))
* mcp server ([cf0885b](https://github.com/fhswf/appointme/commit/cf0885b58e6a2e2a6af416378e282d47ee44f26c))
* new rest api ([8486809](https://github.com/fhswf/appointme/commit/84868098c0111cb620fcd6be1401fbbb59d26479))
* new rest api ([e6d493b](https://github.com/fhswf/appointme/commit/e6d493b327d13b2989fba58138de6634de3a6e7b))
* Prevent Mongoose model re-compilation, enhance OIDC controller tests for unconfigured scenarios, and include `.tsx` files in SonarQube test inclusions. ([afc9d02](https://github.com/fhswf/appointme/commit/afc9d02000c6f0de9578ac63c15d567905624685))
* rebranding to "appointme" ([0b15e47](https://github.com/fhswf/appointme/commit/0b15e47859c0ae0b12c4f22506714ab705618548))
* recurring events ([e98d4b8](https://github.com/fhswf/appointme/commit/e98d4b826b7e04abb187368b0074ebc877173f71))
* recurring events ([a5ac86e](https://github.com/fhswf/appointme/commit/a5ac86e8e4c315ff89283187a31f5e6f5ea6fa38))
* refactor api & swagger docs ([bb7228d](https://github.com/fhswf/appointme/commit/bb7228dca3a59fc0c11d40b65f3d82b3b3d24f34))
* refactor calendar endpoint to use VEVENT data for CalDAV calendars ([01d477d](https://github.com/fhswf/appointme/commit/01d477d7c0c7c8dab7d7d46e63a7eb062e0a49bd))
* Refactor event booking logic into modular functions and introduce client-side configuration for environment variables. ([e2b89be](https://github.com/fhswf/appointme/commit/e2b89befd98f09b176aa52ed029ea9c01b79815c))
* refactoring CORS & dev container ([9d7862d](https://github.com/fhswf/appointme/commit/9d7862da860c555d729ba0a8edbd42692e48cd3a))
* simplify event availability modes ([be666e3](https://github.com/fhswf/appointme/commit/be666e30baea07a75e9cef43c02270f60418a2ee))
* store access token in cookie ([f00f11a](https://github.com/fhswf/appointme/commit/f00f11a611d3b3762fb2c4c8935d9b776655c995))
* store access token in cookie ([48c9d3f](https://github.com/fhswf/appointme/commit/48c9d3f39700a99514a71abcbf07a84d220a9ad7))
* test duplicate `user_url` ([798c2da](https://github.com/fhswf/appointme/commit/798c2da659481f2a6847c33222e91d2332e0a55f))
* token handling ([b50a057](https://github.com/fhswf/appointme/commit/b50a057ea02a5359ca53f69fa4ca6dd883a56cd8))
* ui improvements ([8a9bf18](https://github.com/fhswf/appointme/commit/8a9bf183fec5d58eff336bb7a593fa586a78c16e))
* ui improvements ([3cbfb64](https://github.com/fhswf/appointme/commit/3cbfb646e12022e39821f2b708b2e73d6878e346))
* Update encryption algorithm from AES-256-CBC to AES-256-GCM. ([5571809](https://github.com/fhswf/appointme/commit/5571809eadc321e7a8b2854aedd3454248c899ed))
* update encryption utility to use authentication tags and refine `Event` document type ([582b0cc](https://github.com/fhswf/appointme/commit/582b0ccc41b550849b6c45371580c138348fa934))
* use kustomization for separate stagin/prod environments ([a491378](https://github.com/fhswf/appointme/commit/a49137885ea29cd6df022771aa1cafb0fa941173))





### Dependencies

* **common:** upgraded to 1.15.0-rc.3

# backend [1.37.0-rc.8](https://github.com/fhswf/appointme/compare/backend@1.37.0-rc.7...backend@1.37.0-rc.8) (2026-01-04)


### Bug Fixes

* **backend:** fix Dockerfile dependencies and trigger release ([acdf6c5](https://github.com/fhswf/appointme/commit/acdf6c54f95ad95a76a72f6240cfd64b8afed351))

# backend [1.37.0-rc.7](https://github.com/fhswf/appointme/compare/backend@1.37.0-rc.6...backend@1.37.0-rc.7) (2026-01-04)


### Bug Fixes

* replace yarn in init container ([ff5f4a5](https://github.com/fhswf/appointme/commit/ff5f4a573129644aed8910d19b7a6dded48db5ea))

# backend [1.37.0-rc.6](https://github.com/fhswf/appointme/compare/backend@1.37.0-rc.5...backend@1.37.0-rc.6) (2026-01-04)


### Bug Fixes

* CodeQL issues ([617ad60](https://github.com/fhswf/appointme/commit/617ad60471c3daf7f1c4a23f4cd29ba8d4c14857))


### Features

* centralize documentation generation ([976ac6d](https://github.com/fhswf/appointme/commit/976ac6db6123dbd19d1c31ab46737154b4f7b51a))

# backend [1.37.0-rc.5](https://github.com/fhswf/appointme/compare/backend@1.37.0-rc.4...backend@1.37.0-rc.5) (2026-01-04)


### Bug Fixes

* bump openid-client to v6 ([6afd919](https://github.com/fhswf/appointme/commit/6afd9199380bbff08e9e149e89715a68c404efdb))

# backend [1.37.0-rc.4](https://github.com/fhswf/appointme/compare/backend@1.37.0-rc.3...backend@1.37.0-rc.4) (2026-01-03)


### Bug Fixes

* Potential fix for code scanning alert no. 140: Database query built from user-controlled sources ([19c7644](https://github.com/fhswf/appointme/commit/19c76445e23899354de99a3e4aed6668eb7a0bb1))

# backend [1.37.0-rc.3](https://github.com/fhswf/appointme/compare/backend@1.37.0-rc.2...backend@1.37.0-rc.3) (2026-01-02)


### Bug Fixes

* escape user search queries to prevent regular expression injection and add a corresponding test. ([2882036](https://github.com/fhswf/appointme/commit/28820365b906ae278d95905187a6b2a684b70474))
* linting issues ([252dd0a](https://github.com/fhswf/appointme/commit/252dd0af4b8ff64308d36ce135fbf1e3f6476908))


### Features

* mcp server ([24103e6](https://github.com/fhswf/appointme/commit/24103e6b42e37c763beb8eaeee9c3f0cb85d9f19))

# backend [1.37.0-rc.2](https://github.com/fhswf/appointme/compare/backend@1.37.0-rc.1...backend@1.37.0-rc.2) (2025-12-31)


### Bug Fixes

* build issues ([81fdde0](https://github.com/fhswf/appointme/commit/81fdde0b67a6ba2f21b662d276b991ff517ea3e4))
* build issues ([6be2f0e](https://github.com/fhswf/appointme/commit/6be2f0e03913bdc40a3a500b83e21ae29a98cbbc))


### Features

* handling of free slots for recurrent events ([032748b](https://github.com/fhswf/appointme/commit/032748bbc0ac7fa752fe70ed9173ead3cc094d68))
* recurring events ([2ae62ca](https://github.com/fhswf/appointme/commit/2ae62ca8cbb9597598651465ad042643c5c20c26))
* recurring events ([e9a1f9f](https://github.com/fhswf/appointme/commit/e9a1f9f89b04a2df72fca75db44f443568260c55))





### Dependencies

* **common:** upgraded to 1.15.0-rc.1

# backend [1.37.0-rc.1](https://github.com/fhswf/appointme/compare/backend@1.36.0...backend@1.37.0-rc.1) (2025-12-31)


### Features

* token handling ([588900c](https://github.com/fhswf/appointme/commit/588900c092800cce3aebc49baa96a804a7ae7ea6))

# backend [1.36.0](https://github.com/fhswf/appointme/compare/backend@1.35.0...backend@1.36.0) (2025-12-29)


### Bug Fixes

* base url configuration ([2ee1503](https://github.com/fhswf/appointme/commit/2ee150348fe375c4613142ba1d859f980b2f845a))
* google login library update ([e701999](https://github.com/fhswf/appointme/commit/e70199961624c5c526ff886ee1522d975f6429cf))
* increase rate limit in backend ([945e904](https://github.com/fhswf/appointme/commit/945e9040061c231c3042bfa4137a486983ed2c25))


### Features

* add agenda view with all appointments ([1080840](https://github.com/fhswf/appointme/commit/1080840dea25492830e9a95d33cb4fb64755db4d))
* add agenda view with all appointments ([adfa0ce](https://github.com/fhswf/appointme/commit/adfa0ce8b4992093d749d6538dddb3698c2c7ab8))
* Add persistent agenda visible calendars to user profiles and integrate them into the appointments page. ([b826bd1](https://github.com/fhswf/appointme/commit/b826bd1f60d43a28e9fb97642220d4bb02c05241))
* Enhance CalDAV compatibility with a configured client utility and direct access fallback for account setup. ([1987f6e](https://github.com/fhswf/appointme/commit/1987f6e3c205066c99e80527f587b4291fa2596b))
* introduce calendar integration settings for Google and CalDAV with event fetching API. ([f176798](https://github.com/fhswf/appointme/commit/f1767983fe9126c39f681019a21360580eaf779d))
* refactor calendar endpoint to use VEVENT data for CalDAV calendars ([b26fdec](https://github.com/fhswf/appointme/commit/b26fdec9ff6c4b42c7e88564bc7218a63b28f542))





### Dependencies

* **common:** upgraded to 1.14.0

# backend [1.36.0-rc.2](https://github.com/fhswf/appointme/compare/backend@1.36.0-rc.1...backend@1.36.0-rc.2) (2025-12-27)


### Bug Fixes

* increase rate limit in backend ([945e904](https://github.com/fhswf/appointme/commit/945e9040061c231c3042bfa4137a486983ed2c25))


### Features

* refactor calendar endpoint to use VEVENT data for CalDAV calendars ([b26fdec](https://github.com/fhswf/appointme/commit/b26fdec9ff6c4b42c7e88564bc7218a63b28f542))

# backend [1.36.0-rc.1](https://github.com/fhswf/appointme/compare/backend@1.35.1-rc.1...backend@1.36.0-rc.1) (2025-12-23)


### Bug Fixes

* google login library update ([e701999](https://github.com/fhswf/appointme/commit/e70199961624c5c526ff886ee1522d975f6429cf))


### Features

* add agenda view with all appointments ([1080840](https://github.com/fhswf/appointme/commit/1080840dea25492830e9a95d33cb4fb64755db4d))
* add agenda view with all appointments ([adfa0ce](https://github.com/fhswf/appointme/commit/adfa0ce8b4992093d749d6538dddb3698c2c7ab8))
* Add persistent agenda visible calendars to user profiles and integrate them into the appointments page. ([b826bd1](https://github.com/fhswf/appointme/commit/b826bd1f60d43a28e9fb97642220d4bb02c05241))
* Enhance CalDAV compatibility with a configured client utility and direct access fallback for account setup. ([1987f6e](https://github.com/fhswf/appointme/commit/1987f6e3c205066c99e80527f587b4291fa2596b))
* introduce calendar integration settings for Google and CalDAV with event fetching API. ([f176798](https://github.com/fhswf/appointme/commit/f1767983fe9126c39f681019a21360580eaf779d))





### Dependencies

* **common:** upgraded to 1.14.0-rc.1

## backend [1.35.1-rc.1](https://github.com/fhswf/appointme/compare/backend@1.35.0...backend@1.35.1-rc.1) (2025-12-19)


### Bug Fixes

* base url configuration ([2ee1503](https://github.com/fhswf/appointme/commit/2ee150348fe375c4613142ba1d859f980b2f845a))

# backend [1.35.0](https://github.com/fhswf/appointme/compare/backend@1.34.0...backend@1.35.0) (2025-12-19)


### Features

* Implement default event availability and refine scheduling logic to correctly apply buffers and include exact duration slots. ([e6e0014](https://github.com/fhswf/appointme/commit/e6e0014d1f3835b5f7bed5f35cfad25e7e406a60))
* Implement default event availability and refine scheduling logic to correctly apply buffers and include exact duration slots. ([01d6e01](https://github.com/fhswf/appointme/commit/01d6e0150c2d01a468627d414b5e94d439c7b69b))

# backend [1.35.0-rc.2](https://github.com/fhswf/appointme/compare/backend@1.35.0-rc.1...backend@1.35.0-rc.2) (2025-12-19)


### Features

* Implement default event availability and refine scheduling logic to correctly apply buffers and include exact duration slots. ([e6e0014](https://github.com/fhswf/appointme/commit/e6e0014d1f3835b5f7bed5f35cfad25e7e406a60))

# backend [1.35.0-rc.1](https://github.com/fhswf/appointme/compare/backend@1.34.0...backend@1.35.0-rc.1) (2025-12-19)


### Features

* Implement default event availability and refine scheduling logic to correctly apply buffers and include exact duration slots. ([01d6e01](https://github.com/fhswf/appointme/commit/01d6e0150c2d01a468627d414b5e94d439c7b69b))

# backend [1.34.0](https://github.com/fhswf/appointme/compare/backend@1.33.0...backend@1.34.0) (2025-12-18)


### Bug Fixes

* google login ([0c2cda1](https://github.com/fhswf/appointme/commit/0c2cda19f8c40441eedbbe403334c260eaf2a454))
* simplify common package import paths by removing `/src/types` suffix. ([4ea8a35](https://github.com/fhswf/appointme/commit/4ea8a3575eaa3d4b065ab38654f293a171042962))
* trust proxy ([8839dc6](https://github.com/fhswf/appointme/commit/8839dc69a852db1859e7130b42a891a1b8cc9552))
* update Swagger server URL environment variable from `REACT_APP_URL` to `CLIENT_URL` ([851218e](https://github.com/fhswf/appointme/commit/851218e6ab75340a60fb51a3384e5e90cc354f8a))


### Features

* enhanced availability management ([7139d3d](https://github.com/fhswf/appointme/commit/7139d3ddc4035f14dcd9c728d96c6e02a2f1c656))
* Implement event tagging and refactor the public planning page with dark mode support. ([e6646b0](https://github.com/fhswf/appointme/commit/e6646b092ee18393c2a52cd417348cd5b65488a4))
* improve login/logout ([28c839c](https://github.com/fhswf/appointme/commit/28c839c2d2f020dd12e211d338b328c0610753de))
* simplify event availability modes ([c0479f2](https://github.com/fhswf/appointme/commit/c0479f230f95d3e65401245ccec060fbe9c646a7))





### Dependencies

* **common:** upgraded to 1.13.0

# backend [1.34.0-rc.1](https://github.com/fhswf/appointme/compare/backend@1.33.0...backend@1.34.0-rc.1) (2025-12-18)


### Bug Fixes

* google login ([0c2cda1](https://github.com/fhswf/appointme/commit/0c2cda19f8c40441eedbbe403334c260eaf2a454))
* simplify common package import paths by removing `/src/types` suffix. ([4ea8a35](https://github.com/fhswf/appointme/commit/4ea8a3575eaa3d4b065ab38654f293a171042962))
* trust proxy ([8839dc6](https://github.com/fhswf/appointme/commit/8839dc69a852db1859e7130b42a891a1b8cc9552))
* update Swagger server URL environment variable from `REACT_APP_URL` to `CLIENT_URL` ([851218e](https://github.com/fhswf/appointme/commit/851218e6ab75340a60fb51a3384e5e90cc354f8a))


### Features

* enhanced availability management ([7139d3d](https://github.com/fhswf/appointme/commit/7139d3ddc4035f14dcd9c728d96c6e02a2f1c656))
* Implement event tagging and refactor the public planning page with dark mode support. ([e6646b0](https://github.com/fhswf/appointme/commit/e6646b092ee18393c2a52cd417348cd5b65488a4))
* improve login/logout ([28c839c](https://github.com/fhswf/appointme/commit/28c839c2d2f020dd12e211d338b328c0610753de))
* simplify event availability modes ([c0479f2](https://github.com/fhswf/appointme/commit/c0479f230f95d3e65401245ccec060fbe9c646a7))

# backend [1.33.0](https://github.com/fhswf/appointme/compare/backend@1.32.0...backend@1.33.0) (2025-12-18)


### Bug Fixes

* Correct type assertion for Client property in test mock. ([cc7272b](https://github.com/fhswf/appointme/commit/cc7272bd037841642193fa7e654f76df363ab7b5))
* google login ([0c2cda1](https://github.com/fhswf/appointme/commit/0c2cda19f8c40441eedbbe403334c260eaf2a454))
* regression error due to optional chaining ([2d381cb](https://github.com/fhswf/appointme/commit/2d381cb30c260dbf124ae8c0694069b1f348863b))
* simplify common package import paths by removing `/src/types` suffix. ([4ea8a35](https://github.com/fhswf/appointme/commit/4ea8a3575eaa3d4b065ab38654f293a171042962))
* trust proxy ([8839dc6](https://github.com/fhswf/appointme/commit/8839dc69a852db1859e7130b42a891a1b8cc9552))
* update Swagger server URL environment variable from `REACT_APP_URL` to `CLIENT_URL` ([851218e](https://github.com/fhswf/appointme/commit/851218e6ab75340a60fb51a3384e5e90cc354f8a))
* **build:** release configuration ([8d13d85](https://github.com/fhswf/appointme/commit/8d13d8518f67b0ca4f498aaa79d40460f4a7797e))
* Correct type assertion for Client property in test mock. ([cc7272b](https://github.com/fhswf/appointme/commit/cc7272bd037841642193fa7e654f76df363ab7b5))
* regression error due to optional chaining ([2d381cb](https://github.com/fhswf/appointme/commit/2d381cb30c260dbf124ae8c0694069b1f348863b))


### Features

* enhance login experience ([9d86c9c](https://github.com/fhswf/appointme/commit/9d86c9cab79ef2379e10e3ceb472bcbc79792f20))
* enhanced availability management ([7139d3d](https://github.com/fhswf/appointme/commit/7139d3ddc4035f14dcd9c728d96c6e02a2f1c656))
* gracefully handle missing Google tokens in calendar and event queries and add corresponding tests. ([dc75b57](https://github.com/fhswf/appointme/commit/dc75b57f0b8e64c7dadf00e1c043abf5c65e9664))
* Implement event tagging and refactor the public planning page with dark mode support. ([e6646b0](https://github.com/fhswf/appointme/commit/e6646b092ee18393c2a52cd417348cd5b65488a4))
* improve login/logout ([28c839c](https://github.com/fhswf/appointme/commit/28c839c2d2f020dd12e211d338b328c0610753de))
* Improve user identification by email or provider ID, enforce unique email addresses, and add tests for cross-provider linking. ([e05ac46](https://github.com/fhswf/appointme/commit/e05ac462ddd41e85f63c7831c819418530b23145))
* simplify event availability modes ([c0479f2](https://github.com/fhswf/appointme/commit/c0479f230f95d3e65401245ccec060fbe9c646a7))





### Dependencies

* **common:** upgraded to 1.13.0-rc.1
* gracefully handle missing Google tokens in calendar and event queries and add corresponding tests. ([dc75b57](https://github.com/fhswf/appointme/commit/dc75b57f0b8e64c7dadf00e1c043abf5c65e9664))
* Improve user identification by email or provider ID, enforce unique email addresses, and add tests for cross-provider linking. ([e05ac46](https://github.com/fhswf/appointme/commit/e05ac462ddd41e85f63c7831c819418530b23145))

# backend [1.33.0](https://github.com/fhswf/appointme/compare/backend@1.32.0...backend@1.33.0) (2025-12-17)


### Bug Fixes

* google login ([0c2cda1](https://github.com/fhswf/appointme/commit/0c2cda19f8c40441eedbbe403334c260eaf2a454))

# backend [1.32.0-rc.12](https://github.com/fhswf/appointme/compare/backend@1.32.0-rc.11...backend@1.32.0-rc.12) (2025-12-18)


### Features

* improve login/logout ([28c839c](https://github.com/fhswf/appointme/commit/28c839c2d2f020dd12e211d338b328c0610753de))

# backend [1.32.0-rc.12](https://github.com/fhswf/appointme/compare/backend@1.32.0-rc.11...backend@1.32.0-rc.12) (2025-12-18)


### Features

* improve login/logout ([28c839c](https://github.com/fhswf/appointme/commit/28c839c2d2f020dd12e211d338b328c0610753de))

# backend [1.32.0-rc.11](https://github.com/fhswf/appointme/compare/backend@1.32.0-rc.10...backend@1.32.0-rc.11) (2025-12-17)


### Bug Fixes

* update Swagger server URL environment variable from `REACT_APP_URL` to `CLIENT_URL` ([851218e](https://github.com/fhswf/appointme/commit/851218e6ab75340a60fb51a3384e5e90cc354f8a))

# backend [1.32.0-rc.10](https://github.com/fhswf/appointme/compare/backend@1.32.0-rc.9...backend@1.32.0-rc.10) (2025-12-17)


### Bug Fixes

* trust proxy ([8839dc6](https://github.com/fhswf/appointme/commit/8839dc69a852db1859e7130b42a891a1b8cc9552))

# backend [1.32.0-rc.9](https://github.com/fhswf/appointme/compare/backend@1.32.0-rc.8...backend@1.32.0-rc.9) (2025-12-17)


### Bug Fixes

* simplify common package import paths by removing `/src/types` suffix. ([4ea8a35](https://github.com/fhswf/appointme/commit/4ea8a3575eaa3d4b065ab38654f293a171042962))

# backend [1.32.0-rc.8](https://github.com/fhswf/appointme/compare/backend@1.32.0-rc.7...backend@1.32.0-rc.8) (2025-12-17)
* Correct type assertion for Client property in test mock. ([cc7272b](https://github.com/fhswf/appointme/commit/cc7272bd037841642193fa7e654f76df363ab7b5))
* regression error due to optional chaining ([2d381cb](https://github.com/fhswf/appointme/commit/2d381cb30c260dbf124ae8c0694069b1f348863b))


### Features

* enhanced availability management ([7139d3d](https://github.com/fhswf/appointme/commit/7139d3ddc4035f14dcd9c728d96c6e02a2f1c656))
* Implement event tagging and refactor the public planning page with dark mode support. ([e6646b0](https://github.com/fhswf/appointme/commit/e6646b092ee18393c2a52cd417348cd5b65488a4))
* simplify event availability modes ([c0479f2](https://github.com/fhswf/appointme/commit/c0479f230f95d3e65401245ccec060fbe9c646a7))
* enhance login experience ([9d86c9c](https://github.com/fhswf/appointme/commit/9d86c9cab79ef2379e10e3ceb472bcbc79792f20))
* gracefully handle missing Google tokens in calendar and event queries and add corresponding tests. ([dc75b57](https://github.com/fhswf/appointme/commit/dc75b57f0b8e64c7dadf00e1c043abf5c65e9664))
* Improve user identification by email or provider ID, enforce unique email addresses, and add tests for cross-provider linking. ([e05ac46](https://github.com/fhswf/appointme/commit/e05ac462ddd41e85f63c7831c819418530b23145))





### Dependencies

* **common:** upgraded to 1.12.0

# backend [1.32.0](https://github.com/fhswf/appointme/compare/backend@1.31.0...backend@1.32.0) (2025-12-13)


### Bug Fixes

* regression error due to optional chaining ([2d381cb](https://github.com/fhswf/appointme/commit/2d381cb30c260dbf124ae8c0694069b1f348863b))

# backend [1.32.0-rc.6](https://github.com/fhswf/appointme/compare/backend@1.32.0-rc.5...backend@1.32.0-rc.6) (2025-12-17)


### Features

* gracefully handle missing Google tokens in calendar and event queries and add corresponding tests. ([dc75b57](https://github.com/fhswf/appointme/commit/dc75b57f0b8e64c7dadf00e1c043abf5c65e9664))





### Dependencies

* **common:** upgraded to 1.12.0-rc.2

# backend [1.32.0-rc.5](https://github.com/fhswf/appointme/compare/backend@1.32.0-rc.4...backend@1.32.0-rc.5) (2025-12-15)


### Bug Fixes

* Correct type assertion for Client property in test mock. ([cc7272b](https://github.com/fhswf/appointme/commit/cc7272bd037841642193fa7e654f76df363ab7b5))
* config update ([bff42e3](https://github.com/fhswf/appointme/commit/bff42e3e0b116b4e70771f58de022a16b007cf75))
* config update ([798e067](https://github.com/fhswf/appointme/commit/798e067ea3158e5ac898ccae6e3fd71ce41d279b))
* configuration ([cac0259](https://github.com/fhswf/appointme/commit/cac0259c5100802363f124153b463ba4f2258315))
* image tagging ([95e03b0](https://github.com/fhswf/appointme/commit/95e03b0906d778dd0529b6746d009a82ab0c1308))
* runtime configuration of URLs ([d326a87](https://github.com/fhswf/appointme/commit/d326a8702a994924fdf4924232809476a912931f))
* version bumps ([29c4d17](https://github.com/fhswf/appointme/commit/29c4d173a15de4207c6a4e1f8a76c885ff3ba210))


### Features

* enhance login experience ([9d86c9c](https://github.com/fhswf/appointme/commit/9d86c9cab79ef2379e10e3ceb472bcbc79792f20))
* Improve user identification by email or provider ID, enforce unique email addresses, and add tests for cross-provider linking. ([e05ac46](https://github.com/fhswf/appointme/commit/e05ac462ddd41e85f63c7831c819418530b23145))





### Dependencies

* **common:** upgraded to 1.12.0-rc.1
* add SBOM in docker images ([68cc2e4](https://github.com/fhswf/appointme/commit/68cc2e4ec5d9ac43870bf092819ce3a96439bfb6))

# backend [1.32.0-rc.4](https://github.com/fhswf/appointme/compare/backend@1.32.0-rc.3...backend@1.32.0-rc.4) (2025-12-12)


### Bug Fixes

* configuration ([cac0259](https://github.com/fhswf/appointme/commit/cac0259c5100802363f124153b463ba4f2258315))

# backend [1.32.0-rc.3](https://github.com/fhswf/appointme/compare/backend@1.32.0-rc.2...backend@1.32.0-rc.3) (2025-12-12)


### Bug Fixes

* config update ([bff42e3](https://github.com/fhswf/appointme/commit/bff42e3e0b116b4e70771f58de022a16b007cf75))
* config update ([798e067](https://github.com/fhswf/appointme/commit/798e067ea3158e5ac898ccae6e3fd71ce41d279b))

# backend [1.32.0-rc.3](https://github.com/fhswf/appointme/compare/backend@1.32.0-rc.2...backend@1.32.0-rc.3) (2025-12-12)


### Bug Fixes

* config update ([798e067](https://github.com/fhswf/appointme/commit/798e067ea3158e5ac898ccae6e3fd71ce41d279b))

# backend [1.32.0-rc.2](https://github.com/fhswf/appointme/compare/backend@1.32.0-rc.1...backend@1.32.0-rc.2) (2025-12-12)


### Bug Fixes

* runtime configuration of URLs ([d326a87](https://github.com/fhswf/appointme/commit/d326a8702a994924fdf4924232809476a912931f))

# backend [1.32.0-rc.1](https://github.com/fhswf/appointme/compare/backend@1.31.1-rc.1...backend@1.32.0-rc.1) (2025-12-12)


### Features

* add SBOM in docker images ([68cc2e4](https://github.com/fhswf/appointme/commit/68cc2e4ec5d9ac43870bf092819ce3a96439bfb6))

## backend [1.31.1-rc.1](https://github.com/fhswf/appointme/compare/backend@1.31.0...backend@1.31.1-rc.1) (2025-12-12)


### Bug Fixes

* image tagging ([95e03b0](https://github.com/fhswf/appointme/commit/95e03b0906d778dd0529b6746d009a82ab0c1308))
* version bumps ([29c4d17](https://github.com/fhswf/appointme/commit/29c4d173a15de4207c6a4e1f8a76c885ff3ba210))

# backend [1.31.0](https://github.com/fhswf/appointme/compare/backend@1.30.0...backend@1.31.0) (2025-12-12)


### Bug Fixes

* moving images ([fd19d57](https://github.com/fhswf/appointme/commit/fd19d57644ec5c173d18b072f3e5b63ea5a56460))


### Features

* rebranding to "appointme" ([d73ce59](https://github.com/fhswf/appointme/commit/d73ce597bc90a896a6787ce8cb5f2415594063c5))





### Dependencies

* **common:** upgraded to 1.11.0

# backend [1.30.0](https://github.com/fhswf/appointme/compare/backend@1.29.1...backend@1.30.0) (2025-12-12)


### Bug Fixes

* update release build ([cf9910b](https://github.com/fhswf/appointme/commit/cf9910b310a6fdc8be43aa7dd502cb24dfe7a249))


### Features

* use kustomization for separate stagin/prod environments ([baa6227](https://github.com/fhswf/appointme/commit/baa6227f1dd1d595cc7db6873be55cace3d22c42))

## backend [1.29.1](https://github.com/fhswf/appointme/compare/backend@1.29.0...backend@1.29.1) (2025-12-11)


### Bug Fixes

* **build:** Remove explicit `yarn set version 4` command from Dockerfile. ([6eef985](https://github.com/fhswf/appointme/commit/6eef985984e24aeed0f5923bd755c729fd9b73e0))
* separate Swagger server configurations for production and development environments ([cbb46bd](https://github.com/fhswf/appointme/commit/cbb46bd7372ecaf1e2b1d0cc08aacac357617809))

## backend [1.29.1](https://github.com/fhswf/appointme/compare/backend@1.29.0...backend@1.29.1) (2025-12-11)


### Bug Fixes

* separate Swagger server configurations for production and development environments ([cbb46bd](https://github.com/fhswf/appointme/commit/cbb46bd7372ecaf1e2b1d0cc08aacac357617809))

# backend [1.29.0](https://github.com/fhswf/appointme/compare/backend@1.28.0...backend@1.29.0) (2025-12-11)


### Bug Fixes

* remove unused code ([0b3ea53](https://github.com/fhswf/appointme/commit/0b3ea53a70f7d65b083416ebc3fe728ce3286250))
* type issues ([190ebd3](https://github.com/fhswf/appointme/commit/190ebd3e6c44976548c4fe22607d8c8d44d9d663))


### Features

* add swagger ui ([3d96b76](https://github.com/fhswf/appointme/commit/3d96b7655d9c350196fbbbb5777ffdef0c75e9fb))
* refactor api & swagger docs ([01efa3e](https://github.com/fhswf/appointme/commit/01efa3eef808b40f6d649122990bf55f1c68f441))

# backend [1.29.0](https://github.com/fhswf/appointme/compare/backend@1.28.0...backend@1.29.0) (2025-12-11)


### Bug Fixes

* remove unused code ([0b3ea53](https://github.com/fhswf/appointme/commit/0b3ea53a70f7d65b083416ebc3fe728ce3286250))


### Features

* add swagger ui ([3d96b76](https://github.com/fhswf/appointme/commit/3d96b7655d9c350196fbbbb5777ffdef0c75e9fb))
* refactor api & swagger docs ([01efa3e](https://github.com/fhswf/appointme/commit/01efa3eef808b40f6d649122990bf55f1c68f441))

# backend [1.28.0](https://github.com/fhswf/appointme/compare/backend@1.27.0...backend@1.28.0) (2025-12-11)


### Bug Fixes

* use top-level await & try/catch ([7b925ee](https://github.com/fhswf/appointme/commit/7b925eeaa82b3c849f5f3c03d1e1c2ba5531aab7))


### Features

* Refactor event booking logic into modular functions and introduce client-side configuration for environment variables. ([75c3380](https://github.com/fhswf/appointme/commit/75c33807d401dc6537cf0cde5cd1df4c0c7aadc0))

# backend [1.27.0](https://github.com/fhswf/appointme/compare/backend@1.26.0...backend@1.27.0) (2025-12-11)


### Bug Fixes

* OIDC login ([59c8431](https://github.com/fhswf/appointme/commit/59c843193b10ef19ea608578739b58725b64b373))


### Features

* improve Google Calendar integration ([bbb5031](https://github.com/fhswf/appointme/commit/bbb5031acc50d41e2aa7a3fe1549d1a8db269cb6))

# backend [1.26.0](https://github.com/fhswf/appointme/compare/backend@1.25.2...backend@1.26.0) (2025-12-10)


### Features

* database migration ([c326a4c](https://github.com/fhswf/appointme/commit/c326a4c456a369bd45fe25f6c8f933b5c817dfd5))





### Dependencies

* **common:** upgraded to 1.10.0

## backend [1.25.2](https://github.com/fhswf/appointme/compare/backend@1.25.1...backend@1.25.2) (2025-12-10)


### Bug Fixes

* handle multiple push calendars ([c33f087](https://github.com/fhswf/appointme/commit/c33f08716eb1eff9eda8e4b9401196670dae2ff3))

## backend [1.25.1](https://github.com/fhswf/appointme/compare/backend@1.25.0...backend@1.25.1) (2025-12-10)


### Bug Fixes

* simplify health check endpoint ([0e6b02a](https://github.com/fhswf/appointme/commit/0e6b02a793932ea021c02b34fd1ce5de7fe0ac5c))

# backend [1.25.0](https://github.com/fhswf/appointme/compare/backend@1.24.0...backend@1.25.0) (2025-12-10)


### Bug Fixes

* add user rate limiter and update authentication middleware for the /me route ([ab310cf](https://github.com/fhswf/appointme/commit/ab310cf1f28e2eb8729c301fb247507c11dc9229))


### Features

* add health check ([e3f3928](https://github.com/fhswf/appointme/commit/e3f392870fe8cd64a25af6ef8d8e09fae0407903))
* Enhance health check endpoint to report database connection status with error handling. ([eac3bf9](https://github.com/fhswf/appointme/commit/eac3bf9ee4e63e0fb3894c842361b85668f9e68c))
* externalize contact information to environment variables and a new component, updating legal pages and i18n. ([5e9aa07](https://github.com/fhswf/appointme/commit/5e9aa0732d026874d77d1f58107ffddeb4befae1))
* Implement 404 response and cache control for `GET /api/v1/user/me` and add a new test case. ([eb0c1c6](https://github.com/fhswf/appointme/commit/eb0c1c6075d70306f9249f350b7cbe16097253a5))





### Dependencies

* **common:** upgraded to 1.9.0

# backend [1.24.0](https://github.com/fhswf/appointme/compare/backend@1.23.0...backend@1.24.0) (2025-12-10)


### Features

* branding update ([f101231](https://github.com/fhswf/appointme/commit/f101231fc8c8a3d54188a8ec03b3b85b0c81f5e5))
* ui improvements ([bd566a4](https://github.com/fhswf/appointme/commit/bd566a4def557b95e47a5dc65ba369131af7b613))





### Dependencies

* **common:** upgraded to 1.8.0

# backend [1.23.0](https://github.com/fhswf/appointme/compare/backend@1.22.2...backend@1.23.0) (2025-12-10)


### Bug Fixes

* Add input type validation for user identifiers to prevent NoSQL injection and include a test for `getUserByUrl`. ([2920162](https://github.com/fhswf/appointme/commit/2920162b4bed72f12d2f03c77f065b2751328d1c))
* nosql injection ([3837f60](https://github.com/fhswf/appointme/commit/3837f6052d5bca5081071eec1a7f6580b2d55a70))


### Features

* Add rate limiting to user update route and enhance `updateUser` controller with ID validation, field lookup optimization, and improved error handling. ([065344f](https://github.com/fhswf/appointme/commit/065344f55d6493b7dc25284dfd68e8d0a260cf7d))
* Add user welcome field, update i18n password key, enhance user update security, and integrate new client icons. ([ac5aac0](https://github.com/fhswf/appointme/commit/ac5aac038d07ad84f167c787c47d062c47ddc7e8))
* Add utility to patch JUnit XML timestamps and integrate into client unit and backend CI workflows. ([e3640ad](https://github.com/fhswf/appointme/commit/e3640ad57e01012412de1c5bff259be3350e644f))
* Implement user profile page with Gravatar support, user URL updates, and i18n for navigation. ([1bfa2d6](https://github.com/fhswf/appointme/commit/1bfa2d64c04897dba6a99e6391cec0a5a51270d2))
* improve OIDC user creation with email check and `user_url` collision retry, and redirect to login on client-side errors ([1daf9ae](https://github.com/fhswf/appointme/commit/1daf9aeb7a50837cc936f6f8acc3104425bf9fb2))





### Dependencies

* **common:** upgraded to 1.7.0

## backend [1.22.2](https://github.com/fhswf/appointme/compare/backend@1.22.1...backend@1.22.2) (2025-12-09)





### Dependencies

* **common:** upgraded to 1.6.0

## backend [1.22.1](https://github.com/fhswf/appointme/compare/backend@1.22.0...backend@1.22.1) (2025-12-09)


### Bug Fixes

* mongoose import ([a243b54](https://github.com/fhswf/appointme/commit/a243b5440ab91b4ddcbda55a5a66c413e651e310))

# backend [1.22.0](https://github.com/fhswf/appointme/compare/backend@1.21.0...backend@1.22.0) (2025-12-09)


### Features

* Add optional email field to CalDAV accounts and use it for event organizers when creating events. ([6283fdc](https://github.com/fhswf/appointme/commit/6283fdc9f3c682e52cee82a4f859d90032928300))





### Dependencies

* **common:** upgraded to 1.5.0

# backend [1.21.0](https://github.com/fhswf/appointme/compare/backend@1.20.0...backend@1.21.0) (2025-12-09)


### Features

* Allow SMTP configuration without authentication and update K8s manifests and tests. ([1a3dee0](https://github.com/fhswf/appointme/commit/1a3dee0ce116c6542236dfeda1e206ddb0f1467e))

# backend [1.20.0](https://github.com/fhswf/appointme/compare/backend@1.19.0...backend@1.20.0) (2025-12-09)


### Features

* Add ENCRYPTION_KEY environment variable for CalDAV password encryption to deployment, secret example, and README. ([12dc113](https://github.com/fhswf/appointme/commit/12dc113cb4f337c28fd6b313665bc362d090f62f))

# backend [1.19.0](https://github.com/fhswf/appointme/compare/backend@1.18.0...backend@1.19.0) (2025-12-09)


### Features

* add Kubernetes deployment examples for ConfigMap and Secret, update README and gitignore. ([beb7391](https://github.com/fhswf/appointme/commit/beb739184d4d3a91b660297ab9a9dd34ae453259))

# backend [1.18.0](https://github.com/fhswf/appointme/compare/backend@1.17.0...backend@1.18.0) (2025-12-09)


### Bug Fixes

* Correct 'Invitaion' typo in event invitation subject and feat: introduce navigation after calendar updates and internationalize CalDav UI text. ([0b2e7c4](https://github.com/fhswf/appointme/commit/0b2e7c4a211cf1054fd81110fa64e686a50c35a8))
* Refine TypeScript type annotations in CalDAV controller and authentication test mocks. ([129ff15](https://github.com/fhswf/appointme/commit/129ff152c9208e2d494d68039ac5a7a5d5c4d63f))
* Sanitize HTML in email invitation content for attendee name, event summary, and description, and add a corresponding test. ([d9d77fb](https://github.com/fhswf/appointme/commit/d9d77fbe543690ea85d4949015f0dfd6a4415d24))
* syntax error in deployment.yaml ([1ac2707](https://github.com/fhswf/appointme/commit/1ac2707de8e1c37639198291d5bd9d8d1addc9d8))


### Features

* add comprehensive tests for EventForm fields and submit button, refine Login and OidcCallback tests, and update EventList navigation tests. ([179f4d6](https://github.com/fhswf/appointme/commit/179f4d60678b97cdf88e69d1017c8e5c6e1078e7))
* Add configurable SMTP support to mailer, falling back to Gmail service. ([01767b1](https://github.com/fhswf/appointme/commit/01767b11d2853a199fad6a0e278a7e5a0489ae60))
* Add new i18n keys for booking and CalDav features, and refine iCal attendee RSVP logic. ([0c1872f](https://github.com/fhswf/appointme/commit/0c1872fa8fe7b4d15fe58dba5acb4166cfef8845))
* add OIDC controller tests and update Vitest dependencies. ([8d80865](https://github.com/fhswf/appointme/commit/8d8086527915a67e4868b62cf944a55a10794c32))
* Add rate limiting to OIDC `/url` and `/login` endpoints. ([ba54e48](https://github.com/fhswf/appointme/commit/ba54e488da832e7204ad719ae32af98c674e0dd0))
* Add scheduler utility, OIDC callback tests, Google event insertion, and enable event controller tests. ([83ade1d](https://github.com/fhswf/appointme/commit/83ade1dba8966463cab7aec894cf651785ff576c))
* i18n restructured ([2d25c89](https://github.com/fhswf/appointme/commit/2d25c895228f4c4ad17e4237ba5c45f229527fa9))
* Implement OIDC authentication flow ([d8e4cdd](https://github.com/fhswf/appointme/commit/d8e4cdd073a99338257b2ee90721bd91afa0b633))
* Introduce iCal utility to centralize ICS generation and enhance event creation with user comments for CalDAV, Google Calendar, and email invitations. ([657c969](https://github.com/fhswf/appointme/commit/657c969d61806e674e57d1ea075df8e1ba8cc7b2))
* Prevent Mongoose model re-compilation, enhance OIDC controller tests for unconfigured scenarios, and include `.tsx` files in SonarQube test inclusions. ([f8d0b7f](https://github.com/fhswf/appointme/commit/f8d0b7f47ef8fe4a6ed239a75664bbd4fb684b9d))
* test duplicate `user_url` ([f730e0b](https://github.com/fhswf/appointme/commit/f730e0b27ab7aaa3bf17bd10ef0fcbad3b9fb353))

# backend [1.18.0](https://github.com/fhswf/appointme/compare/backend@1.17.0...backend@1.18.0) (2025-12-09)


### Bug Fixes

* Correct 'Invitaion' typo in event invitation subject and feat: introduce navigation after calendar updates and internationalize CalDav UI text. ([0b2e7c4](https://github.com/fhswf/appointme/commit/0b2e7c4a211cf1054fd81110fa64e686a50c35a8))
* Sanitize HTML in email invitation content for attendee name, event summary, and description, and add a corresponding test. ([d9d77fb](https://github.com/fhswf/appointme/commit/d9d77fbe543690ea85d4949015f0dfd6a4415d24))
* syntax error in deployment.yaml ([1ac2707](https://github.com/fhswf/appointme/commit/1ac2707de8e1c37639198291d5bd9d8d1addc9d8))


### Features

* add comprehensive tests for EventForm fields and submit button, refine Login and OidcCallback tests, and update EventList navigation tests. ([179f4d6](https://github.com/fhswf/appointme/commit/179f4d60678b97cdf88e69d1017c8e5c6e1078e7))
* Add configurable SMTP support to mailer, falling back to Gmail service. ([01767b1](https://github.com/fhswf/appointme/commit/01767b11d2853a199fad6a0e278a7e5a0489ae60))
* Add new i18n keys for booking and CalDav features, and refine iCal attendee RSVP logic. ([0c1872f](https://github.com/fhswf/appointme/commit/0c1872fa8fe7b4d15fe58dba5acb4166cfef8845))
* add OIDC controller tests and update Vitest dependencies. ([8d80865](https://github.com/fhswf/appointme/commit/8d8086527915a67e4868b62cf944a55a10794c32))
* Add rate limiting to OIDC `/url` and `/login` endpoints. ([ba54e48](https://github.com/fhswf/appointme/commit/ba54e488da832e7204ad719ae32af98c674e0dd0))
* Add scheduler utility, OIDC callback tests, Google event insertion, and enable event controller tests. ([83ade1d](https://github.com/fhswf/appointme/commit/83ade1dba8966463cab7aec894cf651785ff576c))
* i18n restructured ([2d25c89](https://github.com/fhswf/appointme/commit/2d25c895228f4c4ad17e4237ba5c45f229527fa9))
* Implement OIDC authentication flow ([d8e4cdd](https://github.com/fhswf/appointme/commit/d8e4cdd073a99338257b2ee90721bd91afa0b633))
* Introduce iCal utility to centralize ICS generation and enhance event creation with user comments for CalDAV, Google Calendar, and email invitations. ([657c969](https://github.com/fhswf/appointme/commit/657c969d61806e674e57d1ea075df8e1ba8cc7b2))
* Prevent Mongoose model re-compilation, enhance OIDC controller tests for unconfigured scenarios, and include `.tsx` files in SonarQube test inclusions. ([f8d0b7f](https://github.com/fhswf/appointme/commit/f8d0b7f47ef8fe4a6ed239a75664bbd4fb684b9d))
* test duplicate `user_url` ([f730e0b](https://github.com/fhswf/appointme/commit/f730e0b27ab7aaa3bf17bd10ef0fcbad3b9fb353))

# backend [1.17.0](https://github.com/fhswf/appointme/compare/backend@1.16.0...backend@1.17.0) (2025-12-08)


### Bug Fixes

* **auth:** default for API_URL ([ff39be6](https://github.com/fhswf/appointme/commit/ff39be61286082a80562668360927eacd5fcbf0f))
* **auth:** default for API_URL ([a0da198](https://github.com/fhswf/appointme/commit/a0da1988df228c30e80cd2ed3c76ed89890531bf))
* **authentication:** remove client-accessible token ([3e371cc](https://github.com/fhswf/appointme/commit/3e371cc811581404e3d5e2ae3563e8f86880c4c4))
* automated docker build ([c1f2de3](https://github.com/fhswf/appointme/commit/c1f2de3cbd41a2c65f21a3d861901db710f6da65))
* **backend:** change type to module ([dc52879](https://github.com/fhswf/appointme/commit/dc52879130a7b0bd4d222670d228d7222f726c5c))
* **backend:** config warnings ([13b571a](https://github.com/fhswf/appointme/commit/13b571a1b48feef6f5b4c1da8de4f792485700e1))
* **backend:** import in test spec ([a2d997a](https://github.com/fhswf/appointme/commit/a2d997ad16b0bdbd8b82c1a19d9c849f219bf02c))
* **backend:** JWT_SECRET and email passwords ([63596b0](https://github.com/fhswf/appointme/commit/63596b02e3996bc721784954a4dc341b4446e07a))
* **backend:** quality improvement ([5cc5862](https://github.com/fhswf/appointme/commit/5cc58625aabf612078a4d725c4e0e5a3670b08cd))
* **backend:** token verification ([4172337](https://github.com/fhswf/appointme/commit/41723375ab877eead79c6b24bfed51da37819dbe))
* **backend:** typescript config ([06f4656](https://github.com/fhswf/appointme/commit/06f46565111fdd5b7d7c86f2d3d58aac3c523926))
* build backend image via gh action ([7226d2d](https://github.com/fhswf/appointme/commit/7226d2dd0ed040b082c30061fbe9f8ddd2560370))
* build backend image via gh action ([eec81e5](https://github.com/fhswf/appointme/commit/eec81e555588fd90177a300d99d7a1c117f30e0e))
* build backend image via gh action ([7a418a9](https://github.com/fhswf/appointme/commit/7a418a9609f7dd3f4a2acbb8563c72ddcd17e898))
* build backend image via gh action ([1d1a733](https://github.com/fhswf/appointme/commit/1d1a733a3ff55ce1746cb068c776cbf0a39fe4c6))
* **bump dependencies:** upgrade several dependencies ([39d06e3](https://github.com/fhswf/appointme/commit/39d06e3986ec8911d03cfe50286e6a09e494dbea))
* **client:** docker deployment & typing ([13ddc53](https://github.com/fhswf/appointme/commit/13ddc53aad4afb5bb627f35063b3f1c856c51424))
* **config:** update config values ([6ced70e](https://github.com/fhswf/appointme/commit/6ced70eba462830ce7d42c55ad75669a99e05fcb))
* controller should not return a promise ([2070fd5](https://github.com/fhswf/appointme/commit/2070fd56f195187ca35e03e838d9b259a6431710))
* correct api url configuration ([1c65124](https://github.com/fhswf/appointme/commit/1c6512411ed3a6cc2026b7c37fcb0f1192c3a8e6))
* CORS for debugging ([74f56f1](https://github.com/fhswf/appointme/commit/74f56f19ee966adb72db0120e00e9e8b058cea1a))
* deployment on appoint.gawron.cloud ([9023b45](https://github.com/fhswf/appointme/commit/9023b4517a11275bccd881597f3b3dbfd1f71cdd))
* **deployment:** resource limits ([e59b219](https://github.com/fhswf/appointme/commit/e59b219caf9dfc04b05d5d23a925afac430e303d))
* **deployment:** separate deployment & ingress config ([2cc83f5](https://github.com/fhswf/appointme/commit/2cc83f5f698c063c84f8515c82afa85d2e66e91f))
* **deployment:** update via semantic release ([8dd703e](https://github.com/fhswf/appointme/commit/8dd703ea931d01d4b1eaf911ee56e8c85f24a606))
* do not overwrite calendar settings upon login ([195f7fe](https://github.com/fhswf/appointme/commit/195f7fe0d8685f06b87a53f23336b4bee88dc605))
* do not update google tokens via user controller ([6c9eee3](https://github.com/fhswf/appointme/commit/6c9eee3ce070cf07ebad92e4d66020a07ade935c))
* dotenv config for backend ([714a7c0](https://github.com/fhswf/appointme/commit/714a7c06eeff750278a0fa6e851ff31798be362c))
* edit available times ([#5](https://github.com/fhswf/appointme/issues/5)) ([74f1d3a](https://github.com/fhswf/appointme/commit/74f1d3aab871a27b1f66dcf9e4854f0221c99b74))
* enable cookies for CORS requests ([c49e148](https://github.com/fhswf/appointme/commit/c49e1485b4faaebd6f2738733eacb20eca3fa0bd))
* enable cookies for CORS requests ([4a20b82](https://github.com/fhswf/appointme/commit/4a20b82bc48d2d511c5eef59960395bdfb961540))
* Enhance CalDAV error reporting and introduce a manual testing script for CalDAV integration. ([4fbb38b](https://github.com/fhswf/appointme/commit/4fbb38bab25af0aed6fc81b59a5748781e2b2a6a))
* freeBusy service corrected ([ff80003](https://github.com/fhswf/appointme/commit/ff8000327717a67a42b326c1acce906112bbb250))
* **freeBusy:** filter out free slots shorter than the event duration ([4179f8b](https://github.com/fhswf/appointme/commit/4179f8b8a2681a00a09919a9027a888c5f91fc8d))
* github actions for semantic release fixed ([7789df7](https://github.com/fhswf/appointme/commit/7789df7d31d491bd876ce2d93272f1c4c5452ced))
* improve quality ([c82d164](https://github.com/fhswf/appointme/commit/c82d164c48163ba884e602391492c3683a2bcad7))
* **insertEvent:** check availablility of requested slot in backend ([ddaa7f7](https://github.com/fhswf/appointme/commit/ddaa7f7088bfac17abff8f4d1706d8d2ebcdc0fe)), closes [#27](https://github.com/fhswf/appointme/issues/27)
* **k8s:** security settings ([5a4b1a4](https://github.com/fhswf/appointme/commit/5a4b1a4f4c87e231ea17ca9837a4638022565cfe))
* **logging:** log CORS config ([7872a72](https://github.com/fhswf/appointme/commit/7872a7255dcef772ec2242745326e56ad291e6e4))
* **logging:** log CORS config ([c9b7cc0](https://github.com/fhswf/appointme/commit/c9b7cc019391160a4cc05ef63be069e52247d9fa))
* make redirect URL configurable ([4ceea0c](https://github.com/fhswf/appointme/commit/4ceea0c4e26599b758402cc96b23eac9c62b72aa))
* Migrate to Google Sign In ([fcda431](https://github.com/fhswf/appointme/commit/fcda431c95c118368a5e1a4abed2ad7eee5cc2b7))
* module deps ([1e746bb](https://github.com/fhswf/appointme/commit/1e746bb38f6ea4242ba4a379ab761d7ffc46c361))
* module import ([6a42b74](https://github.com/fhswf/appointme/commit/6a42b7490f4153a95c8c11a5814c07a1acc7523d))
* module import ([36b1f5b](https://github.com/fhswf/appointme/commit/36b1f5be7ed35abdf6b53ef581841a310a537a11))
* module resolution ([6b3eb2d](https://github.com/fhswf/appointme/commit/6b3eb2d032a7349c117ff738dd1c84c00e00d9e3))
* module resolution ([fdd128e](https://github.com/fhswf/appointme/commit/fdd128ee14ca2855c15b9353400166cd7fd3943f))
* multi-release ([0e18282](https://github.com/fhswf/appointme/commit/0e18282ceac0b39840802682101c132c8896eec2))
* multi-release ([8ab5317](https://github.com/fhswf/appointme/commit/8ab531792d16509166c49b3aba82d242d41ed500))
* rate limiting ([c3c89bd](https://github.com/fhswf/appointme/commit/c3c89bd6b7411c40d415f2a0deb5a65af1fa6cf0))
* redirect to calendar integration ([e305329](https://github.com/fhswf/appointme/commit/e305329a86cc80158ad604940c045261ff9bd4c2))
* redirect to calendar integration ([89f8597](https://github.com/fhswf/appointme/commit/89f85972fb8e4c30eaece662db1c559e12960286))
* refactor event controller ([b3eb06e](https://github.com/fhswf/appointme/commit/b3eb06e30bbec8b29094d00131deff4bff0ea8d0))
* refactor event controller ([c94aec7](https://github.com/fhswf/appointme/commit/c94aec7ed60bb0868cce158cb643a8ce45b00e12))
* refactor user type ([991dd29](https://github.com/fhswf/appointme/commit/991dd2924d71373ed667ca862aa36d6245021d20))
* remove unused routes ([a29a54e](https://github.com/fhswf/appointme/commit/a29a54e995d66054b42979e1bf2dc6b1f2f1afda))
* resource limits ([04b261c](https://github.com/fhswf/appointme/commit/04b261c4f9738f4d173feaf5c929f22147703bf0))
* security updates ([f96e262](https://github.com/fhswf/appointme/commit/f96e26276bf4a0dc5013971c4094ee3a64fbdcf7))
* **security:** enforce TLS with nodemailer ([bfbfa5f](https://github.com/fhswf/appointme/commit/bfbfa5fd6bceb9147dc0eb35f41d8ba89d761b96))
* **security:** remove password attribute ([a1fb3e5](https://github.com/fhswf/appointme/commit/a1fb3e5abdacd6037a76ee24b357c71658162f18))
* **security:** remove secret from docker image ([0c9d6f3](https://github.com/fhswf/appointme/commit/0c9d6f3940153244c16fb6f3b23bd437049e7cd9))
* semantic release config ([b638ae1](https://github.com/fhswf/appointme/commit/b638ae1bf1f34ba6283a7ab61de5eaf406a27e20))
* semantic-release config ([e6b7a13](https://github.com/fhswf/appointme/commit/e6b7a1326964a2a7b5f3d088386e60deb6a3b077))
* set domain for cookie ([c876638](https://github.com/fhswf/appointme/commit/c8766385d00388a332b5bcf0f633db65c2954c0b))
* set sameSite: lax in development ([6a18a47](https://github.com/fhswf/appointme/commit/6a18a47fb53f4f0da65b95e1362296da43a29f2e))
* set sameSite: none in development ([bc3279d](https://github.com/fhswf/appointme/commit/bc3279d42a148be61374d6b044221853f26c13a3))
* sonarqube issues ([9f61182](https://github.com/fhswf/appointme/commit/9f6118235ffc9868413403b21cac0a36b1bac8e4))
* sonarqube issues ([e5d870b](https://github.com/fhswf/appointme/commit/e5d870b40da04c12cc277c1cdcfede15ddd09913))
* sonarqube issues ([89c0456](https://github.com/fhswf/appointme/commit/89c0456526614a2e10976ce45706baa5489c9d21))
* **test:** coverage for cypress tests ([ec5499d](https://github.com/fhswf/appointme/commit/ec5499d6b909a7e04010b7fb5b97aa8c30d16a8b))
* **test:** coverage for cypress tests ([505550d](https://github.com/fhswf/appointme/commit/505550dfd722a13a13c1568990602df982cec66e))
* testing ([d74b86f](https://github.com/fhswf/appointme/commit/d74b86ff227c26cc6e1e1d40b92b32c2fc3c6a63))
* **test:** mock google calendar ([ffc15fb](https://github.com/fhswf/appointme/commit/ffc15fba1453368bd35489c879c00ddc59d76869))
* **test:** test before sonarqube analysis ([50a3389](https://github.com/fhswf/appointme/commit/50a33892f69f3c0a82f8fb77d6c07b95a0dcc6b0))
* **test:** test before sonarqube analysis ([a5d856f](https://github.com/fhswf/appointme/commit/a5d856f1f4b55f543e5d3e21840fdad2001cff0d))
* **test:** test before sonarqube analysis ([a6d28c6](https://github.com/fhswf/appointme/commit/a6d28c6e4e3017c9716f2328e784fadc7c30550c))
* **test:** test before sonarqube analysis ([966b558](https://github.com/fhswf/appointme/commit/966b558099ccf7ec09f30c8676c0b1e9ba9cc9c1))
* **test:** version & config updates ([266684c](https://github.com/fhswf/appointme/commit/266684cc69a162ee968ac3ebcce8613df1f25244))
* transfer timestamp as integer ([4753bd4](https://github.com/fhswf/appointme/commit/4753bd45e879a5f1f56748cedfc8a92c12a938a4))
* typescript issues ([15a4cc1](https://github.com/fhswf/appointme/commit/15a4cc1c5caf2c14d4d4c0a60695c155b08f6d57))
* UI glitches fixed ([14783e1](https://github.com/fhswf/appointme/commit/14783e13cd00b7e3d05aac64354ca30157a679c0))
* **ui:** changes for vite & mui 6 ([6fc7016](https://github.com/fhswf/appointme/commit/6fc701620d3c9931cbc072e62fb375a96928080d))
* update docker build to use yarn ([5b5ed89](https://github.com/fhswf/appointme/commit/5b5ed8996b9e9a6fb6386da935a4f8c95d878251))
* **workflow:** delete obsolete workflow files ([7fa0e67](https://github.com/fhswf/appointme/commit/7fa0e678227763bbc0c02efd9dbf2c3fad7435d4))
* **workflow:** update version in package.json ([e0037a7](https://github.com/fhswf/appointme/commit/e0037a7dde4aeaf4f4ed6c31958a4f050e0f94b3))
* yarn build/dependency management & docker ([5b491e6](https://github.com/fhswf/appointme/commit/5b491e6b0005db98837286b411d8de9a13fdbb7a))


### Features

* Add authentication and event controller tests and fix authentication flow. ([e9089d5](https://github.com/fhswf/appointme/commit/e9089d5d7153caaa7fb17fa0ce5868174f8aca41))
* **backend:** calender events ([6262e39](https://github.com/fhswf/appointme/commit/6262e394c914de06600c493fe406e1f0ee5ef49f))
* **backend:** CORS entry for appoint.gawron.cloud ([b0ed4b5](https://github.com/fhswf/appointme/commit/b0ed4b5364b266a80ddeeca7f733a16b4e6d003c))
* **backend:** store access token in cookie ([8241926](https://github.com/fhswf/appointme/commit/824192629bec518322d562578ba0451ef9b464d8))
* caldav integration ([ddc3773](https://github.com/fhswf/appointme/commit/ddc37730f4ccd50b57f70a60394276f3abd29273))
* caldav integration ([5b7fb4d](https://github.com/fhswf/appointme/commit/5b7fb4d62acd3ccb94e4da94dad1585d9df9c716))
* CalDAV integration ([3d42396](https://github.com/fhswf/appointme/commit/3d423964f8417aa8df136ed84c9bb92d6fb16024))
* **calendar:** allow guests to modify an event ([f815931](https://github.com/fhswf/appointme/commit/f81593101d2633a6d38f8bf8e532c6e42cb53945))
* docker build in release ([b6b7b43](https://github.com/fhswf/appointme/commit/b6b7b430ba6d05d73366f45f00e87f03bfadcfc4))
* docker build in release ([dc61033](https://github.com/fhswf/appointme/commit/dc61033d30f1cae5acef61feacd3afbe479ffabb))
* docker build in release ([845feae](https://github.com/fhswf/appointme/commit/845feae2e366527d28f6a65c869efbf96d0e7043))
* docker build in release ([d7ac528](https://github.com/fhswf/appointme/commit/d7ac5284923a7cac9a9ece4ef5ce6e7dff31ac61))
* docker build in release ([24dc4b2](https://github.com/fhswf/appointme/commit/24dc4b249ed6141caf9838b159e4a23d0a6e9b0a))
* docker build in release ([f8ad783](https://github.com/fhswf/appointme/commit/f8ad783b66842bef7a11217d42c556463ac97b40))
* docker build in release ([6b3d4f7](https://github.com/fhswf/appointme/commit/6b3d4f741eadfe376ec0bf285d3b6422570ea4a4))
* docker build in release ([75f655f](https://github.com/fhswf/appointme/commit/75f655f57953a5ebd1dc5e22164fe182f743840d))
* docker build in release ([45bb72f](https://github.com/fhswf/appointme/commit/45bb72f47bf7f0eb88f5ff6547a8cd67aed98496))
* docker build in release ([c87aab2](https://github.com/fhswf/appointme/commit/c87aab26f5f064bb30e592d7c4c08fbba04d75a4))
* docker build in release ([827d4c8](https://github.com/fhswf/appointme/commit/827d4c860f7c95425470cf5be48a0bf31a72b1b0))
* docker build in release ([072330c](https://github.com/fhswf/appointme/commit/072330c19ea33aee7775db346008ae0f0adeb0ce))
* docker build in release ([d60907c](https://github.com/fhswf/appointme/commit/d60907c8f9205fdc4efdd8582debe870b4964e18))
* docker build in release ([3bf3c12](https://github.com/fhswf/appointme/commit/3bf3c123c0e59618ced40eb5a5ae5192b20bb5fd))
* docker build in release ([5834136](https://github.com/fhswf/appointme/commit/5834136b16d3cdb20f89f450acab79f40a1ce739))
* docker build in release ([6bb006e](https://github.com/fhswf/appointme/commit/6bb006e04d0b6cc5829d680bca41c8c92235e5c8))
* **freeBusy:** check maxPerDay constraint ([2f4c391](https://github.com/fhswf/appointme/commit/2f4c3919be4616b0375044ac08ee411aa1fff544))
* **freeBusy:** freeBusy should observe minFuture and maxFuture restrictictions of an event ([93847d1](https://github.com/fhswf/appointme/commit/93847d15685d370bb58a4a19b522b72d24e946aa))
* Implement CSRF protection by adding a new CSRF service and integrating CSRF tokens into client requests and backend server logic. ([1ccd011](https://github.com/fhswf/appointme/commit/1ccd011a6cfbf7848db4479715c96533764de837))
* implement email event invitations with ICS attachments via new mailer utility. ([40a72c0](https://github.com/fhswf/appointme/commit/40a72c0bfc61a3c893cb60c48b8bf74c420c952a))
* Implement Google Calendar event insertion, improve free/busy time calculation, and add token revocation. ([c2e86b3](https://github.com/fhswf/appointme/commit/c2e86b34ae2923a598daa9e513c94a63926b4ccf))
* Implement per-user OAuth2Client creation with automatic token refresh and refine token update logic, adding new tests. ([19b0f8b](https://github.com/fhswf/appointme/commit/19b0f8bb57e807dd843e1a2c35bb49bc38cc07bc))
* improve test coverage ([04cb13a](https://github.com/fhswf/appointme/commit/04cb13a303fce553cb33226b912314cc6fa43f4f))
* Integrate `sonner` for client-side toast notifications, enhance backend authentication error handling, and update ESLint configuration. ([ec29e58](https://github.com/fhswf/appointme/commit/ec29e58aca49a9da67e7a6b6442015fbeae59514))
* Integrate CalDAV busy slot fetching into free slot calculation and improve environment variable loading. ([7983f06](https://github.com/fhswf/appointme/commit/7983f0612090a5628865bf4723c1575b6d6fd3a9))
* local development ([406bd5f](https://github.com/fhswf/appointme/commit/406bd5f219cd22420c0a4bffa16c73460828c91f))
* **logging:** use winston for logging ([6a0e299](https://github.com/fhswf/appointme/commit/6a0e2991e8859366f4a1b1a92683adbd7ebec36e))
* **logging:** use winston for logging ([1d6d130](https://github.com/fhswf/appointme/commit/1d6d130cf3942c1ce5943ef599f670b307f974da))
* **markdown:** handle event type description as markdown. ([87731b1](https://github.com/fhswf/appointme/commit/87731b1288460ebff551da5f77d5b080a799fc89))
* new rest api ([a8f823f](https://github.com/fhswf/appointme/commit/a8f823f8aec8116a302cf7e326f2edbc81b97218))
* new rest api ([f4e42c3](https://github.com/fhswf/appointme/commit/f4e42c3cad3202c54114fbbea64d4f7ca583c879))
* refactoring CORS & dev container ([75596f7](https://github.com/fhswf/appointme/commit/75596f70cf7cdc9bd2d061c7733971a74bda2ac0))
* store access token in cookie ([32daf4e](https://github.com/fhswf/appointme/commit/32daf4ea65d415c2bce5eb2d276829f6fca96bf8))
* store access token in cookie ([0d1e499](https://github.com/fhswf/appointme/commit/0d1e49926e85fed710456e8b241aaf307e74a3e2))
* ui improvements ([2cd8dfe](https://github.com/fhswf/appointme/commit/2cd8dfee5038775ebb1c122a5bab0a8a2ecd62c4))
* Update encryption algorithm from AES-256-CBC to AES-256-GCM. ([04ccf64](https://github.com/fhswf/appointme/commit/04ccf6496eab32d6df67155531448e3ee17b8c5f))
* update encryption utility to use authentication tags and refine `Event` document type ([1b7db71](https://github.com/fhswf/appointme/commit/1b7db7125ac90c672cfa050cfc407496c0fad6a9))

# backend [1.17.0](https://github.com/fhswf/appointme/compare/backend@1.16.0...backend@1.17.0) (2025-12-08)


### Bug Fixes

* **auth:** default for API_URL ([ff39be6](https://github.com/fhswf/appointme/commit/ff39be61286082a80562668360927eacd5fcbf0f))
* **auth:** default for API_URL ([a0da198](https://github.com/fhswf/appointme/commit/a0da1988df228c30e80cd2ed3c76ed89890531bf))
* **authentication:** remove client-accessible token ([3e371cc](https://github.com/fhswf/appointme/commit/3e371cc811581404e3d5e2ae3563e8f86880c4c4))
* automated docker build ([c1f2de3](https://github.com/fhswf/appointme/commit/c1f2de3cbd41a2c65f21a3d861901db710f6da65))
* **backend:** change type to module ([dc52879](https://github.com/fhswf/appointme/commit/dc52879130a7b0bd4d222670d228d7222f726c5c))
* **backend:** config warnings ([13b571a](https://github.com/fhswf/appointme/commit/13b571a1b48feef6f5b4c1da8de4f792485700e1))
* **backend:** import in test spec ([a2d997a](https://github.com/fhswf/appointme/commit/a2d997ad16b0bdbd8b82c1a19d9c849f219bf02c))
* **backend:** JWT_SECRET and email passwords ([63596b0](https://github.com/fhswf/appointme/commit/63596b02e3996bc721784954a4dc341b4446e07a))
* **backend:** quality improvement ([5cc5862](https://github.com/fhswf/appointme/commit/5cc58625aabf612078a4d725c4e0e5a3670b08cd))
* **backend:** token verification ([4172337](https://github.com/fhswf/appointme/commit/41723375ab877eead79c6b24bfed51da37819dbe))
* **backend:** typescript config ([06f4656](https://github.com/fhswf/appointme/commit/06f46565111fdd5b7d7c86f2d3d58aac3c523926))
* build backend image via gh action ([7226d2d](https://github.com/fhswf/appointme/commit/7226d2dd0ed040b082c30061fbe9f8ddd2560370))
* build backend image via gh action ([eec81e5](https://github.com/fhswf/appointme/commit/eec81e555588fd90177a300d99d7a1c117f30e0e))
* build backend image via gh action ([7a418a9](https://github.com/fhswf/appointme/commit/7a418a9609f7dd3f4a2acbb8563c72ddcd17e898))
* build backend image via gh action ([1d1a733](https://github.com/fhswf/appointme/commit/1d1a733a3ff55ce1746cb068c776cbf0a39fe4c6))
* **bump dependencies:** upgrade several dependencies ([39d06e3](https://github.com/fhswf/appointme/commit/39d06e3986ec8911d03cfe50286e6a09e494dbea))
* **client:** docker deployment & typing ([13ddc53](https://github.com/fhswf/appointme/commit/13ddc53aad4afb5bb627f35063b3f1c856c51424))
* **config:** update config values ([6ced70e](https://github.com/fhswf/appointme/commit/6ced70eba462830ce7d42c55ad75669a99e05fcb))
* controller should not return a promise ([2070fd5](https://github.com/fhswf/appointme/commit/2070fd56f195187ca35e03e838d9b259a6431710))
* correct api url configuration ([1c65124](https://github.com/fhswf/appointme/commit/1c6512411ed3a6cc2026b7c37fcb0f1192c3a8e6))
* CORS for debugging ([74f56f1](https://github.com/fhswf/appointme/commit/74f56f19ee966adb72db0120e00e9e8b058cea1a))
* deployment on appoint.gawron.cloud ([9023b45](https://github.com/fhswf/appointme/commit/9023b4517a11275bccd881597f3b3dbfd1f71cdd))
* **deployment:** resource limits ([e59b219](https://github.com/fhswf/appointme/commit/e59b219caf9dfc04b05d5d23a925afac430e303d))
* **deployment:** separate deployment & ingress config ([2cc83f5](https://github.com/fhswf/appointme/commit/2cc83f5f698c063c84f8515c82afa85d2e66e91f))
* **deployment:** update via semantic release ([8dd703e](https://github.com/fhswf/appointme/commit/8dd703ea931d01d4b1eaf911ee56e8c85f24a606))
* do not overwrite calendar settings upon login ([195f7fe](https://github.com/fhswf/appointme/commit/195f7fe0d8685f06b87a53f23336b4bee88dc605))
* do not update google tokens via user controller ([6c9eee3](https://github.com/fhswf/appointme/commit/6c9eee3ce070cf07ebad92e4d66020a07ade935c))
* dotenv config for backend ([714a7c0](https://github.com/fhswf/appointme/commit/714a7c06eeff750278a0fa6e851ff31798be362c))
* edit available times ([#5](https://github.com/fhswf/appointme/issues/5)) ([74f1d3a](https://github.com/fhswf/appointme/commit/74f1d3aab871a27b1f66dcf9e4854f0221c99b74))
* enable cookies for CORS requests ([c49e148](https://github.com/fhswf/appointme/commit/c49e1485b4faaebd6f2738733eacb20eca3fa0bd))
* enable cookies for CORS requests ([4a20b82](https://github.com/fhswf/appointme/commit/4a20b82bc48d2d511c5eef59960395bdfb961540))
* Enhance CalDAV error reporting and introduce a manual testing script for CalDAV integration. ([4fbb38b](https://github.com/fhswf/appointme/commit/4fbb38bab25af0aed6fc81b59a5748781e2b2a6a))
* freeBusy service corrected ([ff80003](https://github.com/fhswf/appointme/commit/ff8000327717a67a42b326c1acce906112bbb250))
* **freeBusy:** filter out free slots shorter than the event duration ([4179f8b](https://github.com/fhswf/appointme/commit/4179f8b8a2681a00a09919a9027a888c5f91fc8d))
* github actions for semantic release fixed ([7789df7](https://github.com/fhswf/appointme/commit/7789df7d31d491bd876ce2d93272f1c4c5452ced))
* improve quality ([c82d164](https://github.com/fhswf/appointme/commit/c82d164c48163ba884e602391492c3683a2bcad7))
* **insertEvent:** check availablility of requested slot in backend ([ddaa7f7](https://github.com/fhswf/appointme/commit/ddaa7f7088bfac17abff8f4d1706d8d2ebcdc0fe)), closes [#27](https://github.com/fhswf/appointme/issues/27)
* **k8s:** security settings ([5a4b1a4](https://github.com/fhswf/appointme/commit/5a4b1a4f4c87e231ea17ca9837a4638022565cfe))
* **logging:** log CORS config ([7872a72](https://github.com/fhswf/appointme/commit/7872a7255dcef772ec2242745326e56ad291e6e4))
* **logging:** log CORS config ([c9b7cc0](https://github.com/fhswf/appointme/commit/c9b7cc019391160a4cc05ef63be069e52247d9fa))
* make redirect URL configurable ([4ceea0c](https://github.com/fhswf/appointme/commit/4ceea0c4e26599b758402cc96b23eac9c62b72aa))
* Migrate to Google Sign In ([fcda431](https://github.com/fhswf/appointme/commit/fcda431c95c118368a5e1a4abed2ad7eee5cc2b7))
* module deps ([1e746bb](https://github.com/fhswf/appointme/commit/1e746bb38f6ea4242ba4a379ab761d7ffc46c361))
* module import ([6a42b74](https://github.com/fhswf/appointme/commit/6a42b7490f4153a95c8c11a5814c07a1acc7523d))
* module import ([36b1f5b](https://github.com/fhswf/appointme/commit/36b1f5be7ed35abdf6b53ef581841a310a537a11))
* module resolution ([6b3eb2d](https://github.com/fhswf/appointme/commit/6b3eb2d032a7349c117ff738dd1c84c00e00d9e3))
* module resolution ([fdd128e](https://github.com/fhswf/appointme/commit/fdd128ee14ca2855c15b9353400166cd7fd3943f))
* multi-release ([0e18282](https://github.com/fhswf/appointme/commit/0e18282ceac0b39840802682101c132c8896eec2))
* multi-release ([8ab5317](https://github.com/fhswf/appointme/commit/8ab531792d16509166c49b3aba82d242d41ed500))
* rate limiting ([c3c89bd](https://github.com/fhswf/appointme/commit/c3c89bd6b7411c40d415f2a0deb5a65af1fa6cf0))
* redirect to calendar integration ([e305329](https://github.com/fhswf/appointme/commit/e305329a86cc80158ad604940c045261ff9bd4c2))
* redirect to calendar integration ([89f8597](https://github.com/fhswf/appointme/commit/89f85972fb8e4c30eaece662db1c559e12960286))
* refactor event controller ([b3eb06e](https://github.com/fhswf/appointme/commit/b3eb06e30bbec8b29094d00131deff4bff0ea8d0))
* refactor event controller ([c94aec7](https://github.com/fhswf/appointme/commit/c94aec7ed60bb0868cce158cb643a8ce45b00e12))
* refactor user type ([991dd29](https://github.com/fhswf/appointme/commit/991dd2924d71373ed667ca862aa36d6245021d20))
* remove unused routes ([a29a54e](https://github.com/fhswf/appointme/commit/a29a54e995d66054b42979e1bf2dc6b1f2f1afda))
* resource limits ([04b261c](https://github.com/fhswf/appointme/commit/04b261c4f9738f4d173feaf5c929f22147703bf0))
* security updates ([f96e262](https://github.com/fhswf/appointme/commit/f96e26276bf4a0dc5013971c4094ee3a64fbdcf7))
* **security:** enforce TLS with nodemailer ([bfbfa5f](https://github.com/fhswf/appointme/commit/bfbfa5fd6bceb9147dc0eb35f41d8ba89d761b96))
* **security:** remove password attribute ([a1fb3e5](https://github.com/fhswf/appointme/commit/a1fb3e5abdacd6037a76ee24b357c71658162f18))
* **security:** remove secret from docker image ([0c9d6f3](https://github.com/fhswf/appointme/commit/0c9d6f3940153244c16fb6f3b23bd437049e7cd9))
* semantic release config ([b638ae1](https://github.com/fhswf/appointme/commit/b638ae1bf1f34ba6283a7ab61de5eaf406a27e20))
* semantic-release config ([e6b7a13](https://github.com/fhswf/appointme/commit/e6b7a1326964a2a7b5f3d088386e60deb6a3b077))
* set domain for cookie ([c876638](https://github.com/fhswf/appointme/commit/c8766385d00388a332b5bcf0f633db65c2954c0b))
* set sameSite: lax in development ([6a18a47](https://github.com/fhswf/appointme/commit/6a18a47fb53f4f0da65b95e1362296da43a29f2e))
* set sameSite: none in development ([bc3279d](https://github.com/fhswf/appointme/commit/bc3279d42a148be61374d6b044221853f26c13a3))
* sonarqube issues ([9f61182](https://github.com/fhswf/appointme/commit/9f6118235ffc9868413403b21cac0a36b1bac8e4))
* sonarqube issues ([e5d870b](https://github.com/fhswf/appointme/commit/e5d870b40da04c12cc277c1cdcfede15ddd09913))
* sonarqube issues ([89c0456](https://github.com/fhswf/appointme/commit/89c0456526614a2e10976ce45706baa5489c9d21))
* **test:** coverage for cypress tests ([ec5499d](https://github.com/fhswf/appointme/commit/ec5499d6b909a7e04010b7fb5b97aa8c30d16a8b))
* **test:** coverage for cypress tests ([505550d](https://github.com/fhswf/appointme/commit/505550dfd722a13a13c1568990602df982cec66e))
* testing ([d74b86f](https://github.com/fhswf/appointme/commit/d74b86ff227c26cc6e1e1d40b92b32c2fc3c6a63))
* **test:** mock google calendar ([ffc15fb](https://github.com/fhswf/appointme/commit/ffc15fba1453368bd35489c879c00ddc59d76869))
* **test:** test before sonarqube analysis ([50a3389](https://github.com/fhswf/appointme/commit/50a33892f69f3c0a82f8fb77d6c07b95a0dcc6b0))
* **test:** test before sonarqube analysis ([a5d856f](https://github.com/fhswf/appointme/commit/a5d856f1f4b55f543e5d3e21840fdad2001cff0d))
* **test:** test before sonarqube analysis ([a6d28c6](https://github.com/fhswf/appointme/commit/a6d28c6e4e3017c9716f2328e784fadc7c30550c))
* **test:** test before sonarqube analysis ([966b558](https://github.com/fhswf/appointme/commit/966b558099ccf7ec09f30c8676c0b1e9ba9cc9c1))
* **test:** version & config updates ([266684c](https://github.com/fhswf/appointme/commit/266684cc69a162ee968ac3ebcce8613df1f25244))
* transfer timestamp as integer ([4753bd4](https://github.com/fhswf/appointme/commit/4753bd45e879a5f1f56748cedfc8a92c12a938a4))
* typescript issues ([15a4cc1](https://github.com/fhswf/appointme/commit/15a4cc1c5caf2c14d4d4c0a60695c155b08f6d57))
* UI glitches fixed ([14783e1](https://github.com/fhswf/appointme/commit/14783e13cd00b7e3d05aac64354ca30157a679c0))
* **ui:** changes for vite & mui 6 ([6fc7016](https://github.com/fhswf/appointme/commit/6fc701620d3c9931cbc072e62fb375a96928080d))
* update docker build to use yarn ([5b5ed89](https://github.com/fhswf/appointme/commit/5b5ed8996b9e9a6fb6386da935a4f8c95d878251))
* **workflow:** delete obsolete workflow files ([7fa0e67](https://github.com/fhswf/appointme/commit/7fa0e678227763bbc0c02efd9dbf2c3fad7435d4))
* **workflow:** update version in package.json ([e0037a7](https://github.com/fhswf/appointme/commit/e0037a7dde4aeaf4f4ed6c31958a4f050e0f94b3))
* yarn build/dependency management & docker ([5b491e6](https://github.com/fhswf/appointme/commit/5b491e6b0005db98837286b411d8de9a13fdbb7a))


### Features

* Add authentication and event controller tests and fix authentication flow. ([e9089d5](https://github.com/fhswf/appointme/commit/e9089d5d7153caaa7fb17fa0ce5868174f8aca41))
* **backend:** calender events ([6262e39](https://github.com/fhswf/appointme/commit/6262e394c914de06600c493fe406e1f0ee5ef49f))
* **backend:** CORS entry for appoint.gawron.cloud ([b0ed4b5](https://github.com/fhswf/appointme/commit/b0ed4b5364b266a80ddeeca7f733a16b4e6d003c))
* **backend:** store access token in cookie ([8241926](https://github.com/fhswf/appointme/commit/824192629bec518322d562578ba0451ef9b464d8))
* caldav integration ([ddc3773](https://github.com/fhswf/appointme/commit/ddc37730f4ccd50b57f70a60394276f3abd29273))
* caldav integration ([5b7fb4d](https://github.com/fhswf/appointme/commit/5b7fb4d62acd3ccb94e4da94dad1585d9df9c716))
* CalDAV integration ([3d42396](https://github.com/fhswf/appointme/commit/3d423964f8417aa8df136ed84c9bb92d6fb16024))
* **calendar:** allow guests to modify an event ([f815931](https://github.com/fhswf/appointme/commit/f81593101d2633a6d38f8bf8e532c6e42cb53945))
* docker build in release ([b6b7b43](https://github.com/fhswf/appointme/commit/b6b7b430ba6d05d73366f45f00e87f03bfadcfc4))
* docker build in release ([dc61033](https://github.com/fhswf/appointme/commit/dc61033d30f1cae5acef61feacd3afbe479ffabb))
* docker build in release ([845feae](https://github.com/fhswf/appointme/commit/845feae2e366527d28f6a65c869efbf96d0e7043))
* docker build in release ([d7ac528](https://github.com/fhswf/appointme/commit/d7ac5284923a7cac9a9ece4ef5ce6e7dff31ac61))
* docker build in release ([24dc4b2](https://github.com/fhswf/appointme/commit/24dc4b249ed6141caf9838b159e4a23d0a6e9b0a))
* docker build in release ([f8ad783](https://github.com/fhswf/appointme/commit/f8ad783b66842bef7a11217d42c556463ac97b40))
* docker build in release ([6b3d4f7](https://github.com/fhswf/appointme/commit/6b3d4f741eadfe376ec0bf285d3b6422570ea4a4))
* docker build in release ([75f655f](https://github.com/fhswf/appointme/commit/75f655f57953a5ebd1dc5e22164fe182f743840d))
* docker build in release ([45bb72f](https://github.com/fhswf/appointme/commit/45bb72f47bf7f0eb88f5ff6547a8cd67aed98496))
* docker build in release ([c87aab2](https://github.com/fhswf/appointme/commit/c87aab26f5f064bb30e592d7c4c08fbba04d75a4))
* docker build in release ([827d4c8](https://github.com/fhswf/appointme/commit/827d4c860f7c95425470cf5be48a0bf31a72b1b0))
* docker build in release ([072330c](https://github.com/fhswf/appointme/commit/072330c19ea33aee7775db346008ae0f0adeb0ce))
* docker build in release ([d60907c](https://github.com/fhswf/appointme/commit/d60907c8f9205fdc4efdd8582debe870b4964e18))
* docker build in release ([3bf3c12](https://github.com/fhswf/appointme/commit/3bf3c123c0e59618ced40eb5a5ae5192b20bb5fd))
* docker build in release ([5834136](https://github.com/fhswf/appointme/commit/5834136b16d3cdb20f89f450acab79f40a1ce739))
* docker build in release ([6bb006e](https://github.com/fhswf/appointme/commit/6bb006e04d0b6cc5829d680bca41c8c92235e5c8))
* **freeBusy:** check maxPerDay constraint ([2f4c391](https://github.com/fhswf/appointme/commit/2f4c3919be4616b0375044ac08ee411aa1fff544))
* **freeBusy:** freeBusy should observe minFuture and maxFuture restrictictions of an event ([93847d1](https://github.com/fhswf/appointme/commit/93847d15685d370bb58a4a19b522b72d24e946aa))
* Implement CSRF protection by adding a new CSRF service and integrating CSRF tokens into client requests and backend server logic. ([1ccd011](https://github.com/fhswf/appointme/commit/1ccd011a6cfbf7848db4479715c96533764de837))
* implement email event invitations with ICS attachments via new mailer utility. ([40a72c0](https://github.com/fhswf/appointme/commit/40a72c0bfc61a3c893cb60c48b8bf74c420c952a))
* Implement Google Calendar event insertion, improve free/busy time calculation, and add token revocation. ([c2e86b3](https://github.com/fhswf/appointme/commit/c2e86b34ae2923a598daa9e513c94a63926b4ccf))
* Implement per-user OAuth2Client creation with automatic token refresh and refine token update logic, adding new tests. ([19b0f8b](https://github.com/fhswf/appointme/commit/19b0f8bb57e807dd843e1a2c35bb49bc38cc07bc))
* improve test coverage ([04cb13a](https://github.com/fhswf/appointme/commit/04cb13a303fce553cb33226b912314cc6fa43f4f))
* Integrate `sonner` for client-side toast notifications, enhance backend authentication error handling, and update ESLint configuration. ([ec29e58](https://github.com/fhswf/appointme/commit/ec29e58aca49a9da67e7a6b6442015fbeae59514))
* Integrate CalDAV busy slot fetching into free slot calculation and improve environment variable loading. ([7983f06](https://github.com/fhswf/appointme/commit/7983f0612090a5628865bf4723c1575b6d6fd3a9))
* local development ([406bd5f](https://github.com/fhswf/appointme/commit/406bd5f219cd22420c0a4bffa16c73460828c91f))
* **logging:** use winston for logging ([6a0e299](https://github.com/fhswf/appointme/commit/6a0e2991e8859366f4a1b1a92683adbd7ebec36e))
* **logging:** use winston for logging ([1d6d130](https://github.com/fhswf/appointme/commit/1d6d130cf3942c1ce5943ef599f670b307f974da))
* **markdown:** handle event type description as markdown. ([87731b1](https://github.com/fhswf/appointme/commit/87731b1288460ebff551da5f77d5b080a799fc89))
* new rest api ([a8f823f](https://github.com/fhswf/appointme/commit/a8f823f8aec8116a302cf7e326f2edbc81b97218))
* new rest api ([f4e42c3](https://github.com/fhswf/appointme/commit/f4e42c3cad3202c54114fbbea64d4f7ca583c879))
* refactoring CORS & dev container ([75596f7](https://github.com/fhswf/appointme/commit/75596f70cf7cdc9bd2d061c7733971a74bda2ac0))
* store access token in cookie ([32daf4e](https://github.com/fhswf/appointme/commit/32daf4ea65d415c2bce5eb2d276829f6fca96bf8))
* store access token in cookie ([0d1e499](https://github.com/fhswf/appointme/commit/0d1e49926e85fed710456e8b241aaf307e74a3e2))
* ui improvements ([2cd8dfe](https://github.com/fhswf/appointme/commit/2cd8dfee5038775ebb1c122a5bab0a8a2ecd62c4))
* Update encryption algorithm from AES-256-CBC to AES-256-GCM. ([04ccf64](https://github.com/fhswf/appointme/commit/04ccf6496eab32d6df67155531448e3ee17b8c5f))

# backend [1.17.0](https://github.com/fhswf/appointme/compare/backend@1.16.0...backend@1.17.0) (2025-12-08)


### Bug Fixes

* **auth:** default for API_URL ([ff39be6](https://github.com/fhswf/appointme/commit/ff39be61286082a80562668360927eacd5fcbf0f))
* **auth:** default for API_URL ([a0da198](https://github.com/fhswf/appointme/commit/a0da1988df228c30e80cd2ed3c76ed89890531bf))
* **authentication:** remove client-accessible token ([3e371cc](https://github.com/fhswf/appointme/commit/3e371cc811581404e3d5e2ae3563e8f86880c4c4))
* automated docker build ([c1f2de3](https://github.com/fhswf/appointme/commit/c1f2de3cbd41a2c65f21a3d861901db710f6da65))
* **backend:** change type to module ([dc52879](https://github.com/fhswf/appointme/commit/dc52879130a7b0bd4d222670d228d7222f726c5c))
* **backend:** config warnings ([13b571a](https://github.com/fhswf/appointme/commit/13b571a1b48feef6f5b4c1da8de4f792485700e1))
* **backend:** import in test spec ([a2d997a](https://github.com/fhswf/appointme/commit/a2d997ad16b0bdbd8b82c1a19d9c849f219bf02c))
* **backend:** JWT_SECRET and email passwords ([63596b0](https://github.com/fhswf/appointme/commit/63596b02e3996bc721784954a4dc341b4446e07a))
* **backend:** quality improvement ([5cc5862](https://github.com/fhswf/appointme/commit/5cc58625aabf612078a4d725c4e0e5a3670b08cd))
* **backend:** token verification ([4172337](https://github.com/fhswf/appointme/commit/41723375ab877eead79c6b24bfed51da37819dbe))
* **backend:** typescript config ([06f4656](https://github.com/fhswf/appointme/commit/06f46565111fdd5b7d7c86f2d3d58aac3c523926))
* build backend image via gh action ([7226d2d](https://github.com/fhswf/appointme/commit/7226d2dd0ed040b082c30061fbe9f8ddd2560370))
* build backend image via gh action ([eec81e5](https://github.com/fhswf/appointme/commit/eec81e555588fd90177a300d99d7a1c117f30e0e))
* build backend image via gh action ([7a418a9](https://github.com/fhswf/appointme/commit/7a418a9609f7dd3f4a2acbb8563c72ddcd17e898))
* build backend image via gh action ([1d1a733](https://github.com/fhswf/appointme/commit/1d1a733a3ff55ce1746cb068c776cbf0a39fe4c6))
* **bump dependencies:** upgrade several dependencies ([39d06e3](https://github.com/fhswf/appointme/commit/39d06e3986ec8911d03cfe50286e6a09e494dbea))
* **client:** docker deployment & typing ([13ddc53](https://github.com/fhswf/appointme/commit/13ddc53aad4afb5bb627f35063b3f1c856c51424))
* **config:** update config values ([6ced70e](https://github.com/fhswf/appointme/commit/6ced70eba462830ce7d42c55ad75669a99e05fcb))
* controller should not return a promise ([2070fd5](https://github.com/fhswf/appointme/commit/2070fd56f195187ca35e03e838d9b259a6431710))
* correct api url configuration ([1c65124](https://github.com/fhswf/appointme/commit/1c6512411ed3a6cc2026b7c37fcb0f1192c3a8e6))
* CORS for debugging ([74f56f1](https://github.com/fhswf/appointme/commit/74f56f19ee966adb72db0120e00e9e8b058cea1a))
* deployment on appoint.gawron.cloud ([9023b45](https://github.com/fhswf/appointme/commit/9023b4517a11275bccd881597f3b3dbfd1f71cdd))
* **deployment:** resource limits ([e59b219](https://github.com/fhswf/appointme/commit/e59b219caf9dfc04b05d5d23a925afac430e303d))
* **deployment:** separate deployment & ingress config ([2cc83f5](https://github.com/fhswf/appointme/commit/2cc83f5f698c063c84f8515c82afa85d2e66e91f))
* **deployment:** update via semantic release ([8dd703e](https://github.com/fhswf/appointme/commit/8dd703ea931d01d4b1eaf911ee56e8c85f24a606))
* do not overwrite calendar settings upon login ([195f7fe](https://github.com/fhswf/appointme/commit/195f7fe0d8685f06b87a53f23336b4bee88dc605))
* do not update google tokens via user controller ([6c9eee3](https://github.com/fhswf/appointme/commit/6c9eee3ce070cf07ebad92e4d66020a07ade935c))
* dotenv config for backend ([714a7c0](https://github.com/fhswf/appointme/commit/714a7c06eeff750278a0fa6e851ff31798be362c))
* edit available times ([#5](https://github.com/fhswf/appointme/issues/5)) ([74f1d3a](https://github.com/fhswf/appointme/commit/74f1d3aab871a27b1f66dcf9e4854f0221c99b74))
* enable cookies for CORS requests ([c49e148](https://github.com/fhswf/appointme/commit/c49e1485b4faaebd6f2738733eacb20eca3fa0bd))
* enable cookies for CORS requests ([4a20b82](https://github.com/fhswf/appointme/commit/4a20b82bc48d2d511c5eef59960395bdfb961540))
* Enhance CalDAV error reporting and introduce a manual testing script for CalDAV integration. ([4fbb38b](https://github.com/fhswf/appointme/commit/4fbb38bab25af0aed6fc81b59a5748781e2b2a6a))
* freeBusy service corrected ([ff80003](https://github.com/fhswf/appointme/commit/ff8000327717a67a42b326c1acce906112bbb250))
* **freeBusy:** filter out free slots shorter than the event duration ([4179f8b](https://github.com/fhswf/appointme/commit/4179f8b8a2681a00a09919a9027a888c5f91fc8d))
* github actions for semantic release fixed ([7789df7](https://github.com/fhswf/appointme/commit/7789df7d31d491bd876ce2d93272f1c4c5452ced))
* improve quality ([c82d164](https://github.com/fhswf/appointme/commit/c82d164c48163ba884e602391492c3683a2bcad7))
* **insertEvent:** check availablility of requested slot in backend ([ddaa7f7](https://github.com/fhswf/appointme/commit/ddaa7f7088bfac17abff8f4d1706d8d2ebcdc0fe)), closes [#27](https://github.com/fhswf/appointme/issues/27)
* **k8s:** security settings ([5a4b1a4](https://github.com/fhswf/appointme/commit/5a4b1a4f4c87e231ea17ca9837a4638022565cfe))
* **logging:** log CORS config ([7872a72](https://github.com/fhswf/appointme/commit/7872a7255dcef772ec2242745326e56ad291e6e4))
* **logging:** log CORS config ([c9b7cc0](https://github.com/fhswf/appointme/commit/c9b7cc019391160a4cc05ef63be069e52247d9fa))
* make redirect URL configurable ([4ceea0c](https://github.com/fhswf/appointme/commit/4ceea0c4e26599b758402cc96b23eac9c62b72aa))
* Migrate to Google Sign In ([fcda431](https://github.com/fhswf/appointme/commit/fcda431c95c118368a5e1a4abed2ad7eee5cc2b7))
* module deps ([1e746bb](https://github.com/fhswf/appointme/commit/1e746bb38f6ea4242ba4a379ab761d7ffc46c361))
* module import ([6a42b74](https://github.com/fhswf/appointme/commit/6a42b7490f4153a95c8c11a5814c07a1acc7523d))
* module import ([36b1f5b](https://github.com/fhswf/appointme/commit/36b1f5be7ed35abdf6b53ef581841a310a537a11))
* module resolution ([6b3eb2d](https://github.com/fhswf/appointme/commit/6b3eb2d032a7349c117ff738dd1c84c00e00d9e3))
* module resolution ([fdd128e](https://github.com/fhswf/appointme/commit/fdd128ee14ca2855c15b9353400166cd7fd3943f))
* multi-release ([0e18282](https://github.com/fhswf/appointme/commit/0e18282ceac0b39840802682101c132c8896eec2))
* multi-release ([8ab5317](https://github.com/fhswf/appointme/commit/8ab531792d16509166c49b3aba82d242d41ed500))
* rate limiting ([c3c89bd](https://github.com/fhswf/appointme/commit/c3c89bd6b7411c40d415f2a0deb5a65af1fa6cf0))
* redirect to calendar integration ([e305329](https://github.com/fhswf/appointme/commit/e305329a86cc80158ad604940c045261ff9bd4c2))
* redirect to calendar integration ([89f8597](https://github.com/fhswf/appointme/commit/89f85972fb8e4c30eaece662db1c559e12960286))
* refactor event controller ([b3eb06e](https://github.com/fhswf/appointme/commit/b3eb06e30bbec8b29094d00131deff4bff0ea8d0))
* refactor event controller ([c94aec7](https://github.com/fhswf/appointme/commit/c94aec7ed60bb0868cce158cb643a8ce45b00e12))
* refactor user type ([991dd29](https://github.com/fhswf/appointme/commit/991dd2924d71373ed667ca862aa36d6245021d20))
* remove unused routes ([a29a54e](https://github.com/fhswf/appointme/commit/a29a54e995d66054b42979e1bf2dc6b1f2f1afda))
* resource limits ([04b261c](https://github.com/fhswf/appointme/commit/04b261c4f9738f4d173feaf5c929f22147703bf0))
* security updates ([f96e262](https://github.com/fhswf/appointme/commit/f96e26276bf4a0dc5013971c4094ee3a64fbdcf7))
* **security:** enforce TLS with nodemailer ([bfbfa5f](https://github.com/fhswf/appointme/commit/bfbfa5fd6bceb9147dc0eb35f41d8ba89d761b96))
* **security:** remove password attribute ([a1fb3e5](https://github.com/fhswf/appointme/commit/a1fb3e5abdacd6037a76ee24b357c71658162f18))
* **security:** remove secret from docker image ([0c9d6f3](https://github.com/fhswf/appointme/commit/0c9d6f3940153244c16fb6f3b23bd437049e7cd9))
* semantic release config ([b638ae1](https://github.com/fhswf/appointme/commit/b638ae1bf1f34ba6283a7ab61de5eaf406a27e20))
* semantic-release config ([e6b7a13](https://github.com/fhswf/appointme/commit/e6b7a1326964a2a7b5f3d088386e60deb6a3b077))
* set domain for cookie ([c876638](https://github.com/fhswf/appointme/commit/c8766385d00388a332b5bcf0f633db65c2954c0b))
* set sameSite: lax in development ([6a18a47](https://github.com/fhswf/appointme/commit/6a18a47fb53f4f0da65b95e1362296da43a29f2e))
* set sameSite: none in development ([bc3279d](https://github.com/fhswf/appointme/commit/bc3279d42a148be61374d6b044221853f26c13a3))
* sonarqube issues ([9f61182](https://github.com/fhswf/appointme/commit/9f6118235ffc9868413403b21cac0a36b1bac8e4))
* sonarqube issues ([e5d870b](https://github.com/fhswf/appointme/commit/e5d870b40da04c12cc277c1cdcfede15ddd09913))
* sonarqube issues ([89c0456](https://github.com/fhswf/appointme/commit/89c0456526614a2e10976ce45706baa5489c9d21))
* **test:** coverage for cypress tests ([ec5499d](https://github.com/fhswf/appointme/commit/ec5499d6b909a7e04010b7fb5b97aa8c30d16a8b))
* **test:** coverage for cypress tests ([505550d](https://github.com/fhswf/appointme/commit/505550dfd722a13a13c1568990602df982cec66e))
* testing ([d74b86f](https://github.com/fhswf/appointme/commit/d74b86ff227c26cc6e1e1d40b92b32c2fc3c6a63))
* **test:** mock google calendar ([ffc15fb](https://github.com/fhswf/appointme/commit/ffc15fba1453368bd35489c879c00ddc59d76869))
* **test:** test before sonarqube analysis ([50a3389](https://github.com/fhswf/appointme/commit/50a33892f69f3c0a82f8fb77d6c07b95a0dcc6b0))
* **test:** test before sonarqube analysis ([a5d856f](https://github.com/fhswf/appointme/commit/a5d856f1f4b55f543e5d3e21840fdad2001cff0d))
* **test:** test before sonarqube analysis ([a6d28c6](https://github.com/fhswf/appointme/commit/a6d28c6e4e3017c9716f2328e784fadc7c30550c))
* **test:** test before sonarqube analysis ([966b558](https://github.com/fhswf/appointme/commit/966b558099ccf7ec09f30c8676c0b1e9ba9cc9c1))
* **test:** version & config updates ([266684c](https://github.com/fhswf/appointme/commit/266684cc69a162ee968ac3ebcce8613df1f25244))
* transfer timestamp as integer ([4753bd4](https://github.com/fhswf/appointme/commit/4753bd45e879a5f1f56748cedfc8a92c12a938a4))
* typescript issues ([15a4cc1](https://github.com/fhswf/appointme/commit/15a4cc1c5caf2c14d4d4c0a60695c155b08f6d57))
* UI glitches fixed ([14783e1](https://github.com/fhswf/appointme/commit/14783e13cd00b7e3d05aac64354ca30157a679c0))
* **ui:** changes for vite & mui 6 ([6fc7016](https://github.com/fhswf/appointme/commit/6fc701620d3c9931cbc072e62fb375a96928080d))
* update docker build to use yarn ([5b5ed89](https://github.com/fhswf/appointme/commit/5b5ed8996b9e9a6fb6386da935a4f8c95d878251))
* **workflow:** delete obsolete workflow files ([7fa0e67](https://github.com/fhswf/appointme/commit/7fa0e678227763bbc0c02efd9dbf2c3fad7435d4))
* **workflow:** update version in package.json ([e0037a7](https://github.com/fhswf/appointme/commit/e0037a7dde4aeaf4f4ed6c31958a4f050e0f94b3))
* yarn build/dependency management & docker ([5b491e6](https://github.com/fhswf/appointme/commit/5b491e6b0005db98837286b411d8de9a13fdbb7a))


### Features

* Add authentication and event controller tests and fix authentication flow. ([e9089d5](https://github.com/fhswf/appointme/commit/e9089d5d7153caaa7fb17fa0ce5868174f8aca41))
* **backend:** calender events ([6262e39](https://github.com/fhswf/appointme/commit/6262e394c914de06600c493fe406e1f0ee5ef49f))
* **backend:** CORS entry for appoint.gawron.cloud ([b0ed4b5](https://github.com/fhswf/appointme/commit/b0ed4b5364b266a80ddeeca7f733a16b4e6d003c))
* **backend:** store access token in cookie ([8241926](https://github.com/fhswf/appointme/commit/824192629bec518322d562578ba0451ef9b464d8))
* caldav integration ([ddc3773](https://github.com/fhswf/appointme/commit/ddc37730f4ccd50b57f70a60394276f3abd29273))
* caldav integration ([5b7fb4d](https://github.com/fhswf/appointme/commit/5b7fb4d62acd3ccb94e4da94dad1585d9df9c716))
* CalDAV integration ([3d42396](https://github.com/fhswf/appointme/commit/3d423964f8417aa8df136ed84c9bb92d6fb16024))
* **calendar:** allow guests to modify an event ([f815931](https://github.com/fhswf/appointme/commit/f81593101d2633a6d38f8bf8e532c6e42cb53945))
* docker build in release ([b6b7b43](https://github.com/fhswf/appointme/commit/b6b7b430ba6d05d73366f45f00e87f03bfadcfc4))
* docker build in release ([dc61033](https://github.com/fhswf/appointme/commit/dc61033d30f1cae5acef61feacd3afbe479ffabb))
* docker build in release ([845feae](https://github.com/fhswf/appointme/commit/845feae2e366527d28f6a65c869efbf96d0e7043))
* docker build in release ([d7ac528](https://github.com/fhswf/appointme/commit/d7ac5284923a7cac9a9ece4ef5ce6e7dff31ac61))
* docker build in release ([24dc4b2](https://github.com/fhswf/appointme/commit/24dc4b249ed6141caf9838b159e4a23d0a6e9b0a))
* docker build in release ([f8ad783](https://github.com/fhswf/appointme/commit/f8ad783b66842bef7a11217d42c556463ac97b40))
* docker build in release ([6b3d4f7](https://github.com/fhswf/appointme/commit/6b3d4f741eadfe376ec0bf285d3b6422570ea4a4))
* docker build in release ([75f655f](https://github.com/fhswf/appointme/commit/75f655f57953a5ebd1dc5e22164fe182f743840d))
* docker build in release ([45bb72f](https://github.com/fhswf/appointme/commit/45bb72f47bf7f0eb88f5ff6547a8cd67aed98496))
* docker build in release ([c87aab2](https://github.com/fhswf/appointme/commit/c87aab26f5f064bb30e592d7c4c08fbba04d75a4))
* docker build in release ([827d4c8](https://github.com/fhswf/appointme/commit/827d4c860f7c95425470cf5be48a0bf31a72b1b0))
* docker build in release ([072330c](https://github.com/fhswf/appointme/commit/072330c19ea33aee7775db346008ae0f0adeb0ce))
* docker build in release ([d60907c](https://github.com/fhswf/appointme/commit/d60907c8f9205fdc4efdd8582debe870b4964e18))
* docker build in release ([3bf3c12](https://github.com/fhswf/appointme/commit/3bf3c123c0e59618ced40eb5a5ae5192b20bb5fd))
* docker build in release ([5834136](https://github.com/fhswf/appointme/commit/5834136b16d3cdb20f89f450acab79f40a1ce739))
* docker build in release ([6bb006e](https://github.com/fhswf/appointme/commit/6bb006e04d0b6cc5829d680bca41c8c92235e5c8))
* **freeBusy:** check maxPerDay constraint ([2f4c391](https://github.com/fhswf/appointme/commit/2f4c3919be4616b0375044ac08ee411aa1fff544))
* **freeBusy:** freeBusy should observe minFuture and maxFuture restrictictions of an event ([93847d1](https://github.com/fhswf/appointme/commit/93847d15685d370bb58a4a19b522b72d24e946aa))
* Implement CSRF protection by adding a new CSRF service and integrating CSRF tokens into client requests and backend server logic. ([1ccd011](https://github.com/fhswf/appointme/commit/1ccd011a6cfbf7848db4479715c96533764de837))
* implement email event invitations with ICS attachments via new mailer utility. ([40a72c0](https://github.com/fhswf/appointme/commit/40a72c0bfc61a3c893cb60c48b8bf74c420c952a))
* Implement Google Calendar event insertion, improve free/busy time calculation, and add token revocation. ([c2e86b3](https://github.com/fhswf/appointme/commit/c2e86b34ae2923a598daa9e513c94a63926b4ccf))
* Implement per-user OAuth2Client creation with automatic token refresh and refine token update logic, adding new tests. ([19b0f8b](https://github.com/fhswf/appointme/commit/19b0f8bb57e807dd843e1a2c35bb49bc38cc07bc))
* improve test coverage ([04cb13a](https://github.com/fhswf/appointme/commit/04cb13a303fce553cb33226b912314cc6fa43f4f))
* Integrate `sonner` for client-side toast notifications, enhance backend authentication error handling, and update ESLint configuration. ([ec29e58](https://github.com/fhswf/appointme/commit/ec29e58aca49a9da67e7a6b6442015fbeae59514))
* Integrate CalDAV busy slot fetching into free slot calculation and improve environment variable loading. ([7983f06](https://github.com/fhswf/appointme/commit/7983f0612090a5628865bf4723c1575b6d6fd3a9))
* local development ([406bd5f](https://github.com/fhswf/appointme/commit/406bd5f219cd22420c0a4bffa16c73460828c91f))
* **logging:** use winston for logging ([6a0e299](https://github.com/fhswf/appointme/commit/6a0e2991e8859366f4a1b1a92683adbd7ebec36e))
* **logging:** use winston for logging ([1d6d130](https://github.com/fhswf/appointme/commit/1d6d130cf3942c1ce5943ef599f670b307f974da))
* **markdown:** handle event type description as markdown. ([87731b1](https://github.com/fhswf/appointme/commit/87731b1288460ebff551da5f77d5b080a799fc89))
* new rest api ([a8f823f](https://github.com/fhswf/appointme/commit/a8f823f8aec8116a302cf7e326f2edbc81b97218))
* new rest api ([f4e42c3](https://github.com/fhswf/appointme/commit/f4e42c3cad3202c54114fbbea64d4f7ca583c879))
* refactoring CORS & dev container ([75596f7](https://github.com/fhswf/appointme/commit/75596f70cf7cdc9bd2d061c7733971a74bda2ac0))
* store access token in cookie ([32daf4e](https://github.com/fhswf/appointme/commit/32daf4ea65d415c2bce5eb2d276829f6fca96bf8))
* store access token in cookie ([0d1e499](https://github.com/fhswf/appointme/commit/0d1e49926e85fed710456e8b241aaf307e74a3e2))
* ui improvements ([2cd8dfe](https://github.com/fhswf/appointme/commit/2cd8dfee5038775ebb1c122a5bab0a8a2ecd62c4))





### Dependencies

* **common:** upgraded to 1.3.0

# backend [1.16.0](https://github.com/fhswf/appointme/compare/backend@1.15.0...backend@1.16.0) (2025-12-04)


### Features

* Add authentication and event controller tests and fix authentication flow. ([ac27ac6](https://github.com/fhswf/appointme/commit/ac27ac6c16249b338c97f7d9ca54693b59d18bb8))

# backend [1.15.0](https://github.com/fhswf/appointme/compare/backend@1.14.0...backend@1.15.0) (2025-12-03)


### Features

* Implement CSRF protection by adding a new CSRF service and integrating CSRF tokens into client requests and backend server logic. ([ddb896e](https://github.com/fhswf/appointme/commit/ddb896e41b7bac29fb67f24b3ba2f1db728c8a6d))
* Implement Google Calendar event insertion, improve free/busy time calculation, and add token revocation. ([86ea2b8](https://github.com/fhswf/appointme/commit/86ea2b854fac7168b23d80711cd37e652f3eb0cc))
* Implement per-user OAuth2Client creation with automatic token refresh and refine token update logic, adding new tests. ([6d6f304](https://github.com/fhswf/appointme/commit/6d6f3041fde4fa001605da8a03c87df5bee5b6ea))





### Dependencies

* **common:** upgraded to 1.2.0

# backend [1.14.0](https://github.com/fhswf/appointme/compare/backend@1.13.0...backend@1.14.0) (2024-11-04)


### Bug Fixes

* remove unused routes ([87eb614](https://github.com/fhswf/appointme/commit/87eb6142a119fc359b1753278f1ca253e1790288))
* set domain for cookie ([ff919ee](https://github.com/fhswf/appointme/commit/ff919eeba9069edf1a0fa2590b965b7358c1e8a1))
* **test:** mock google calendar ([272fdcb](https://github.com/fhswf/appointme/commit/272fdcbc44783090785b6f4940bb9b92fd9fec1d))


### Features

* **logging:** use winston for logging ([7b865d3](https://github.com/fhswf/appointme/commit/7b865d38b61382cca0f9bcab6c3a44636436e581))
* **logging:** use winston for logging ([b1c8ac0](https://github.com/fhswf/appointme/commit/b1c8ac041e6891ef8c3b45e4847f6d225753d41a))

# backend [1.13.0](https://github.com/fhswf/appointme/compare/backend@1.12.0...backend@1.13.0) (2024-10-17)


### Features

* new rest api ([93ec39b](https://github.com/fhswf/appointme/commit/93ec39bedfe704cf6c26ba72078b108c7498248a))

# backend [1.12.0](https://github.com/fhswf/appointme/compare/backend@1.11.9...backend@1.12.0) (2024-10-16)


### Bug Fixes

* rate limiting ([229aa17](https://github.com/fhswf/appointme/commit/229aa17f2acbab0105ade1b9a6daa6dfbee1074f))


### Features

* new rest api ([6e5a9d3](https://github.com/fhswf/appointme/commit/6e5a9d3c3ab928a020e166e09be89c713c7cdd3f))

## backend [1.11.9](https://github.com/fhswf/appointme/compare/backend@1.11.8...backend@1.11.9) (2024-10-16)


### Bug Fixes

* improve quality ([f22c507](https://github.com/fhswf/appointme/commit/f22c507b8afa1939c1735b4b62a7ebea42dc2e36))
* refactor event controller ([085d544](https://github.com/fhswf/appointme/commit/085d5446af0d8f07e7ca06762acf2c83932b89f8))
* refactor event controller ([acac350](https://github.com/fhswf/appointme/commit/acac350b725d770f73f501e593852de375276893))

## backend [1.11.8](https://github.com/fhswf/appointme/compare/backend@1.11.7...backend@1.11.8) (2024-10-15)


### Bug Fixes

* set sameSite: none in development ([28c9152](https://github.com/fhswf/appointme/commit/28c91520a6c1551f2c09b8627a48f111cc64a0c9))

## backend [1.11.7](https://github.com/fhswf/appointme/compare/backend@1.11.6...backend@1.11.7) (2024-10-15)


### Bug Fixes

* set sameSite: lax in development ([b7229b0](https://github.com/fhswf/appointme/commit/b7229b072f5bd06ebd3a514ce843496ae044167b))

## backend [1.11.6](https://github.com/fhswf/appointme/compare/backend@1.11.5...backend@1.11.6) (2024-10-15)


### Bug Fixes

* **authentication:** remove client-accessible token ([65171ef](https://github.com/fhswf/appointme/commit/65171ef3dcea85e637eebbb7901d10c4a3769e53))

## backend [1.11.5](https://github.com/fhswf/appointme/compare/backend@1.11.4...backend@1.11.5) (2024-10-14)


### Bug Fixes

* redirect to calendar integration ([cb9338b](https://github.com/fhswf/appointme/commit/cb9338b85220cffc0cf8bcb4d2cf9cc773d1b5cc))

## backend [1.11.4](https://github.com/fhswf/appointme/compare/backend@1.11.3...backend@1.11.4) (2024-10-14)


### Bug Fixes

* redirect to calendar integration ([5e9563d](https://github.com/fhswf/appointme/commit/5e9563d483e10b4cd048e8949d3cb9f12fbb9b7f))

## backend [1.11.3](https://github.com/fhswf/appointme/compare/backend@1.11.2...backend@1.11.3) (2024-10-11)


### Bug Fixes

* enable cookies for CORS requests ([3b5b5dc](https://github.com/fhswf/appointme/commit/3b5b5dc41c7b666874dd2f97b5f4298bccf0d792))

## backend [1.11.2](https://github.com/fhswf/appointme/compare/backend@1.11.1...backend@1.11.2) (2024-10-11)


### Bug Fixes

* enable cookies for CORS requests ([0188059](https://github.com/fhswf/appointme/commit/0188059edf52d5eeb8c0cab06ffa2caeb8bebc65))

## backend [1.11.1](https://github.com/fhswf/appointme/compare/backend@1.11.0...backend@1.11.1) (2024-10-11)


### Bug Fixes

* testing ([7e1022c](https://github.com/fhswf/appointme/commit/7e1022c848a7f7cf7033e2610326b8d38197321b))

# backend [1.11.0](https://github.com/fhswf/appointme/compare/backend@1.10.0...backend@1.11.0) (2024-10-11)


### Bug Fixes

* **backend:** import in test spec ([88c78d8](https://github.com/fhswf/appointme/commit/88c78d828c3023a257ef37941799c93911a42add))


### Features

* **backend:** store access token in cookie ([3b58072](https://github.com/fhswf/appointme/commit/3b58072ded26205ba01edaaf951aebc2012125fd))
* store access token in cookie ([27990d7](https://github.com/fhswf/appointme/commit/27990d7e86de82d3f6d5e9ba97e4f785e9e26ea2))

# backend [1.11.0](https://github.com/fhswf/appointme/compare/backend@1.10.0...backend@1.11.0) (2024-10-11)


### Features

* **backend:** store access token in cookie ([3b58072](https://github.com/fhswf/appointme/commit/3b58072ded26205ba01edaaf951aebc2012125fd))
* store access token in cookie ([27990d7](https://github.com/fhswf/appointme/commit/27990d7e86de82d3f6d5e9ba97e4f785e9e26ea2))

# backend [1.10.0](https://github.com/fhswf/appointme/compare/backend@1.9.0...backend@1.10.0) (2024-10-10)


### Features

* store access token in cookie ([fbd2706](https://github.com/fhswf/appointme/commit/fbd27066b4e3d016c4053197b551d46555df68c1))

# backend [1.9.0](https://github.com/fhswf/appointme/compare/backend@1.8.0...backend@1.9.0) (2024-10-09)


### Features

* **calendar:** allow guests to modify an event ([dbba656](https://github.com/fhswf/appointme/commit/dbba6566db19783759f980ede8463b81246d4f2f))

# backend [1.8.0](https://github.com/fhswf/appointme/compare/backend@1.7.17...backend@1.8.0) (2024-10-09)


### Features

* **backend:** calender events ([beaa138](https://github.com/fhswf/appointme/commit/beaa138df7112321dbe30a9e809d43c3d56b992a))

## backend [1.7.17](https://github.com/fhswf/appointme/compare/backend@1.7.16...backend@1.7.17) (2024-10-09)





### Dependencies

* **common:** upgraded to 1.1.11

## backend [1.7.16](https://github.com/fhswf/appointme/compare/backend@1.7.15...backend@1.7.16) (2024-10-09)





### Dependencies

* **common:** upgraded to 1.1.10

## backend [1.7.15](https://github.com/fhswf/appointme/compare/backend@1.7.14...backend@1.7.15) (2024-10-09)





### Dependencies

* **common:** upgraded to 1.1.9

## backend [1.7.14](https://github.com/fhswf/appointme/compare/backend@1.7.13...backend@1.7.14) (2024-10-09)





### Dependencies

* **common:** upgraded to 1.1.8

## backend [1.7.13](https://github.com/fhswf/appointme/compare/backend@1.7.12...backend@1.7.13) (2024-10-08)


### Bug Fixes

* **security:** enforce TLS with nodemailer ([0777972](https://github.com/fhswf/appointme/commit/07779728b5a807ed3b755887ddbf4b866bcd5852))

## backend [1.7.12](https://github.com/fhswf/appointme/compare/backend@1.7.11...backend@1.7.12) (2024-10-08)


### Bug Fixes

* module import ([40234c5](https://github.com/fhswf/appointme/commit/40234c5bd91cbc50a8c8fe2db999aa334a4eff80))
* module import ([22e6605](https://github.com/fhswf/appointme/commit/22e6605fdf3e6a4022976a3fd0d098bbd49d1107))

## backend [1.7.12](https://github.com/fhswf/appointme/compare/backend@1.7.11...backend@1.7.12) (2024-10-08)


### Bug Fixes

* module import ([22e6605](https://github.com/fhswf/appointme/commit/22e6605fdf3e6a4022976a3fd0d098bbd49d1107))

## backend [1.7.11](https://github.com/fhswf/appointme/compare/backend@1.7.10...backend@1.7.11) (2024-10-08)


### Bug Fixes

* **auth:** default for API_URL ([0698329](https://github.com/fhswf/appointme/commit/0698329f4b7b208293bcf2ae63e7cb4cd9f037ad))
* **auth:** default for API_URL ([23b8df9](https://github.com/fhswf/appointme/commit/23b8df9cd31dc512491299e3021bf6109cd909f2))
* **deployment:** resource limits ([b9fc3d2](https://github.com/fhswf/appointme/commit/b9fc3d2f38b4c0490542f7d874307fd528627743))
* **k8s:** security settings ([311c449](https://github.com/fhswf/appointme/commit/311c44912ca9dd82533ef1855cb1b3b5b0b99cd2))
* refactor user type ([09abe71](https://github.com/fhswf/appointme/commit/09abe7130e4d380985572f8535924c439bad13d4))
* resource limits ([4f26ed7](https://github.com/fhswf/appointme/commit/4f26ed7a5cc35d19f8a8c740c91e4907a274b442))
* **security:** remove password attribute ([79c4584](https://github.com/fhswf/appointme/commit/79c4584e57c0f462c82ec3640fbd6b13faaeb311))
* sonarqube issues ([6c8e66d](https://github.com/fhswf/appointme/commit/6c8e66d181f1f902583db3445bc99574164db68b))
* sonarqube issues ([3f05807](https://github.com/fhswf/appointme/commit/3f05807085837e747e90ced0e4aeaafe0e9cc5d4))
* sonarqube issues ([3e28fd5](https://github.com/fhswf/appointme/commit/3e28fd51cd5fe5e89144c5df70a8c1394d31a021))
* **test:** coverage for cypress tests ([353638e](https://github.com/fhswf/appointme/commit/353638ecc49079b9fae69cda835c80fb66acba3e))
* **test:** coverage for cypress tests ([542cf93](https://github.com/fhswf/appointme/commit/542cf93830992589da7b68ca4d48d8a47f15bf80))
* **test:** test before sonarqube analysis ([d91fa5d](https://github.com/fhswf/appointme/commit/d91fa5d79ac2494b9f4e2f5ad76105897b4a6dab))
* **test:** test before sonarqube analysis ([c12d1e5](https://github.com/fhswf/appointme/commit/c12d1e58fcac663bd28f7c3476cf8df289c65b7c))
* **test:** test before sonarqube analysis ([a7ce602](https://github.com/fhswf/appointme/commit/a7ce602f1a7b81d51f181f40d874a50a364154a1))
* **test:** test before sonarqube analysis ([eb7b3bc](https://github.com/fhswf/appointme/commit/eb7b3bc9c313d5378324f728c8a0b088a34e8469))
* **test:** version & config updates ([0dbd7fd](https://github.com/fhswf/appointme/commit/0dbd7fdc9e79db5269f849912ccb91a16bebb618))

## backend [1.7.11](https://github.com/fhswf/appointme/compare/backend@1.7.10...backend@1.7.11) (2024-10-08)


### Bug Fixes

* **auth:** default for API_URL ([0698329](https://github.com/fhswf/appointme/commit/0698329f4b7b208293bcf2ae63e7cb4cd9f037ad))
* **auth:** default for API_URL ([23b8df9](https://github.com/fhswf/appointme/commit/23b8df9cd31dc512491299e3021bf6109cd909f2))
* **deployment:** resource limits ([b9fc3d2](https://github.com/fhswf/appointme/commit/b9fc3d2f38b4c0490542f7d874307fd528627743))
* **k8s:** security settings ([311c449](https://github.com/fhswf/appointme/commit/311c44912ca9dd82533ef1855cb1b3b5b0b99cd2))
* resource limits ([4f26ed7](https://github.com/fhswf/appointme/commit/4f26ed7a5cc35d19f8a8c740c91e4907a274b442))
* **security:** remove password attribute ([79c4584](https://github.com/fhswf/appointme/commit/79c4584e57c0f462c82ec3640fbd6b13faaeb311))
* sonarqube issues ([6c8e66d](https://github.com/fhswf/appointme/commit/6c8e66d181f1f902583db3445bc99574164db68b))
* sonarqube issues ([3f05807](https://github.com/fhswf/appointme/commit/3f05807085837e747e90ced0e4aeaafe0e9cc5d4))
* sonarqube issues ([3e28fd5](https://github.com/fhswf/appointme/commit/3e28fd51cd5fe5e89144c5df70a8c1394d31a021))
* **test:** coverage for cypress tests ([353638e](https://github.com/fhswf/appointme/commit/353638ecc49079b9fae69cda835c80fb66acba3e))
* **test:** coverage for cypress tests ([542cf93](https://github.com/fhswf/appointme/commit/542cf93830992589da7b68ca4d48d8a47f15bf80))
* **test:** test before sonarqube analysis ([d91fa5d](https://github.com/fhswf/appointme/commit/d91fa5d79ac2494b9f4e2f5ad76105897b4a6dab))
* **test:** test before sonarqube analysis ([c12d1e5](https://github.com/fhswf/appointme/commit/c12d1e58fcac663bd28f7c3476cf8df289c65b7c))
* **test:** test before sonarqube analysis ([a7ce602](https://github.com/fhswf/appointme/commit/a7ce602f1a7b81d51f181f40d874a50a364154a1))
* **test:** test before sonarqube analysis ([eb7b3bc](https://github.com/fhswf/appointme/commit/eb7b3bc9c313d5378324f728c8a0b088a34e8469))
* **test:** version & config updates ([0dbd7fd](https://github.com/fhswf/appointme/commit/0dbd7fdc9e79db5269f849912ccb91a16bebb618))





### Dependencies

* **common:** upgraded to 1.1.7

## backend [1.7.11](https://github.com/fhswf/appointme/compare/backend@1.7.10...backend@1.7.11) (2024-10-04)


### Bug Fixes

* **auth:** default for API_URL ([0698329](https://github.com/fhswf/appointme/commit/0698329f4b7b208293bcf2ae63e7cb4cd9f037ad))
* **auth:** default for API_URL ([23b8df9](https://github.com/fhswf/appointme/commit/23b8df9cd31dc512491299e3021bf6109cd909f2))
* **deployment:** resource limits ([b9fc3d2](https://github.com/fhswf/appointme/commit/b9fc3d2f38b4c0490542f7d874307fd528627743))
* **k8s:** security settings ([311c449](https://github.com/fhswf/appointme/commit/311c44912ca9dd82533ef1855cb1b3b5b0b99cd2))
* sonarqube issues ([3f05807](https://github.com/fhswf/appointme/commit/3f05807085837e747e90ced0e4aeaafe0e9cc5d4))
* sonarqube issues ([3e28fd5](https://github.com/fhswf/appointme/commit/3e28fd51cd5fe5e89144c5df70a8c1394d31a021))
* **test:** test before sonarqube analysis ([d91fa5d](https://github.com/fhswf/appointme/commit/d91fa5d79ac2494b9f4e2f5ad76105897b4a6dab))
* **test:** test before sonarqube analysis ([c12d1e5](https://github.com/fhswf/appointme/commit/c12d1e58fcac663bd28f7c3476cf8df289c65b7c))
* **test:** test before sonarqube analysis ([a7ce602](https://github.com/fhswf/appointme/commit/a7ce602f1a7b81d51f181f40d874a50a364154a1))
* **test:** test before sonarqube analysis ([eb7b3bc](https://github.com/fhswf/appointme/commit/eb7b3bc9c313d5378324f728c8a0b088a34e8469))
* **test:** version & config updates ([0dbd7fd](https://github.com/fhswf/appointme/commit/0dbd7fdc9e79db5269f849912ccb91a16bebb618))

## backend [1.7.11](https://github.com/fhswf/appointme/compare/backend@1.7.10...backend@1.7.11) (2024-10-04)


### Bug Fixes

* **auth:** default for API_URL ([0698329](https://github.com/fhswf/appointme/commit/0698329f4b7b208293bcf2ae63e7cb4cd9f037ad))
* **auth:** default for API_URL ([23b8df9](https://github.com/fhswf/appointme/commit/23b8df9cd31dc512491299e3021bf6109cd909f2))
* **deployment:** resource limits ([b9fc3d2](https://github.com/fhswf/appointme/commit/b9fc3d2f38b4c0490542f7d874307fd528627743))
* **k8s:** security settings ([311c449](https://github.com/fhswf/appointme/commit/311c44912ca9dd82533ef1855cb1b3b5b0b99cd2))
* sonarqube issues ([3f05807](https://github.com/fhswf/appointme/commit/3f05807085837e747e90ced0e4aeaafe0e9cc5d4))
* sonarqube issues ([3e28fd5](https://github.com/fhswf/appointme/commit/3e28fd51cd5fe5e89144c5df70a8c1394d31a021))
* **test:** test before sonarqube analysis ([d91fa5d](https://github.com/fhswf/appointme/commit/d91fa5d79ac2494b9f4e2f5ad76105897b4a6dab))
* **test:** test before sonarqube analysis ([c12d1e5](https://github.com/fhswf/appointme/commit/c12d1e58fcac663bd28f7c3476cf8df289c65b7c))
* **test:** test before sonarqube analysis ([a7ce602](https://github.com/fhswf/appointme/commit/a7ce602f1a7b81d51f181f40d874a50a364154a1))
* **test:** test before sonarqube analysis ([eb7b3bc](https://github.com/fhswf/appointme/commit/eb7b3bc9c313d5378324f728c8a0b088a34e8469))
* **test:** version & config updates ([0dbd7fd](https://github.com/fhswf/appointme/commit/0dbd7fdc9e79db5269f849912ccb91a16bebb618))

## backend [1.7.10](https://github.com/fhswf/appointme/compare/backend@1.7.9...backend@1.7.10) (2024-09-29)


### Bug Fixes

* deployment on appoint.gawron.cloud ([ecf8498](https://github.com/fhswf/appointme/commit/ecf849879389344b76d398913dc205203fd83668))

## backend [1.7.9](https://github.com/fhswf/appointme/compare/backend@1.7.8...backend@1.7.9) (2024-09-24)


### Bug Fixes

* module resolution ([c2f37d6](https://github.com/fhswf/appointme/commit/c2f37d645eeab8bc85301736d24304f198f7496e))
* module resolution ([6263324](https://github.com/fhswf/appointme/commit/6263324b72feff539720dffd264891b8dbd4b52d))





### Dependencies

* **common:** upgraded to 1.1.5

## backend [1.7.8](https://github.com/fhswf/appointme/compare/backend@1.7.7...backend@1.7.8) (2024-09-24)


### Bug Fixes

* **backend:** change type to module ([f80c257](https://github.com/fhswf/appointme/commit/f80c25736bfc9be332b35d704fd976712fbba119))

## backend [1.7.7](https://github.com/fhswf/appointme/compare/backend@1.7.6...backend@1.7.7) (2024-09-24)


### Bug Fixes

* **ui:** changes for vite & mui 6 ([2aab61e](https://github.com/fhswf/appointme/commit/2aab61e7b67692c40872960b9f4d6fad35e239f9))





### Dependencies

* **common:** upgraded to 1.1.3

## backend [1.7.6](https://github.com/fhswf/appointme/compare/backend@1.7.5...backend@1.7.6) (2024-09-24)


### Bug Fixes

* module deps ([d12fc5b](https://github.com/fhswf/appointme/commit/d12fc5b4db2447ea0db16519964797a023fd549d))

## backend [1.7.5](https://github.com/fhswf/appointme/compare/backend@1.7.4...backend@1.7.5) (2024-09-24)


### Bug Fixes

* CORS for debugging ([59b7983](https://github.com/fhswf/appointme/commit/59b798336f7959bd77e5ad2b35ad23244bc95847))

## backend [1.7.4](https://github.com/fhswf/appointme/compare/backend@1.7.3...backend@1.7.4) (2024-09-23)


### Bug Fixes

* **config:** update config values ([a2d2e63](https://github.com/fhswf/appointme/commit/a2d2e639d3667c186142fcd6f6b7d28823551680))

## backend [1.7.3](https://github.com/fhswf/appointme/compare/backend@1.7.2...backend@1.7.3) (2024-09-23)


### Bug Fixes

* **logging:** log CORS config ([ebfd5d1](https://github.com/fhswf/appointme/commit/ebfd5d1b413137a3d5c79b0dec7eab7ae4ee34b2))

## backend [1.7.2](https://github.com/fhswf/appointme/compare/backend@1.7.1...backend@1.7.2) (2024-09-23)


### Bug Fixes

* **logging:** log CORS config ([c449f3f](https://github.com/fhswf/appointme/commit/c449f3fadc3ddfcab05bb0ac65e6b69143692b21))

## backend [1.7.1](https://github.com/fhswf/appointme/compare/backend@1.7.0...backend@1.7.1) (2024-09-23)


### Bug Fixes

* **deployment:** update via semantic release ([52619ba](https://github.com/fhswf/appointme/commit/52619bad54f3eb702164d2909f01c52b1c7e7425))

# backend [1.7.0](https://github.com/fhswf/appointme/compare/backend@1.6.8...backend@1.7.0) (2024-09-23)


### Bug Fixes

* **deployment:** separate deployment & ingress config ([bd3b800](https://github.com/fhswf/appointme/commit/bd3b8006d94567282f2f2e636ab83b5e7a775915))


### Features

* **backend:** CORS entry for appoint.gawron.cloud ([c629be7](https://github.com/fhswf/appointme/commit/c629be707d33facc2135995aa72494a4db72f435))





config: {"name":"backend","version":"1.6.8","description":"","repository":{"type":"git","url":"git@github.com:fhswf/appointme.git"},"main":"server.js","scripts":{"test":"vitest run src/**/*.spec.ts --coverage","ci":"vitest run src/**/*.spec.ts --coverage","start":"node build/server.js","server":"nodemon src/server.ts","dev":"concurrently \"npm run server\" \"npm run client\"","build":"tsc","doc":"jsdoc -c jsdoc.json"},"contributors":[{"name":"Felix Hinnemann"},{"name":"Christian Gawron","email":"gawron.christian@fh-swf.de"}],"license":"MIT","dependencies":{"bcrypt":"^5.0.1","bcryptjs":"^2.4.3","body-parser":"^1.20.1","common":"workspace:*","concurrently":"^8.2.1","cookie-parser":"^1.4.5","cors":"^2.8.5","date-fns":"^2.30.0","date-fns-tz":"^1.1.1","dotenv":"^16.3.1","express":"^4.18.2","express-jwt":"^8.4.1","express-validator":"^7.0.1","google-auth-library":"9.0.0","googleapis":"^126.0.1","ical-generator":"^5.0.1","jsonwebtoken":"^9.0.2","moment":"^2.29.1","mongoose":"^7.5.0","nodemailer":"^6.4.14","remark":"15.0.1","remark-html":"16.0.1"},"devDependencies":{"@babel/core":"^7.23.3","@babel/preset-typescript":"^7.23.3","@jest/globals":"^29.7.0","@types/babel__core":"^7","@types/bcrypt":"^5.0.0","@types/bcryptjs":"^2.4.2","@types/express":"^4.17.11","@types/jest":"^29.5.8","@types/jsonwebtoken":"^9.0.3","@types/node":"^20.5.9","@types/nodemailer":"^6.4.0","@vitest/coverage-v8":"^0.34.6","eslint":"^8.48.0","eslint-config-prettier":"^8.3.0","eslint-config-react-app":"^7.0.1","jest":"^29.7.0","nodemon":"^3.0.1","supertest":"^6.3.3","ts-jest":"^29.1.1","ts-node":"^10.9.1","typescript":"^5.2.2","vitest":"^0.34.6"},"eslintConfig":{"extends":["react-app","react-app/jest"]},"release":{"plugins":["@semantic-release/commit-analyzer","@semantic-release/release-notes-generator","@semantic-release/changelog",["@semantic-release/exec",{"execCwd":"..","prepareCmd":"yarn exec node utility/patch-workspace-versions.js"}],["@dmeents/semantic-release-yarn",{"npmPublish":false,"changeVersion":true,"tarballDir":"build"}],["@semantic-release/exec",{"execCwd":".","generateNotesCmd":"yarn exec node ../utility/patch-k8s.js k8s/deployment.yaml"}],["@semantic-release/git",{"assets":["package.json","CHANGELOG.md","k8s/deployment.yaml"],"message":"chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"}],"@semantic-release/github",["@codedependant/semantic-release-docker",{"dockerTags":["latest","{{major}}-latest","{{version}}","{{git_sha}}"],"dockerImage":"backend","dockerRegistry":"ghcr.io","dockerProject":"fhswf/appointme","dockerContext":".."}]]},"gitHead":"a4b1d2cc78703828c99149277115e8434b675afc"}
Patching k8s config...
ghcr.io/fhswf/appointme/backend:1.6.8

## backend [1.6.8](https://github.com/fhswf/appointme/compare/backend@1.6.7...backend@1.6.8) (2024-06-19)


### Bug Fixes

* multi-release ([bbb6a72](https://github.com/fhswf/appointme/commit/bbb6a72964206a302f044db078575ae093d0cc10))

## backend [1.6.7](https://github.com/fhswf/appointme/compare/backend@1.6.6...backend@1.6.7) (2024-06-19)


### Bug Fixes

* multi-release ([15f0acf](https://github.com/fhswf/appointme/commit/15f0acf4854398bbccd8b28e679a568729b8ab7a))

## backend [1.6.6](https://github.com/fhswf/appointme/compare/backend@1.6.5...backend@1.6.6) (2024-06-17)


### Bug Fixes

* **backend:** quality improvement ([3836ca6](https://github.com/fhswf/appointme/commit/3836ca673f1f01639902bbbdcedca5a8cbab4ac2))
* controller should not return a promise ([91a0bb1](https://github.com/fhswf/appointme/commit/91a0bb1bbea3ab68a506c77c9632d4bac15fb84d))
* dotenv config for backend ([02df94c](https://github.com/fhswf/appointme/commit/02df94c4cdb1b85b7d52edea491d515e14f91ece))





### Dependencies

* **common:** upgraded to 1.1.1

## backend [1.6.5](https://github.com/fhswf/appointme/compare/backend@1.6.4...backend@1.6.5) (2023-10-13)


### Bug Fixes

* **security:** remove secret from docker image ([64446b5](https://github.com/fhswf/appointme/commit/64446b53362e89dd2aa9b9b1dc2f874dc103738e))

## backend [1.6.4](https://github.com/fhswf/appointme/compare/backend@1.6.3...backend@1.6.4) (2023-10-13)


### Bug Fixes

* **backend:** token verification ([6b95be6](https://github.com/fhswf/appointme/commit/6b95be610ccc77f788917d5cec35e8133b15c0fb))

## backend [1.6.3](https://github.com/fhswf/appointme/compare/backend@1.6.2...backend@1.6.3) (2023-10-11)


### Bug Fixes

* **backend:** JWT_SECRET and email passwords ([032df16](https://github.com/fhswf/appointme/commit/032df1659925782e2e91dfa7e061cde3ba5655be))

## backend [1.6.2](https://github.com/fhswf/appointme/compare/backend@1.6.1...backend@1.6.2) (2023-10-09)


### Bug Fixes

* **backend:** config warnings ([6c004e4](https://github.com/fhswf/appointme/commit/6c004e47ce927e66ba4470ec79f930c572fe8982))

## backend [1.6.1](https://github.com/fhswf/appointme/compare/backend@1.6.0...backend@1.6.1) (2023-10-09)


### Bug Fixes

* **backend:** typescript config ([48376f7](https://github.com/fhswf/appointme/commit/48376f7fb2b36535fa037ea76c8f8e32a1c403ae))

# backend [1.6.0](https://github.com/fhswf/appointme/compare/backend@1.5.6...backend@1.6.0) (2023-10-09)


### Bug Fixes

* **client:** docker deployment & typing ([57111e9](https://github.com/fhswf/appointme/commit/57111e909d4abce2f2df79f5d830ec78dbfafed5))


### Features

* local development ([867fd81](https://github.com/fhswf/appointme/commit/867fd81d834a5c47bf57e9b2ef3ce3f17ce2048b))





### Dependencies

* **common:** upgraded to 1.1.0

## backend [1.5.6](https://github.com/fhswf/appointme/compare/backend@1.5.5...backend@1.5.6) (2023-09-14)


### Bug Fixes

* correct api url configuration ([8afb172](https://github.com/fhswf/appointme/commit/8afb1726902e67c12b9a6f3485142d4adb050b49))

## backend [1.5.5](https://github.com/fhswf/appointme/compare/backend@1.5.4...backend@1.5.5) (2023-09-14)


### Bug Fixes

* **workflow:** update version in package.json ([c0d9d2f](https://github.com/fhswf/appointme/commit/c0d9d2fcc609c6e0fe56d3377bae0450fcb10701))

## backend [1.5.4](https://github.com/fhswf/appointme/compare/backend@1.5.3...backend@1.5.4) (2023-09-14)


### Bug Fixes

* **workflow:** delete obsolete workflow files ([f98ed45](https://github.com/fhswf/appointme/commit/f98ed4583dd5c440be19e832e1517fde6405cfad))

## backend [1.5.3](https://github.com/fhswf/appointme/compare/backend@1.5.2...backend@1.5.3) (2023-09-14)


### Bug Fixes

* build backend image via gh action ([debf186](https://github.com/fhswf/appointme/commit/debf18672509d5bd0610c9a9c80bddd315430c4a))
* make redirect URL configurable ([b2fe616](https://github.com/fhswf/appointme/commit/b2fe616e62a4f14910fe22e412537e771471ecd9))

## backend [1.5.2](https://github.com/fhswf/appointme/compare/backend@1.5.1...backend@1.5.2) (2023-09-13)


### Bug Fixes

* build backend image via gh action ([956d375](https://github.com/fhswf/appointme/commit/956d375f95a69e2b1b21461fbf1832411b2bab94))
* build backend image via gh action ([3110467](https://github.com/fhswf/appointme/commit/3110467f8a6fb65ec3081e863ccd7e070248b070))
* build backend image via gh action ([64cc709](https://github.com/fhswf/appointme/commit/64cc7099d0613010aba03c75a8b4169915dbd767))

## backend [1.5.2](https://github.com/fhswf/appointme/compare/backend@1.5.1...backend@1.5.2) (2023-09-13)


### Bug Fixes

* build backend image via gh action ([3110467](https://github.com/fhswf/appointme/commit/3110467f8a6fb65ec3081e863ccd7e070248b070))
* build backend image via gh action ([64cc709](https://github.com/fhswf/appointme/commit/64cc7099d0613010aba03c75a8b4169915dbd767))

## backend [1.5.2](https://github.com/fhswf/appointme/compare/backend@1.5.1...backend@1.5.2) (2023-09-13)


### Bug Fixes

* build backend image via gh action ([64cc709](https://github.com/fhswf/appointme/commit/64cc7099d0613010aba03c75a8b4169915dbd767))

## backend [1.5.1](https://github.com/fhswf/appointme/compare/backend@1.5.0...backend@1.5.1) (2023-09-12)


### Bug Fixes

* automated docker build ([3647c57](https://github.com/fhswf/appointme/commit/3647c579e5e261f60d503f3989a591043d8288a6))

# backend [1.5.0](https://github.com/fhswf/appointme/compare/backend@1.4.0...backend@1.5.0) (2023-09-11)


### Features

* docker build in release ([408acff](https://github.com/fhswf/appointme/commit/408acff2177b69a7745c925f7e944859400b1b0d))
* docker build in release ([c697153](https://github.com/fhswf/appointme/commit/c697153957f3ddac263f110fad88ce1fb612c55b))
* docker build in release ([4f05ee3](https://github.com/fhswf/appointme/commit/4f05ee3f72cc8ab6482a22498bb2069b1b1a03c4))

# backend [1.4.0](https://github.com/fhswf/appointme/compare/backend@1.3.0...backend@1.4.0) (2023-09-11)


### Features

* docker build in release ([8302272](https://github.com/fhswf/appointme/commit/8302272c2f07a72dff498b9da46eec034e10fa37))

# backend [1.3.0](https://github.com/fhswf/appointme/compare/backend@1.2.0...backend@1.3.0) (2023-09-10)


### Features

* docker build in release ([1437407](https://github.com/fhswf/appointme/commit/1437407f5b96b06ec538e2c870f1e592a5d28ebb))

# backend [1.2.0](https://github.com/fhswf/appointme/compare/backend@1.1.0...backend@1.2.0) (2023-09-10)


### Features

* docker build in release ([cce03b0](https://github.com/fhswf/appointme/commit/cce03b0ca8a8970b4d65fa1e8729227035c95108))
* docker build in release ([a2e1c1f](https://github.com/fhswf/appointme/commit/a2e1c1feae44eae6987a016a6f73a4f4991a20ef))
* docker build in release ([891bb01](https://github.com/fhswf/appointme/commit/891bb017ef0580385696d1c6f84bb810a027e25f))
* docker build in release ([f1c3366](https://github.com/fhswf/appointme/commit/f1c3366e78a3e6cbe8c048572dd49b664fb1c980))
* docker build in release ([af3b7c4](https://github.com/fhswf/appointme/commit/af3b7c449225e7ef9c26181c0a21482856521644))

# backend [1.2.0](https://github.com/fhswf/appointme/compare/backend@1.1.0...backend@1.2.0) (2023-09-10)


### Features

* docker build in release ([891bb01](https://github.com/fhswf/appointme/commit/891bb017ef0580385696d1c6f84bb810a027e25f))
* docker build in release ([f1c3366](https://github.com/fhswf/appointme/commit/f1c3366e78a3e6cbe8c048572dd49b664fb1c980))
* docker build in release ([af3b7c4](https://github.com/fhswf/appointme/commit/af3b7c449225e7ef9c26181c0a21482856521644))

# backend [1.2.0](https://github.com/fhswf/appointme/compare/backend@1.1.0...backend@1.2.0) (2023-09-10)


### Features

* docker build in release ([f1c3366](https://github.com/fhswf/appointme/commit/f1c3366e78a3e6cbe8c048572dd49b664fb1c980))
* docker build in release ([af3b7c4](https://github.com/fhswf/appointme/commit/af3b7c449225e7ef9c26181c0a21482856521644))

# backend [1.1.0](https://github.com/fhswf/appointme/compare/backend@1.0.0...backend@1.1.0) (2023-09-10)


### Features

* docker build in release ([000ce1c](https://github.com/fhswf/appointme/commit/000ce1cb8162a30c43d43d24ddb59aa54c28efb2))
* docker build in release ([2205739](https://github.com/fhswf/appointme/commit/2205739080523259c7ec345a5482f792d3f22e3d))
* docker build in release ([920652b](https://github.com/fhswf/appointme/commit/920652bec227fec613fb8eec7dbc4b8b13eee566))
* docker build in release ([ca47fa9](https://github.com/fhswf/appointme/commit/ca47fa9e1b21eccc7d75ab8eb5936d468516f10b))
* docker build in release ([b1610e3](https://github.com/fhswf/appointme/commit/b1610e3c6a7bd013e58107e9f53f8b2b9a6a6c0f))
* docker build in release ([e856a5c](https://github.com/fhswf/appointme/commit/e856a5c1c1b03d7e258bd14c36dba9c67c08e768))

# backend [1.1.0](https://github.com/fhswf/appointme/compare/backend@1.0.0...backend@1.1.0) (2023-09-10)


### Features

* docker build in release ([920652b](https://github.com/fhswf/appointme/commit/920652bec227fec613fb8eec7dbc4b8b13eee566))
* docker build in release ([ca47fa9](https://github.com/fhswf/appointme/commit/ca47fa9e1b21eccc7d75ab8eb5936d468516f10b))
* docker build in release ([b1610e3](https://github.com/fhswf/appointme/commit/b1610e3c6a7bd013e58107e9f53f8b2b9a6a6c0f))
* docker build in release ([e856a5c](https://github.com/fhswf/appointme/commit/e856a5c1c1b03d7e258bd14c36dba9c67c08e768))

# backend [1.1.0](https://github.com/fhswf/appointme/compare/backend@1.0.0...backend@1.1.0) (2023-09-10)


### Features

* docker build in release ([b1610e3](https://github.com/fhswf/appointme/commit/b1610e3c6a7bd013e58107e9f53f8b2b9a6a6c0f))
* docker build in release ([e856a5c](https://github.com/fhswf/appointme/commit/e856a5c1c1b03d7e258bd14c36dba9c67c08e768))

# backend 1.0.0 (2023-09-10)


### Bug Fixes

* **bump dependencies:** upgrade several dependencies ([ca905e2](https://github.com/fhswf/appointme/commit/ca905e241e31bbbe69d05a7e4bec76b0bd4a9bcc))
* do not overwrite calendar settings upon login ([8923777](https://github.com/fhswf/appointme/commit/892377784cc94f2243c193f0763c82e7e58e7c16))
* do not update google tokens via user controller ([c1a04da](https://github.com/fhswf/appointme/commit/c1a04dad850e091a217fc06e7976c1f6fc1f603a))
* edit available times ([#5](https://github.com/fhswf/appointme/issues/5)) ([46500a9](https://github.com/fhswf/appointme/commit/46500a9c33da1279c612938652eb765c0dd76b91))
* freeBusy service corrected ([c2d8590](https://github.com/fhswf/appointme/commit/c2d85904dfb2393faadf1caa4dd1b4af107e44f9))
* **freeBusy:** filter out free slots shorter than the event duration ([2eedf77](https://github.com/fhswf/appointme/commit/2eedf7789c6158827c6ffc2d9ebf61c6c4682879))
* github actions for semantic release fixed ([72ac08f](https://github.com/fhswf/appointme/commit/72ac08ff062d91c2e05b1671c31eaa64d11de74f))
* **insertEvent:** check availablility of requested slot in backend ([54c9e92](https://github.com/fhswf/appointme/commit/54c9e92b3b7d4c452954e30c8442bc483e654ed1)), closes [#27](https://github.com/fhswf/appointme/issues/27)
* Migrate to Google Sign In ([e3e51e4](https://github.com/fhswf/appointme/commit/e3e51e4dde061b522641194ef2c1374e924797ba))
* security updates ([9e359b1](https://github.com/fhswf/appointme/commit/9e359b187ca2f5496fc1ef384172c49ff562ae3f))
* semantic release config ([981919d](https://github.com/fhswf/appointme/commit/981919d114991237ba83a04dbc95e04f29ed30f1))
* semantic-release config ([7ac94ec](https://github.com/fhswf/appointme/commit/7ac94ec675b5b1a9644a013e208f214aeb7300fe))
* transfer timestamp as integer ([37dd14a](https://github.com/fhswf/appointme/commit/37dd14a5b0ddfa4a9e5126eb345616cf3e6e5c64))
* typescript issues ([46e85ca](https://github.com/fhswf/appointme/commit/46e85cab96b0180b999151d8909b5afaaf69a2fd))
* UI glitches fixed ([2720b9d](https://github.com/fhswf/appointme/commit/2720b9d26ee4779988d71275e1d7ff4e3cc94bb1))
* update docker build to use yarn ([e0618f7](https://github.com/fhswf/appointme/commit/e0618f71e36062ae0745df42a87139aaf432ec26))
* yarn build/dependency management & docker ([eaae025](https://github.com/fhswf/appointme/commit/eaae025680d1a840765406f2c3fb2eed9c238c43))


### Features

* **freeBusy:** check maxPerDay constraint ([ad49b95](https://github.com/fhswf/appointme/commit/ad49b957181a2717b179b4c52ce4ab84f1ddca34))
* **freeBusy:** freeBusy should observe minFuture and maxFuture restrictictions of an event ([a670b7d](https://github.com/fhswf/appointme/commit/a670b7d8eadf01547009c35121bbe3062b545931))
* **markdown:** handle event type description as markdown. ([4bedade](https://github.com/fhswf/appointme/commit/4bedade846876fe6eedb5b0f4d986a33c8d283b2))





### Dependencies

* **common:** upgraded to 1.0.0

# [@fhswf/appointme-backend-v1.3.2](https://github.com/fhswf/appointme/compare/@fhswf/appointme-backend-v1.3.1...@fhswf/appointme-backend-v1.3.2) (2021-08-10)


### Bug Fixes

* **bump dependencies:** upgrade several dependencies ([ca905e2](https://github.com/fhswf/appointme/commit/ca905e241e31bbbe69d05a7e4bec76b0bd4a9bcc))

# [@fhswf/appointme-backend-v1.3.1](https://github.com/fhswf/appointme/compare/@fhswf/appointme-backend-v1.3.0...@fhswf/appointme-backend-v1.3.1) (2021-06-06)


### Bug Fixes

* **insertEvent:** check availablility of requested slot in backend ([54c9e92](https://github.com/fhswf/appointme/commit/54c9e92b3b7d4c452954e30c8442bc483e654ed1)), closes [#27](https://github.com/fhswf/appointme/issues/27)

# [@fhswf/appointme-backend-v1.3.0](https://github.com/fhswf/appointme/compare/@fhswf/appointme-backend-v1.2.1...@fhswf/appointme-backend-v1.3.0) (2021-06-06)


### Features

* **markdown:** handle event type description as markdown. ([4bedade](https://github.com/fhswf/appointme/commit/4bedade846876fe6eedb5b0f4d986a33c8d283b2))

# [@fhswf/appointme-backend-v1.2.1](https://github.com/fhswf/appointme/compare/@fhswf/appointme-backend-v1.2.0...@fhswf/appointme-backend-v1.2.1) (2021-06-05)


### Bug Fixes

* **freeBusy:** filter out free slots shorter than the event duration ([2eedf77](https://github.com/fhswf/appointme/commit/2eedf7789c6158827c6ffc2d9ebf61c6c4682879))

# [@fhswf/appointme-backend-v1.2.0](https://github.com/fhswf/appointme/compare/@fhswf/appointme-backend-v1.1.0...@fhswf/appointme-backend-v1.2.0) (2021-05-31)


### Features

* **freeBusy:** check maxPerDay constraint ([ad49b95](https://github.com/fhswf/appointme/commit/ad49b957181a2717b179b4c52ce4ab84f1ddca34))

# [@fhswf/appointme-backend-v1.1.0](https://github.com/fhswf/appointme/compare/@fhswf/appointme-backend-v1.0.1...@fhswf/appointme-backend-v1.1.0) (2021-05-29)


### Features

* **freeBusy:** freeBusy should observe minFuture and maxFuture restrictictions of an event ([a670b7d](https://github.com/fhswf/appointme/commit/a670b7d8eadf01547009c35121bbe3062b545931))

# [@fhswf/appointme-backend-v1.0.1](https://github.com/fhswf/appointme/compare/@fhswf/appointme-backend-v1.0.0...@fhswf/appointme-backend-v1.0.1) (2021-05-26)


### Bug Fixes

* do not overwrite calendar settings upon login ([8923777](https://github.com/fhswf/appointme/commit/892377784cc94f2243c193f0763c82e7e58e7c16))

# @fhswf/appointme-backend-v1.0.0 (2021-05-26)


### Bug Fixes

* do not update google tokens via user controller ([c1a04da](https://github.com/fhswf/appointme/commit/c1a04dad850e091a217fc06e7976c1f6fc1f603a))
* edit available times ([238d799](https://github.com/fhswf/appointme/commit/238d7995005bfd7fca0ed25abc56f23dfc06567a))
* edit available times ([#5](https://github.com/fhswf/appointme/issues/5)) ([46500a9](https://github.com/fhswf/appointme/commit/46500a9c33da1279c612938652eb765c0dd76b91))
* freeBusy service corrected ([c2d8590](https://github.com/fhswf/appointme/commit/c2d85904dfb2393faadf1caa4dd1b4af107e44f9))
* github actions for semantic release fixed ([72ac08f](https://github.com/fhswf/appointme/commit/72ac08ff062d91c2e05b1671c31eaa64d11de74f))
* transfer timestamp as integer ([37dd14a](https://github.com/fhswf/appointme/commit/37dd14a5b0ddfa4a9e5126eb345616cf3e6e5c64))
* typescript issues ([46e85ca](https://github.com/fhswf/appointme/commit/46e85cab96b0180b999151d8909b5afaaf69a2fd))
* UI glitches fixed ([2720b9d](https://github.com/fhswf/appointme/commit/2720b9d26ee4779988d71275e1d7ff4e3cc94bb1))


### Features

* add profile image ([e291705](https://github.com/fhswf/appointme/commit/e291705a560d006301a515877a04a7c6a34c6d7c))
