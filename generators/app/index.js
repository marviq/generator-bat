'use strict';

//
//  Yeoman bat app generator.
//

var generators      = require( 'yeoman-generator' )
,   yosay           = require( 'yosay' )
,   youtil          = require( './../../lib/youtil.js' )
,   mkdirp          = require( 'mkdirp' )
,   _               = require( 'lodash' )
;

var clean           = require( 'underscore.string/clean' );

//  Use different delimiters when our template itself is meant to be a template or template-like.
//
var tpl_tpl_settings =
        {
            evaluate:       /#%([\s\S]+?)%#/g
        ,   escape:         /#-([\s\S]+?)-#/g

        //  Not (yet) used:
        //
        ,   interpolate:    null
        }
;

module.exports  = generators.Base.extend(
    {
        constructor: function ()
        {
            generators.Base.apply( this, arguments );

            this.argument(
                'packageName'
            ,   {
                    type:           String
                ,   required:       false
                ,   desc:           'The package name of the webapp to create.'
                ,   defaults:       this.appname
                }
            );
        }

    ,   initializing: function ()
        {
            //  Load the BAT generator's 'package.json'.
            //
            this.pkg = require( './../../package.json' );

            //  Container for template expansion data.
            //
            this.templateData = {};
        }

    ,   prompting:
        {
            askSomeQuestions: function ()
            {
                /* jshint laxbreak: true */

                var done = this.async();

                //  Have Yeoman greet the user.
                //
                this.log( yosay(
                    'Welcome to the BAT generator! (Backbone Application Template)\n'
                +   'Powered by marviq'
                ));

                //  Ask the user for the webapp details.
                //
                var prompts = [
                    {
                        name:       'packageName'
                    ,   message:    'What is the package name of this webapp?'
                    ,   default:    this.packageName
                    ,   validate:   youtil.isNpmName
                    }
                ,   {
                        name:       'packageDescription'
                    ,   message:    'What is the purpose (description) of this webapp?'
                    ,   validate:   youtil.isNonBlank
                    ,   filter:     youtil.sentencify
                    }
                ,   {
                        name:       'authorName'
                    ,   message:    'What is your name?'
                    ,   default:    this.user.git.name()
                    ,   validate:   youtil.isNonBlank
                    ,   filter:     clean
                    }
                ,   {
                        name:       'authorEmail'
                    ,   message:    'What is your email address?'
                    ,   default:    this.user.git.email()
                    ,   validate:   youtil.isNonBlank
                    ,   filter:     _.trim
                    }
                ,   {
                        name:       'authorUrl'
                    ,   message:    'If any, by what URL would you like to be known?'
                    ,   default:    ''
                    ,   filter:     _.trim
                    }
                ,   {
                        name:       'multiLanguage'
                    ,   type:       'confirm'
                    ,   message:    'Do you need multi language support?'
                    ,   default:    false
                    }
                ,   {
                        name:       'ie8'
                    ,   type:       'confirm'
                    ,   message:    'Do you need IE8 and lower support? (affects the jQuery version and shims HTML5 and media query support)'
                    ,   default:    false
                    }
                ,   {
                        name:       'demo'
                    ,   type:       'confirm'
                    ,   message:    'Do you want the demo app?'
                    ,   default:    false
                    }
                ];

                this.prompt(
                    prompts
                ,   function ( answers )
                    {
                        _.extend( this.templateData, answers );

                        done();

                    }.bind( this )
                );
            }
        }

    ,   configuring: function ()
        {
            var data    = this.templateData;

            data.i18n   = data.multiLanguage || data.demo;

            //
            //  Save a '.yo-rc.json' config file.
            //  At the very least this marks your project root for sub-generators.
            //
            //  Note that answers to prompts that have `store: true` defined aren't stored here, but in '~/.yo-rc-global.json'.
            //

            this.config.set(
                {
                    'generator-version':    this.pkg.version
                }
            );
        }

    ,   writing:
        {
            setupDirectoryStructure: function ()
            {
                var data    = this.templateData
                ,   layout  =
                    [
                        //  App source:

                        'src'

                        //  Backbone:

                    ,   'src/collections'
                    ,   'src/models'
                    ,   'src/views'

                        //  Style and Compass:

                    ,   'src/sass'

                    ,   'src/style'
                    ,   'src/style/images/'
                    ,   'src/style/images/sprites/'

                        //  Testing:

                    ,   'test'

                        //  Third-party, external libraries:

                    ,   'vendor'
                    ]
                ;

                //  Location for 'i' + 'nternationalisatio'.length + 'n' definitions:
                //
                //  https://github.com/marviq/madlib-locale#readme
                //

                if ( data.i18n )
                {
                    layout.push( 'src/i18n' );
                }

                for ( var i=0, l=layout.length; i < l ; i++ )
                {
                    mkdirp.sync( this.destinationPath( layout[ i ] ));
                }
            }

        ,   setupProjectFiles: function()
            {
                var data = this.templateData;

                // Setup the config files for git, editor etc.
                //
                this.copy( '@.editorconfig',    '.editorconfig' );
                this.copy( '@.gitattributes',   '.gitattributes' );
                this.copy( '@.gitignore',       '.gitignore' );
                this.copy( '@coffeelint.json',  'coffeelint.json' );
                this.copy( '@.jshintrc',        '.jshintrc' );

                // write package.json and readme file
                //
                this.template( '@package.json',     'package.json', data );
                this.template( '@AUTHORS',          'AUTHORS', data );
                this.template( '@README.md',        'README.md', data );
                this.copy( '@LICENSE',              'LICENSE' );

                // Setup build, watch files etc
                //
                this.template( '@Gruntfile.coffee', 'Gruntfile.coffee', data, tpl_tpl_settings );

                // Setup the sass files
                //
                this.copy( 'src/sass/app.sass',             'src/sass/app.sass' );
                this.copy( 'src/sass/_settings.sass',       'src/sass/_settings.sass' );
                this.copy( 'src/sass/_views.sass',          'src/sass/_views.sass' );
                this.copy( 'src/style/images/sprites/check-green.png',      'src/style/images/sprites/check-green.png' );

                // If we want the demo copy the demo files
                //
                if ( data.demo )
                {
                    this.copy( 'demo/router.coffee',                'src/router.coffee' );
                    this.template( 'demo/index.template.html',      'src/index.template.html', data, tpl_tpl_settings );

                    this.copy( 'demo/views/buildscript.hbs',        'src/views/buildscript.hbs' );
                    this.copy( 'demo/views/buildscript.coffee',     'src/views/buildscript.coffee' );

                    this.copy( 'demo/views/documentation.hbs',      'src/views/documentation.hbs' );
                    this.copy( 'demo/views/documentation.coffee',   'src/views/documentation.coffee' );

                    this.copy( 'demo/views/i18n.hbs',               'src/views/i18n.hbs' );
                    this.copy( 'demo/views/i18n.coffee',            'src/views/i18n.coffee' );

                    this.copy( 'demo/views/index.hbs',              'src/views/index.hbs' );
                    this.copy( 'demo/views/index.coffee',           'src/views/index.coffee' );
                    this.copy( 'demo/sass/views/_index.sass',       'src/sass/views/_index.sass' );

                    this.copy( 'demo/views/navigation.hbs',         'src/views/navigation.hbs' );
                    this.copy( 'demo/views/navigation.coffee',      'src/views/navigation.coffee' );

                    this.copy( 'demo/style/images/marviq-logo-web.png', 'src/style/images/marviq-logo-web.png' );
                    this.copy( 'demo/style/images/documentation.jpg', 'src/style/images/documenting.jpg' );

                    // Copy the i18n files
                    //
                    this.copy( 'demo/i18n/nl_NL.json',              'src/i18n/nl_NL.json' );
                    this.copy( 'demo/i18n/en_GB.json',              'src/i18n/en_GB.json' );

                    // Copy the app main entry point
                    //
                    this.template( 'demo/app.coffee',               'src/app.coffee', data );

                    // Copy the test example files
                    //
                    this.copy( 'demo/models/example.coffee', 'src/models/example.coffee' );
                    this.copy( 'demo/test/example.coffee',  'test/example.coffee' );
                }
                else
                {
                    if ( data.i18n )
                    {
                        // Copy the i18n files
                        //
                        this.copy( 'src/i18n/nl_NL.json',  'src/i18n/nl_NL.json' );
                        this.copy( 'src/i18n/en_GB.json',  'src/i18n/en_GB.json' );
                    }


                    this.template( 'src/index.template.html',       'src/index.template.html', data, tpl_tpl_settings );
                    this.template( 'src/router.coffee',             'src/router.coffee', data );

                    this.copy( 'src/views/index.coffee',            'src/views/index.coffee' );
                    this.copy( 'src/views/index.hbs',               'src/views/index.hbs' );
                    this.copy( 'src/sass/views/_index.sass',        'src/sass/views/_index.sass' );

                    // Copy the app main entry point
                    //
                    this.template( 'src/app.coffee',                'src/app.coffee', data );
                }
            }
        }

    ,   install: function ()
        {
            var data = this.templateData
            ,   deps =
                    [
                        'backbone'
                    ,   ( 'jquery' + ( data.ie8 ? '@<2' : '' ))
                    ,   'madlib-console'
                    ,   'madlib-hostmapping'
                    ,   'madlib-settings'
                    ,   'q'
                    ,   'underscore'
                    ]
            ,   devDeps =
                    [
                        'browserify'
                    ,   'browserify-shim'
                    ,   'chai'
                    ,   'coffeeify'
                    ,   'grunt'
                    ,   'grunt-browserify'
                    ,   'grunt-coffee-jshint'
                    ,   'grunt-coffeelint'
                    ,   'grunt-contrib-clean'
                    ,   'grunt-contrib-compass'
                    ,   'grunt-contrib-compress'
                    ,   'grunt-contrib-copy'
                    ,   'grunt-contrib-uglify'
                    ,   'grunt-contrib-watch'
                    ,   'grunt-contrib-yuidoc'
                    ,   'grunt-mocha-test'
                    ,   'grunt-template'
                    ,   'handlebars'
                    ,   'hbsfy'
                    ]
            ;

            if ( data.i18n )
            {
                deps.push( 'madlib-locale' );
            }

            this.npmInstall( deps,      { save:     true } );
            this.npmInstall( devDeps,   { saveDev:  true } );

            //  Merely cause the "I'm all done. Running 'npm install' for you to ..." message to be outputted.
            //  Because of the `.npmInstal()`s above, setting 'skipInstall' to `true` here would do nothing to prevent those.
            //
            this.installDependencies(
                {
                    bower:          false
                ,   npm:            true
                ,   skipInstall:    false
                ,   skipMessage:    false
                }
            );
        }
    }
);
