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

    ###*
    #   @author         <%= user.git.name() %>
    #   @module         App
    #   @submodule      Collections
    ###

    'use strict'

    ###*
    #   <%= description %>
    #
    #
    #   @class          <%= className %>Collection
    #   @extends        Backbone.Collection<% if ( singleton ) { %>
    #   @static<% } else { %>
    #   @constructor<% } %>
    ###

    class <%= className %>Collection extends Backbone.Collection

        ###*
        #   @property       model
        #
        #   @default        <%= modelClass %>Model
        #   @type           Class
        #   @static
        #   @final
        ###

        model:              <%= modelClass %>Model<% if ( singleton ) { %>


    ##  Export singleton
    ##
    return new <%= className %>Collection()<% } %>

)
