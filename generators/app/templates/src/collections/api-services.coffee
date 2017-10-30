'use strict'

( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )

            require( './../models/api-service.coffee' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'backbone'

            './../models/api-service.coffee'
        ], factory )
    return
)((
    Backbone

    ApiServiceModel
) ->

    ###*
    #   @author         David Bouman
    #   @module         App
    #   @submodule      Collections
    ###


    ###*
    #   A collection of services available on an API.
    #
    #   @class          ApiServicesCollection
    #   @extends        Backbone.Collection
    #   @constructor
    ###

    class ApiServicesCollection extends Backbone.Collection

        ###*
        #   The collection's `{{#crossLink 'ApiServiceModel'}}{{/crossLink}}` constructor.
        #
        #   @property       model
        #   @type           Function
        #   @protected
        #   @final
        #
        #   @default        ApiServiceModel
        ###

        model:              ApiServiceModel


        ###*
        #   The API's base url.
        #
        #   This property will be initialized from the `options.url` constructor argument.
        #
        #   @property       url
        #   @type           String
        ###

        url:                undefined


        ###*
        #   Initialize the `@url` property from `options`.
        #
        #   @method         initialize
        #   @protected
        #
        #   @param          {Array}             [models]                An initial array of models for the collection.
        #   @param          {Object}            [options]
        #   @param          {String}            [options.url]           The base url for the API.
        ###

        initialize: ( models, options ) ->

            @url = options?.url

            return

)
