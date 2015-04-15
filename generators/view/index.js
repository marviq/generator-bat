'use strict';

//
//  Yeoman bat:view sub-generator.
//

var generators  = require( 'yeoman-generator' )
,   yosay       = require( 'yosay' )
,   varname     = require( 'varname' )
,   _           = require( 'lodash' )
;

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
                    ,   message:    'What\'s the name of this view you so desire? ( use camelcasing! )'
                    }
                ,   {
                        name:       'description'
                    ,   message:    'What\'s the description for this view?'
                    ,   default:    'No description given....'
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

                        // Convert the filename to dashes instead of camel casing
                        //
                        this.fileName       = varname.dash( this.viewName );

                        // Classnames are uppercase by convention
                        //
                        this.className      = answers.viewName.charAt( 0 ).toUpperCase() + answers.viewName.slice( 1 );

                        // Whether the user wants a sass file or not
                        //
                        this.sassFile       = answers.sassFile;

                        done();

                    }.bind( this )
                );
            }
        }

    ,   writing:
        {
            createView: function ()
            {
                // Create the views coffee file and handlebars template file
                //
                this.template( 'view.hbs',      'src/views/' + this.fileName + '.hbs'  );
                this.template( 'view.coffee',   'src/views/' + this.fileName + '.coffee' );

                // Check if a sass file should be created for this view
                //
                if ( this.sassFile === true )
                {
                    // Avoid the conflict warning and use force for the write
                    //
                    this.conflicter.force = true;

                    // Create the sass file with the same name as the view
                    //
                    this.template( 'view.sass', 'src/sass/views/_' + this.fileName + '.sass' );

                    // Read in the _views.sass file so we can add the import statement
                    // for the newly created sass file
                    //
                    var views   = this.readFileAsString( 'src/sass/_views.sass' )
                    ,   insert  = '@import "views/_' + this.fileName + '"';

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
