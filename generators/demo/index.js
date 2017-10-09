'use strict';

//
//  Yeoman bat app generator.
//

var generators      = require( 'yeoman-generator' )
,   chalk           = require( 'chalk' )
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
            var config          = this.config
            ,   locale          = tags( 'en-GB' )
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

            //  A demo app with a bundled `jquery` needs to expose it on the global scope for the CDN loaded bootstrap to find.
            //
            if ( !( config.get( 'jqueryCdn' )) && !( config.get( 'jqueryExpose' )) )
            {
                this.log(
                    '\n'
                +   chalk.red(
                        'The demo app needs '
                    +   chalk.bold.yellow( 'jQuery' )
                    +   ' to be exposed on the global scope!\n'
                    )
                +   chalk.gray(
                        'Adjusting your '
                    +   chalk.bold.yellow( '.yo-rc.jqueryExpose' )
                    +   ' config setting to '
                    +   chalk.bold.yellow( 'true' )
                    +   ' to reflect this...\n'
                    )
                );

                config.set( 'jqueryExpose', true );
            }

            _.extend(
                this.templateData
            ,   {
                    ie8:                        config.get( 'ie8' )
                ,   i18n:                       true
                ,   i18nLocaleDefault:          locale.format()
                ,   i18nLocaleDefaultLanguage:  locale.language().descriptions()[0]
                ,   i18nLocaleDefaultRegion:    locale.region().format()
                ,   jqueryCdn:                  config.get( 'jqueryCdn' )
                ,   jqueryExpose:               config.get( 'jqueryExpose' )
                }
            );
        }

    ,   writing:
        {
            createDemo: function ()
            {
                var data        = this.templateData
                ,   templates   =
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
                    ,   'test/unit/spec/models/example.spec.coffee'
                    ]
                ;

                if ( data.jqueryExpose )
                {
                    templates.push(
                        'vendor/jquery-for-cdns-shim.coffee'
                    );
                }

                this._templatesProcess( templates );
            }
        }

    ,   install:
        {
            updatePackageJSONForjQueryExpose: function ()
            {
                var data        = this.templateData;

                if ( !( data.jqueryExpose )) { return; }

                var pkgPath     = this.destinationPath( 'package.json' )
                ,   fs          = this.fs
                ,   npm         = fs.readJSON( pkgPath )
                ,   jqShimKey   = 'jquery-for-cdns-shim'
                ,   browser     = ( npm.browser || ( npm.browser = {} ))
                ,   bfyShimKey  = 'browserify-shim'
                ,   bfyShim     = ( npm[ bfyShimKey ] || ( npm[ bfyShimKey ] = {} ))
                ,   jqBfyShim   = ( bfyShim[ jqShimKey ] || ( bfyShim[ jqShimKey ] = {} ))
                ;

                if ( !( browser[ jqShimKey ] ) )
                {
                    browser[ jqShimKey ] = './vendor/jquery-for-cdns-shim.coffee';
                }

                jqBfyShim.depends = _.union( [ 'jquery:jQuery' ], jqBfyShim.depends ).sort();

                fs.writeJSON( pkgPath, npm );
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
