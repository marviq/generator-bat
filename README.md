# BAT, the Backbone Application Template

[![npm version](https://badge.fury.io/js/generator-bat.svg)](https://badge.fury.io/js/generator-bat)
[![David dependency drift detection](https://david-dm.org/marviq/generator-bat.svg)](https://david-dm.org/marviq/generator-bat)

A Yeoman generator collection created by marviq.

Ever got tired of having to scaffold your new webapp projects over and over again? Moan no more; Yeoman and BAT will do it for you!

## Getting Started

### What is Yeoman?

Trick question.  It's not a thing.  It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed.  He lives in the [npm](https://npmjs.org) package repository.  You only have to ask for him once, then he packs up and moves into your hard drive.  *Make sure you clean up, he likes new and shiny things.*

```bash
[sudo ]npm install -g yo
```

### Yeoman Generators

Yeoman travels light.  He didn't pack any generators when he moved in.  You can think of a generator like a plug-in.  You get to choose what type of application you wish to create, such as a BAT webapp.

To install BAT from [npm](https://npmjs.org), run:

```bash
[sudo ]npm install -g generator-bat
```

Finally, initiate the main app generator:

```bash
yo bat
```

Some of its subs:

```bash
yo bat:view
yo bat:model
yo bat:collection
```

Or, if you want a head start, even:

```bash
yo bat:demo
```

## The Finer Print

### Why BAT?

With BAT you can immediately start developing your application instead of worrying about getting your project set up first.
The main app generator will provide you with the following out of the box:

- A default project filesystem structure:
    - `src/` - a directory for your sources to live in;
    - `test/` - a directory to contain your unit tests;
    - `dist/` - where all you builds will be assembled;
    - `vendor/` - a place for keeping third-party libraries that [npm](https://npmjs.org) doesn't know how to deliver;
- Project files:
    - `Gruntfile.coffee`
    - `package.json`
    - `AUTHORS`
    - `LICENSE` ([BSD-3-Clause](https://spdx.org/licenses/BSD-3-Clause.html))
    - `README.md`
    - `.editorconfig`
    - `.gitattributes`
    - `.gitmessage`
    - `.jshintrc`
    - `.coffeelint.json`
- [Grunt](http://gruntjs.com), or rather, a complete and annotated `Gruntfile.coffee`, set up for [Browserify](https://github.com/jmreidy/grunt-browserify#readme), [Compass](https://github.com/gruntjs/grunt-contrib-compass#readme), code [linting](https://github.com/vojtajina/grunt-coffeelint#readme), [-testing](https://github.com/karma-runner/grunt-karma#readme), [-minification](https://github.com/gruntjs/grunt-contrib-uglify#readme) and [-documentation generation](https://github.com/gruntjs/grunt-contrib-yuidoc#readme);
- [Browserify](http://browserify.org/), bundling modular code for the browser, supporting [CoffeeScript](https://github.com/jnordberg/coffeeify#readme), [Handlebars](https://github.com/epeli/node-hbsfy#readme) and [browserify shims](https://github.com/thlorenz/browserify-shim#readme);
- [Backbone.js](http://backbonejs.org/) MV*x* foundation, including a main [router](http://backbonejs.org/#Router) implementation;
- [Backbone-Debugger](https://github.com/Maluen/Backbone-Debugger) browser plugin engagement (when available), automatically included with debugging builds;
- [CoffeeScript](http://coffeescript.org/) coding;
- [Compass](http://compass-style.org/) SASS styling;
- [Handlebars](http://handlebarsjs.com/) HTML templating;
- [jQuery](https://jquery.com/) browser normalization;
- Basic [Internationalisation](https://github.com/marviq/madlib-locale#readme) support;
- [YUIDoc](http://yui.github.io/yuidoc/) code documentation generation;

To scaffold out a new project like that, simply run:

```shell
yo bat
```

Yeoman will ask you some questions, set everything up and install dependencies for you.  Wait a bit for him to complete this and you're all set to go.

Additionally, Yeoman can:
- Provide you with a demo webapp implementation showcasing the BAT.  It is also possible to get this at a later instant through `yo bat:demo`;


### Sub-generators

BAT also comes with sub-generators that scaffold out new Backbone [models](http://backbonejs.org/#Model), [collections](http://backbonejs.org/#Collection) and [views](http://backbonejs.org/#View).

For each of these Yeoman will deliver a neat set of files, set up, YUIDoc code documentation pre-filled and integrated into existing code for as far as he dares to.


#### View

```shell
yo bat:view
```

Placed into the `src/views` directory, Yeoman will provide you with `*some-view-name*.coffee` and `*some-view-name*.hbs` files, respectively containing the `class` definition for the `*SomeViewName*View` and its handlebars template.

Additionally, Yeoman can:
- Create a `_*some-view-name*.sass` file into the `src/sass/views` directory and insert an `@import` for it into `src/sass/_views.sass`;

**Note** that for so-called routed views, you would probably want to incorporate this view into your webapp's main `router.coffee`.  Yeoman would have liked to do this for you too but is too afraid to break your code, so he doesn't.


#### Model

```shell
yo bat:model
```

Yeoman will provide you with a `*some-model-name*.coffee` file containing the `class` definition for `*SomeModelName*Model` and place it into the `src/models` directory.

Optionally, Yeoman can:
- Cause a singleton instance of the model to be exported instead of the `class` itself;


#### Collection

```shell
yo bat:collection
```

Yeoman will provide you with a `*some-collection-name*.coffee` file containing the `class` definition for `*SomeCollectionName*Collection` and place it into the `src/collections` directory.

Furthermore, Yeoman can:
- Also create the model for this collection;
- Cause a singleton instance of the collection to be exported instead of the `class` itself;


#### Demo

BAT also comes packed with a demo webapp implementation showcasing its features.  To get this, either answer _yes_ to the relevant prompt from an initial `yo bat` run, or when you answered _no_ there earlier, invoke:

```shell
yo bat:demo
```

**Note:** that the latter _will_ result in a few clashes with some of the files produced from the earlier `yo bat` run.  These are however, caveat codor, harmless.


### Grunt tasks

After you're all set up, you'll want to build your project; this is where [Grunt](http://gruntjs.com) comes in:

```shell
grunt dev
```

This will first do a development build (all builds will be assembled into the `dist` directory btw), and then enter a watch-for-changes -> re-build loop.

Grunt can do more than just that; here's a recap of common grunt idioms:

command           | description
:--               |:--
`grunt [default]` | shortcut for `grunt dist` unless the `GRUNT_TASKS` environment variable specifies a space separated list of alternative tasks to run instead;
`grunt dist`      | does a for-production, non-debugging, all-parts, tested, minified build plus artifacts;
`grunt debug`     | does a for-testing, debugging, all-parts except documentation, tested, as-is build;
`grunt dev`       | does a for-local, debugging, all-parts except documentation, as-is build; <br> _**(Note that this variant doesn't exit**.  Instead it'll keep a close watch on filesystem changes, selectively re-triggering part builds as needed)_
`grunt doc`       | will build just the code documentation;
`grunt lint`      | will just lint your code;
`grunt test`      | will run your test suite;
`grunt test:dev`  | will run your test suite and will keep monitoring it for changes, triggering re-runs;
`grunt --help`    | will show you all of the above and the kitchen sink;


### Unit tests

BAT comes with support for unit testing using [Karma](http://karma-runner.github.io/1.0/), [Jasmine](http://jasmine.github.io/2.4/introduction.html) and [PhantomJS](http://phantomjs.org/).

Unit testing is an integrated build step in both `dist` and `debug` build runs, but can also be run independently as:

```shell
grunt test
```

And as watched, continuous test runs as:

```shell
grunt test:dev
```

The latter invocation, while it is kept running, also offers the opportunity to launch a test suite run in any browser, simply by directing it to this url:

[`http://localhost:9876/debug.html`](http://localhost:9876/debug.html)

*Do not forget to open your dev tools and browser console there!*


## ChangeLog

Refer to the [releases on GitHub](https://github.com/marviq/generator-bat/releases) for a detailed log of changes.


## Contributing

### Prerequisites

  * [npm and node](https://nodejs.org/en/download/)
  * [git flow](https://github.com/nvie/gitflow/wiki/Installation)
  * [jq](https://stedolan.github.io/jq/download/)


### Setup

Clone this repository somewhere, switch to it, then:

```bash
git config commit.template ./.gitmessage
git checkout master
git checkout develop
git flow init -d
( cd ./.git/hooks && ln -s ../../.git-hooks/git-hook-on-npm-lockfile-change.sh post-checkout )
( cd ./.git/hooks && ln -s ../../.git-hooks/git-hook-on-npm-lockfile-change.sh post-merge )
npm run refresh
```

This will:

  * Set up [a helpful reminder](.gitmessage) of how to make [a good commit message](#commit-message-format-discipline).  If you adhere to this, then a
    detailed, meaningful [CHANGELOG](./CHANGELOG.md) can be constructed automatically;
  * Ensure you have local `master` and `develop` branches tracking their respective remote counterparts;
  * Set up the git flow [branching model](#branching-model) with default branch names;
  * Set up two [git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) to ensure that your `node_modules` will be synced with the
    [`package-lock.json`](https://docs.npmjs.com/files/package-lock.json) dependency tree definition whenever a `git merge` or -`checkout` causes it to
    change;
  * Install all required dependencies, pruned and deduplicated;


### Commit

#### Branching Model

This project uses [`git flow`](https://github.com/nvie/gitflow#readme).  Here's a quick [cheat sheet](http://danielkummer.github.io/git-flow-cheatsheet/).


#### Commit Message Format Discipline

This project uses [`conventional-changelog/standard-version`](https://github.com/conventional-changelog/standard-version) for automatic versioning and
[CHANGELOG](./CHANGELOG.md) management.

To make this work, *please* ensure that your commit messages adhere to the
[Commit Message Format](https://github.com/bcoe/conventional-changelog-standard/blob/master/convention.md#commit-message-format).  Setting your `git config`
to have the `commit.template` as referenced below will help you with [a detailed reminder](.gitmessage) of how to do this on every `git commit`.

```bash
git config commit.template ./.gitmessage
```


### Release

  * Determine what your next [semver](https://docs.npmjs.com/getting-started/semantic-versioning#semver-for-publishers) `<version>` should be:

    ```bash
    version="<version>"
    ```

  * Create and checkout a `release/v<version>` branch off of `develop`:

    ```bash
    git flow release start "v${version}"
    ```

  * Bump the package's `.version`, update the [CHANGELOG](./CHANGELOG.md), commit these, and tag the commit as `v<version>`:

    ```bash
    npm run release
    ```

  * If all is well this new `version` **should** be identical to your intended `<version>`:

    ```bash
    jq ".version == \"${version}\"" package.json
    ```

    *If this is not the case*, then either your assumptions about what changed are wrong, or (at least) one of your commits did not adhere to the
    [Commit Message Format Discipline](#commit-message-format-discipline); **Abort the release, and sort it out first.**

  * Merge `release/v<version>` back into both `develop` and `master`, checkout `develop` and delete `release/v<version>`:

    ```bash
    git flow release finish -n "v${version}"
    ```

    Note that contrary to vanilla `git flow`, the merge commit into `master` will *not* have been tagged (that's what the
    [`-n`](https://github.com/nvie/gitflow/wiki/Command-Line-Arguments#git-flow-release-finish--fsumpkn-version) was for).  This is done because
    `npm run release` has already tagged its own commit.

    I believe that in practice, this won't make a difference for the use of `git flow`; and ensuring it's done the other way round instead would render the
    use of `conventional-changelog` impossible.


### Publish

#### To NPM

```bash
git checkout v<version>
npm publish
git checkout develop
```

#### On GitHub

```bash
git push --follow-tags --all
```

  * Go to [https://github.com/marviq/generator-bat/releases](https://github.com/marviq/generator-bat/releases);
  * Click the `Draft a new release` button;
  * Select the appropriate `v<version>` tag from the dropdown menu;
  * You could enter a title and some release notes here; at the very least include a link to the corresponding section in the [CHANGELOG](./CHANGELOG.md) as:
    ```markdown
    [Change log](CHANGELOG.md# ... )
    ```
  * Click the `Publish release` button;


## ChangeLog

See [CHANGELOG](./CHANGELOG.md) for versions >`0.1.27`; For older versions, refer to the [releases on GitHub](https://github.com/marviq/generator-bat/releases?after=v1.0.0) for a detailed log of changes.


## License

[BSD-3-Clause](LICENSE)
