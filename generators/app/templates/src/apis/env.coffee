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
    #   A collection of services' endpoints available on the app's target-environment's API.
    #
    #   @class          EnvApi
    #   @static
    ###

    new ApiServicesCollection(

        [
            ###*
            #   Service API endpoint for retrieving the app's current build's {{#crossLink 'BuildBrief'}}briefing data{{/crossLink}}.
            #
            #   This data includes:
            #
            #     * `buildNumber`
            #     * `buildId`
            #     * `revision`
            #     * `grunted`
            #     * `environment`
            #     * `debugging`
            #     * `name`
            #     * `version`
            #     * `timestamp`
            #
            #   @attribute      buildBrief
            #   @type           ApiServiceModel
            #   @final
            #
            #   @default        '<EnvApi.url>/build.json'
            ###

            id:                 'buildBrief'
            urlPath:            'build.json'

        ,
            ###*
            #   Service API endpoint for retrieving the app's {{#crossLink 'SettingsEnvironment'}}target-environment settings{{/crossLink}}.
            #
            #   These settings include:
            #
            #     * `api`
            #     * `environment`<% if ( i18n ) { %>
            #     * `locales`<% } %>
            #
            #   Once retrieved these can be referenced through the {{#crossLink 'Settings/environment:property'}}`environment` setting{{/crossLink}}.
            #
            #   @attribute      settingsEnvironment
            #   @type           ApiServiceModel
            #   @final
            #
            #   @default        '<EnvApi.url>/settings.json'
            ###

            id:                 'settingsEnvironment'
            urlPath:            'settings.json'

        ,
        ]

    ,
        ###*
        #   The `EnvApi`'s base url.
        #
        #   Defined through the {{#crossLink 'Settings/appBaseUrl:property'}}`appBaseUrl` setting{{/crossLink}}.
        #
        #   @property       url
        #   @type           String
        #   @final
        #
        #   @default        settings.get( 'appBaseUrl' )
        ###

        url:                settings.get( 'appBaseUrl' )

    )

)
