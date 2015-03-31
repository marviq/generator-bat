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

        # Will contain mapping of view name to view class
        #
        views: {}

        initialize: () ->

            # Get handle to the main content container
            #
            @$mainContent = $( '#main-content' )

            # Populate the views index, each view required in the router
            # should expose a viewName property by convention to identify it
            #
            for view in Views
                @views[ view.prototype.viewName ] = view

        navigate: ( fragment, options ) ->
            # Force a reload when navigating to current fragment with a forced trigger
            #
            if fragment is Backbone.history.fragment and options? and options.trigger is true
                console.log( '[ROUTER] forcing current fragment reload' )
                Backbone.history.loadUrl( Backbone.history.fragment )

            else
                super( fragment, options )

        startApp: () ->
            console.log( '[ROUTER] Starting application...' )

            # You probably want to do some things here
            # setup views that aren't in the main container
            # ( navigation for example ).
            #


            # Start routing the application using Backbone
            # once this is called the application really starts
            # and tries to load the first view based on the url/hash
            #
            Backbone.history.start()

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
                NewViewClass = @views[ pageName ]
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

                    @pageView = new @views[ '404' ](
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
