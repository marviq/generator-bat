( ( factory ) ->
    if typeof exports is "object"
        module.exports = factory(
            require "q"
            require "backbone"
        )
    else if typeof define is "function" and define.amd
        define( [
            "q"
            "backbone"
        ], factory )

)( ( Q, Backbone ) ->

    ###*
    #   <%= description %>
    #
    #   @author <%= user.git.username %>
    #   @class <%= className %>Model
    #   @static
    #   @extends Backbone.Model
    #   @moduletype model
    #   @version 0.1
    ###
    class <%= className %>Model extends Backbone.Model


<% if( singleton === true ) { %>
    my<%= className %>Model = new <%= className %>Model()
    return my<%= className %>Model
<% } %>

)