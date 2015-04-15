'use strict';

//
//  Yeoman bat:collection sub-generator.
//

var generators  = require( 'yeoman-generator' )
,   yosay       = require( 'yosay' )
,   varname     = require( 'varname' )
,   _           = require( 'lodash' )
;

var CollectionGenerator = generators.Base.extend(
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
                this.log( yosay( 'So you want a BAT collection?' ) );

                // Ask the user for the webapp details
                //
                var prompts = [
                    {
                        name:       'collectionName'
                    ,   message:    'What\'s the name of this collection you so desire? ( use camelcasing! )'
                    }
                ,   {
                        name:       'description'
                    ,   message:    'What\'s the description for this collection?'
                    ,   default:    'No description'
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
                    ,   message:    'Whats the model name for this collection ( use camelcasing! )'
                    ,   default:    modelName
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

    ,   writing:
        {
            createCollection: function ()
            {
                // Create the needed variables
                this.modelClass     = this.modelName.charAt(0).toUpperCase() + this.modelName.slice(1);
                this.className      = this.collectionName.charAt(0).toUpperCase() + this.collectionName.slice(1);
                this.modelFileName  = varname.dash( this.modelName );
                this.fileName       = varname.dash( this.collectionName );

                // Create the collection
                this.template( 'collection.coffee', 'src/collections/' + this.fileName + '.coffee' );

                // Create the model if needed
                if ( this.createModel === true )
                {
                    this.invoke(
                        'bat:model'
                    ,   {
                            options: {
                                nested:         true
                            ,   modelName:      this.modelName
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
