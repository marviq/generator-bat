//
//  Mix in common ground for sub-generators.
//

'use strict';

var chalk = require( 'chalk' );

module.exports =
    {
        _assertBatApp: function ()
        {
            /* jshint laxbreak: true */

            if ( !( this.config.get( 'generator-version' ) ))
            {
                this.env.error(
                    chalk.bold.red( 'I cannot find a BAT app to hook into!\n' )
                +   '\n'
                +   'Is your current working directory part of your project tree?\n'
                +   'Does your project root have a valid "' + chalk.bold( '.yo-rc.json' ) + '" file?\n'
                +   'If you have never done so before, please run "' + chalk.yellow.bold( 'yo bat' ) + '" from your project root first.\n'
                );
            }
        }
    }
;
