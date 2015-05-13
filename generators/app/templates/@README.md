# <%= packageName %>

<%= packageDescription %>j


## Development

### Prerequisites

#### npm and node

See: https://nodejs.org/download/

#### grunt

```bash
$ [sudo ]npm install -g grunt-cli
```

Or see: http://gruntjs.com/getting-started#installing-the-cli

#### compass v1.0.0 or greater

```bash
$ [sudo ]gem install compass
```

Or see: http://thesassway.com/beginner/getting-started-with-sass-and-compass#install-sass-and-compass 


### Build

Clone this repo somewhere and switch to it, then:

```bash
$ npm install
```

This will install all required dependencies. It will also invoke `grunt` (no args) for you, creating a production build in `./dist` (plus artifacts).

If you would like something different then a production build, here's a recap of common grunt idioms:

command           | description
:--               |:--
`grunt [default]` | does a production, non-debugging, all-parts, minified build plus artifacts;
`grunt debug`     | does a testing, debugging, all-parts except documentation, as-is build;
`grunt dev`       | does a local, debugging, all-parts except documentation, as-is build; <br>_(**Note that this variant doesn't exit**. Instead it'll keep a close watch on filesystem changes, selectively re-triggering part builds as needed)_
`grunt doc`       | will build just the code documentation;
`grunt lint`      | will just lint your code;
`grunt test`      | will run your test suite;
`grunt --help`    | will show you all of the above and the kitchen sink;


## Install 

_\[Ultimately, you may also want to include instructions on how to install and use a production release of <%= packageName %>. This text is just a placeholder.\]_


## License

[BSD-3-Clause](LICENSE)
