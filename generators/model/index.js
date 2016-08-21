'use strict';

//
//  Yeoman bat:model sub-generator.
//

var generators      = require( 'yeoman-generator' )
,   yosay           = require( 'yosay' )
,   youtil          = require( './../../lib/youtil.js' )
,   chalk           = require( 'chalk' )
,   _               = require( 'lodash' )
;

var decapitalize    = require( 'underscore.string/decapitalize' );

var ModelGenerator = generators.Base.extend(
    {
        constructor: function ()
        {
            generators.Base.apply( this, arguments );

            this.description    = this._description( 'backbone model' );

            this.argument(
                'modelName'
            ,   {
                    type:           String
                ,   required:       false
                ,   desc:           'The name of the model to create.'
                }
            );

            //  Also add 'modelName' as a - hidden - option, defaulting to the positional argument's value.
            //  This way `_promptsPruneByOptions()` can filter away prompting for the model name too.
            //
            this.option(
                'modelName'
            ,   {
                    type:           String
                ,   desc:           'The name of the model to create.'
                ,   default:        this.modelName
                ,   hide:           true
                }
            );

            //  Normal options.
            //
            this.option(
                'description'
            ,   {
                    type:           String
                ,   desc:           'The purpose of this model.'
                }
            );

            this.option(
                'singleton'
            ,   {
                    type:           Boolean
                ,   desc:           'Whether this model should be a singleton (instance).'
                }
            );
        }

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
                            ,   name:       'modelName'
                            ,   message:    'What is the name of this model you so desire?'
                            ,   default:    youtil.definedToString( this.options.modelName )
                            ,   validate:   youtil.isIdentifier
                            ,   filter: function ( value )
                                {
                                    return decapitalize( _.trim( value ).replace( /model$/i, '' ));
                                }
                            }
                        ,   {
                                type:       'input'
                            ,   name:       'description'
                            ,   message:    'What is the purpose (description) of this model?'
                            ,   default:    youtil.definedToString( this.options.description )
                            ,   validate:   youtil.isNonBlank
                            ,   filter:     youtil.sentencify
                            }
                        ,   {
                                type:       'confirm'
                            ,   name:       'singleton'
                            ,   message:    'Should this model be a singleton (instance)?'
                            ,   default:    false
                            ,   validate:   _.isBoolean
                            }
                        ]
                    )
                ;

                if ( prompts.length )
                {
                    //  Have Yeoman greet the user.
                    //
                    this.log( yosay( 'So you want a BAT model?' ) );

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
            ,   modelName   = data.modelName
            ;

            _.extend(
                data
            ,   {
                    className:          _.capitalize( modelName ) + 'Model'
                ,   fileBase:           _.kebabCase( _.deburr( modelName ))

                ,   userName:           this.user.git.name()

                ,   backbone:           ( this.config.get( 'backbone' ) || { className: 'Backbone', modulePath: 'backbone' } )
                }
            );
        }

    ,   writing:
        {
            createModel: function ()
            {
                var data        = this.templateData
                ,   templates   =
                    {
                        'model.coffee':    [ 'src/models/' + data.fileBase + '.coffee' ]
                    }
                ;

                this._templatesProcess( templates );
            }
        }
    }
);

_.extend(
    ModelGenerator.prototype
,   require( './../../lib/generator.js' )
,   require( './../../lib/sub-generator.js' )
);

module.exports = ModelGenerator;
