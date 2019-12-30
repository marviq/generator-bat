'use strict';

//
//  Yeoman bat:api sub-generator.
//

var Generator       = require( 'yeoman-generator' )
,   yosay           = require( 'yosay' )
,   youtil          = require( './../../lib/youtil.js' )
,   chalk           = require( 'chalk' )
,   glob            = require( 'glob' )
,   jsStringify     = require( 'json-stable-stringify' )
,   _               = require( 'lodash' )
;

class ApiGenerator extends Generator
{
    constructor ()
    {
        super( ...arguments );

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

    initializing ()
    {
        this._assertBatApp();

        //  Find available Environment settings files:
        //
        var envs    = this.envs
                    = {}
        ,   base    = this.destinationPath( 'settings' )
        ;

        glob.sync( '**/*.json', { cwd: base } ).forEach(

            ( path ) =>
            {
                var pathAbs     = base + '/' + path;
                var match       = this.fs.read( pathAbs ).match( /"environment"\s*:\s*"([^"]+)"/ );

                if ( !( match ) ) { return; }

                var name        = match[ 1 ];

                envs[ name ]   =
                    {
                        name
                    ,   pathAbs
                    ,   path
                    }
                ;
            }
        );

        //  Container for template expansion data.
        //
        this.templateData = {};
    }

    prompting ()
    {
        var previous;

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
                    ,   filter:     ( value ) => ( _.camelCase( _.lowerFirst( _.trim( value ).replace( /api$/i, '' ))) )
                    }
                ,   {
                        type:       'input'
                    ,   name:       'description'
                    ,   message:    'What is the purpose (description) of this API?'
                    ,   default:    ( answers ) => (
                                        youtil.definedToString( this.options.description )
                                    ||  (
                                            'A collection of services\' endpoints available on the '
                                        +   ( answers.apiName || this.templateData.apiName )
                                        +   ' API.'
                                        )
                                    )
                    ,   validate:   youtil.isNonBlank
                    ,   filter:     youtil.sentencify
                    }
                ]
            )
        ;

        //  Add per-environment prompts; each previous prompt's answer serves as the next one's default, using `this.options.url` as a base case.
        //
        prompts.push(

            ...Object.keys( this.envs ).map (

                ( envName ) =>
                {
                    var prompt  =
                            {
                                type:       'input'
                            ,   name:       `env_${ envName }_url`
                            ,   message:    'What is the base URL for this API in the ' + chalk.green( envName ) + ' environment?'
                            ,   default:    (
                                                ( prv ) => ( answers ) => prv ? answers[ prv ] : youtil.definedToString( this.options.url )

                                            )( previous )
                            ,   validate:   youtil.isNonBlank
                            }
                    ;

                    previous    = prompt.name;

                    return prompt;
                }
            )
        );

        if ( prompts.length )
        {
            //  Have Yeoman greet the user.
            //
            this.log( yosay( 'So you want a BAT API-instance?' ) );

            return (
                this
                    .prompt( prompts )
                    .then( ( answers ) => { _.extend( this.templateData, answers ); } )
            );
        }
    }

    configuring ()
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

    writing ()
    {
        //  createApi:
        //
        ( () =>
        {
            var data        = this.templateData
            ,   templates   =
                {
                    'api.coffee':    [ 'src/apis/' + data.fileBase + '.coffee' ]
                }
            ;

            this._templatesProcess( templates );
        }
        )();
    }

    install ()
    {
        //  updateEnvironmentsSettings:
        //
        ( () =>
        {
            var data        = this.templateData
            ,   fs          = this.fs
            ,   ts          = 4
            ,   align       = 8 * ts
            ;

            //  Insert each environment's base `url` for this API.
            //
            Object.entries( this.envs ).forEach(
                ( [ envName, env ] ) =>
                {
                    var envSettings = fs.readJSON( env.pathAbs )
                    ,   apis        = envSettings.api
                    ,   url         = data[ `env_${ envName }_url` ]
                    ;

                    if ( !( apis ) || !( url ) ) { return; }

                    apis[ data.apiName ] = url;

                    //  Keep entries sorted, comma-first style, aligned.
                    //
                    fs.write(
                        env.pathAbs
                    ,   jsStringify( envSettings, { space: ts } )
                            .replace(
                                /,$(\s*)\s{4}(?=\S)/gm
                            ,   ( match, space ) => space + ','.padEnd( ts )
                            )
                            .replace(
                                /(".*?")\s*:\s*(?![{\s[])/gm
                            ,   ( match, key ) => ( key += ': ' ).padEnd( key.length <= align ? align : ( key.length + ts - 1 - ( key.length - 1 ) % ts ) )
                            )
                    );
                }
            );

        }
        )();
    }
}

_.extend(
    ApiGenerator.prototype
,   require( './../../lib/generator.js' )
,   require( './../../lib/sub-generator.js' )
);

module.exports = ApiGenerator;
