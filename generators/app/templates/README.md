<%= _.slugify(packageName) %>
======================

## introduction
<%= packageDescription %>


## installation
```bash
$ npm install <%= _.slugify(packageName) %> --save
```

## usage
Generate a project and then run grunt to build/update the distribution sources.
You can also use `grunt watch` to continuously update when file changes are detected.