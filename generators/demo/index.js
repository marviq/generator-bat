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
                var data = this.templateData;

                this.template( '@Gruntfile.coffee',                 'Gruntfile.coffee', data, tpl_tpl_settings );

                this.copy( 'src/router.coffee',                     'src/router.coffee' );

                this.template( 'src/index.template.html',           'src/index.template.html', data, tpl_tpl_settings );

                this.copy( 'src/views/buildscript.hbs',             'src/views/buildscript.hbs' );
                this.copy( 'src/views/buildscript.coffee',          'src/views/buildscript.coffee' );

                this.copy( 'src/views/documentation.hbs',           'src/views/documentation.hbs' );
                this.copy( 'src/views/documentation.coffee',        'src/views/documentation.coffee' );

                this.copy( 'src/views/i18n.hbs',                    'src/views/i18n.hbs' );
                this.copy( 'src/views/i18n.coffee',                 'src/views/i18n.coffee' );

                this.copy( 'src/views/index.hbs',                   'src/views/index.hbs' );
                this.copy( 'src/views/index.coffee',                'src/views/index.coffee' );
                this.copy( 'src/sass/views/_index.sass',            'src/sass/views/_index.sass' );

                this.copy( 'src/views/navigation.hbs',              'src/views/navigation.hbs' );
                this.copy( 'src/views/navigation.coffee',           'src/views/navigation.coffee' );

                this.copy( 'src/style/images/marviq-logo-web.png',  'src/style/images/marviq-logo-web.png' );
                this.copy( 'src/style/images/documentation.jpg',    'src/style/images/documenting.jpg' );

                // Copy the i18n files
                //
                this.copy( 'src/i18n/nl_NL.json',                   'src/i18n/nl_NL.json' );
                this.copy( 'src/i18n/en_GB.json',                   'src/i18n/en_GB.json' );

                // Copy the app main entry point
                //
                this.template( 'src/app.coffee',                    'src/app.coffee', data );

                // Copy the test example files
                //
                this.copy( 'src/models/example.coffee',             'src/models/example.coffee' );
                this.copy( 'test/example.coffee',                   'test/example.coffee' );
            }
        }
    }
);

_.merge(
    DemoGenerator.prototype
,   require( './../../lib/sub-generator.js' )
);

module.exports = DemoGenerator;
