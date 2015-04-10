( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )
            require( './<%= fileName %>.hbs' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'backbone'
            './<%= fileName %>.hbs'
        ], factory )

)((
    Backbone
    template
) ->

    'use strict'

    ###*
    #   <%= description %>
    #
    #   @author         <%= user.git.name() %>
    #
    #   @class          <%= className %>View
    #   @extends        Backbone.View
    #   @moduletype     view
    #   @constructor
    #   @version        0.1
    ###
    class <%= className %>View extends Backbone.View

        # We need to expose our name to the router
        #
        viewName:   '<%= viewName %>'
        className:  '<%= fileName %>-view'

        initialize: () ->
            # placeholder

            return


        render: () ->

            @$el.html( template() )

            # By convention always return this so people can chain functions
            # for example grab the .el after rendering ;-)
            #
            return @

)
