( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )
            require( 'underscore' )
            require( 'jquery' )
            require( 'madlib-console' )<% if ( i18n ) { %>
            require( 'madlib-locale' )<% } %>

            require( './views/index.coffee' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'backbone'
            'underscore'
            'jquery'
            'madlib-console'<% if ( i18n ) { %>
            'madlib-locale'<% } %>

            './views/index.coffee'
        ], factory )
)((
    Backbone
    _
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

        constructor: ( options = {} ) ->

            ##  Create function handlers for routes that haven't yet got one.
            ##
            ##  Created handlers will pass on to `@_openPage( ... )`:
            ##    - The targeted view class of their route;
            ##    - The url pattern's named arguments of their route;

            paramPattern    = /[*:](\w+)/g
            routes          = {}

            _( options.routes ? @routes ).each( ( handler, urlPattern ) =>

                if ( @[ handler ] ? _.isFunction( handler ) )

                    ##  Keep existing method.
                    ##
                    routes[ urlPattern ] = handler

                else if (( View = @viewMap[ handler ] ))

                    ##  Collect url pattern's parameter names.
                    ##
                    paramNames = ( matched[1] while (( matched = paramPattern.exec( urlPattern ) )) )

                    ##  Create handler function.
                    ##
                    routes[ urlPattern ] =
                        if paramNames.length
                            () -> @_openPage( View, _.object( paramNames, arguments ))
                        else
                            () -> @_openPage( View )
                else
                    throw new Error( "Cannot create handler for '#{handler}'." )

                return
            )

            options.routes = routes

            super( options )

            return


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

            @$mainContent   = $( '#main-content' )

            ###*
            #   A handle on the current View instance loaded into `@$mainContent` container.
            #
            #   @property       pageView
            #
            #   @type           Backbone.View
            #   @protected
            ###

            @pageView       = null

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


        ###*
        #   Load the `@$mainContent` container with an instance of the requested view class.
        #   Either by simply re-rendering (with possibly changed parameters) the current instance if it is of the same class, or by creating a new instance to
        #   replace the current one if they differ.
        #
        #   @method         _openPage
        #   @protected
        #
        #   @param          {Class}         View        The targeted view class of the matched route.
        #   @param          {Object}        params      A key-value mapping of the matched route's url pattern's parameters.
        ###

        _openPage: ( View, params ) ->

            divert  = undefined

            ##
            ##  Here be code to determine possible diversions from the targeted View if needed.
            ##
            ##  ... Set `divert` to another view class's `::viewName`.
            ##
            ##  ----

            if ( divert? )

                ##  Diverted-to views should be accessible by anyone. When that condition no longer holds, for *every* such view, consider turning _openPage()
                ##  into a recursive function, so that the new view's accessibility requirements can be verified too.

                View    = @viewMap[ divert ]
                params  = undefined


            if ( @pageView instanceof View )

                ##  The requested View has already been loaded; just re-`render()` the current instance.

                console.log( "[ROUTER] Updating page '#{@pageView.viewName}'.", params )

                @pageView.render( params )

            else

                console.log( "[ROUTER] Opening page '#{View::viewName}'.", params )

                ##  Cleanup previously active view if any.
                ##
                @pageView?.remove()

                ##  Render and load the new view.
                ##
                @pageView = new View(
                    _.extend(
                        router:     @
                    ,   params
                    )
                )

                @$mainContent.append( @pageView.render( params ).$el )


            ###*
            #   Signal loading of the `@$mainContent` container with a view.
            #
            #   @event          open
            #
            #   @param          {Backbone.View} view        The view instance currently loaded.
            #   @param          {Object}        params      A key-value mapping of the matched route's url pattern's parameters.
            #
            ###

            @trigger( 'open', @pageView, params )

            return

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
