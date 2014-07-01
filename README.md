## generator-bat ( Backbone Application Template )
Ever got tired of having to bootstrap your new projects over and over again? This Yeoman generator will generate it for you!

## Why would you want to use BAT?
When using the BAT generator you can immediatly start developing your application instead of worrying about setting everything up.
It gives you the following things out of the box:

- GruntFile: setup completely including, compass, browserify, yuidoc, uglify, compress etc
- BackboneJS
- HandlebarsJS
- Default project structure
- Support for browserify shims
- Watchify
- Lots more

## Installation:
The generator is available in the global NPM:

```shell
npm install -g generator-bat 
```

## Usage

To use this generator you will need the have the following things installed:

Yeoman:
```shell
npm install -g yo
```

### Main generator
To start a new project execute the following in your shell:

```shell
yo bat
```

It will ask you some questions, set everything up, do an npm install and your set to go!

### Subgenerators
The generator also comes with sub-generators for Backbone models, collections and views.
When using a subgenerator it will also automatically fill in the Yuidoc documentation partly
using your GIT username, views require there Handlebar template already etc. Basically it saves you
alot of time! So use them wisely!

#### Views
When a view is generated it will create for you: {{viewName}}.coffee, {{viewName}}.hbs. These will be placed in 
the root of the views folder.

Optionally: _{{viewName}}.sass and add it to the _views.sass.

```shell
yo bat:view
```

#### Models
When a model is generated it will create a {{modelName}}.coffee file in the root of the models folder.

Optionally: make the model a singleton.

```shell
yo bat:model
```

#### Collections
When a collection is generated it will create a {{collectionName}}.coffee file in the root of the collections folder.

Optionally: make the collection a singleton.

```shell
yo bat:collection
```

## Grunt watch tasks
For watching your files for changes and compile and build there are 2 routes you can choose the simple one is:

```shell
grunt watch
```

This will watch for changes on your .coffee .hbs and .sass files. The problem with this one is that the building of 
browserify becomes quite slow if your project becomes bigger.

The quicker way, which still a bit of BETA is using watchify, this caches parts of the browserify builds
and therefore builds this way quicker when changes occur:

```shell
npm install -g watchify
```

Then you can call the following script to watch changes on your .hbs and .coffee files:

```shell
./watchify.sh
```

Watchify doesn't watch your sass files so you will have to run a seperate watch process for that:

```shell
grunt watch:sass
```



