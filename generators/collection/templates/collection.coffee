( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )
            require( './../models/<%= modelFileName %>.coffee' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'backbone'
            './../models/<%= modelFileName %>.coffee'
        ], factory )

)((
    Backbone
    <%= modelClass %>Model
) ->

    'use strict'

    ###*
    #   <%= description %>
    #
    #   @author         <%= user.git.name() %>
    #   @class          <%= className %>Collection
    #   @extends        Backbone.Collection<% if ( singleton ) { %>
    #   @static<% } else { %>
    #   @constructor<% } %>
    #   @moduletype     collection
    #   @version        0.1
    ###
    class <%= className %>Collection extends Backbone.Collection

        model: <%= modelClass %>Model<% if ( singleton ) { %>


    ##  Export singleton
    ##
    return new <%= className %>Collection()<% } %>

)
