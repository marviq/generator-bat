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
    #   @author         David Bouman
    #   @module         App
    #   @submodule      Models
    ###


    ###*
    #   Model for the `{{#crossLink 'ApiServicesCollection'}}{{/crossLink}}`.
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
        #   @final
        ###

        ###*
        #   The `ApiServiceModel`'s unique identifier.
        #
        #   @attribute      id
        #   @type           String
        ###

        ###*
        #   A url path relative to the API's base `url` for accessing this service's API endpoint.
        #
        #   @attribute      urlPath
        #   @type           String
        ###

        schema: [

            'id'
            'urlPath'
        ]


        ###*
        #   This method caters for `Backbone.Model.url()` to not break on `ApiServiceModel` values. It is, in short, a hack.
        #
        #   Not many libraries do ensure to stringify values before invoking `String` prototype methods on them and `Backbone.Model.url()` is no exception.
        #
        #   See:
        #   [`String.prototype.replace`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#wiki-document-head)
        #   for a complete description of this method's signature.
        #
        #   @method         replace
        ###

        replace: () ->

            return @toString().replace( arguments... )


        ###*
        #   Creates a complete service API endpoint url from the API's base `url` and the model's `urlPath`.
        #
        #   Most time you won't need to call this method explicitly; simply provide this model wherever you have a need for this value.
        #
        #   @method         toString
        #
        #   @return         {String}                                    The complete url of the service's API endpoint.
        ###

        toString: () ->

            return "#{ @collection.url }/#{ @attributes.urlPath }"

)
