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
    #   @author         <%= userName %>
    #   @module         App
    #   @submodule      Models
    ###

    'use strict'

    ###*<% if ( description ) { %>
    #   <%= description %>
    #<% } %>
    #   @class          <%= className %>
    #   @extends        Backbone.Model<% if ( singleton ) { %>
    #   @static<% } else { %>
    #   @constructor<% } %>
    ###

    class <%= className %> extends Backbone.Model<% if ( singleton ) { %>


    ##  Export singleton
    ##
    return new <%= className %>()<% } %>

)
