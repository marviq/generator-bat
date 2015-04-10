( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )
            require( './documentation.hbs' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'backbone'
            './documentation.hbs'
        ], factory )

)((
    Backbone
    template
) ->

    'use strict'

    ###*
    #
    #
    #   @author         Raymond de Wit
    #   @class          DocumentationView
    #   @extends        Backbone.View
    #   @module         view
    #   @constructor
    #   @version        0.1
    ###
    class DocumentationView extends Backbone.View

        # We need to expose our name to the router
        #
        viewName:   'documentation'
        className:  'documentation-view'

        ###*
        # Function initializes the view
        #
        # @method     render
        #
        ###
        initialize: () ->
            # Add the pre-compiled handlebars template to our element
            # or do that in your render that's up to you...
            #
            @$el.append( template() )

            return


        ###*
        # Function renders the view
        #
        # @method     render
        # @return     viewInstance
        ###
        render: () ->

            # By convention always return this so people can chain functions
            # for example grab the .el after rendering ;-)
            #
            return @

)
