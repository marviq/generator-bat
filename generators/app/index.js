'use strict';

//
//  Yeoman bat app generator.
//

var generators  = require( 'yeoman-generator' )
,   yosay       = require( 'yosay' )
;

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
        initializing: function ()
        {
            //  Load the BAT generator's 'package.json'.
            //
            this.pkg = require( './../../package.json' );
        }

    ,   prompting:
        {
            askSomeQuestions: function ()
            {
                var done = this.async();

                // Have Yeoman greet the user.
                //
                this.log( yosay( 'Welcome to the BAT generator! (Backbone Application Template) \n Powered by Marviq' ) );

                // Ask the user for the webapp details
                //
                var prompts = [
                    {
                        name:       'packageName'
                    ,   message:    'What is the name of this webapp?'
                    ,   default:    this.appname
                    }
                ,   {
                        name:       'packageDescription'
                    ,   message:    'What is the purpose (description) of this webapp?'
                    }
                ,   {
                        name:       'authorName'
                    ,   message:    'What is your name?'
                    ,   default:    this.user.git.name()
                    }
                ,   {
                        name:       'authorEmail'
                    ,   message:    'What is your email?'
                    ,   default:    this.user.git.email()
                    }
                ,   {
                        name:       'authorUrl'
                    ,   message:    'If any, by what url would you like to be known?'
                    ,   default:    ''
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
                    ,   default:    true
                    }
                ];

                this.prompt(
                    prompts
                ,   function ( answers )
                    {
                        this.packageName        = answers.packageName;
                        this.packageDescription = answers.packageDescription;
                        this.authorName         = answers.authorName;
                        this.authorEmail        = answers.authorEmail.trim();
                        this.authorUrl          = answers.authorUrl.trim();
                        this.ie8                = answers.ie8;
                        this.demo               = answers.demo;

                        this.i18n               = answers.multiLanguage || answers.demo;

                        done();

                    }.bind( this )
                );
            }
        }

    ,   configuring: function ()
        {
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
                // Create base folders
                //
                this.mkdir( 'src'  );
                this.mkdir( 'test' );

                // Create Backbone folders
                //
                this.mkdir( 'src/models'        );
                this.mkdir( 'src/collections'   );
                // this.mkdir( 'src/routers'       );
                this.mkdir( 'src/views'         );

                // Create vendor library folder
                //
                this.mkdir( 'vendor'        );

                // Create i18n folder
                //
                if ( this.i18n === true )
                {
                    this.mkdir( 'src/i18n' );
                }

                // Create compass folders
                //
                this.mkdir( 'src/sass'          );
                this.mkdir( 'src/style'         );
                this.mkdir( 'src/style/images'  );
                this.mkdir( 'src/style/images/sprites'  );
            }

        ,   setupProjectFiles: function()
            {
                // Setup the config files for git, editor etc.
                //
                this.copy( 'editorconfig',      '.editorconfig' );
                this.copy( 'gitattributes',     '.gitattributes' );
                this.copy( 'gitignore',         '.gitignore' );
                this.copy( 'coffeelint.json',   'coffeelint.json' );
                this.copy( 'jshintrc',          '.jshintrc' );

                // write package.json and readme file
                //
                this.template( '_package.json',     'package.json' );
                this.template( 'AUTHORS',           'AUTHORS' );
                this.template( 'README.md',         'README.md'    );
                this.copy( 'LICENSE',               'LICENSE'           );

                // Setup build, watch files etc
                //
                this.template( '_Gruntfile.coffee', 'Gruntfile.coffee', null, tpl_tpl_settings );

                // Setup the sass files
                //
                this.copy( 'src/sass/app.sass',             'src/sass/app.sass' );
                this.copy( 'src/sass/_settings.sass',       'src/sass/_settings.sass' );
                this.copy( 'src/sass/_views.sass',          'src/sass/_views.sass' );
                this.copy( 'src/sass/check-green.png',      'src/style/images/sprites/check-green.png' );

                // If we want the demo copy the demo files
                //
                if ( this.demo === true )
                {
                    this.copy( 'demo/router.coffee',                'src/router.coffee' );
                    this.template( 'demo/_index.template.html',     'src/index.template.html', null, tpl_tpl_settings );

                    this.copy( 'demo/views/buildscript.hbs',        'src/views/buildscript.hbs' );
                    this.copy( 'demo/views/buildscript.coffee',     'src/views/buildscript.coffee' );

                    this.copy( 'demo/views/documentation.hbs',      'src/views/documentation.hbs' );
                    this.copy( 'demo/views/documentation.coffee',   'src/views/documentation.coffee' );

                    this.copy( 'demo/views/i18n.hbs',               'src/views/i18n.hbs' );
                    this.copy( 'demo/views/i18n.coffee',            'src/views/i18n.coffee' );

                    this.copy( 'demo/views/index.hbs',              'src/views/index.hbs' );
                    this.copy( 'demo/views/index.coffee',           'src/views/index.coffee' );
                    this.copy( 'demo/sass/_index.sass',             'src/sass/views/_index.sass' );

                    this.copy( 'demo/views/navigation.hbs',         'src/views/navigation.hbs' );
                    this.copy( 'demo/views/navigation.coffee',      'src/views/navigation.coffee' );

                    this.copy( 'demo/marviq-logo-web.png',          'src/style/images/marviq-logo-web.png' );
                    this.copy( 'demo/documentation.jpg',            'src/style/images/documenting.jpg' );

                    // Copy the i18n files
                    //
                    this.copy( 'demo/i18n/nl_NL.json',              'src/i18n/nl_NL.json' );
                    this.copy( 'demo/i18n/en_GB.json',              'src/i18n/en_GB.json' );

                    // Copy the app main entry point
                    //
                    this.template( 'demo/_app.coffee',              'src/app.coffee' );

                    // Copy the test example files
                    //
                    this.copy( 'demo/models/example.coffee', 'src/models/example.coffee' );
                    this.copy( 'demo/test/example.coffee',  'test/example.coffee' );
                }
                else
                {
                    if ( this.i18n === true )
                    {
                        // Copy the i18n files
                        //
                        this.copy( 'src/i18n/nl_NL.json',  'src/i18n/nl_NL.json' );
                        this.copy( 'src/i18n/en_GB.json',  'src/i18n/en_GB.json' );
                    }


                    this.template( 'src/_index.template.html',      'src/index.template.html', null, tpl_tpl_settings );
                    this.template( 'src/_router.coffee',            'src/router.coffee' );

                    this.copy( 'src/views/index.coffee',            'src/views/index.coffee' );
                    this.copy( 'src/views/index.hbs',               'src/views/index.hbs' );
                    this.copy( 'src/sass/views/_index.sass',        'src/sass/views/_index.sass' );

                    // Copy the app main entry point
                    //
                    this.template( 'src/_app.coffee',               'src/app.coffee' );
                }
            }
        }

    ,   install: function ()
        {
            var deps =
                    [
                        'backbone'
                    ,   ( 'jquery' + ( this.ie8 ? '@<2' : '' ))
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

            if ( this.i18n )
            {
                deps.push( 'madlib-locale' );
            }

            this.npmInstall( deps,      { save:     true } );
            this.npmInstall( devDeps,   { saveDev:  true } );

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
