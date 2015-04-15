'use strict';

//
//  Yeoman bat:model sub-generator.
//

var generators  = require( 'yeoman-generator' )
,   yosay       = require( 'yosay' )
,   varname     = require( 'varname' )
,   _           = require( 'lodash' )
;

var ModelGenerator = generators.Base.extend(
    {
        constructor: function ( args, options )
        {
            generators.Base.apply( this, arguments );

            // Check if any options are passed. Collection generator might be
            // calling this generator for example
            if ( options )
            {
                if ( options.modelName )
                {
                    this.modelName = options.modelName;
                }

                if ( options.description )
                {
                    this.description = options.description;
                }

                if ( typeof( options.singleton) === 'boolean' )
                {
                    this.singleton = options.singleton;
                }
            }
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

                // Have Yeoman greet the user.
                //
                if ( !this.options.nested )
                {
                    this.log( yosay( 'So you want a BAT model?' ) );

                    // Ask the user for the webapp details
                    //
                    var prompts = [
                        {
                            name:       'modelName'
                        ,   message:    'What\'s the name of this model you so desire? ( use camelcasing! )'
                        }
                    ,   {
                            name:       'description'
                        ,   message:    'What\'s the description for this model?'
                        ,   default:    'No description'
                        }
                    ,   {
                            type:       'confirm'
                        ,   name:       'singleton'
                        ,   message:    'Should this model be a singleton?'
                        ,   default:    false
                        }
                    ];

                    this.prompt(
                        prompts
                    ,   function ( answers )
                        {
                            this.modelName      = answers.modelName;
                            this.description    = answers.description;
                            this.singleton      = answers.singleton;

                            done();

                        }.bind( this )
                    );

                } else {

                    done();
                }
            }
        }

    ,   writing:
        {
            createModel: function ()
            {
                this.fileName   = varname.dash( this.modelName );

                // Class names start with a capital by convention
                //
                this.className  = this.modelName.charAt( 0 ).toUpperCase() + this.modelName.slice( 1 );

                this.template( 'model.coffee', 'src/models/' + this.fileName + '.coffee' );
            }
        }
    }
);

_.merge(
    ModelGenerator.prototype
,   require( './../../lib/sub-generator.js' )
);

module.exports = ModelGenerator;
