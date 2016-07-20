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
    return
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

        ###*
        #   Expose this view's name to the router.
        #
        #   @property       viewName
        #
        #   @default        'documentation'
        #   @type           String
        #   @static
        #   @final
        ###

        viewName:           'documentation'


        ###*
        #   CSS class(es) to set on this view's root DOM element.
        #
        #   @property       className
        #
        #   @default        'documentation-view'
        #   @type           String
        #   @static
        #   @final
        ###

        className:          'documentation-view'


        ###*
        #   The compiled handlebars template expander function.
        #
        #   @property       template
        #
        #   @type           Function
        #   @protected
        #   @static
        #   @final
        ###

        template:           template


        ###*
        #   @method         render
        #
        #   @chainable
        #
        ###

        render: () ->

            ##  Expand the handlebars template into this view's container element.
            ##
            @$el.html( @template( @renderData() ) )

            ##  This method is chainable.
            ##
            return @


        ###*
        #   Collect and return all data needed to expand the handlebars `@template` with
        #
        #   @method         renderData
        #   @protected
        #
        #   @return         {Object}
        #
        ###

        renderData: () ->

            return {}

)
