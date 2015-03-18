( ( factory ) ->
    if typeof exports is "object"
        module.exports = factory(
            require "q"
            require "backbone"
            require "./../models/<%= modelFileName %>.coffee"
        )
    else if typeof define is "function" and define.amd
        define( [
            "q"
            "backbone"
            "./../models/<%= modelFileName %>.coffee"
        ], factory )

)( ( Q, Backbone, <%= modelClass %>Model ) ->

    ###*
    #   <%= description %>
    #
    #   @author         <%= user.git.user() %>
    #   @class          <%= className %>Collection
    #   @extends        Backbone.Collection<% if ( singleton ) { %>
    #   @static<% } %>
    #   @moduletype     collection
    #   @version        0.1
    ###
    class <%= className %>Collection extends Backbone.Collection

        model: <%= modelClass %>Model


<% if( singleton === true ) { %>
    my<%= className %>Collection = new <%= className %>Collection()
    return my<%= className %>Collection
<% } %>

)
