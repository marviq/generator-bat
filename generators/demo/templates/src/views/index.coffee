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

    ###*
    #   @author         Raymond de Wit
    #   @module         App
    #   @submodule      Views
    ###

    'use strict'

    ###*
    #   Index view
    #
    #   @class          IndexView
    #   @extends        Backbone.View
    #   @constructor
    ###

    class IndexView extends Backbone.View

        ###*
        #   Expose this view's name to the router.
        #
        #   @property       viewName
        #
        #   @default        'index'
        #   @type           String
        #   @static
        #   @final
        ###

        viewName:           'index'


        ###*
        #   CSS class(es) to set on this view's root DOM element.
        #
        #   @property       className
        #
        #   @default        'index-view'
        #   @type           String
        #   @static
        #   @final
        ###

        className:          'index-view'


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