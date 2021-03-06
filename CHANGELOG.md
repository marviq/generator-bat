# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.1.4](https://github.com/marviq/generator-bat/compare/v1.1.3...v1.1.4) (2020-10-04)

### [1.1.3](https://github.com/marviq/generator-bat/compare/v1.1.2...v1.1.3) (2020-03-16)

### [1.1.2](https://github.com/marviq/generator-bat/compare/v1.1.1...v1.1.2) (2019-12-30)


### Bug Fixes

* **generators/app:** match documented `jshint` version with dependency's ([5e35d5f](https://github.com/marviq/generator-bat/commit/5e35d5f116e9ee4c5bb92f32c80c451d1f4f8cd6))

### [1.1.1](https://github.com/marviq/generator-bat/compare/v1.1.0...v1.1.1) (2019-12-30)


### Bug Fixes

* **generators/app:** fix typo ([72bdb85](https://github.com/marviq/generator-bat/commit/72bdb854c04f597386b9c9de43c58a6c8cf3c89a))
* **generators/app:** update project baseline files with current best practices and defaults ([fbcfd8c](https://github.com/marviq/generator-bat/commit/fbcfd8ca7926adf07b81e09aeb584090eefc2e2d))
* **generators/app/templates:** fix comment ([03321a0](https://github.com/marviq/generator-bat/commit/03321a0d00fed538724a2e614180d007fa3622dc))

<a name="1.1.0"></a>
# [1.1.0](https://github.com/marviq/generator-bat/compare/v1.0.3...v1.1.0) (2018-01-29)


### Bug Fixes

* **generators/app/templates:** remove `bash` command blocks' inconsistencies ([59d7124](https://github.com/marviq/generator-bat/commit/59d7124))
* **generators/app/templates:** tweak ribbon ([d00f512](https://github.com/marviq/generator-bat/commit/d00f512))
* **generators/app/templatestests:** fix unit test descriptions grammar ([440f8dc](https://github.com/marviq/generator-bat/commit/440f8dc))
* **generators/apps/templates:** fix references in documentation ([8b3ffc2](https://github.com/marviq/generator-bat/commit/8b3ffc2))


### Features

* **generators:** change how the settings object(s) defines available apis ([d4f395e](https://github.com/marviq/generator-bat/commit/d4f395e))
* **generators/app/templates:** add support for easy access to generated code documentation ([db714c6](https://github.com/marviq/generator-bat/commit/db714c6))



<a name="1.0.3"></a>
## [1.0.3](https://github.com/marviq/generator-bat/compare/v1.0.2...v1.0.3) (2018-01-22)


### Bug Fixes

* **project:** include support `lib`-s with the `files` manifest ([6658100](https://github.com/marviq/generator-bat/commit/6658100))



<a name="1.0.2"></a>
## [1.0.2](https://github.com/marviq/generator-bat/compare/v1.0.1...v1.0.2) (2017-10-20)


### Bug Fixes

* **generators/{app,demo}/templates:** fix non-html5 self-closing tags ([d88e8b4](https://github.com/marviq/generator-bat/commit/d88e8b4))
* **generators/app/templates:** ensure git hooks don't error-exit when there's nothing to do ([3fd33d7](https://github.com/marviq/generator-bat/commit/3fd33d7))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/marviq/generator-bat/compare/v1.0.0...v1.0.1) (2017-10-18)


### Bug Fixes

* **generators/{app,demo}/templates:** prevent undefined optional parameters from appearing in de url as `"null"` or `"undefined"` (the strings that is) ([625776b](https://github.com/marviq/generator-bat/commit/625776b))
* **generators/app/templates:** modernize environment ribbon (debug) ([066ecad](https://github.com/marviq/generator-bat/commit/066ecad))


### Features

* **generators/app:** include warning about generated localization file ([60b98da](https://github.com/marviq/generator-bat/commit/60b98da))
* **generators/app/templates:** add revision (commit) to environment ribbon ([a24c9ad](https://github.com/marviq/generator-bat/commit/a24c9ad))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/marviq/generator-bat/compare/v0.1.27...v1.0.0) (2017-10-12)


### Bug Fixes

* **all generators:** ensure defaults to 'input' type prompts' are indeed strings ([345be4a](https://github.com/marviq/generator-bat/commit/345be4a))
* **all generators:** normalize taglines ([5ae30f9](https://github.com/marviq/generator-bat/commit/5ae30f9))
* **app generator:** allow different sets of `jshintOptions` per target whilst maintaining a common base ([046e5fc](https://github.com/marviq/generator-bat/commit/046e5fc))
* **app generator:** avoid 'bower install' getting called ([e171825](https://github.com/marviq/generator-bat/commit/e171825))
* **app generator:** clarify build target environment into build anatomy ([a11115d](https://github.com/marviq/generator-bat/commit/a11115d))
* **app generator:** comply grunt idiom detail with those in the 'README.md' template ([b9ad708](https://github.com/marviq/generator-bat/commit/b9ad708))
* **app generator:** comply question phrasing with `yo bat --help` output ([272de8e](https://github.com/marviq/generator-bat/commit/272de8e))
* **app generator:** correct install suggestion given when grunt command does not appear to exist ([79fc707](https://github.com/marviq/generator-bat/commit/79fc707))
* **app generator:** correct the app's main entry point in 'package.json' template ([f2586f2](https://github.com/marviq/generator-bat/commit/f2586f2))
* **app generator:** correct ways to retrieve git user name and -email ([297e6e1](https://github.com/marviq/generator-bat/commit/297e6e1))
* **app generator:** dasherize the directory-derived default package name ([22101b6](https://github.com/marviq/generator-bat/commit/22101b6))
* **app generator:** default `lang` attribute value to 'en' on `html` tag ([fa8d3cb](https://github.com/marviq/generator-bat/commit/fa8d3cb))
* **app generator:** fix `Gruntfile` documentation ([89c7a99](https://github.com/marviq/generator-bat/commit/89c7a99))
* **app generator:** fix conditional i18n dependency in '_package.json' template ([ab4da39](https://github.com/marviq/generator-bat/commit/ab4da39))
* **app generator:** fix default for modelName when collectionName settled as command line option ([4ad52ac](https://github.com/marviq/generator-bat/commit/4ad52ac))
* **app generator:** fix expanding default index view for the template that it always was. ([9ec6b33](https://github.com/marviq/generator-bat/commit/9ec6b33))
* **app generator:** fix i18n files not being scaffolded ([845f6fb](https://github.com/marviq/generator-bat/commit/845f6fb))
* **app generator:** fix i18n support ([f6498f2](https://github.com/marviq/generator-bat/commit/f6498f2))
* **app generator:** fix npm 'prepublish' entry in 'scripts' section ([7a911c5](https://github.com/marviq/generator-bat/commit/7a911c5))
* **app generator:** fix retrieving git user name ([26e74eb](https://github.com/marviq/generator-bat/commit/26e74eb))
* **app generator:** fix typo ([ed924bd](https://github.com/marviq/generator-bat/commit/ed924bd))
* **app generator:** move template files to their expected relative location ([9550bf5](https://github.com/marviq/generator-bat/commit/9550bf5))
* **app generator:** normalize prompt phrasing with sub-generators ([295b833](https://github.com/marviq/generator-bat/commit/295b833))
* **app generator:** Refrain from doing an `npm install` without arguments so that its 'prepublish' script isn't run. ([781b1d5](https://github.com/marviq/generator-bat/commit/781b1d5))
* **app generator:** remove 'demo' watch target ([d7917a9](https://github.com/marviq/generator-bat/commit/d7917a9))
* **app generator:** remove `slugify()`-ing `packageDescription` ([b2b4bb8](https://github.com/marviq/generator-bat/commit/b2b4bb8))
* **app generator:** remove typo from coffeelint:test task's file declaration ([578a5b4](https://github.com/marviq/generator-bat/commit/578a5b4))
* **app generator:** remove unused `watchFiles` ([ff8b98f](https://github.com/marviq/generator-bat/commit/ff8b98f))
* **app generator:** remove unused prop ([94eccc5](https://github.com/marviq/generator-bat/commit/94eccc5))
* **app generator:** replace depecrated API `mkdir()` method with alternative ([861da5f](https://github.com/marviq/generator-bat/commit/861da5f))
* **app generator chore:** add AMD / RequireJS pattern globals ([c06b03d](https://github.com/marviq/generator-bat/commit/c06b03d))
* **app generator chore:** comply with standard package.json indentation ([07fd501](https://github.com/marviq/generator-bat/commit/07fd501))
* **app generator chore:** default to a true `detectGlobals` browserify setting ([f47b64d](https://github.com/marviq/generator-bat/commit/f47b64d))
* **app generator chore:** fix typo in `project_type` ([93db0f5](https://github.com/marviq/generator-bat/commit/93db0f5))
* **app generator chore:** move misplaced jshintrc options to their proper place ([43057d3](https://github.com/marviq/generator-bat/commit/43057d3))
* **app generator demo app:** remove pedantic scaling settings ([d474549](https://github.com/marviq/generator-bat/commit/d474549))
* **app generator docs:** fix comment instruction ([48684e9](https://github.com/marviq/generator-bat/commit/48684e9))
* **app generator style:** fix `fontsDir` ([9f1692d](https://github.com/marviq/generator-bat/commit/9f1692d))
* **app generator/router:** make a locale switch do a proper `[@refresh](https://github.com/refresh)()` ([7771b14](https://github.com/marviq/generator-bat/commit/7771b14))
* **app generators:** require answer to copyright owner to be non-blank ([e965343](https://github.com/marviq/generator-bat/commit/e965343))
* **app-generator:** fix naming typo's ([a74b979](https://github.com/marviq/generator-bat/commit/a74b979))
* **collection generator:** complete collection's model description ([84f7e1a](https://github.com/marviq/generator-bat/commit/84f7e1a))
* **collection subgenerator:** fix not actually generating the collection model ([aa1a2fe](https://github.com/marviq/generator-bat/commit/aa1a2fe))
* **collection subgenerator:** remove confusing default collection name ([80632d4](https://github.com/marviq/generator-bat/commit/80632d4))
* **demo generator:** fix running demo generator through `composeWith()` ([0b4ce2a](https://github.com/marviq/generator-bat/commit/0b4ce2a))
* **demo sub-generator:** fix index view styling ([d773ead](https://github.com/marviq/generator-bat/commit/d773ead))
* **generators:** add omitted new files ([552cf8d](https://github.com/marviq/generator-bat/commit/552cf8d))
* **generators:** adhere to jshint rules ([f033ce1](https://github.com/marviq/generator-bat/commit/f033ce1))
* **generators:** fix capitalization of first letter ([157a42c](https://github.com/marviq/generator-bat/commit/157a42c))
* **generators:** remove unnecessary fat arrows ([f0c1099](https://github.com/marviq/generator-bat/commit/f0c1099))
* **generators/*/templates:** fix documented `[@type](https://github.com/type)` declatations ([0644f81](https://github.com/marviq/generator-bat/commit/0644f81))
* **generators/app:** add missing command line options ([cefe325](https://github.com/marviq/generator-bat/commit/cefe325))
* **generators/app:** ensure `npm prune` is run synchronously ([a0f37c9](https://github.com/marviq/generator-bat/commit/a0f37c9))
* **generators/app:** ensure to avoid conflicts when composing in the demo generator ([6c113de](https://github.com/marviq/generator-bat/commit/6c113de))
* **generators/app:** ensure transform is done from a known origin ([2532218](https://github.com/marviq/generator-bat/commit/2532218))
* **generators/app:** fix argument type ([d08eb44](https://github.com/marviq/generator-bat/commit/d08eb44))
* **generators/app:** fix default `copyrightOwner` retrieval ([16a382d](https://github.com/marviq/generator-bat/commit/16a382d))
* **generators/app:** fix typo ([cd617ed](https://github.com/marviq/generator-bat/commit/cd617ed))
* **generators/app:** set an upper bound on those dependencies that changed over (or are expected to) to favor `coffeescript` over `coffee-script` ([a858780](https://github.com/marviq/generator-bat/commit/a858780))
* **generators/app/templates:** attempt to fix grunt watch not detecting changes ([59e7bfb](https://github.com/marviq/generator-bat/commit/59e7bfb))
* **generators/app/templates:** fix contributing/setup documentation being too biased towards git flow model. ([0c66365](https://github.com/marviq/generator-bat/commit/0c66365))
* **generators/collection:** fix deriving default model name from option-derived collection name ([8a6aad6](https://github.com/marviq/generator-bat/commit/8a6aad6))
* **generators/demo:** add missing template data ([ed81638](https://github.com/marviq/generator-bat/commit/ed81638))
* **generators/demo:** avoid re-installing dependency ([c862fba](https://github.com/marviq/generator-bat/commit/c862fba))
* **generators/demo:** fix i18n adjustments for demo app ([c209298](https://github.com/marviq/generator-bat/commit/c209298))
* **generators/demo/templates:** add instruction to generate documentation before referring to it ([fc1a339](https://github.com/marviq/generator-bat/commit/fc1a339))
* **generators/demo/templates:** fix image, attribution and link ([51b3697](https://github.com/marviq/generator-bat/commit/51b3697))
* **generators/model:** ensure default service-name validates as a url-path ([fa6030c](https://github.com/marviq/generator-bat/commit/fa6030c))
* **generators/view:** fix ordered insert ([7fa2653](https://github.com/marviq/generator-bat/commit/7fa2653))
* **model generator:** fix typo ([fd98ad1](https://github.com/marviq/generator-bat/commit/fd98ad1))
* **model generator:** remove leftover initialization rendered useless by commit 0096e01 ([2d780f8](https://github.com/marviq/generator-bat/commit/2d780f8))
* **model sub-generator:** add automatic prompt pruning for command line option equivalents, this removes the need for the '--nested' command line kludge when used as a compositing sub-generator. ([0096e01](https://github.com/marviq/generator-bat/commit/0096e01))
* **project:** add missing dependency on `lodash` ([bc1878e](https://github.com/marviq/generator-bat/commit/bc1878e))
* **project:** add missing dependency on `mkdirp` ([38cb152](https://github.com/marviq/generator-bat/commit/38cb152))
* **subgenerators:** fix and normalize singleton handling ([d400038](https://github.com/marviq/generator-bat/commit/d400038))
* **subgenerators:** fix indefinite articles ([a9ad66c](https://github.com/marviq/generator-bat/commit/a9ad66c))
* **subgenerators:** guard against introducing trailing whitespace ([62d0d26](https://github.com/marviq/generator-bat/commit/62d0d26))
* **subgenerators:** label a model or collection as '[@static](https://github.com/static)' only when meant to be singleton ([bc0f187](https://github.com/marviq/generator-bat/commit/bc0f187))
* **utils:** ensure string methods apply to strings ([040c919](https://github.com/marviq/generator-bat/commit/040c919))
* **view generator:** avoid forced overwrites on view re-generation ([40cc8e9](https://github.com/marviq/generator-bat/commit/40cc8e9))
* **view sub-generator:** fix missing newline at end-of-file ([2add7f6](https://github.com/marviq/generator-bat/commit/2add7f6))


### Features

* ** app generator :** add assessing some build pre-requisites' existence/version ([68b90d7](https://github.com/marviq/generator-bat/commit/68b90d7))
* **all generators:** add `description` tagline used for `--help` output ([6e71c99](https://github.com/marviq/generator-bat/commit/6e71c99))
* **all generators:** add a command line option for each user prompt ([d75d099](https://github.com/marviq/generator-bat/commit/d75d099))
* **all generators:** replace custom `determineRoot()` sub-generator functionality with the Yeoman default '.yo-rc.json' based one. ([0435ab4](https://github.com/marviq/generator-bat/commit/0435ab4))
* **all generators:** revert to stock YUIDoc and its default theme. ([077b755](https://github.com/marviq/generator-bat/commit/077b755))
* **app generator:** add 'open' event, triggered when router loads (or re-renders) a view ([39f1662](https://github.com/marviq/generator-bat/commit/39f1662))
* **app generator:** add a default locale ([80deb5e](https://github.com/marviq/generator-bat/commit/80deb5e))
* **app generator:** add ability to include certain code into debug builds only ([592155f](https://github.com/marviq/generator-bat/commit/592155f))
* **app generator:** add ability to retrieve a build distribution target-environment's settings at run-time ([7d9f599](https://github.com/marviq/generator-bat/commit/7d9f599))
* **app generator:** add an annotated '.gitattributes' default to the templates ([900a249](https://github.com/marviq/generator-bat/commit/900a249))
* **app generator:** add coffee-jshint to build process ([fba49fa](https://github.com/marviq/generator-bat/commit/fba49fa))
* **app generator:** add coffeelinting to build process ([4980b07](https://github.com/marviq/generator-bat/commit/4980b07))
* **app generator:** add debugging-aid styling, will be included on debug builds only ([0a08e4a](https://github.com/marviq/generator-bat/commit/0a08e4a))
* **app generator:** add exit message hints ([c57c5e8](https://github.com/marviq/generator-bat/commit/c57c5e8))
* **app generator:** add HTML5 shim and 'respond.js' for IE8 support of HTML5 elements and media queries ([df60e02](https://github.com/marviq/generator-bat/commit/df60e02))
* **app generator:** add logic to determine the `$appRoot` element. ([8e8e0d4](https://github.com/marviq/generator-bat/commit/8e8e0d4))
* **app generator:** add logic to determine the `appBaseUrl` ([49eb4d8](https://github.com/marviq/generator-bat/commit/49eb4d8))
* **app generator:** add means to learn the current build's briefing details ([1c35d2f](https://github.com/marviq/generator-bat/commit/1c35d2f))
* **app generator:** add option to drop console.* statements from code on minification ([fa92e10](https://github.com/marviq/generator-bat/commit/fa92e10))
* **app generator:** add option to let app load jQuery through a CDN ([d974ed4](https://github.com/marviq/generator-bat/commit/d974ed4))
* **app generator:** add paths containing 't{,e}mp' to '.gitignore' excludes ([f9d74b0](https://github.com/marviq/generator-bat/commit/f9d74b0))
* **app generator:** add support for `conventional-changelog/standard-version` ([5082d3c](https://github.com/marviq/generator-bat/commit/5082d3c))
* **app generator:** add targets to `grunt lint`, `grunt lint:app`, `grunt lint:gruntfile`, `grunt lint:test` ([bda0667](https://github.com/marviq/generator-bat/commit/bda0667))
* **app generator:** add templating the 'LICENSE' file ([9660abd](https://github.com/marviq/generator-bat/commit/9660abd))
* **app generator:** add to copy task's robustness ([c0d2059](https://github.com/marviq/generator-bat/commit/c0d2059))
* **app generator:** default demo app install to false ([8dd1358](https://github.com/marviq/generator-bat/commit/8dd1358))
* **app generator:** externalize 'contributors' from 'package.json' to AUTHORS ([6969815](https://github.com/marviq/generator-bat/commit/6969815))
* **app generator:** factor out demo app into a sub-generator ([927dcaa](https://github.com/marviq/generator-bat/commit/927dcaa))
* **app generator:** include a default api-services collection ([8ee884b](https://github.com/marviq/generator-bat/commit/8ee884b))
* **app generator:** include basic classname prefix to the 'index' view's sass ([6bcb28f](https://github.com/marviq/generator-bat/commit/6bcb28f))
* **app generator:** include tests on debug builds ([ca4d091](https://github.com/marviq/generator-bat/commit/ca4d091))
* **app generator:** insert package.json default sections, even if empty ([44521ac](https://github.com/marviq/generator-bat/commit/44521ac))
* **app generator:** introduce `settings` as a static `[@class](https://github.com/class)` to yuidoc code documentation ([e9a0c84](https://github.com/marviq/generator-bat/commit/e9a0c84))
* **app generator:** link document root element identification to `.name` in `package.json` ([84f703e](https://github.com/marviq/generator-bat/commit/84f703e))
* **app generator:** loose the marviq-tied default author url, and ask the user for it instead ([f964dcb](https://github.com/marviq/generator-bat/commit/f964dcb))
* **app generator:** make author email address optional ([1f5c580](https://github.com/marviq/generator-bat/commit/1f5c580))
* **app generator:** prevent accidental publishing to the global repo ([51b4376](https://github.com/marviq/generator-bat/commit/51b4376))
* **app generator:** prune npm packages after install ([20f95d3](https://github.com/marviq/generator-bat/commit/20f95d3))
* **app generator:** reorganize sass tree structure and `[@imports](https://github.com/imports)` ([267a5af](https://github.com/marviq/generator-bat/commit/267a5af))
* **app generator:** replace 'test' entry in 'scripts' section with one that'll run `grunt test` ([91318de](https://github.com/marviq/generator-bat/commit/91318de))
* **app generator:** start app only on DOM ready-ness ([0d302df](https://github.com/marviq/generator-bat/commit/0d302df))
* **app generator:** throw `Mixins` into the mix ([bcb25c6](https://github.com/marviq/generator-bat/commit/bcb25c6))
* **app generator:** update `coffeelint.json` compliance to `coffeelint[@1](https://github.com/1).15.7` ([8726dc5](https://github.com/marviq/generator-bat/commit/8726dc5))
* **app generator:** upgrade `.jshintrc` compliance to `jshint[@2](https://github.com/2).9.2` ([23561bf](https://github.com/marviq/generator-bat/commit/23561bf))
* **app generator chore:** adapt to `grunt-coffee-jshint[@0](https://github.com/0).3.0` ([acbff72](https://github.com/marviq/generator-bat/commit/acbff72))
* **app generator chore:** relax line breaking style ([f8cbd62](https://github.com/marviq/generator-bat/commit/f8cbd62))
* **app generator chore:** update `.jshintrc` compliance to `jshint[@2](https://github.com/2).8.0` ([938524f](https://github.com/marviq/generator-bat/commit/938524f))
* **app generator chore:** update `coffeelint.json` compliance to `coffeelint[@1](https://github.com/1).10.1` ([7424ad9](https://github.com/marviq/generator-bat/commit/7424ad9))
* **app generator demo app:** include ie8 fallback html5 and media query shims ([48db5cd](https://github.com/marviq/generator-bat/commit/48db5cd))
* **app generator docs:** clarify `relativeAssets: true` setting ([e264098](https://github.com/marviq/generator-bat/commit/e264098))
* **app generator docs:** make app name standout ([61ca4e1](https://github.com/marviq/generator-bat/commit/61ca4e1))
* **app generator,test:** replace mocha/chai based testing framework with a combo of karma, jasmine, phantomjs and browserify ([925d1ca](https://github.com/marviq/generator-bat/commit/925d1ca))
* **app generator,view subgenerator:** normalize template expansion ([bc32f20](https://github.com/marviq/generator-bat/commit/bc32f20))
* **app generator/router:** add ability to adjust any of the current url's parameters without requiring knowledge of the current url itself or its structure ([9962873](https://github.com/marviq/generator-bat/commit/9962873))
* **app generator/templates:** add `CHANGELOG.md` to package manifest ([8601717](https://github.com/marviq/generator-bat/commit/8601717))
* **collection generator:** add crosslinks between collection and model. ([2025943](https://github.com/marviq/generator-bat/commit/2025943))
* **collection sub-generator:** remove smart-guessing the `modelName` from an assumed plural `collectionName` ([f49187f](https://github.com/marviq/generator-bat/commit/f49187f))
* **debug:** do a smarter insertion of the livereload url ([0b10652](https://github.com/marviq/generator-bat/commit/0b10652))
* **generator/app:** add IntelliJ IDEA project files and dir to `.gitignore` ([b02efce](https://github.com/marviq/generator-bat/commit/b02efce))
* **generators:** add answers validation and laundering, normalize across subgenerators, tweak and normalize phrasings ([400648d](https://github.com/marviq/generator-bat/commit/400648d))
* **generators:** add mixin method for symlinking files within `this.destinationRoot()` ([07b4afa](https://github.com/marviq/generator-bat/commit/07b4afa))
* **generators:** adhere to Yeoman's run loop priorities ([9cbfb74](https://github.com/marviq/generator-bat/commit/9cbfb74))
* **generators:** be more strict ([36e614d](https://github.com/marviq/generator-bat/commit/36e614d))
* **generators:** provide visual feedback of symlinked sources ([9f2e96c](https://github.com/marviq/generator-bat/commit/9f2e96c))
* **generators:** remove madlib-console ([cfe343f](https://github.com/marviq/generator-bat/commit/cfe343f))
* **generators/*:** convert `name` cli argument/option to camelcase when used as default prompt value. ([3bb2f90](https://github.com/marviq/generator-bat/commit/3bb2f90))
* **generators/*:** ensure prompted-for data is ungrudgingly massaged to fit the expected representation patterns ([62b8343](https://github.com/marviq/generator-bat/commit/62b8343))
* **generators/api:** add a subgenerator for creating API instances ([a04056c](https://github.com/marviq/generator-bat/commit/a04056c))
* **generators/app:** add a "Changelog" section ([0648f02](https://github.com/marviq/generator-bat/commit/0648f02))
* **generators/app:** cater for a spot to place test runner reports ([725e9cd](https://github.com/marviq/generator-bat/commit/725e9cd))
* **generators/app:** extend with visual studio project directory ([96320b9](https://github.com/marviq/generator-bat/commit/96320b9))
* **generators/app:** hint at how best to include the twitter bootstrap CSS framework ([1460bfe](https://github.com/marviq/generator-bat/commit/1460bfe))
* **generators/app:** safe-guard against running in non-empty destination roots ([6969a74](https://github.com/marviq/generator-bat/commit/6969a74))
* **generators/app/templates:** add `directories.doc` section ([5dca9e9](https://github.com/marviq/generator-bat/commit/5dca9e9))
* **generators/app/templates:** add an environment-ribbon view showing the build's briefing details for debug type builds ([06cd7f1](https://github.com/marviq/generator-bat/commit/06cd7f1))
* **generators/app/templates:** add automatic engagement of the Backbone-Debugger browser plugin when available ([2b27dea](https://github.com/marviq/generator-bat/commit/2b27dea))
* **generators/app/templates:** add separate `deploy` section ([31a4129](https://github.com/marviq/generator-bat/commit/31a4129))
* **generators/app/templates:** ensure livereloading works for _any_ /^local/ target-environment ([1814386](https://github.com/marviq/generator-bat/commit/1814386))
* **generators/app/templates:** include setting up two git hooks that will help keeping `node_modules` in sync with `package-lock.json` ([e633778](https://github.com/marviq/generator-bat/commit/e633778))
* **generators/app/templates:** instruct `yuidoc` to also examine the ([1241f1b](https://github.com/marviq/generator-bat/commit/1241f1b))
* **generators/app/templates:** make generated code documentation expand any tabs that slipped through to the default 4 spaces ([047cd8e](https://github.com/marviq/generator-bat/commit/047cd8e))
* **generators/app/templates:** make generated code include links to native data types ([e4be45a](https://github.com/marviq/generator-bat/commit/e4be45a))
* **generators/app/templates:** transition to use `prepublishOnly` in favor of `prepublish` ([0d2c82b](https://github.com/marviq/generator-bat/commit/0d2c82b))
* **generators/demo:** add a default locale ([4909f1f](https://github.com/marviq/generator-bat/commit/4909f1f))
* **generators/demo:** add ability to adjust any of the current url's parameters without requiring knowledge of the current url itself or its structure ([1637fd2](https://github.com/marviq/generator-bat/commit/1637fd2))
* **generators/demo:** add ability to retrieve a build distribution target-environment's settings at run-time ([e2bc048](https://github.com/marviq/generator-bat/commit/e2bc048))
* **generators/demo:** add debugging-aid styling, will be included on debug builds only ([a0c4a49](https://github.com/marviq/generator-bat/commit/a0c4a49))
* **generators/demo:** add logic to determine the `$appRoot` element. ([f7e5989](https://github.com/marviq/generator-bat/commit/f7e5989))
* **generators/demo:** add option to let app load jQuery through a CDN ([021334d](https://github.com/marviq/generator-bat/commit/021334d))
* **generators/demo:** do a smarter insertion of the livereload url ([335284c](https://github.com/marviq/generator-bat/commit/335284c))
* **generators/demo:** link document root element identification to `.name` in `package.json` ([0b8e3ad](https://github.com/marviq/generator-bat/commit/0b8e3ad))
* **generators/demo:** replace mocha/chai based testing framework with a combo of karma, jasmine, phantomjs and browserify ([3ea9f91](https://github.com/marviq/generator-bat/commit/3ea9f91))
* **generators/demo/templates:** ensure livereloading works for _any_ /^local/ target-environment ([577dd61](https://github.com/marviq/generator-bat/commit/577dd61))
* **generators/model:** add service API endpoint fitting to a scaffolded model ([299a206](https://github.com/marviq/generator-bat/commit/299a206))
* **generators/view/templates:** add an `events` property ([d0be3f8](https://github.com/marviq/generator-bat/commit/d0be3f8))
* **model generator:** add a model schema as a standard place to list and document your model's ttributes ([58ac9e1](https://github.com/marviq/generator-bat/commit/58ac9e1))
* **model generator/templates:** add `defaults` property to template ([fff13b2](https://github.com/marviq/generator-bat/commit/fff13b2))
* **subgenerators:** prepare for using Backbone derivatives ([cfeb477](https://github.com/marviq/generator-bat/commit/cfeb477))
* **ui:** highlight a question's main subject. ([312f2de](https://github.com/marviq/generator-bat/commit/312f2de))
* **ux:** add feedback of `bat:demo` generator composition ([8e35dec](https://github.com/marviq/generator-bat/commit/8e35dec))
* **view sub-generator:** add inserting a new view's sass file `[@import](https://github.com/import)` to at an ordered position in '_views.sass' ([1ee475d](https://github.com/marviq/generator-bat/commit/1ee475d))
* **view sub-generator:** add notification when leaving 'src/sass/_views.sass' untouched. ([9d1d0f1](https://github.com/marviq/generator-bat/commit/9d1d0f1))
