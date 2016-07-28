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
    #   @author         <%- userName %>
    #   @module         App
    #   @submodule      Models
    ###

    'use strict'


    ###*<% if ( description ) { %>
    #   <%- description %>
    #<% } %>
    #   @class          <%- className %>
    #   @extends        Backbone.Model<% if ( singleton ) { %>
    #   @static<% } else { %>
    #   @constructor<% } %>
    ###

    class <%- className %> extends Backbone.Model

        ###*
        #   List of [valid attribute names](#attrs).
        #
        #   @property       schema
        #
        #   @type           Array[String]
        #   @static
        #   @final
        ###

        ###*
        #   The `<%- className %>`'s unique identifier.
        #
        #   @attribute      id
        #
        #   @type           String
        ###

        schema: [

            'id'
        ]<% if ( singleton ) { %>


    ##  Export singleton.
    ##
    return new <%- className %>()<% } %>

)
