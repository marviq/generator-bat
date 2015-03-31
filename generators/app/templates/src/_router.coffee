( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )
            require( 'jquery' )
            require( 'madlib-console' )<% if ( i18n ) { %>
            require( 'madlib-locale' )<% } %>

            require( './views/index.coffee' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'backbone'
            'jquery'
            'madlib-console'<% if ( i18n ) { %>
            'madlib-locale'<% } %>

            './views/index.coffee'
        ], factory )
)((
    Backbone
    $
    console<% if ( i18n ) { %>
    localeManager<% } %>

    Views...
) ->

    ###*
    #   @module         App
    ###

    ###*
    #   The app's main router.
    #
    #   @class          AppRouter
    #   @extends        Backbone.Router
    #   @static
    ###

    class AppRouter extends Backbone.Router

        routes:
            '':                     'index'

            # Please leave this as the last one :-)
            #
            '*notFound':            'notFound'


        ###*
        #   Mapping of a each `require()`d View's `::viewName` property to its class.
        #
        #   Each view class `require()`d is expected to have a `::viewName` class property.
        #   Most routes in `AppRouter::routes` will map to these properties' values.
        #
        #   @property       viewMap
        #
        #   @type           Object
        #   @static
        #   @final
        ###

        viewMap: do () ->

            viewMap = {}
            viewMap[ View::viewName ] = View for View in Views

            return viewMap


        ###*
        #   Setup the router's internals.
        #
        #   @method         initialize
        #   @protected
        #
        ###

        initialize: () ->

            ###*
            #   A handle on the router's main content container.
            #
            #   @property       $mainContent
            #
            #   @type           jQuery
            #   @protected
            #   @final
            ###

            @$mainContent = $( '#main-content' )

            return


        navigate: ( fragment, options ) ->
            # Force a reload when navigating to current fragment with a forced trigger
            #
            if fragment is Backbone.history.fragment and options? and options.trigger is true
                console.log( '[ROUTER] forcing current fragment reload' )
                Backbone.history.loadUrl( Backbone.history.fragment )

            else
                super( fragment, options )


        ###*
        #   Set up shop, instantiate things like navigation views and such, start the `Backbone.history` global router.
        #
        #   @method         startApp
        #
        #   @param          {Object}    [options]   Any options you may want to pass on to `Backbone.history.start( options )`.
        #
        ###

        startApp: ( options ) ->

            console.log( '[ROUTER] Starting application...' )

            ##
            ##  Additional setting up can be done here; instantiate views that aren't to be part of the main container, like navigation perhaps.
            ##

            ##  Start the `Backbone.history` global router which will begin monitoring for url changes, causing all matching route handlers to be
            ##  dispatched.
            ##
            Backbone.history.start( options )

            return


        index: () ->
            @_openPage( 'index' )

        _openPage: ( pageName, params ) ->

            # Check if the requested view is already loaded
            # if so let it re-render itself
            #
            if @pageView? and @pageView.viewName is pageName
                console.log( "[ROUTER] Updating page '#{pageName}'", params )
                @pageView.render( params )

            else
                # Check if the class for the new view is available
                #
                NewViewClass = @viewMap[ pageName ]
                if typeof NewViewClass is 'function'
                    console.log( "[ROUTER] Opening page '#{pageName}'", params )

                    # Cleanup previously active view
                    #
                    @pageView.remove() if @pageView?

                    # Render and show the niew view
                    #
                    @pageView = new NewViewClass( $.extend(
                        router:     @
                    ,   params
                    ) )
                    @$mainContent.append( @pageView.render( params ).el )

                else
                    console.log( "[ROUTER] Can't find view for '#{pageName}'" )

                    @pageView.remove() if @pageView?

                    @pageView = new @viewMap[ '404' ](
                        router:         @
                    )

                    @$mainContent.append( @pageView.render( params ).el )

        #<% if ( i18n ) { %>

        localeSwitch: ( locale ) ->
            localeManager.setLocale( locale ).then(
                () =>
                    # Unload the current view
                    #
                    @pageView.remove()
                    @pageView = undefined

                    # And then reload it with the new locale active
                    #
                    window.history.back()

                () =>
                    console.log( '[ROUTER] Failed to switch locale, do nothing...' )
            ).done()

        #<% } %>

    ##  Export singleton
    ##
    return new AppRouter()

)
