# BAT, the Backbone Application Template

[![npm version](https://badge.fury.io/js/generator-bat.svg)](http://badge.fury.io/js/generator-bat)
[![David dependency drift detection](https://david-dm.org/marviq/generator-bat.svg)](https://david-dm.org/marviq/generator-bat)

A Yeoman generator collection created by marviq.

Ever got tired of having to scaffold your new webapp projects over and over again? Moan no more; Yeoman and BAT will do it for you!

## Getting Started

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```bash
[sudo ]npm install -g yo
```

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a BAT webapp.

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
    - `.jshintrc`
    - `.coffeelint.json`
- [Grunt](http://gruntjs.com), or rather, a complete and annotated `Gruntfile.coffee`, set up for [Browserify](https://github.com/jmreidy/grunt-browserify#readme), [Compass](https://github.com/gruntjs/grunt-contrib-compass#readme), code [linting](https://github.com/vojtajina/grunt-coffeelint#readme), [-testing](https://github.com/pghalliday/grunt-mocha-test#readme), [-minification](https://github.com/gruntjs/grunt-contrib-uglify#readme) and [-documentation generation](https://github.com/gruntjs/grunt-contrib-yuidoc#readme);
- [Browserify](http://browserify.org/), bundling modular code for the browser, supporting [CoffeeScript](https://github.com/jnordberg/coffeeify#readme), [Handlebars](https://github.com/epeli/node-hbsfy#readme) and [browserify shims](https://github.com/thlorenz/browserify-shim#readme);
- [Backbone.js](http://backbonejs.org/) MV*x* foundation, including a main [router](http://backbonejs.org/#Router) implementation;
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

Yeoman will ask you some questions, set everything up and install dependencies for you. Wait a bit for him to complete this and you're all set to go.

Additionally, Yeoman can:
- Provide you with a demo webapp implementation showcasing the BAT. It is also possible to get this at a later instant through `yo bat:demo`;


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

**Note** that for so-called routed views, you would probably want to incorporate this view into your webapp's main `router.coffee`. Yeoman would have liked to do this for you too but is too afraid to break your code, so he doesn't.


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

BAT also comes packed with a demo webapp implementation showcasing its features. To get this, either answer _yes_ to the relevant prompt from an initial `yo bat` run, or when you answered _no_ there earlier, invoke:

```shell
yo bat:demo
```

**Note:** that the latter _will_ result in a few clashes with some of the files produced from the earlier `yo bat` run. These are however, caveat codor, harmless.


## Grunt tasks

After you're all set up, you'll want to build your project; this is where [Grunt](http://gruntjs.com) comes in:

```shell
grunt dev
```

This will first do a development build (all builds will be assembled into the `dist` directory btw), and then enter a watch-for-changes -> re-build loop.

Grunt can do more than just that; here's a recap of common grunt idioms:

command           | description
:--               |:--
`grunt [default]` | does a production, non-debugging, all-parts, minified build plus artifacts;
`grunt debug`     | does a testing, debugging, all-parts except documentation, as-is build;
`grunt dev`       | does a local, debugging, all-parts except documentation, as-is build; <br>_(**Note that this variant doesn't exit**. Instead it'll keep a close watch on filesystem changes, selectively re-triggering part builds as needed)_
`grunt doc`       | will build just the code documentation;
`grunt lint`      | will just lint your code;
`grunt test`      | will run your test suite;
`grunt --help`    | will show you all of the above and the kitchen sink;


## Unit tests

BAT comes with support for unit testing using [Mocha](http://mochajs.org/) and [Chai](http://chaijs.com/). The demo webapp has a basic (and admittedly, pretty unconnected) example of this.

You may already have guessed how to run your test suite; it's:

```shell
grunt test
```

The default grunt task also includes the `test` task. You may or may not want to add it to your `dev` task too, depending on your workflow.


## ChangeLog

Refer to the [releases on GitHub](https://github.com/marviq/generator-bat/releases) for a detailed log of changes.


## License

[BSD-3-Clause](LICENSE)
