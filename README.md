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
The generator also comes with sub-generators for Backbone models, collections and views:

#### Views
When creating an view, it will also give you the option to automatically generate and SASS
file for the view, and add it to the _views.sass file for you. 

```shell
yo bat:view
```

#### Models

```shell
yo bat:model
```

#### Collections

```shell
yo bat:collection
```



