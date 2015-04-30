'use strict';

//
//  Yeoman bat app generator.
//

var generators      = require( 'yeoman-generator' )
,   yosay           = require( 'yosay' )
,   youtil          = require( './../../lib/youtil.js' )
,   mkdirp          = require( 'mkdirp' )
,   chalk           = require( 'chalk' )
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

var AppGenerator = generators.Base.extend(
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
                    ,   message:    'Would you like the demo app now? (If not, you can always get it later through `yo bat:demo`)'
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

                ,   ie8:                    data.ie8
                ,   i18n:                   data.i18n
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
                var data        = this.templateData
                ,   templates   =
                    [
                        //  Project

                        '@.editorconfig'
                    ,   '@.gitattributes'
                    ,   '@.gitignore'
                    ,   '@.jshintrc'
                    ,   [ '@AUTHORS' ]
                    ,   [ '@Gruntfile.coffee', tpl_tpl_settings ]
                    ,   '@LICENSE'
                    ,   [ '@README.md' ]
                    ,   '@coffeelint.json'

                    ,   [ '@package.json' ]

                        //  Style and Compass:

                    ,   'src/sass/app.sass'
                    ,   'src/sass/_settings.sass'
                    ,   'src/sass/_views.sass'
                    ,   'src/style/images/sprites/check-green.png'
                    ]
                ;

                if ( data.demo )
                {
                    this.composeWith( 'bat:demo' );
                }
                else
                {
                    //
                    //  Do not write these when a demo app is wanted right now; avoids conflicts.
                    //

                    templates.push(

                        //  The app main entry point:

                        [ 'src/app.coffee' ]
                    ,   [ 'src/index.template.html', tpl_tpl_settings ]

                        //  Backbone:

                    ,   [ 'src/router.coffee' ]

                    ,   'src/sass/views/_index.sass'
                    ,   'src/views/index.coffee'
                    ,   'src/views/index.hbs'
                    );

                    if ( this.i18n )
                    {
                        templates.push(
                            'src/i18n/en_GB.json'
                        ,   'src/i18n/nl_NL.json'
                        );
                    }
                }

                this._templatesProcess( templates );
            }
        }

    ,   install: function ()
        {
            /* jshint laxbreak: true */

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

            this.log( chalk.bold(
                '\n'
            +   'Running a number of "'
            +   chalk.yellow( 'npm install ' + chalk.cyan( '<package>' ) + ' --save' + chalk.cyan( '[' ) + '-dev' + chalk.cyan( ']' ))
            +   '"s for you to install required dependencies.'
            ));

            this.npmInstall( deps,      { save:     true } );
            this.npmInstall( devDeps,   { saveDev:  true } );
        }

    ,   end: function ()
        {
            /* jshint laxbreak: true */

            this.log(
                '\n'
            +   chalk.bold( 'I\m all done. You may invoke "' + chalk.yellow( 'grunt' ) + chalk.cyan( ' <arg>...' ) + '" now to build your project.\n' )

            +   '\n'
            +   'Here\'s a quick reminder of common grunt idioms:\n'

            +   '\n'
            +   chalk.bold( '  * ' + chalk.yellow( 'grunt ' + chalk.cyan( '[' ) + 'default' + chalk.cyan( ']' ) + '     ' ))
            +   '- does a production, non-debugging, all-parts, minified build plus artifacts;\n'

            +   chalk.bold( '  * ' + chalk.yellow( 'grunt debug         ' ))
            +   '- does a testing, debugging, all-parts except documentation, as-is build;\n'

            +   chalk.bold( '  * ' + chalk.yellow( 'grunt dev           ' ))
            +   '- does a local, debugging, all-parts except documentation, as-is build; and keeps a close\n'
            +   '                          watch on filesystem changes, selectively re-triggering part builds as needed;\n'

            +   '\n'
            +   chalk.bold( '  * ' + chalk.yellow( 'grunt doc           ' ))
            +   '- will build just the code documentation;\n'

            +   chalk.bold( '  * ' + chalk.yellow( 'grunt lint          ' ))
            +   '- will just lint your code;\n'

            +   chalk.bold( '  * ' + chalk.yellow( 'grunt test          ' ))
            +   '- will run your test suite;\n'

            +   '\n'
            +   chalk.bold( '  * ' + chalk.yellow( 'grunt --help        ' ))
            +   '- will show you all of the above and the kitchen sink;\n'
            );
        }
    }
);

_.extend(
    AppGenerator.prototype
,   require( './../../lib/generator.js' )
);

module.exports = AppGenerator;
