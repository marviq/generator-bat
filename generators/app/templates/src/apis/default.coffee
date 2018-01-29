'use strict'

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
        #   Defined through the {{#crossLink 'SettingsEnvironmentModel/api:attribute'}}`environment.api.default` setting{{/crossLink}}.
        #
        #   @property       url
        #   @type           String
        #   @final
        #
        #   @default        settings.get( 'environment.api.default' )
        ###

        url:                settings.get( 'environment.api.default' )

    )

)
