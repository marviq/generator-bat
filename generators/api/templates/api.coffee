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
    #   @author         <%- userName %>
    #   @module         App
    #   @submodule      Apis
    ###


    ###*<% if ( description ) { %>
    #   <%- description %>
    #<% } %>
    #   @class          <%- className %>
    #   @static
    ###

    new ApiServicesCollection(

        [
        ]

    ,
        ###*
        #   The `<%- className %>`'s base url.
        #
        #   Defined through the {{#crossLink 'SettingsEnvironmentModel/api:attribute'}}`environment.api.<%- apiName %>` setting{{/crossLink}}.
        #
        #   @property       url
        #   @type           String
        #   @final
        #
        #   @default        settings.get( 'environment.api.<%- apiName %>' )
        ###

        url:                settings.get( 'environment.api.<%- apiName %>' )

    )

)
