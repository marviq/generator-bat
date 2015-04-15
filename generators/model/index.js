'use strict';

//
//  Yeoman bat:model sub-generator.
//

var generators      = require( 'yeoman-generator' )
,   yosay           = require( 'yosay' )
,   youtil          = require( './../../lib/youtil.js' )
,   _               = require( 'lodash' )
;

var decapitalize    = require( 'underscore.string/decapitalize' );

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
                        ,   message:    'What is the name of this model you so desire?'
                        ,   validate:   youtil.isIdentifier
                        ,   filter: function ( value )
                            {
                                return decapitalize( _.trim( value ).replace( /model$/i, '' ));
                            }
                        }
                    ,   {
                            name:       'description'
                        ,   message:    'What is the purpose (description) of this model?'
                        ,   validate:   youtil.isNonBlank
                        ,   filter:     youtil.sentencify
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

    ,   configuring: function ()
        {
            var modelName   = this.modelName;

            this.className  = _.capitalize( modelName ) + 'Model';
            this.fileBase   = _.kebabCase( _.deburr( modelName ));
        }

    ,   writing:
        {
            createModel: function ()
            {
                this.template( 'model.coffee', 'src/models/' + this.fileBase + '.coffee' );
            }
        }
    }
);

_.merge(
    ModelGenerator.prototype
,   require( './../../lib/sub-generator.js' )
);

module.exports = ModelGenerator;
