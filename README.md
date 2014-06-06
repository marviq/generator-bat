# generator-bat
Every got tired of having to bootstrap your new projects over and over again? This Yeoman generator will generate it for you!

## Installation:
The generator is available in the global NPM:

```shell
npm install -g generator-bat 
```

## Usage
### New project

```shell
yo bat
```

### Subgenerators
The generator also comes with sub-generators for Backbone models, collections and views.
When using a subgenerator it will also automatically fill in the Yuidoc documentation partly
using your GIT username, views require there Handlebar template already etc.

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



