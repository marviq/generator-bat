( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )
            require( 'underscore' )
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
            'underscore'
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
    _
    $
    console

    NavigationView

    Views...
) ->

    ###*
    #   @module         App
    ###

    'use strict'

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


        ###*
        #   Map url patterns to route handlers.
        #
        #   A handler can either be:
        #     - A function;
        #     - The name of an existing method on the router;
        #     - The value of one of the `require()`d view classes' `::viewName` property;
        #
        #   In the latter case, a function will be created as the router is instantiated.
        #   That function will collect parameters from the url pattern in a key-value mapping and pass these on to `@openPage()` along with the targeted view
        #   class.
        #
        #   @property       routes
        #
        #   @type           Object
        #   @static
        #   @final
        ###

        routes:

            ##  Routes that have methods:
            ##  The value should be the name of a method on this router.
            ##
            '':                                     'home'

            ##  Routes that have views:
            ##  The value should be that of the corresponding view's `viewName' property.
            ##
            'index':                                'index'
            'i18n':                                 'i18n'
            'documentation':                        'documentation'
            'buildscript':                          'buildscript'

            ##  A catchall route; save this one for last.
            ##
            ##  Will divert unknown urls, navigating `@home()` instead.
            ##  Alternatively, one could create a 404-not-found type of view class to handle these.
            ##
            '*catchall':                            'home'


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
        #   The url to redirect to when going `@home()`.
        #
        #   @property       homeUrl
        #
        #   @default        '/index'
        #   @type           String
        #   @static
        #   @final
        ###

        homeUrl:
            '/index'


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


        ###*
        #   Convenience method to navigate straight to the app's home state.
        #
        #   @method         home
        ###

        home: () ->

            @navigate(
                @homeUrl

                replace:    true
                trigger:    true
            )

            return


        ###*
        #   Convenience method to navigate a step back into history.
        #
        #   @method         back
        ###

        back: () ->

            Backbone.history.history.back()

            return


        ###*
        #   Fork out to the default `Backbone.router`s `@navigate()`, except that a page reload is forced when navigating to the current fragment (normally a
        #   no-op) and `options.trigger` has been given truthy value.
        #
        #   @method         navigate
        #
        #   @param          {Object}    [options]
        #   @param          {Boolean}   [options.trigger]
        #
        ###

        navigate: ( fragment, options ) ->

            ##  Force a reload when navigating to current fragment with a forced trigger.
            ##
            if ( options?.trigger and fragment is Backbone.history.fragment )

                console.log( '[ROUTER] forcing current fragment reload.' )

                Backbone.history.loadUrl( Backbone.history.fragment )

            else
                super( arguments... )

            return


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


    ##  Export singleton
    ##
    return new AppRouter()

)
