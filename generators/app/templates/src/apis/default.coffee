( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'madlib-settings' )

            require( './../collections/api-services.coffee' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'madlib-settings'

            './../collections/api-services.coffee'
        ], factory )
    return
)((
    settings

    ApiServicesCollection
) ->

    ###*
    #   @author         David Bouman
    #   @module         App
    #   @submodule      Apis
    ###

    'use strict'


    ###*
    #   A collection of services' endpoints available on the app's default API.
    #
    #   @class          DefaultApi
    #   @static
    ###

    new ApiServicesCollection(

        [
        ]

    ,
        ###*
        #   The `DefaultApi`'s base url.
        #
        #   Defined through the {{#crossLink 'Settings/environment.apiBaseUrl:property'}}environment.apiBaseUrl setting{{/crossLink}}.
        #
        #   @property       url
        #   @type           String
        #   @final
        #
        #   @default        `settings.get( 'environment.apiBaseUrl' )`
        ###

        url:                settings.get( 'environment.apiBaseUrl' )

    )

)
