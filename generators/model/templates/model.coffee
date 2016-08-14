( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( '<%- backbone.modulePath %>' )<% if ( api ) { %>

            require( './../apis/<%- api.path %>' )<% } %>
        )
    else if typeof define is 'function' and define.amd
        define( [
            '<%- backbone.modulePath %>'<% if ( api ) { %>

            './../apis/<%- api.path %>'<% } %>
        ], factory )
    return
)((
    <%- backbone.className %><% if ( api ) { %>

    api<% } %>
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
        ]


        ###*
        #   Default attribute values.
        #
        #   @property       defaults
        #   @type           Object
        #   @static
        #   @final
        ###

        defaults:           {}<% if ( api ) { %>


        ###*
        #   Service API endpoint; defined in the {{#crossLink '<%- api.className %>/<%- modelName %>:attribute'}}<%- api.className %>{{/crossLink}}.
        #<% if ( singleton ) { %>
        #   @property       url<% } else { %>
        #   @property       urlRoot<% } %>
        #   @type           ApiServiceModel
        #   @static
        #   @final
        #
        #   @default        '<<%- api.className %>.url>/<%- service %>'
        ###
<% if ( singleton ) { %>
        url:                api.get( '<%- modelName %>' )<% } else { %>
        urlRoot:            api.get( '<%- modelName %>' )<% } %><% } %><% if ( singleton ) { %>


    ##  Export singleton.
    ##
    return new <%- className %>()<% } %>

)
