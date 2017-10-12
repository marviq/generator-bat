'use strict';

var _       = require( 'lodash' )
,   clean   = require( 'underscore.string/clean' )
;

module.exports =
    {
        definedToString: function ( value )
        {
            return (( value == null ) ? value : '' + value );
        }

    ,   isCoffeeScript: function ( value )
        {
            try
            {
                require( 'coffee-script' ).compile( value );
            }
            catch ( e )
            {
                return false;
            }

            return true;
        }

    ,   isIdentifier: function ( value )
        {
            return /^[$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*$/.test(( '' + value ).trim() );
        }

    ,   isNonBlank: function ( value )
        {
            return /\S/.test( value );
        }

    //  https://docs.npmjs.com/files/package.json#name
    //  https://github.com/npm/normalize-package-data/blob/v2.0.0/lib/fixer.js#L304
    //
    ,   isNpmName: function ( value )
        {
            return value === encodeURIComponent( value ) && value === ( '' + value ).toLowerCase();
        }

    ,   sentencify: function ( value )
        {
            return _.upperFirst( clean( value )).replace( /([^!?.,:;])$/, '$1.' );
        }
    }
;
