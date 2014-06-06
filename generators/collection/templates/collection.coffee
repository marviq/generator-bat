( ( factory ) ->
    if typeof exports is "object"
        module.exports = factory(
            require "q"
            require "backbone"
            require "./../models/<%= modelName %>.coffee"
        )
    else if typeof define is "function" and define.amd
        define( [
            "q"
            "backbone"
            "./../models/<%= modelName %>.coffee"
        ], factory )

)( ( Q, Backbone, <%= modelName %>Model ) ->

    ###*
    #   <%= description %>
    #
    #   @author <%= user.git.username %>
    #   @class <%= className %>Collection
    #   @static
    #   @extends Backbone.Collection
    #   @moduletype collection
    #   @version 0.1
    ###
    class <%= className %>Collection extends Backbone.Collection

        model: <%= modelName %>Model


<% if( singleton === true ) { %>
    my<%= className %>Collection = new <%= className %>Collection()
    return my<%= className %>Collection
<% } %>

)