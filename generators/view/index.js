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
        initializing: function ()
        {
            this._assertBatApp();
        }

    ,   prompting:
        {
            askSomeQuestions: function ()
            {
                var done = this.async();

                // Have Yeoman greet the user.
                //
                this.log( yosay( 'So you want a BAT view?' ) );

                // Ask the user for the webapp details
                //
                var prompts = [
                    {
                        name:       'viewName'
                    ,   message:    'What is the name of this view you so desire?'
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

                // Check if a sass file should be created for this view
                //
                if ( this.sassFile === true )
                {
                    // Avoid the conflict warning and use force for the write
                    //
                    this.conflicter.force = true;

                    // Create the sass file with the same name as the view
                    //
                    this.template( 'view.sass', 'src/sass/views/_' + this.fileBase + '.sass' );

                    // Read in the _views.sass file so we can add the import statement
                    // for the newly created sass file
                    //
                    var views   = this.readFileAsString( 'src/sass/_views.sass' )
                    ,   insert  = '@import "views/_' + this.fileBase + '"';

                    // Check if there isn't already in import for this file
                    // just in case....
                    //
                    if ( views.indexOf( insert ) === -1 )
                    {
                        this.write( 'src/sass/_views.sass', views + '\n' + insert );
                    }
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
