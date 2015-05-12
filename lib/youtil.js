'use strict';

var capitalize  = require( 'underscore.string/capitalize' )
,   clean       = require( 'underscore.string/clean' )
;

module.exports =
    {
        isIdentifier: function ( value )
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
            return capitalize( clean( value )).replace( /([^!?.,:;])$/, '$1.' );
        }
    }
;
