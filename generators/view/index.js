'use strict';

//
//  Yeoman bat:view sub-generator.
//

var Generator       = require( 'yeoman-generator' )
,   yosay           = require( 'yosay' )
,   youtil          = require( './../../lib/youtil.js' )
,   _               = require( 'lodash' )
;

class ViewGenerator extends Generator
{
    constructor ()
    {
        super( ...arguments );

        this.description    = this._description( 'backbone view' );

        this.argument(
            'viewName'
        ,   {
                type:           String
            ,   required:       false
            ,   desc:           'The name of the view to create.'
            }
        );

        //  Also add 'viewName' as a - hidden - option, defaulting to the positional argument's value.
        //  This way `_promptsPruneByOptions()` can filter away prompting for the view name too.
        //
        this.option(
            'viewName'
        ,   {
                type:           String
            ,   desc:           'The name of the view to create.'
            ,   default:        this.viewName
            ,   hide:           true
            }
        );

        //  Normal options.
        //
        this.option(
            'description'
        ,   {
                type:           String
            ,   desc:           'The purpose of this view.'
            }
        );

        this.option(
            'sass'
        ,   {
                type:           Boolean
            ,   desc:           'Whether this view should have a SASS file of its own.'
            }
        );
    }

    initializing ()
    {
        this._assertBatApp();

        //  Container for template expansion data.
        //
        this.templateData = {};
    }

    prompting ()
    {
        //  Ask only those question that have not yet been provided with answers via the command line.
        //
        var prompts = this._promptsPruneByOptions(
                [
                    {
                        type:       'input'
                    ,   name:       'viewName'
                    ,   message:    'What is the name of this view you so desire?'
                    ,   default:    _.camelCase( youtil.definedToString( this.options.viewName ))
                    ,   validate:   youtil.isIdentifier
                    ,   filter:     ( value ) => ( _.camelCase( _.lowerFirst( _.trim( value ).replace( /view$/i, '' ))) )
                    }
                ,   {
                        type:       'input'
                    ,   name:       'description'
                    ,   message:    'What is the purpose (description) of this view?'
                    ,   validate:   youtil.isNonBlank
                    ,   filter:     youtil.sentencify
                    }
                ,   {
                        type:       'confirm'
                    ,   name:       'sass'
                    ,   message:    'Should this view have a a SASS file of its own?'
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
            this.log( yosay( 'So you want a BAT view?' ) );

            return (
                this
                    .prompt( prompts )
                    .then( ( answers ) => { _.extend( this.templateData, answers ); } )
            );
        }
    }

    configuring ()
    {
        var data        = this.templateData
        ,   viewName    = data.viewName
        ;

        _.extend(
            data
        ,   {
                className:          _.upperFirst( viewName ) + 'View'
            ,   cssClassName:       _.kebabCase( viewName ) + '-view'
            ,   fileBase:           _.kebabCase( _.deburr( viewName ))

            ,   userName:           this.user.git.name()

            ,   backbone:           ( this.config.get( 'backbone' ) || { className: 'Backbone', modulePath: 'backbone' } )
            }
        );
    }

    writing ()
    {
        //  createView:
        //
        ( () =>
        {
            var data        = this.templateData
            ,   templates   =
                {
                    'view.hbs':     [ 'src/views/' + data.fileBase + '.hbs' ]
                ,   'view.coffee':  [ 'src/views/' + data.fileBase + '.coffee' ]
                }
            ;

            if ( data.sass )
            {
                templates[ 'view.sass' ] = [ 'src/sass/views/_' + data.fileBase + '.sass' ];
            }

            this._templatesProcess( templates );
        }
        )();
    }

    install ()
    {
        //  updateViewsSass:
        //
        ( () =>
        {
            /* jshint laxbreak: true */

            var data = this.templateData;

            if ( !( data.sass )) { return; }

            //
            //  Add an `@import "views/_<fileBase>" statement to the '_views.sass' file.
            //

            var viewsPath   = 'src/sass/_views.sass'
            ,   fs          = this.fs
            ,   views       = fs.read( viewsPath )
            ,   statement   = '@import "views/_' + data.fileBase + '"'
            ;

            //  Look for a place to insert, preferably at an alfanumerically ordered position.
            //  Do nothing if an `@import` for this sass file seems to exist already.
            //
            var insertAt, indent, match, matcher = /^([ \t]*)(@import.*)/mg;

            while ( (( match = matcher.exec( views ) )) )
            {
                if ( statement > match[ 2 ] )
                {
                    //  Use indent of the (possibly) preceding line.
                    //
                    indent      = match[ 1 ];
                    continue;
                }

                if ( statement < match[ 2 ] )
                {
                    insertAt    = match.index;
                    break;
                }

                this.log(
                    'It appears that "' + viewsPath + '" already contains an `@import` for "' + data.fileBase + '.sass".\n'
                +   'Leaving it untouched.'
                );

                return;
            }

            //  Avoid the conflict warning and use force for the write
            //
            this.conflicter.force = true;

            if ( indent == null )
            {
                //  First @import; use indent of the following line, if any.
                //
                indent = match ? match[ 1 ] : '';
            }

            if ( insertAt == null )
            {
                //  Append at end of file; Take care of possibly missing trailing newline.
                //
                fs.write( viewsPath, views + (( views.length && views.slice( -1 ) !== '\n' ) ? '\n' : '' ) + indent + statement + '\n' );
            }
            else
            {
                fs.write( viewsPath, views.slice( 0, insertAt ) + indent + statement + '\n' + views.slice( insertAt ) );
            }
        }
        )();
    }
}

_.extend(
    ViewGenerator.prototype
,   require( './../../lib/generator.js' )
,   require( './../../lib/sub-generator.js' )
);

module.exports = ViewGenerator;
