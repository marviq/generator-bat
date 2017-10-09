( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )
            require( './../models/<%- modelFileName %>' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'backbone'
            './../models/<%- modelFileName %>'
        ], factory )
    return
)((
    Backbone
    <%- modelClassName %>
) ->

    ###*
    #   @author         <%- userName %>
    #   @module         App
    #   @submodule      Collections
    ###

    'use strict'


    ###*<% if ( description ) { %>
    #   <%- description %>
    #<% } %>
    #   @class          <%- className %>
    #   @extends        Backbone.Collection<% if ( singleton ) { %>
    #   @static<% } else { %>
    #   @constructor<% } %>
    ###

    class <%- className %> extends Backbone.Collection

        ###*
        #   The collection's `{{#crossLink "<%- modelClassName %>"}}{{/crossLink}}`.
        #
        #   @property       model
        #
        #   @default        <%- modelClassName %>
        #   @type           Backbone.Model
        #   @static
        #   @final
        ###

        model:              <%- modelClassName %><% if ( singleton ) { %>


    ##  Export singleton.
    ##
    return new <%- className %>()<% } %>

)
