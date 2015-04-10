( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )
            require( './index.hbs' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'backbone'
            './index.hbs'
        ], factory )

)((
    Backbone
    template
) ->

    'use strict'

    ###*
    #   Default index view of BAT
    #<% if ( authorName ) { %>
    #   @author         <%= authorName %><% } %>
    #   @class          IndexView
    #   @extends        Backbone.View
    #   @constructor
    ###
    class IndexView extends Backbone.View

        # We need to expose our name to the router
        #
        viewName:   'index'
        className:  'index-view'

        initialize: () ->
            # Add the pre-compiled handlebars template to our element
            # or do that in your render that's up to you...
            #
            @$el.append( template() )

            return


        render: () ->

            # By convention always return this so people can chain functions
            # for example grab the .el after rendering ;-)
            #
            return @

)
