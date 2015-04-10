( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )
            require( './buildscript.hbs' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'backbone'
            './buildscript.hbs'
        ], factory )

)((
    Backbone
    template
) ->

    'use strict'

    ###*
    #   View contains information about the build tasks in the Gruntfile
    #
    #   @author         Raymond de Wit
    #   @class          BuildscriptView
    #   @module         view
    #   @extends        Backbone.View
    #   @constructor
    ###
    class BuildscriptView extends Backbone.View

        # We need to expose our name to the router
        #
        viewName:   'buildscript'
        className:  'buildscript-view'

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
