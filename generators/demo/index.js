'use strict';

//
//  Yeoman bat app generator.
//

var generators      = require( 'yeoman-generator' )
,   chalk           = require( 'chalk' )
,   _               = require( 'lodash' )
;

//  Use a different delimiter when our template itself is meant to be a template or template-like.
//
var tpl_tpl_settings =
        {
            delimiter:      '@'
        }
;

var DemoGenerator = generators.Base.extend(
    {
        initializing: function ()
        {
            this._assertBatApp();

            var npm = this.fs.readJSON( this.destinationPath( 'package.json' ));

            //  Container for template expansion data.
            //
            this.templateData =
                {
                    packageDescription: npm.description
                ,   packageName:        npm.name
                }
            ;
        }

    ,   description:
            chalk.bold(
                'This is the ' + chalk.cyan( 'demo app' )
            +   ' generator for BAT, the Backbone Application Template'
            +   ' created by ' + chalk.blue( 'marv' ) + chalk.red( 'iq' ) + '.'
            )

    ,   configuring: function()
        {
            var config  = this.config;

            //  A demo app implies 'i'+'nternationalisatio'.length+'n' support.
            //
            if ( !( config.get( 'i18n' )) )
            {
                config.set( 'i18n', true );
            }

            _.extend(
                this.templateData
            ,   {
                    ie8:    config.get( 'ie8' )
                ,   i18n:   true
                }
            );
        }

    ,   writing:
        {
            createDemo: function ()
            {
                var templates =
                    [
                        //  Project files

                        [ '@Gruntfile.coffee', tpl_tpl_settings ]

                        //  The app main entry point:

                    ,   [ 'src/app.coffee' ]
                    ,   [ 'src/index.template.html', tpl_tpl_settings ]

                        //  Backbone:

                    ,   'src/router.coffee'

                    ,   'src/views/buildscript.hbs'
                    ,   'src/views/buildscript.coffee'

                    ,   'src/views/documentation.hbs'
                    ,   'src/views/documentation.coffee'

                    ,   'src/views/i18n.hbs'
                    ,   'src/views/i18n.coffee'

                    ,   'src/sass/views/_index.sass'
                    ,   'src/views/index.hbs'
                    ,   'src/views/index.coffee'

                    ,   'src/views/navigation.hbs'
                    ,   'src/views/navigation.coffee'

                    ,   'src/style/images/marviq-logo-web.png'
                    ,   'src/style/images/documentation.jpg'

                        //  i18n:

                    ,   'src/i18n/en_GB.json'
                    ,   'src/i18n/nl_NL.json'

                        //  Testing example:

                    ,   'src/models/example.coffee'
                    ,   'test/example.coffee'
                    ]
                ;

                this._templatesProcess( templates );
            }
        }
    }
);

_.extend(
    DemoGenerator.prototype
,   require( './../../lib/generator.js' )
,   require( './../../lib/sub-generator.js' )
);

module.exports = DemoGenerator;
