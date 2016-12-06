'use strict';

//
//  Yeoman bat:api sub-generator.
//

var generators      = require( 'yeoman-generator' )
,   yosay           = require( 'yosay' )
,   youtil          = require( './../../lib/youtil.js' )
,   chalk           = require( 'chalk' )
,   _               = require( 'lodash' )
;

var ApiGenerator = generators.Base.extend(
    {
        constructor: function ()
        {
            generators.Base.apply( this, arguments );

            this.description    = this._description( 'API-instance' );

            this.argument(
                'apiName'
            ,   {
                    type:           String
                ,   required:       false
                ,   desc:           'The name of the API-instance to create.'
                }
            );

            //  Also add 'apiName' as a - hidden - option, defaulting to the positional argument's value.
            //  This way `_promptsPruneByOptions()` can filter away prompting for the API name too.
            //
            this.option(
                'apiName'
            ,   {
                    type:           String
                ,   desc:           'The name of the API-instance to create.'
                ,   default:        this.apiName
                ,   hide:           true
                }
            );

            //  Normal options.
            //
            this.option(
                'description'
            ,   {
                    type:           String
                ,   desc:           'The purpose of this API.'
                }
            );

            this.option(
                'url'
            ,   {
                    type:           String
                ,   desc:           'The base URL for this API.'
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
                            ,   name:       'apiName'
                            ,   message:    'What is the name of this API-instance you so desire?'
                            ,   default:    _.camelCase( youtil.definedToString( this.options.apiName ))
                            ,   validate:   youtil.isIdentifier
                            ,   filter: function ( value )
                                {
                                    return _.lowerFirst( _.trim( value ).replace( /api$/i, '' ));
                                }
                            }
                        ,   {
                                type:       'input'
                            ,   name:       'description'
                            ,   message:    'What is the purpose (description) of this API?'
                            ,   default: function ( answers )
                                {
                                    return (
                                        youtil.definedToString( this.options.description )
                                    ||  (
                                            'A collection of services\' endpoints available on the '
                                        +   ( answers.apiName || this.templateData.apiName )
                                        +   ' API.'
                                        )
                                    );
                                }.bind( this )
                            ,   validate:   youtil.isNonBlank
                            ,   filter:     youtil.sentencify
                            }
                        ,   {
                                type:       'input'
                            ,   name:       'url'
                            ,   message:    'What is the base URL for this API? ' + chalk.gray( ' - please enter as code:' )
                            ,   default:    youtil.definedToString( this.options.url )
                            ,   validate:   youtil.isCoffeeScript
                            }
                        ]
                    )
                ;

                if ( prompts.length )
                {
                    //  Have Yeoman greet the user.
                    //
                    this.log( yosay( 'So you want a BAT API-instance?' ) );

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
            ,   apiName         = data.apiName
            ;

            _.extend(
                data
            ,   {
                    className:          _.upperFirst( apiName ) + 'Api'
                ,   fileBase:           _.kebabCase( _.deburr( apiName ))

                ,   userName:           this.user.git.name()

                }
            );
        }

    ,   writing:
        {
            createApi: function ()
            {
                var data        = this.templateData
                ,   templates   =
                    {
                        'api.coffee':    [ 'src/apis/' + data.fileBase + '.coffee' ]
                    }
                ;

                this._templatesProcess( templates );
            }
        }
    }
);

_.extend(
    ApiGenerator.prototype
,   require( './../../lib/generator.js' )
,   require( './../../lib/sub-generator.js' )
);

module.exports = ApiGenerator;
