( ( factory ) ->
    if typeof exports is "object"
        module.exports = factory(
            require "backbone"
            require "jquery"
            require "./<%= viewName %>.hbs"
        )
    else if typeof define is "function" and define.amd
        define( [
            "backbone"
            "jquery"
            "./<%= viewName %>.hbs"
        ], factory )

)( ( Backbone, $, template ) ->
    ###*
    #   <%= description %>
    #
    #   @author         <%= user.git.username %>
    #   @class          <%= className %>View
    #   @extends        Backbone.View
    #   @constructor
    #   @version        0.1
    ###
    class <%= className %>View extends Backbone.View

        # We need to expose our name to the router
        #
        viewName:   "<%= viewName %>"
        className:  "<%= viewName %>-view"

        initialize: () ->
            # Add the pre-compiled handlebars template to our element
            # or do that in your render that's up to you...
            #
            @$el.append( template() )

        render: () ->

            # By convention always return this so people can chain functions
            # for example grab the .el after rendering ;-)
            #
            return @
)
