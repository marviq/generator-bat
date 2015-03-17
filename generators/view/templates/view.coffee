( ( factory ) ->
    if typeof exports is "object"
        module.exports = factory(
            require "backbone"
            require "jquery"
            require "./<%= fileName %>.hbs"
        )
    else if typeof define is "function" and define.amd
        define( [
            "backbone"
            "jquery"
            "./<%= fileName %>.hbs"
        ], factory )

)( ( Backbone, $, template ) ->
    ###*
    #   <%= description %>
    #
    #   @author         <%= user.git.user() %>
    #   @class          <%= className %>View
    #   @extends        Backbone.View
    #   @moduletype     view
    #   @constructor
    #   @version        0.1
    ###
    class <%= className %>View extends Backbone.View

        # We need to expose our name to the router
        #
        viewName:   "<%= viewName %>"
        className:  "<%= fileName %>-view"

        initialize: () ->
            # placeholder

        render: () ->

            @$el.html( template() )

            # By convention always return this so people can chain functions
            # for example grab the .el after rendering ;-)
            #
            return @
)
