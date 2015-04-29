'use strict';

//
//  Yeoman bat app generator.
//

var generators      = require( 'yeoman-generator' )
,   _               = require( 'lodash' )
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

var DemoGenerator = generators.Base.extend(
    {
        initializing: function ()
        {
            this._assertBatApp();

            var npm = require( this.destinationPath( 'package.json' ));

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

_.merge(
    DemoGenerator.prototype
,   require( './../../lib/generator.js' )
,   require( './../../lib/sub-generator.js' )
);

module.exports = DemoGenerator;
