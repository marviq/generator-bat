## ============================================================================
##
##  [Q]
##
##  https://github.com/kriskowal/q#readme
##

Q               = require( 'q' )

##  Uncomment / remove for your developement convenience.
##
##  https://github.com/kriskowal/q/wiki/API-Reference#qstopunhandledrejectiontracking
##
Q.stopUnhandledRejectionTracking()

##  Set this to true for your developement convenience.
##
##  https://github.com/kriskowal/q/wiki/API-Reference#qlongstacksupport
##
Q.longStackSupport = false


## ============================================================================
##
##  [Misc]
##


## ============================================================================
##
##  [jQuery]
##
##  http://api.jquery.com/
##

$               = require( 'jquery' )

##
##  This would be a good place to also `require()` any jQuery plugins, just so that they get an early chance to hook themselves into jQuery.
##


## ============================================================================
##
##  [Underscore]
##
##  http://underscorejs.org/
##

_               = require( 'underscore' )

##
##  This would be a good place to load any underscore mixins.
##


## ============================================================================
##
##  [Backbone]
##
##  http://backbonejs.org/
##

Backbone        = require( 'backbone' )

##  Expose jQuery to Backbone.
##
Backbone.$  = $


router      = require( './router.coffee' )
console     = require( 'madlib-console' )
Handlebars  = require( 'hbsfy/runtime' )

# Include required bootstrap modules
#
settings    = require( 'madlib-settings' )
HostMapping = require( 'madlib-hostmapping' )

# Initialise your settings and create hostMapping instance
#
hostMapping = new HostMapping( settings )

# Set the debug log level to WARN for production
#
# hostMapping.determineTarget()
# if hostMapping.getCurrentHostMapping() is 'production'
#     console.logLevel = 'WARN'
# else
#     console.logLevel = 'DEBUG'


#<% if ( i18n ) { %>

locale = require( 'madlib-locale' )

locale.initialize( Handlebars, 'en_GB' ).then(
    () ->
        # Start your application here
        #
        router.startApp()

        return

    () ->
        console.error( 'Failed to retrieve default locale file.' )

        return

).done()

#<% } else { %>

# Start your application here
#
router.startApp()

#<% } %>
