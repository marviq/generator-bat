'use strict';

//
//  Yeoman bat:view sub-generator.
//

var generators      = require( 'yeoman-generator' )
,   yosay           = require( 'yosay' )
,   youtil          = require( './../../lib/youtil.js' )
,   chalk           = require( 'chalk' )
,   _               = require( 'lodash' )
;

var decapitalize    = require( 'underscore.string/decapitalize' );

var ViewGenerator = generators.Base.extend(
    {
        constructor: function ()
        {
            generators.Base.apply( this, arguments );

            this.argument(
                'viewName'
            ,   {
                    type:           String
                ,   required:       false
                ,   desc:           'The name of the view to create.'
                }
            );
        }

    ,   description:
            chalk.bold(
                'This is the ' + chalk.cyan( 'backbone view' ) + ' generator for the Backbone Application Template'
            +   ', powered by ' + chalk.blue( 'marv' ) + chalk.red( 'iq' ) + '.'
            )

    ,   initializing: function ()
        {
            this._assertBatApp();

            //  Container for template expansion data.
            //
            this.templateData = {};
        }

    ,   prompting:
        {
            askSomeQuestions: function ()
            {
                var done = this.async();

                //  Have Yeoman greet the user.
                //
                this.log( yosay( 'So you want a BAT view?' ) );

                var prompts = [
                    {
                        name:       'viewName'
                    ,   message:    'What is the name of this view you so desire?'
                    ,   default:    this.viewName
                    ,   validate:   youtil.isIdentifier
                    ,   filter: function ( value )
                        {
                            return decapitalize( _.trim( value ).replace( /view$/i, '' ));
                        }
                    }
                ,   {
                        name:       'description'
                    ,   message:    'What is the purpose (description) of this view?'
                    ,   validate:   youtil.isNonBlank
                    ,   filter:     youtil.sentencify
                        }
                ,   {
                        type:       'confirm'
                    ,   name:       'sassFile'
                    ,   message:    'Would you like a SASS file for this view?'
                    ,   default:    true
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
            var data        = this.templateData
            ,   viewName    = data.viewName
            ;

            _.extend(
                data
            ,   {
                    className:      _.capitalize( viewName ) + 'View'
                ,   cssClassName:   _.kebabCase( viewName ) + '-view'
                ,   fileBase:       _.kebabCase( _.deburr( viewName ))

                ,   userName:       this.user.git.name()
                }
            );
        }

    ,   writing:
        {
            createView: function ()
            {
                var data        = this.templateData
                ,   templates   =
                    {
                        'view.hbs':     [ 'src/views/' + data.fileBase + '.hbs' ]
                    ,   'view.coffee':  [ 'src/views/' + data.fileBase + '.coffee' ]
                    }
                ;

                if ( data.sassFile )
                {
                    templates[ 'view.sass' ] = [ 'src/sass/views/_' + data.fileBase + '.sass' ];
                }

                this._templatesProcess( templates );
            }
        }

    ,   install: {

            updateViewsSass: function () {

                var data = this.templateData;

                /* jshint laxbreak: true */

                if ( !( data.sassFile )) { return; }

                //
                //  Add an `@import "views/_<fileBase>" statement to the '_views.sass' file.
                //

                var viewsPath   = 'src/sass/_views.sass'
                ,   fs          = this.fs
                ,   views       = fs.read( viewsPath )
                ,   statement   = '@import "views/_' + data.fileBase + '"'
                ;

                //  Do nothing if an `@import` for this sass file seems to exist already.
                //
                if ( views.indexOf( statement ) !== -1 )
                {
                    this.log(
                        'It appears that "' + viewsPath + '" already contains an `@import` for "' + data.fileBase + '.sass".\n'
                    +   'Leaving it untouched.'
                    );

                    return;
                }

                // Avoid the conflict warning and use force for the write
                //
                this.conflicter.force = true;

                //  Look for a place to insert, preferably at an alfanumerically ordered position.
                //
                var insertAt, match, matcher = /^@import.*/mg;

                while ( (( match = matcher.exec( views ) )) )
                {
                    if ( statement < match[ 0 ] ) { insertAt = match.index; }
                }

                if ( insertAt == null )
                {
                    var pad = (( views.length && views.slice( -1 ) !== '\n' ) ? '\n' : '' );

                    fs.write( viewsPath, views + pad + statement + '\n' );
                }
                else
                {
                    fs.write( viewsPath, views.slice( 0, insertAt ) + statement + '\n' + views.slice( insertAt ) );
                }
            }
        }
    }
);

_.merge(
    ViewGenerator.prototype
,   require( './../../lib/generator.js' )
,   require( './../../lib/sub-generator.js' )
);

module.exports = ViewGenerator;
