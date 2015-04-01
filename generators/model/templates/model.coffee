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
    #   <%= description %>
    #
    #   @author         <%= user.git.name() %>
    #   @class          <%= className %>Model
    #   @extends        Backbone.Model<% if ( singleton ) { %>
    #   @static<% } else { %>
    #   @constructor<% } %>
    #   @moduletype     model
    #   @version        0.1
    ###

    class <%= className %>Model extends Backbone.Model<% if ( singleton ) { %>


    ##  Export singleton
    ##
    return new <%= className %>Model()<% } %>

)
