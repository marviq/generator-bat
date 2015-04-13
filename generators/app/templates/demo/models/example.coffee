( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'backbone'
        ], factory )

)((
    Backbone
) ->

    ###*
    #   @author         Raymond de Wit
    #   @module         App
    #   @submodule      Models
    ###

    'use strict'

    ###*
    #   Example of a model
    #
    #   @class          ExampleModel
    #   @extends        Backbone.Model
    #   @constructor
    ###

    class ExampleModel extends Backbone.Model

        defaults:
            propertyOne:    'this should be a string'
            propertyTwo:    true


        exampleAsyncFunction: ( callback ) ->

            setTimeout( () ->
                callback( true )
            ,   1000 )

            return

)
