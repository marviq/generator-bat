'use strict';

//
//  Yeoman bat app generator.
//

var generators      = require( 'yeoman-generator' )
,   tags            = require( 'language-tags' )
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

            this.description    = this._description( 'demo app' );

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

    ,   configuring: function()
        {
            var config  = this.config
            ,   locale  = tags( 'en-GB' )
            ;

            //  A demo app implies 'i'+'nternationalisatio'.length+'n' support.
            //
            if ( !( config.get( 'i18n' )) )
            {
                config.set( 'i18n', true );

                if ( !( config.get( 'i18nLocaleDefault' )) )
                {
                    config.set( 'i18nLocaleDefault', locale.format() );
                }
            }

            _.extend(
                this.templateData
            ,   {
                    ie8:                        config.get( 'ie8' )
                ,   i18n:                       true
                ,   i18nLocaleDefault:          locale.format()
                ,   i18nLocaleDefaultLanguage:  locale.language().descriptions()[0]
                ,   i18nLocaleDefaultRegion:    locale.region().format()
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

                        //  Target environment settings:

                    ,   'settings/production.json'
                    ,   'settings/acceptance.json'
                    ,   'settings/testing.json'
                    ,   'settings/local.json'

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

                    ,   'src/i18n/en-GB.json'
                    ,   'src/i18n/nl-NL.json'

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
