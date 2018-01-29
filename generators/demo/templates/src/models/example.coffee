'use strict'

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
    #   @author         Raymond de Wit
    #   @module         App
    #   @submodule      Models
    ###


    ###*
    #   Example of a model
    #
    #   @class          ExampleModel
    #   @extends        Backbone.Model
    #   @constructor
    ###

    class ExampleModel extends Backbone.Model

        ###*
        #   Defaults to initialize missing attributes with when instantiating a new `ExampleModel`.
        #
        #   @property       defaults
        #   @type           Object
        #   @protected
        #   @final
        ###

        defaults:
            attributeOne:   'this should be a string'
            attributeTwo:   true


        ###*
        #   @method         exampleAsyncFunction
        #
        #   @param          {Function}          callback                A callback function to call after one second.
        ###

        exampleAsyncFunction: ( callback ) ->

            setTimeout( () ->
                callback( true )
            ,   1000 )

            return

)
