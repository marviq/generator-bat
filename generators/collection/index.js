'use strict';

//
//  Yeoman bat:collection sub-generator.
//

var generators      = require( 'yeoman-generator' )
,   yosay           = require( 'yosay' )
,   youtil          = require( './../../lib/youtil.js' )
,   chalk           = require( 'chalk' )
,   _               = require( 'lodash' )
;

var decapitalize    = require( 'underscore.string/decapitalize' );

var CollectionGenerator = generators.Base.extend(
    {
        constructor: function ()
        {
            generators.Base.apply( this, arguments );

            this.argument(
                'collectionName'
            ,   {
                    type:           String
                ,   required:       false
                ,   desc:           'The name of the collection to create.'
                }
            );

            //  Also add 'collectionName' as a - hidden - option, defaulting to the positional argument's value.
            //  This way `_promptsPruneByOptions()` can filter away prompting for the collection name too.
            //
            this.option(
                'collectionName'
            ,   {
                    type:           String
                ,   desc:           'The name of the collection to create.'
                ,   default:        this.collectionName
                ,   hide:           true
                }
            );

            //  Normal options.
            //
            this.option(
                'description'
            ,   {
                    type:           String
                ,   desc:           'The purpose of the collection to create.'
                }
            );

            this.option(
                'singleton'
            ,   {
                    type:           Boolean
                ,   desc:           'Specify whether this collection should be a singleton (instance).'
                }
            );

            this.option(
                'modelName'
            ,   {
                    type:           String
                ,   desc:           'The model name for the collection to create.'
                }
            );

            this.option(
                'createModel'
            ,   {
                    type:           Boolean
                ,   desc:           'Specify whether to create the collection\'s model too.'
                }
            );
        }

    ,   description:
            chalk.bold(
                'This is the ' + chalk.cyan( 'backbone collection' )
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
                            ,   name:       'collectionName'
                            ,   message:    'What is the name of this collection you so desire?'
                            ,   default:    youtil.definedToString( this.options.collectionName )
                            ,   validate:   youtil.isIdentifier
                            ,   filter: function ( value )
                                {
                                    return decapitalize( _.trim( value ).replace( /collection$/i, '' ));
                                }
                            }
                        ,   {
                                type:       'input'
                            ,   name:       'description'
                            ,   message:    'What is the purpose (description) of this collection?'
                            ,   default:    youtil.definedToString( this.options.description )
                            ,   validate:   youtil.isNonBlank
                            ,   filter:     youtil.sentencify
                            }
                        ,   {
                                type:       'confirm'
                            ,   name:       'singleton'
                            ,   message:    'Should this collection be a singleton?'
                            ,   default:    false
                            ,   validate:   _.isBoolean
                            }
                        ,   {
                                type:       'input'
                            ,   name:       'modelName'
                            ,   message:    'What is the model name for this collection?'
                            ,   default: function ( answers )
                                {
                                    return (
                                        youtil.definedToString( this.options.modelName )
                                    ||  answers.collectionName
                                    ||  youtil.definedToString( this.options.collectionName )
                                    );

                                }.bind( this )
                            ,   validate:   youtil.isIdentifier
                            ,   filter: function ( value )
                                {
                                    return decapitalize( _.trim( value ).replace( /model$/i, '' ));
                                }
                            }
                        ,   {
                                type:       'confirm'
                            ,   name:       'createModel'
                            ,   message:    'Should i create this model now as well?'
                            ,   default:    true
                            ,   validate:   _.isBoolean
                            }
                        ]
                    )
                ;

                if ( prompts.length )
                {
                    return new Promise(
                        function ( done ) {

                            //  Have Yeoman greet the user.
                            //
                            this.log( yosay( 'So you want a BAT collection?' ) );

                            this.prompt(
                                prompts
                            ,   function ( answers )
                                {
                                    _.extend( this.templateData, answers );

                                    done();

                                }.bind( this )
                            );

                        }.bind( this )
                    );
                }
            }
        }

    ,   configuring: function ()
        {
            var data            = this.templateData
            ,   collectionName  = data.collectionName
            ,   modelName       = data.modelName
            ;

            _.extend(
                data
            ,   {
                    className:      _.capitalize( collectionName ) + 'Collection'
                ,   fileBase:       _.kebabCase( _.deburr( collectionName ))

                ,   modelClassName: _.capitalize( modelName ) + 'Model'
                ,   modelFileName:  _.kebabCase( _.deburr( modelName )) + '.coffee'

                ,   userName:       this.user.git.name()
                }
            );
        }

    ,   writing:
        {
            createCollection: function ()
            {
                var data        = this.templateData
                ,   templates   =
                    {
                        'collection.coffee':    [ 'src/collections/' + data.fileBase + '.coffee' ]
                    }
                ;

                this._templatesProcess( templates );

                //  Create the model too if needed.
                //
                if ( data.createModel )
                {
                    this.composeWith(
                        'bat:model'
                    ,   {
                            arguments: [ data.modelName ]

                        ,   options:
                            {
                                description:    'Model for the ' + data.collectionName + ' collection.'
                            ,   singleton:      false
                            }
                        }
                    );
                }
            }
        }
    }
);

_.merge(
    CollectionGenerator.prototype
,   require( './../../lib/generator.js' )
,   require( './../../lib/sub-generator.js' )
);

module.exports = CollectionGenerator;
