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
        constructor: function ()
        {
            generators.Base.apply( this, arguments );

            this.argument(
                'modelName'
            ,   {
                    type:           String
                ,   required:       false
                ,   desc:           'The name of the model to create.'
                }
            );
        }

    ,   initializing: function ()
        {
            this._assertBatApp();

            //  Container for template expansion data.
            //
            var data = this.templateData =
                {
                    modelName:      this.modelName
                }
            ;

            //  Check if any options are passed. Collection generator might be
            //  calling this generator for example

            var options = this.options;

            if ( options )
            {
                if ( options.description )
                {
                    data.description = options.description;
                }

                if ( typeof( options.singleton) === 'boolean' )
                {
                    data.singleton = options.singleton;
                }
            }
        }

    ,   prompting:
        {
            askSomeQuestions: function ()
            {
                var done = this.async();

                if ( !this.options.nested )
                {
                    //  Have Yeoman greet the user.
                    //
                    this.log( yosay( 'So you want a BAT model?' ) );

                    var prompts = [
                        {
                            name:       'modelName'
                        ,   message:    'What is the name of this model you so desire?'
                        ,   default:    this.modelName
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
                            _.extend( this.templateData, answers );

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
            var data        = this.templateData
            ,   modelName   = data.modelName
            ;

            _.extend(
                data
            ,   {
                    className:  _.capitalize( modelName ) + 'Model'
                ,   fileBase:   _.kebabCase( _.deburr( modelName ))

                ,   userName:   this.user.git.name()
                }
            );
        }

    ,   writing:
        {
            createModel: function ()
            {
                var data = this.templateData;

                this.template( 'model.coffee', 'src/models/' + data.fileBase + '.coffee', data );
            }
        }
    }
);

_.merge(
    ModelGenerator.prototype
,   require( './../../lib/sub-generator.js' )
);

module.exports = ModelGenerator;
