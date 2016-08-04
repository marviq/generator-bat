( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( '<%- backbone.modulePath %>' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            '<%- backbone.modulePath %>'
        ], factory )
    return
)((
    <%- backbone.className %>
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
    #   @extends        <%- backbone.className %>.Model<% if ( singleton ) { %>
    #   @static<% } else { %>
    #   @constructor<% } %>
    ###

    class <%- className %> extends <%- backbone.className %>.Model

        ###*
        #   List of [valid attribute names](#attrs).
        #
        #   @property       schema
        #   @type           Array[String]
        #   @static
        #   @final
        ###

        ###*
        #   The `<%- className %>`'s unique identifier.
        #
        #   @attribute      id
        #   @type           String
        ###

        schema: [

            'id'
        ]<% if ( singleton ) { %>


    ##  Export singleton.
    ##
    return new <%- className %>()<% } %>

)
