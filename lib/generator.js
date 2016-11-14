//
//  Mix in template utilities for generators.
//

'use strict';

var _       = require( 'lodash' )
,   chalk   = require( 'chalk' )
,   fsCore  = require( 'fs' )
,   path    = require( 'path' )
;

module.exports =
    {
        /**
         *  Churn out a commonly styled generator description.
         *
         *  @method:    _description
         *
         *  @param      {String}       what         String injected into the common descriptor template.
         *
         *  @return     {String}                    The expanded description.
         */

        _description: function ( what )
        {
            return chalk.bold(
                'This is the ' + chalk.cyan( what )
            +   ' generator for BAT, the Backbone Application Template'
            +   ' created by ' + chalk.blue( 'marv' ) + chalk.red( 'iq' ) + '.'
            );
        }

    ,
        /**
         *  Takes an array of prompt definitions, as would be passed to `this.prompt()`, filters away those for which valid values have been supplied via the
         *  identically named command line options, fills the `this.templateData` object with those values and returns the pruned list.

         *  @method     _promptPruneByOptions
         *
         *  @param      {Array}         prompts     An array of prompt definitions as would be passed to `this.prompt()`.
         *
         *  @return     {Array}                     The prompts for which no valid value has been supplied through a command line option.
         *
         */

        _promptsPruneByOptions: function ( prompts )
        {
            var options     = this.options
            ,   data        = this.templateData
            ,   remaining   = []
            ,   prompt
            ,   name
            ,   value
            ,   final
            ,   index
            ,   validate
            ,   filter
            ;

            for ( index = prompts.length; index--; )
            {
                prompt  = prompts[ index ];
                name    = prompt.name;
                value   = options[ name ];
                final   = null;

                if ( value != null )
                {
                    if ( !(( validate = prompt.validate )) || validate( value ))
                    {
                        final = (( filter = prompt.filter )) ? filter( value ) : value;
                    }
                }

                if ( final != null )
                {
                    data[ name ] = final;
                }
                else
                {
                    remaining.unshift( prompt );
                }
            }

            return remaining;
        }

    ,
        /**
         *  Process template files; either copying them as-is from `#sourceRoot()` to `#destinationRoot()`, or expanding them with `#templateData` first.
         *
         *  @method     _templatesProcess
         *
         *  @param      {Array|Object}  templates
         *
         *    - Either an array of template files to copy or expand keeping relative paths identical in both roots.
         *      In this case, the destination path will be cleared from any '@' exempt markers that may be present in the
         *      source path.
         *
         *    - Or an object hash mapping source- to destination paths relative to each root respectively.
         *      In this case, the destination path is used as-is.
         *
         *    In either case, the hash- or array element values can be simple strings or arrays.
         *
         *    * A string indicates to do a simple `#fs.copy()`;
         *    * An array indicates to use `fs.copyTpl()` instead, its first element providing the path and the (optional) second element becoming the `options`
         *      arguments to `#fs.copyTpl()`.
         */

        _templatesProcess: function ( templates )
        {
            /* jshint forin: false */

            var src, dst, args, method
            ,   fs = this.fs
            ;

            for ( src in templates )
            {
                dst = templates[ src ];

                if ( _.isArray( dst ) )
                {
                    //  Template expansion needed.

                    method  = fs.copyTpl;
                    args    = [ this.templateData ].concat( dst.slice( 1, 2 ));
                    dst     = dst[ 0 ];
                }
                else
                {
                    method  = fs.copy;
                    args    = [];
                }

                if ( /^\d+$/.test( src ))   //  numeric index, ergo: `templates` is an `Array`.
                {
                    src = dst;

                    //  Remove exempt markers.
                    //
                    dst = dst.replace( /(^|\/)@/g, '$1' );
                }

                args.unshift( this.templatePath( src ), this.destinationPath( dst ));

                method.apply( fs, args );
            }
        }

    ,
        /**
         *  Make a symbolic link within `#destinationRoot()`.
         *
         *  @method     _symLink
         *
         *  @param      {String}        src         The path relative to `#destinationRoot()` that should become the target of the symbolic link.
         *  @param      {String}        dst         The path relative to `#destinationRoot()` that should become the symbolic link.
         *
         */

        _symLink: function ( src, dst )
        {
            src = this.destinationPath( src );
            dst = this.destinationPath( dst );

            this.conflicter.checkForCollision(

                dst
            ,   this.read( src )
            ,   function ( err, status ) {

                    if ( 'identical' === status ) { return; }

                    //  The symlink may exist, but may link to a nonexistent file in which case `status` will be `'create'`, so try unlinking it anyway.
                    //
                    try
                    {
                        fsCore.unlinkSync( dst );
                    }
                    catch ( error )
                    {
                        if ( 'ENOENT' !== error.code  ) { throw error; }
                    }

                    fsCore.symlinkSync( path.relative( path.dirname( dst ), src ), dst );
                }
            );
        }
    }
;
