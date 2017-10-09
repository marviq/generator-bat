( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )
            require( './../models/api-service.coffee' )

            require( 'madlib-settings' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'backbone'
            './../models/api-service.coffee'

            'madlib-settings'
        ], factory )
    return
)((
    Backbone
    ApiServiceModel

    settings
) ->

    ###*
    #   @author         David Bouman
    #   @module         App
    #   @submodule      Collections
    ###

    'use strict'


    ###*
    #   A collection of services available on the API.
    #
    #   @class          ApiServicesCollection
    #   @extends        Backbone.Collection
    #   @static
    ###

    class ApiServicesCollection extends Backbone.Collection

        ###*
        #   The collection's `{{#crossLink "ApiServiceModel"}}{{/crossLink}}`.
        #
        #   @property       model
        #   @type           Backbone.Model
        #   @protected
        #   @static
        #   @final
        #
        #   @default        ApiServiceModel
        ###

        model:              ApiServiceModel



    ###*
    #   The app's globally sharable configuration settings.
    #
    #   These are exposed through the `madlib-settings` singleton object. Simply `require(...)` it wherever you have a need for them.
    #
    #   @class          Settings
    #   @static
    ###

    appBaseUrl  = settings.get( 'appBaseUrl' )

    apiServices =
        new ApiServicesCollection(

            [
                ###*
                #   Absolute url path for retrieving the app's current build's {{#crossLink "BuildBrief"}}briefing data{{/crossLink}}.
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
                #   @property       services.buildBrief
                #   @type           String
                #   @final
                #
                #   @default        '<app-base-url>/build.json'
                ###

                id:     'buildBrief'
                url:    "#{appBaseUrl}build.json"

            ,
                ###*
                #   Absolute url path for retrieving the app's {{#crossLink "SettingsEnvironment"}}target-environment settings{{/crossLink}}.
                #
                #   These settings include:
                #
                #     * `apiBaseUrl`
                #     * `environment`<% if ( i18n ) { %>
                #     * `locales`<% } %>
                #
                #   Once retrieved these can be referenced through the {{#crossLink "Settings/environment:property"}}the `environment` setting{{/crossLink}}.
                #
                #   @property       services.settingsEnvironment
                #   @type           String
                #   @final
                #
                #   @default        '<app-base-url>/settings.json'
                ###

                id:     'settingsEnvironment'
                url:    "#{appBaseUrl}settings.json"

            ,

                ##
                ##  NOTE:
                ##
                ##  Before using any of the services below, the target-environment settings need to have been retrieved first in order to have an API base url
                ##  to base these values off of.
                ##

            ]
        )


    ###*
    #   The services available on the API.
    #
    #   @property       services
    #   @type           Object
    ###

    settings.init( 'services', apiServices.reduce( ( ( memo, service ) -> memo[ service.id ] = service.get( 'url' ); return memo ), {} ) )


    ###*
    #   @class          ApiServicesCollection
    ###


    ##  Export singleton.
    ##
    return apiServices

)
