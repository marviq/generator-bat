'use strict';

//
//  Yeoman bat:collection sub-generator.
//

var generators      = require( 'yeoman-generator' )
,   yosay           = require( 'yosay' )
,   youtil          = require( './../../lib/youtil.js' )
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
                this.log( yosay( 'So you want a BAT collection?' ) );

                var prompts = [
                    {
                        name:       'collectionName'
                    ,   message:    'What is the name of this collection you so desire?'
                    ,   default:    this.collectionName
                    ,   validate:   youtil.isIdentifier
                    ,   filter: function ( value )
                        {
                            return decapitalize( _.trim( value ).replace( /collection$/i, '' ));
                        }
                    }
                ,   {
                        name:       'description'
                    ,   message:    'What is the purpose (description) of this collection?'
                    ,   validate:   youtil.isNonBlank
                    ,   filter:     youtil.sentencify
                    }
                ,   {
                        type:       'confirm'
                    ,   name:       'singleton'
                    ,   message:    'Should this collection be a singleton?'
                    ,   default:    false
                    }
                ];

                this.prompt(
                    prompts
                ,   function ( answers )
                    {
                        this.collectionName = answers.collectionName;
                        this.description    = answers.description;
                        this.singleton      = answers.singleton;

                        done();

                    }.bind( this )
                );
            }

        ,   askModelQuestions: function ()
            {
                var done = this.async();

                // We are gonna do a 'smart' guess for the modelName to have a default value
                // If the last characters of the collectionName is a 's' we are gonna assume it's
                // plural and remove the trailing as and use that a default modelName
                //
                var modelName = this.collectionName;

                if ( this.collectionName.slice( -1 ) === 's' )
                {
                    modelName = this.collectionName.slice( 0, -1 );
                }

                var prompts = [
                    {
                        name:       'modelName'
                    ,   message:    'What is the model name for this collection?'
                    ,   default:    modelName
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
                    }
                ];

                this.prompt(
                    prompts
                ,   function ( answers )
                    {
                        this.modelName      = answers.modelName;
                        this.createModel    = answers.createModel;

                        done();

                    }.bind( this )
                );
            }
        }

    ,   configuring: function ()
        {
            var collectionName  = this.collectionName
            ,   modelName       = this.modelName
            ;

            this.className      = _.capitalize( collectionName ) + 'Collection';
            this.fileBase       = _.kebabCase( _.deburr( collectionName ));

            this.modelClassName = _.capitalize( modelName ) + 'Model';
            this.modelFileName  = _.kebabCase( _.deburr( modelName )) + '.coffee';
        }

    ,   writing:
        {
            createCollection: function ()
            {
                //  Create the collection
                this.template( 'collection.coffee', 'src/collections/' + this.fileBase + '.coffee' );

                //  Create the model if needed.
                //
                if ( this.createModel )
                {
                    this.composeWith(
                        'bat:model'
                    ,   {
                            arguments: [ this.modelName ]

                        ,   options:
                            {
                                nested:         true
                            ,   description:    'Model for the ' + this.collectionName
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
,   require( './../../lib/sub-generator.js' )
);

module.exports = CollectionGenerator;
