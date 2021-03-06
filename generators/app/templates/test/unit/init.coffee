<% if ( jqueryCdn ) { %>
## ============================================================================
##
##  [jQuery]
##
##  http://api.jquery.com/
##

$               = require( 'jquery' )

## ============================================================================
##
##  [Backbone]
##
##  http://backbonejs.org/
##

Backbone        = require( 'backbone' )

##  Expose jQuery to Backbone.
##  Needed because Backbone's jquery dependency will not be bundled with the build distribution artifact.
##
Backbone.$      = $


<% } %>
## ============================================================================
##
##  [madlib]
##

###*
#   The app's globally sharable configuration settings.
#
#   These are exposed through the `madlib-settings` singleton object. Simply `require(...)` it wherever you have a need for them.
#
#   @class          Settings
#   @static
###

##  https://github.com/Qwerios/madlib-settings#readme
##
settings        = require( 'madlib-settings' )


###*
#   The app's base url, so that resources can know what their origin is.
#
#   Often the `document` and this app will share the same base url, but not necessarily so.
#
#   @attribute      appBaseUrl
#   @type           String
#   @final
###

appBaseUrl = ''

settings.init( 'appBaseUrl', appBaseUrl )
