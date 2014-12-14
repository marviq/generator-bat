( ( factory ) ->
    if typeof exports is "object"
        module.exports = factory(
            require "q"
            require "backbone"
        )
    else if typeof define is "function" and define.amd
        define( [
            "q"
            "backbone"
        ], factory )

)( ( Q, Backbone ) ->

    ###*
    #   Example of a model
    #
    #   @author Raymond de Wit
    #   @class ExampleModel
    #   @static
    #   @extends Backbone.Model
    #   @moduletype model
    #   @version 0.1
    ###
    class ExampleModel extends Backbone.Model

        defaults:
            propertyOne:    "this should be a string"
            propertyTwo:    true


        exampleAsyncFunction: ( callback ) ->

            setTimeout( () ->
                callback( true )
            ,   1000 )
)