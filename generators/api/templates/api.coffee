( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(

            require( './../collections/api-services.coffee' )
        )
    else if typeof define is 'function' and define.amd
        define( [

            './../collections/api-services.coffee'
        ], factory )
    return
)((

    ApiServicesCollection
) ->

    ###*
    #   @author         <%- userName %>
    #   @module         App
    #   @submodule      Apis
    ###

    'use strict'


    ###*<% if ( description ) { %>
    #   <%- description %>
    #<% } %>
    #   @class          <%- className %>
    #   @static
    ###

    new ApiServicesCollection(

        [
        ]

    ,
        ###*
        #   The `<%- className %>`'s base url.
        #
        #   @property       url
        #   @type           String
        #   @final
        #
        #   @default        <%- url %>
        ###

        url:                <%- url %>

    )

)
