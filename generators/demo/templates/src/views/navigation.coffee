( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )
            require( './navigation.hbs' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'backbone'
            './navigation.hbs'
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
    #   Navigation view
    #
    #   @class          NavigationView
    #   @extends        Backbone.View
    #   @constructor
    ###

    class NavigationView extends Backbone.View

        ###*
        #   CSS class(es) to set on this view's root DOM element.
        #
        #   @property       className
        #
        #   @default        'navigation-view'
        #   @type           String
        #   @static
        #   @final
        ###

        className:          'navigation-view'


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

            # Set reference to the navbar
            #
            @$navBar = @$el.find( '.navbar-nav' )

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

        ###*
        #   Set the activeMenuItem based on the url passed.
        #
        #   @method         setActiveMenuItem
        #
        #   @param          {String}            url                     Url excluding the hash belonging to the menuitem
        #
        ###

        setActiveMenuItem: ( url ) ->

            @$navBar.find( '.active' ).removeClass( 'active' )
            @$navBar.find( "a[href='##{url}']" ).closest( 'li' ).addClass( 'active' )

            return

)
