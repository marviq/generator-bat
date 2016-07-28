( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'backbone'
        ], factory )
    return
)((
    Backbone
) ->

    ###*
    #   @author         David Bouman
    #   @module         App
    #   @submodule      Models
    ###

    'use strict'


    ###*
    #   Model for the `{{#crossLink "ApiServicesCollection"}}{{/crossLink}}`.
    #
    #   @class          ApiServiceModel
    #   @extends        Backbone.Model
    #   @constructor
    ###

    class ApiServiceModel extends Backbone.Model

        ###*
        #   List of [valid attribute names](#attrs).
        #
        #   @property       schema
        #   @type           Array[String]
        #   @static
        #   @final
        ###

        ###*
        #   The `ApiServiceModel`'s unique identifier.
        #
        #   @attribute      id
        #   @type           String
        ###

        ###*
        #   A url base path for accessing this API service.
        #
        #   @attribute      url
        #   @type           String
        ###

        schema: [

            'id'
            'url'
        ]

)
