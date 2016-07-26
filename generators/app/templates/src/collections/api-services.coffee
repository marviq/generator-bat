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
        #
        #   @default        ApiServiceModel
        #   @type           Backbone.Model
        #   @static
        #   @final
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
