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

            //  Also add 'viewName' as a - hidden - option, defaulting to the positional argument's value.
            //  This way `_promptsPruneByOptions()` can filter away prompting for the view name too.
            //
            this.option(
                'viewName'
            ,   {
                    type:           String
                ,   desc:           'The name of the view to create.'
                ,   default:        this.viewName
                ,   hide:           true
                }
            );

            //  Normal options.
            //
            this.option(
                'description'
            ,   {
                    type:           String
                ,   desc:           'The purpose of the view to create.'
                }
            );

            this.option(
                'sass'
            ,   {
                    type:           Boolean
                ,   desc:           'Specify whether this view should have a SASS file of its own.'
                }
            );
        }

    ,   description:
            chalk.bold(
                'This is the ' + chalk.cyan( 'backbone view' )
            +   ' generator for BAT, the Backbone Application Template'
            +   ' created by ' + chalk.blue( 'marv' ) + chalk.red( 'iq' ) + '.'
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
                //  Ask only those question that have not yet been provided with answers via the command line.
                //
                var prompts = this._promptsPruneByOptions(
                        [
                            {
                                type:       'input'
                            ,   name:       'viewName'
                            ,   message:    'What is the name of this view you so desire?'
                            ,   default:    youtil.definedToString( this.options.viewName )
                            ,   validate:   youtil.isIdentifier
                            ,   filter: function ( value )
                                {
                                    return decapitalize( _.trim( value ).replace( /view$/i, '' ));
                                }
                            }
                        ,   {
                                type:       'input'
                            ,   name:       'description'
                            ,   message:    'What is the purpose (description) of this view?'
                            ,   validate:   youtil.isNonBlank
                            ,   filter:     youtil.sentencify
                            }
                        ,   {
                                type:       'confirm'
                            ,   name:       'sass'
                            ,   message:    'Would you like a SASS file for this view?'
                            ,   default:    true
                            ,   validate:   _.isBoolean
                            }
                        ]
                    )
                ;

                if ( prompts.length )
                {
                    //  Have Yeoman greet the user.
                    //
                    this.log( yosay( 'So you want a BAT view?' ) );

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

                if ( data.sass )
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

                if ( !( data.sass )) { return; }

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

_.extend(
    ViewGenerator.prototype
,   require( './../../lib/generator.js' )
,   require( './../../lib/sub-generator.js' )
);

module.exports = ViewGenerator;
