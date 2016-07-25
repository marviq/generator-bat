'use strict';

//
//  Yeoman bat app generator.
//

var generators      = require( 'yeoman-generator' )
,   yosay           = require( 'yosay' )
,   youtil          = require( './../../lib/youtil.js' )
,   mkdirp          = require( 'mkdirp' )
,   chalk           = require( 'chalk' )
,   semver          = require( 'semver' )
,   tags            = require( 'language-tags' )
,   _               = require( 'lodash' )
;

var clean           = require( 'underscore.string/clean' )
,   dasherize       = require( 'underscore.string/dasherize' )
,   trim            = require( 'underscore.string/trim' )
;

//  Use a different delimiter when our template itself is meant to be a template or template-like.
//
var tpl_tpl_settings =
        {
            delimiter:      '@'
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
                ,   desc:           'The name of the webapp to create.'
                }
            );

            //  Also add 'packageName' as a - hidden - option, defaulting to the positional argument's value.
            //  This way `_promptsPruneByOptions()` can filter away prompting for the package name too.
            //
            this.option(
                'packageName'
            ,   {
                    type:           String
                ,   desc:           'The name of the webapp to create.'
                ,   default:        this.packageName
                ,   hide:           true
                }
            );

            //  Normal options.
            //
            this.option(
                'description'
            ,   {
                    type:           String
                ,   desc:           'The purpose of the webapp to create.'
                }
            );

            this.option(
                'authorName'
            ,   {
                    type:           String
                ,   desc:           'The name of the main author creating the webapp.'
                }
            );

            this.option(
                'authorEmail'
            ,   {
                    type:           String
                ,   desc:           'The email address of the main author creating the webapp.'
                }
            );

            this.option(
                'authorUrl'
            ,   {
                    type:           String
                ,   desc:           'A website url identifying the main author creating the webapp.'
                }
            );

            this.option(
                'copyrightOwner'
            ,   {
                    type:           String
                ,   desc:           'The full name of the webapp\'s copyright owner.'
                }
            );

            this.option(
                'i18n'
            ,   {
                    type:           Boolean
                ,   desc:           'Specify whether internationalisation support is needed.'
                }
            );

            this.option(
                'i18nLocaleDefault'
            ,   {
                    type:           Boolean
                ,   desc:           'Specify the default locale.'
                ,   alias:          'locale'
                }
            );

            this.option(
                'ie8'
            ,   {
                    type:           Boolean
                ,   desc:           'Specify whether internet explorer version 8 support is needed.'
                }
            );

            this.option(
                'demo'
            ,   {
                    type:           Boolean
                ,   desc:           'Specify whether the demonstration app should also be included.'
                }
            );
        }

    ,   description:
            chalk.bold(
                'This is the ' + chalk.cyan( 'project and barebones app' )
            +   ' generator for BAT, the Backbone Application Template'
            +   ' created by ' + chalk.blue( 'marv' ) + chalk.red( 'iq' ) + '.'
            )

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

                //  Ask only those question that have not yet been provided with answers via the command line.
                //
                var prompts = this._promptsPruneByOptions(
                        [
                            {
                                type:       'input'
                            ,   name:       'packageName'
                            ,   message:    'What is the name of this webapp you so desire?'
                            ,   default:
                                    (
                                        youtil.definedToString( this.options.packageName )
                                    ||  trim( dasherize( youtil.definedToString( this.appname )), '-' )
                                    )
                            ,   validate:   youtil.isNpmName
                            }
                        ,   {
                                type:       'input'
                            ,   name:       'description'
                            ,   message:    'What is the purpose (description) of this webapp?'
                            ,   default:    youtil.definedToString( this.options.description )
                            ,   validate:   youtil.isNonBlank
                            ,   filter:     youtil.sentencify
                            }
                        ,   {
                                type:       'input'
                            ,   name:       'authorName'
                            ,   message:    'What is the main author\'s name?'
                            ,   default:    ( youtil.definedToString( this.options.auhorName ) || youtil.definedToString( this.user.git.name() ))
                            ,   validate:   youtil.isNonBlank
                            ,   filter:     clean
                            }
                        ,   {
                                type:       'input'
                            ,   name:       'authorEmail'
                            ,   message:    'What is the main author\'s email address?'
                            ,   default:    ( youtil.definedToString( this.options.auhorEmail ) || youtil.definedToString( this.user.git.email() ))
                            ,   validate:   youtil.isNonBlank
                            ,   filter:     _.trim
                            }
                        ,   {
                                type:       'input'
                            ,   name:       'authorUrl'
                            ,   message:    'If any, what is the main author\'s website url?'
                            ,   default:    ( youtil.definedToString( this.options.auhorUrl ) || '' )
                            ,   filter:     _.trim
                            }
                        ,   {
                                type:       'input'
                            ,   name:       'copyrightOwner'
                            ,   message:    'What is the full name of the copyright owner of this webapp?'
                            ,   default: function ( answers )
                                {
                                    return answers.authorName;
                                }
                            ,   validate:   youtil.isNonBlank
                            ,   filter:     _.trim
                            ,   store:      true
                            }
                        ,   {
                                type:       'confirm'
                            ,   name:       'i18n'
                            ,   message:    'Do you need internationalisation support?'
                            ,   default:    false
                            }
                        ,   {
                                type:       'input'
                            ,   name:       'i18nLocaleDefault'
                            ,   message:    'What should the default locale be? (Please use a valid [BCP 47 language tag](https://tools.ietf.org/html/bcp47#section-2))'
                            ,   default:    ( youtil.definedToString( this.options.i18nLocaleDefault ) || 'en-US' )
                            ,   validate:   tags.check
                            ,   filter: function ( value )
                                {
                                    return tags( value ).format();
                                }
                            ,   when: function( answers )
                                {
                                    return answers.i18n || this.templateData.i18n;
                                }.bind( this )
                            }
                        ,   {
                                type:       'confirm'
                            ,   name:       'ie8'
                            ,   message:    'Do you need IE8 and lower support? (affects the jQuery version and shims HTML5 and media query support)'
                            ,   default:    false
                            }
                        ,   {
                                type:       'confirm'
                            ,   name:       'demo'
                            ,   message:    'Would you like the demo app now? (If not, you can always get it later through `yo bat:demo`)'
                            ,   default:    false
                            }
                        ]
                    )
                ;

                if ( prompts.length )
                {
                    //  Have Yeoman greet the user.
                    //
                    this.log( yosay( 'Welcome to BAT, the Backbone Application Template' ));

                    return (
                        this
                            .prompt( prompts )
                            .then( function ( answers ) { _.extend( this.templateData, answers ); }.bind( this ) )
                    );
                }
            }
        }

    ,   configuring: function ()
        {
            var data                        = this.templateData
            ,   localeDefaultOrig           = data.i18nLocaleDefault
            ;

            if ( data.demo )
            {
                data.i18n                   = true;
                data.i18nLocaleDefault      = 'en-GB';
            }

            if ( data.i18n )
            {
                data.i18nLocaleDefaultLanguage  = tags( data.i18nLocaleDefault ).language().descriptions()[0];
                data.i18nLocaleDefaultRegion    = tags( data.i18nLocaleDefault ).region().format();
            }

            data.copyrightYear              = new Date().getFullYear();
            data.packageDescription         = data.description;

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

            if ( data.i18n )
            {
                //  Save the intended default locale if any.
                //
                this.config.set( 'i18nLocaleDefault',   localeDefaultOrig || data.i18nLocaleDefault );
            }
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
                    ,   'src/mixins'
                    ,   'src/models'
                    ,   'src/views'

                        //  Style and Compass:

                    ,   'src/sass'
                    ,   'src/sass/overrides'
                    ,   'src/sass/settings'
                    ,   'src/sass/views'

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
                    ,   '@.gitmessage'
                    ,   '@.jshintrc'
                    ,   [ '@AUTHORS' ]
                    ,   '@CHANGELOG.md'
                    ,   [ '@Gruntfile.coffee', tpl_tpl_settings ]
                    ,   [ '@LICENSE' ]
                    ,   [ '@README.md' ]
                    ,   '@coffeelint.json'

                    ,   [ '@package.json' ]

                        //  Style and Compass:

                    ,   'src/sass/settings/_compass.sass'
                    ,   'src/sass/settings/_fonts.sass'
                    ,   'src/sass/settings/_icons.scss'
                    ,   'src/sass/settings/_layout.sass'
                    ,   'src/sass/_overrides.sass'
                    ,   'src/sass/_settings.sass'
                    ,   'src/sass/_views.sass'
                    ,   [ 'src/sass/app.sass' ]
                    ,   'src/style/images/sprites/check-green.png'
                    ]
                ;

                if ( !( data.demo ))
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
                    ,   [ 'src/views/index.coffee' ]
                    ,   'src/views/index.hbs'
                    );

                    if ( data.i18n )
                    {
                        //  Need a name mapping for this one
                        //
                        this._templatesProcess(
                            { 'src/i18n/bcp47-language-tag.json': [ 'src/i18n/' + data.i18nLocaleDefault + '.json' ] }
                        );
                    }
                }

                this._templatesProcess( templates );
            }

        ,   setupDemo: function ()
            {
                if ( this.templateData.demo )
                {
                    this.composeWith( 'bat:demo' );
                }
            }
        }

    ,   install: function ()
        {
            /* jshint laxbreak: true */

            var data = this.templateData
            ,   deps =
                    [
                        'backbone'
                    ,   'backbone.cocktail'
                    ,   ( 'jquery' + ( data.ie8 ? '@<2' : '' ))
                    ,   'madlib-hostmapping'
                    ,   'madlib-settings'
                    ,   'q'
                    ,   'underscore'
                    ]
            ,   devDeps =
                    [
                        'browserify-shim'
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
                    ,   'standard-version'
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

    ,   end:
        {
            intro: function ()
            {
                /* jshint laxbreak: true */

                this.preReqIssues = 0;

                this.log(
                    '\n'
                +   chalk.bold( 'I\m all done.\n' )

                +   '\n'
                +   chalk.bold(
                        'Please do not forget to checkout the ' + chalk.cyan( '[placeholder]' ) + ' sections in the "' + chalk.yellow( 'README.md' )
                    +   '" for some further things you may want to set up.\n'
                    )

                +   '\n'
                +   chalk.bold( 'But for now, you may invoke "' + chalk.yellow( 'grunt' ) + chalk.cyan( ' <arg>...' ) + '" to build your project.' )
                );
            }

        ,   assessGrunt: function ()
            {
                return new Promise(
                    function ( done ) {
                        var error   = function ()
                            {
                                /* jshint laxbreak: true */

                                this.log(
                                    '\n'
                                +   chalk.red( 'Hang on, it appears that "' + chalk.bold.yellow( 'grunt' ) + '" hasn\'t been installed yet!\n' )
                                +   '\n'
                                +   chalk.gray(
                                        'Consider running "'
                                    +   chalk.bold.yellow( chalk.cyan( '[' ) + 'sudo ' + chalk.cyan( ']' ) + 'npm install -g grunt-cli' )
                                    +   '" first.\n'
                                    )
                                );

                                this.preReqIssues++;

                            }.bind( this )
                        ;

                        this.spawnCommand( 'command', [ '-v', 'grunt' ], { stdio: 'ignore' } )
                            .on( 'exit', function ( exit )
                                {
                                    if ( exit ) { error(); }
                                    done();
                                }
                            )
                        ;

                    }.bind( this )
                );
            }

        ,   assessCompass: function ()
            {
                return new Promise(
                    function ( done ) {
                        var minver  = '1.0.0'
                        ,   version = ''
                        ,   compass = chalk.bold.yellow( 'compass' )
                        ,   error   = function ( nexist )
                            {
                                /* jshint laxbreak: true */

                                var first = !( this.preReqIssues );

                                this.log(
                                    '\n'
                                +   chalk.red(
                                        ( first ? 'Hang on,' : 'Oh, and' )
                                    +   (   nexist
                                        ?   ' it appears that "' + compass + '" hasn\'t been installed ' + ( first ? 'yet' : 'either' ) + '!\n'
                                        :   ' your "' + compass + '" version appears outdated' + ( first ? '' : ' as well' ) + '! '
                                        +   'I found only ' + chalk.underline( version ) + ' and you\'ll need ' + chalk.underline( minver + ' or newer' ) + '.\n'
                                        )
                                    )
                                +   '\n'
                                +   chalk.gray(
                                        'Consider running "'
                                    +   chalk.bold.yellow( chalk.cyan( '[' ) + 'sudo ' + chalk.cyan( ']' ) + 'gem install compass' ) + '" '
                                    +   ( first ? 'first' : 'too' ) + '.\n'
                                    +   '\n'
                                    +   'Or see: ' + chalk.blue( 'http://thesassway.com/beginner/getting-started-with-sass-and-compass#install-sass-and-compass\n' )
                                    )
                                );

                                this.preReqIssues++;

                            }.bind( this )
                        ;

                        this.spawnCommand( 'command', [ 'compass', '-q', '-v' ], { stdio: [ 'ignore', 'pipe', 'ignore' ] } )
                            .on( 'exit', function ( exit )
                                {
                                    version = version.trim();

                                    if ( exit || !( semver.satisfies( version, '>=' + minver )) ) { error( exit ); }
                                    done();
                                }
                            )
                            .stdout.on( 'data', function ( chunk )
                                {
                                    version += chunk;
                                }
                            )
                        ;

                    }.bind( this )
                );
            }

        ,   epilogue: function ()
            {
                /* jshint laxbreak: true */

                this.log(
                    '\n'
                +   ( this.preReqIssues ? 'In any case, h' : 'H' ) + 'ere\'s a quick reminder of common grunt idioms:\n'

                +   '\n'
                +   chalk.bold( '  * ' + chalk.yellow( 'grunt ' + chalk.cyan( '[' ) + 'default' + chalk.cyan( ']' ) + '     ' ))
                +   '- does a production, non-debugging, all-parts, minified build plus artifacts;\n'

                +   chalk.bold( '  * ' + chalk.yellow( 'grunt debug         ' ))
                +   '- does a testing, debugging, all-parts except documentation, as-is build;\n'

                +   chalk.bold( '  * ' + chalk.yellow( 'grunt dev           ' ))
                +   '- does a local, debugging, all-parts except documentation, as-is build;\n'
                +   '                          (' + chalk.bold( 'Note that this variant doesn\'t exit.' ) + ' Instead, it\'ll keep a close watch on\n'
                +   '                          filesystem changes, selectively re-triggering part builds as needed)\n'

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
    }
);

_.extend(
    AppGenerator.prototype
,   require( './../../lib/generator.js' )
);

module.exports = AppGenerator;
