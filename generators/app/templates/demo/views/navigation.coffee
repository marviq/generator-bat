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

    'use strict'

    ###*
    #   Navigation view
    #
    #   @author         rdewit
    #   @class          NavigationView
    #   @extends        Backbone.View
    #   @module         view
    #   @constructor
    ###
    class NavigationView extends Backbone.View

        # We need to expose our name to the router
        #
        viewName:   'navigation'
        className:  'navigation-view'

        ###*
        #   Function renders the view
        #
        #   @method     render
        #   @return     viewInstance
        ###
        render: () ->

            # Append the template
            #
            @$el.append( template() )

            # Set reference to the navbar
            #
            @$navBar = @$el.find( '.navbar-nav' )

            # By convention always return this so people can chain functions
            # for example grab the .el after rendering ;-)
            #
            return @


        ###*
        # Function to set the activeMenuItem based on the url passed
        #
        # @method setActiveMenuItem
        # @param url {string} Url excluding the hash belonging to the menuitem
        ###
        setActiveMenuItem: ( url ) ->
            @$navBar.find( '.active' ).removeClass( 'active' )
            @$navBar.find( "a[href='##{url}']" ).closest( 'li' ).addClass( 'active' )

            return

)
