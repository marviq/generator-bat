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

            //  Container for template expansion data.
            //
            this.templateData = {};
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
                ,   {
                        name:       'modelName'
                    ,   message:    'What is the model name for this collection?'
                    ,   default: function ( answers )
                        {
                            return answers.collectionName;
                        }
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
                        _.extend( this.templateData, answers );

                        done();

                    }.bind( this )
                );
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
                var data = this.templateData;

                //  Create the collection
                this.template( 'collection.coffee', 'src/collections/' + data.fileBase + '.coffee', data );

                //  Create the model if needed.
                //
                if ( data.createModel )
                {
                    this.composeWith(
                        'bat:model'
                    ,   {
                            arguments: [ data.modelName ]

                        ,   options:
                            {
                                nested:         true
                            ,   description:    'Model for the ' + data.collectionName + ' collection.'
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
