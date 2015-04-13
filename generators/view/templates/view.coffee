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

    ###*
    #   @author         <%= user.git.name() %>
    #   @module         App
    #   @submodule      Views
    ###

    'use strict'

    ###*
    #   <%= description %>
    #
    #   @class          <%= className %>View
    #   @extends        Backbone.View
    #   @constructor
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
