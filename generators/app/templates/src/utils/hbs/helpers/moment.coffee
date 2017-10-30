'use strict'

( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'hbsfy/runtime' )
            require( 'moment' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'hbsfy/runtime'
            'moment'
        ], factory )
    return
)((
    Handlebars
    moment
) ->

    ###*
    #   @author         David Bouman
    #   @module         App
    ###


    ###*
    #   Format any value into a date and/or time string representation using [`moment.format()`](http://momentjs.com/docs/#/displaying/format/).
    #
    #   @method         moment
    #   @for            Handlebars.Helpers
    #
    #   @param          {String}            any                     The value to format.
    #   @param          {String}            [format]                The (optional) `moment.format()` format string argument.
    #   @param          {String}            [pattern]               An optional [parsing format](http://momentjs.com/docs/#/parsing/string-format/) you may
    #                                                               need to direct coercion of the `any` value into a `moment` object first. Useful if the
    #                                                               `any` value isn't already a `moment` object.
    #
    #   @return         {String}                                    The `any` value formatted into the desired date and/or time respresentation string.
    ###

    Handlebars.registerHelper( 'moment', ( any, format, pattern, options ) ->

        return ( if options then moment( any, pattern ) else moment( any )).format( format )
    )

    return

)
