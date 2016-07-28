# <%- packageName %>

<%- packageDescription %>


## Contributing

### Prerequisites

* [npm and node](https://nodejs.org/en/download/)
* [git flow](https://github.com/nvie/gitflow/wiki/Installation)
* [jq](https://stedolan.github.io/jq/download/)
* [grunt](http://gruntjs.com/getting-started#installing-the-cli)
  ```bash
  $ [sudo ]npm install -g grunt-cli
  ```

* [compass v1.0.0 or greater](http://thesassway.com/beginner/getting-started-with-sass-and-compass#install-sass-and-compass)
  ```bash
  $ [sudo ]gem install compass
  ```


### Setup

Clone this repository somewhere, switch to it, then:

```bash
$ git config commit.template ./.gitmessage
# ... initialize your branching model tools here, if need be ... ex: git flow init -d
$ npm install
```

This will:
  * Setup [a helpful reminder](.gitmessage) of how to make [a good commit message](#commit-message-format-discipline).  If you adhere to this, then a detailed,
    meaningful [CHANGELOG](CHANGELOG.md) can be constructed automatically.
  * Setup the git flow [branching model](#branching-model) and checkout the `develop` branch.
  * Install all required dependencies.
  * The latter command will also invoke `grunt` (no args) for you, creating a production build in `./dist` (plus artifacts).


### Build

Most of the time you will want to do a
```bash
grunt dev
```
... for creating a watched development build, or simply
```bash
grunt
```
... for a production-ready build.

If you would like something different, here's a recap of most common grunt idioms:

command           | description
:--               |:--
`grunt [default]` | does a for-production, non-debugging, all-parts, tested, minified build plus artifacts;
`grunt debug`     | does a for-testing, debugging, all-parts except documentation, tested, as-is build;
`grunt dev`       | does a for-local, debugging, all-parts except documentation, as-is build; <br>_(**Note that this variant doesn't exit**. Instead it'll keep a close watch on filesystem changes, selectively re-triggering part builds as needed)_
`grunt doc`       | will build just the code documentation;
`grunt lint`      | will just lint your code;
`grunt test`      | will run your test suite;
`grunt test:dev`  | will run your test suite and will keep monitoring it for changes, triggering re-runs;
`grunt --help`    | will show you all of the above and the kitchen sink;


### Test

Unit testing is an integrated build step in both `default` and `debug` build runs, but can also be run independently as:

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


### Commit

#### Branching Model

_\[Here, you might want to say something about the branching model you intend to use. Examples are [git flow](https://github.com/nvie/gitflow#readme), [GitHub flow](https://help.github.com/articles/what-is-a-good-git-workflow/) and [GitLab flow](http://docs.gitlab.com/ee/workflow/gitlab_flow.html). Should you want to change this, then do not forget to adjust the [**setup** section](#setup) accordingly.)


#### Commit Message Format Discipline

This project uses [`conventional-changelog/standard-version`](https://github.com/conventional-changelog/standard-version) for automatic versioning and
[CHANGELOG](CHANGELOG.md) management.

To make this work, *please* ensure that your commit messages adhere to the
[Commit Message Format](https://github.com/bcoe/conventional-changelog-standard/blob/master/convention.md#commit-message-format).  Setting your `git config` to
have the `commit.template` as referenced below will help you with [a detailed reminder](.gitmessage) of how to do this on every `git commit`.

```bash
$ git config commit.template ./.gitmessage
```


### Release

_\[Here, you might want to say something about your release- and versioning strategy. Likely, this is related to what you chose for a branching model. At the very least it should include:]_

* Determine what your next [semver](https://docs.npmjs.com/getting-started/semantic-versioning#semver-for-publishers) `<version>` should be:
  ```bash
  $ version="<version>"
  ```

* Bump the package's `.version`, update the [CHANGELOG](./CHANGELOG.md), commit these, and tag the commit as `v<version>`:
  ```bash
  $ npm run release
  ```

* If all is well this new `version` **should** be identical to your intended `<version>`:
  ```bash
  $ jq ".version == \"${version}\"" package.json
  ```

  *If this is not the case*, then either your assumptions about what changed are wrong, or (at least) one of your commits did not adhere to the
  [Commit Message Format Discipline](#commit-message-format-discipline); **Abort the release, and sort it out first.**


### Publish

_\[Ultimately, you may also want to include instructions on how to publish and deploy a production release of *<%- packageName %>*. This text is just a
placeholder.\]_


## License

[BSD-3-Clause](LICENSE)
