( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )
            require( 'jquery' )
            require( 'madlib-console' )
            require( './views/navigation.coffee' )
            require( './views/index.coffee' )
            require( './views/i18n.coffee' )
            require( './views/documentation.coffee' )
            require( './views/buildscript.coffee' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'backbone'
            'jquery'
            'madlib-console'
            './views/navigation.coffee'
            './views/index.coffee'
            './views/i18n.coffee'
            './views/documentation.coffee'
            './views/buildscript.coffee'
        ], factory )
)((
    Backbone
    $
    console

    NavigationView

    Views...
) ->

    ###*
    #   @module         App
    ###

    ###*
    #   The app's main router.
    #
    #   @author         rdewit
    #   @class          AppRouter
    #   @extends        Backbone.Router
    #   @moduletype     router
    #   @static
    #   @version        0.1
    ###

    class AppRouter extends Backbone.Router

        ###*
        # Contains defined routers and their functions
        #
        # @property routers
        ###
        routes:
            '':                     'index'
            'index':                'index'
            'i18n':                 'i18n'
            'documentation':        'documentation'
            'buildscript':             'buildscript'


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


        ###*
        # Overridden
        ###
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

            navigationView = new NavigationView()
            $( '#navigation' ).html( navigationView.render().$el )

            @listenTo( @, 'route', ( params ) ->
                navigationView.setActiveMenuItem( params )
            )

            ##  Start the `Backbone.history` global router which will begin monitoring for url changes, causing all matching route handlers to be
            ##  dispatched.
            ##
            Backbone.history.start( options )

            return


        ###*
        # Function called when opening a new page in the main
        # container of the application
        #
        # @method _openPage
        # @param pageName {string} name of the view to load
        # @param params {object} params to pass to the new view
        # @private
        ###
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


        index: () ->
            @_openPage( 'index' )
        documentation: () ->
            @_openPage( 'documentation' )
        i18n: () ->
            @_openPage( 'i18n' )
        buildscript: () ->
            @_openPage( 'buildscript' )


    ##  Export singleton
    ##
    return new AppRouter()

)
