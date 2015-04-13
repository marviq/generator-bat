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

    ###*
    #   @author         Raymond de Wit
    #   @module         App
    #   @submodule      Views
    ###

    'use strict'

    ###*
    #   @class          DocumentationView
    #   @extends        Backbone.View
    #   @constructor
    ###

    class DocumentationView extends Backbone.View

        # We need to expose our name to the router
        #
        viewName:   'documentation'
        className:  'documentation-view'


        ###*
        # Function renders the view
        #
        # @method     render
        # @return     viewInstance
        ###
        render: () ->

            @$el.html( template() )

            # By convention always return this so people can chain functions
            # for example grab the .el after rendering ;-)
            #
            return @

)
