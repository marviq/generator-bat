'use strict';

//
//  Yeoman bat:view sub-generator.
//

var generators      = require( 'yeoman-generator' )
,   yosay           = require( 'yosay' )
,   youtil          = require( './../../lib/youtil.js' )
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

    ,   initializing: function ()
        {
            this._assertBatApp();
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

                // Ask the question and when done make answers available
                // on the this scope. This way they are reachable in the template
                // function for example
                //
                this.prompt(
                    prompts
                ,   function ( answers )
                    {
                        this.viewName       = answers.viewName;
                        this.description    = answers.description;
                        this.sassFile       = answers.sassFile;

                        done();

                    }.bind( this )
                );
            }
        }

    ,   configuring: function ()
        {
            var viewName        = this.viewName;

            this.className      = _.capitalize( viewName ) + 'View';
            this.cssClassName   = _.kebabCase( viewName ) + '-view';
            this.fileBase       = _.kebabCase( _.deburr( viewName ));
        }

    ,   writing:
        {
            createView: function ()
            {
                this.template( 'view.hbs',      'src/views/' + this.fileBase + '.hbs'  );
                this.template( 'view.coffee',   'src/views/' + this.fileBase + '.coffee' );

                if ( this.sassFile )
                {
                    this.template( 'view.sass', 'src/sass/views/_' + this.fileBase + '.sass' );
                }
            }
        }

    ,   install: {

            updateViewsSass: function () {

                /* jshint laxbreak: true */

                if ( !( this.sassFile )) { return; }

                //
                //  Add an `@import "views/_<fileBase>" statement to the '_views.sass' file.
                //

                var viewsPath   = 'src/sass/_views.sass'
                ,   views       = this.readFileAsString( viewsPath )
                ,   statement   = '@import "views/_' + this.fileBase + '"'
                ;

                //  Do nothing if an `@import` for this sass file seems to exist already.
                //
                if ( views.indexOf( statement ) !== -1 )
                {
                    this.log(
                        'It appears that "' + viewsPath + '" already contains an `@import` for "' + this.fileBase + '.sass".\n'
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

                    this.write( viewsPath, views + pad + statement + '\n' );
                }
                else
                {
                    this.write( viewsPath, views.slice( 0, insertAt ) + statement + '\n' + views.slice( insertAt ) );
                }
            }
        }
    }
);

_.merge(
    ViewGenerator.prototype
,   require( './../../lib/sub-generator.js' )
);

module.exports = ViewGenerator;
