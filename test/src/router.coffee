( ( factory ) ->
    if typeof exports is "object"
        module.exports = factory(
            require "backbone"
            require "jquery"
            require "madlib-console"
            require "./views/navigation.coffee"
            require "./views/index.coffee"
            require "./views/i18n.coffee"
            require "./views/documentation.coffee"
            require "./views/buildscript.coffee"
        )
    else if typeof define is "function" and define.amd
        define( [
            "backbone"
            "jquery"
            "madlib-console"
            "./views/navigation.coffee"
            "./views/index.coffee"
            "./views/i18n.coffee"
            "./views/documentation.coffee"
            "./views/buildscript.coffee"
        ], factory )
)( ( Backbone, $, console, NavigationView, Views... ) ->
    ###*
    #   The main app router
    #
    #   @author         rdewit
    #   @class          AppRouter
    #   @extends        Backbone.View
    #   @moduletype     router
    #   @constructor
    #   @version        0.1
    ###
    class AppRouter extends Backbone.Router

        ###*
        # Contains defined routers and their functions
        #
        # @property routers
        ###
        routes:
            "":                     "index"
            "index":                "index"
            "i18n":                 "i18n"
            "documentation":        "documentation"
            "buildscript":             "buildscript"

        ###* 
        # Will contain mapping of view name to view class
        # is filled with data in initialize method
        #
        # @property views
        ###
        views: {}

        ###*
        # Generates the views mapping based on the splat of views
        #
        # @method initialize
        ###
        initialize: () ->

            # Get handle to the main content container
            #
            @$mainContent = $( "#main-content" )

            # Populate the views index, each view required in the router
            # should expose a viewName property by convention to identify it
            #
            for view in Views
                @views[ view.prototype.viewName ] = view

        ###*
        # Overridden 
        ###
        navigate: ( fragment, options ) ->

            # Force a reload when navigating to current fragment with a forced trigger
            #
            if fragment is Backbone.history.fragment and options? and options.trigger is true
                console.log( "[ROUTER] forcing current fragment reload" )
                Backbone.history.loadUrl( Backbone.history.fragment )

            else
                super( fragment, options )

        ###*
        # Function called when bootstrap is ready to start
        # the application. Calls Backbone.history.start() to
        # start routing.
        # 
        # @method startApp
        ###
        startApp: () ->
            console.log( "[ROUTER] Starting application..." )

            navigationView = new NavigationView()
            $( "#navigation" ).html( navigationView.render().$el )

            @listenTo( @, "route", ( params ) -> 
                navigationView.setActiveMenuItem( params )
            )


            # Start routing the application using Backbone
            # once this is called the application really starts
            # and tries to load the first view based on the url/hash
            #
            Backbone.history.start()

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
                NewViewClass = @views[ pageName ]
                if typeof NewViewClass is "function"
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

                    @pageView = new @views[ "404" ](
                        router:         @
                    )

                    @$mainContent.append( @pageView.render( params ).el )


        index: () ->
            @_openPage( "index" )
        documentation: () ->
            @_openPage( "documentation" )
        i18n: () ->
            @_openPage( "i18n" )
        buildscript: () ->
            @_openPage( "buildscript" )

    # Singleton
    #
    appRouter = new AppRouter()
    return appRouter
)