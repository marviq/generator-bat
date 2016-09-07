'use strict';

//
//  Yeoman bat:collection sub-generator.
//

var generators      = require( 'yeoman-generator' )
,   yosay           = require( 'yosay' )
,   youtil          = require( './../../lib/youtil.js' )
,   _               = require( 'lodash' )
;

var CollectionGenerator = generators.Base.extend(
    {
        constructor: function ()
        {
            generators.Base.apply( this, arguments );

            this.description    = this._description( 'backbone collection' );

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
                ,   desc:           'The purpose of this collection.'
                }
            );

            this.option(
                'singleton'
            ,   {
                    type:           Boolean
                ,   desc:           'Whether this collection should be a singleton (instance).'
                }
            );

            this.option(
                'modelName'
            ,   {
                    type:           String
                ,   desc:           'The model name for this collection.'
                }
            );

            this.option(
                'createModel'
            ,   {
                    type:           Boolean
                ,   desc:           'Whether to create this model too.'
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
                            ,   name:       'collectionName'
                            ,   message:    'What is the name of this collection you so desire?'
                            ,   default:    youtil.definedToString( this.options.collectionName )
                            ,   validate:   youtil.isIdentifier
                            ,   filter: function ( value )
                                {
                                    return _.lowerFirst( _.trim( value ).replace( /collection$/i, '' ));
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
                            ,   message:    'Should this collection be a singleton (instance)?'
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
                                    ||  this.templateData.collectionName
                                    );

                                }.bind( this )
                            ,   validate:   youtil.isIdentifier
                            ,   filter: function ( value )
                                {
                                    return _.lowerFirst( _.trim( value ).replace( /model$/i, '' ));
                                }
                            }
                        ,   {
                                type:       'confirm'
                            ,   name:       'createModel'
                            ,   message:    'Should I create this model now as well?'
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
                    this.log( yosay( 'So you want a BAT collection?' ) );

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
            var data            = this.templateData
            ,   collectionName  = data.collectionName
            ,   modelName       = data.modelName
            ;

            _.extend(
                data
            ,   {
                    className:          _.upperFirst( collectionName ) + 'Collection'
                ,   fileBase:           _.kebabCase( _.deburr( collectionName ))

                ,   modelClassName:     _.upperFirst( modelName ) + 'Model'
                ,   modelFileName:      _.kebabCase( _.deburr( modelName )) + '.coffee'

                ,   userName:           this.user.git.name()

                ,   backbone:           ( this.config.get( 'backbone' ) || { className: 'Backbone', modulePath: 'backbone' } )
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
                                description:    'Model for the `{{#crossLink \'' + data.className + '\'}}{{/crossLink}}`.'
                            ,   singleton:      false
                            }
                        }
                    );
                }
            }
        }
    }
);

_.extend(
    CollectionGenerator.prototype
,   require( './../../lib/generator.js' )
,   require( './../../lib/sub-generator.js' )
);

module.exports = CollectionGenerator;
