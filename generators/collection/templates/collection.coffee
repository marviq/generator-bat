( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )
            require( './../models/<%= modelFileName %>' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'backbone'
            './../models/<%= modelFileName %>'
        ], factory )

)((
    Backbone
    <%= modelClassName %>
) ->

    ###*
    #   @author         <%= userName %>
    #   @module         App
    #   @submodule      Collections
    ###

    'use strict'

    ###*<% if ( description ) { %>
    #   <%= description %>
    #<% } %>
    #   @class          <%= className %>
    #   @extends        Backbone.Collection<% if ( singleton ) { %>
    #   @static<% } else { %>
    #   @constructor<% } %>
    ###

    class <%= className %> extends Backbone.Collection

        ###*
        #   @property       model
        #
        #   @default        <%= modelClassName %>
        #   @type           Class
        #   @static
        #   @final
        ###

        model:              <%= modelClassName %><% if ( singleton ) { %>


    ##  Export singleton
    ##
    return new <%= className %>()<% } %>

)
