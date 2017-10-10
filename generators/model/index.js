'use strict';

//
//  Yeoman bat:model sub-generator.
//

var generators      = require( 'yeoman-generator' )
,   yosay           = require( 'yosay' )
,   youtil          = require( './../../lib/youtil.js' )
,   chalk           = require( 'chalk' )
,   glob            = require( 'glob' )
,   url             = require( 'url' )                      //  https://nodejs.org/api/url.html
,   _               = require( 'lodash' )
;

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
                'api'
            ,   {
                    type:           String
                ,   desc:           'The name of the API this model should connect to.'
                }
            );

            this.option(
                'service'
            ,   {
                    type:           String
                ,   desc:           'The service API endpoint URL this model should connect to (relative to the API\'s base).'
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

            //  Find available APIs:
            //
            var apis    = this.apis
                        = {}
            ,   base    = this.destinationPath( 'src/apis' )
            ;

            glob.sync( '**/*.coffee', { cwd: base } ).forEach(

                function ( path )
                {
                    var pathAbs     = base + '/' + path;
                    var match       = this.fs.read( pathAbs ).match( /@class\s+(\S+)/ );

                    if ( !( match ) ) { return; }

                    var className   = match[ 1 ]
                    ,   name        = _.lowerFirst( className.replace( /Api$/, '' ))
                    ;

                    apis[ name ]   =
                        {
                            className:  className
                        ,   pathAbs:    pathAbs
                        ,   path:       path
                        }
                    ;

                }.bind( this )
            );

            //  Container for template expansion data.
            //
            this.templateData   = {};
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
                            ,   default:    _.camelCase( youtil.definedToString( this.options.modelName ))
                            ,   validate:   youtil.isIdentifier
                            ,   filter: function ( value )
                                {
                                    return _.lowerFirst( _.trim( value ).replace( /model$/i, '' ));
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
                                type:       'list'
                            ,   name:       'api'
                            ,   message:    'Should this model connect to an API?'
                            ,   choices:    [ '- none -' ].concat( _.keys( this.apis ))
                            ,   default:    youtil.definedToString( this.options.api )
                            ,   validate: function ( value )
                                {
                                    return value in this.apis;
                                }.bind( this )
                            ,   filter: function ( value ) {
                                    return this.apis[ value ];
                                }.bind( this )
                            ,   when:       !( _.isEmpty( this.apis ))
                            }
                        ,   {
                                type:       'input'
                            ,   name:       'service'
                            ,   message:    (
                                                'To which service API endpoint should this model connect?'
                                            +   chalk.gray ( ' - please enter a URL relative to the API\'s base.' )
                                            )
                            ,   default: function ( answers )
                                {
                                    return (
                                        youtil.definedToString( this.options.service )
                                    ||  _.kebabCase( _.deburr(
                                            answers.modelName
                                        ||  this.templateData.modelName
                                        ))
                                    );
                                }.bind( this )
                            ,   validate: function( value ) {
                                    return value === url.parse( value ).path;
                                }
                            ,   filter: function ( value )
                                {
                                    return value.replace( /^\/+/, '' );
                                }
                            ,   when: function ( answers )
                                {
                                    return answers.api || this.templateData.api;
                                }.bind( this )
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
            var data            = this.templateData
            ,   modelName       = data.modelName
            ;

            _.extend(
                data
            ,   {
                    className:          _.upperFirst( modelName ) + 'Model'
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
                        'model.coffee': [ 'src/models/' + data.fileBase + '.coffee' ]
                    }
                ;

                this._templatesProcess( templates );
            }
        }

    ,   install: {

            updateApi: function () {

                var data        = this.templateData
                ,   api         = data.api
                ,   modelName   = data.modelName
                ;

                if ( !( api )) { return; }

                //
                //  Insert the expanded fragment template into the api collection definition.
                //  Look for a place to insert, preferably at an alfanumerically ordered position.
                //  Do nothing if an service API endpoint defintion for this model seems to exist already.
                //

                var fs          = this.fs
                ,   collection  = fs.read( api.pathAbs )
                ,   matcherDec  = /^([ \t]*).*?\bnew\s+ApiServicesCollection\(\s*?(^[ \t]*)?\[[ \t]*(\n)?/m
                //                  1------1                                      2-------2         3--3
                ,   match       = collection.match( matcherDec )
                ;

                if ( !( match ) )
                {
                    this.log(
                        'It appears that "' + api.pathAbs + '" does not contains an `ApiServicesCollection`\n'
                    +   'Leaving it untouched.'
                    );

                    return;
                }

                var level       = '    '
                ,   indent      = (( match[ 2 ] != null ) ? match[ 2 ] : ( match[ 1 ] + level ))
                ,   insertAt    = match.index + match[ 0 ].length
                ,   padPre      = match[ 3 ] ? '' : '\n'
                ,   padPost     = match[ 3 ] ? '' : indent
                ,   matcherDef  = /^(([ \t]*)([ \t]+))###\*[\s\S]*?^\1###[\s\S]*?^\1id:\s*'([^\]]*?)'[^\]]*?^\2(?:,[ \t]*(\n)?|(?=(\])))/mg
                //                 ^12======23======31             ^\1           ^\1       4-------4        ^\2          5--5     6--6
                ;

                //  Start looking for definitions directly after API declaration opening.
                //
                matcherDef.lastIndex    = insertAt;

                //  Find a place to insert
                //
                while ( (( match = matcherDef.exec( collection ) )) )
                {
                    level   = match[ 3 ];

                    if ( modelName > match[ 4 ] )
                    {
                        //  Possibly insert after this match.
                        //
                        indent      = match[ 2 ];
                        insertAt    = match.index + match[ 0 ].length;
                        padPre      = match[ 5 ] ? '' : match[ 6 ] ? ',\n'  : '\n';
                        padPost     = match[ 5 ] ? '' : indent;
                        continue;
                    }

                    if ( modelName < match[ 4 ] )
                    {
                        //  Insert before this match.
                        //
                        insertAt    = match.index;
                        padPre      = '';
                        padPost     = '';
                        break;
                    }

                    this.log(
                        'It appears that "' + api.pathAbs + '" already contains a service API endpoint definition for "' + data.className + '".\n'
                    +   'Leaving it untouched.'
                    );

                    return;
                }

                //  Avoid conflict warning.
                //
                this.conflicter.force   = true;

                //  Expand fragment template and read it back.
                //
                var fragmentPath        = 'src/apis/api-service-literal-fragment.coffee'
                ,   fragmentDst         = this.destinationPath( fragmentPath )
                ;

                this._templatesProcess( [ [ fragmentPath ] ] );

                var fragment            = fs.read( fragmentDst );

                fs.write(
                    api.pathAbs
                ,   collection.slice( 0, insertAt )
                +   padPre
                +   fragment.replace( /^    /mg, level ).replace( /^(?=.*?\S)/mg, indent )
                +   padPost
                +   collection.slice( insertAt )
                );

                fs.delete( fragmentDst );
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
