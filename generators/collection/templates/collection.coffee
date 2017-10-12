( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( '<%- backbone.modulePath %>' )

            require( './../models/<%- modelFileName %>' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            '<%- backbone.modulePath %>'

            './../models/<%- modelFileName %>'
        ], factory )
    return
)((
    <%- backbone.className %>

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
    #   @extends        <%- backbone.className %>.Collection<% if ( singleton ) { %>
    #   @static<% } else { %>
    #   @constructor<% } %>
    ###

    class <%- className %> extends <%- backbone.className %>.Collection

        ###*
        #   The collection's `{{#crossLink '<%- modelClassName %>'}}{{/crossLink}}` constructor.
        #
        #   @property       model
        #   @type           Function
        #   @protected
        #   @final
        #
        #   @default        <%- modelClassName %>
        ###

        model:              <%- modelClassName %><% if ( singleton ) { %>


    ##  Export singleton.
    ##
    return new <%- className %>()<% } %>

)
