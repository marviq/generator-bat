
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
#   @property       appBaseUrl
#   @type           String
#   @final
###

appBaseUrl = '/'

settings.init( 'appBaseUrl', appBaseUrl )


## ============================================================================
##
##  [API]
##

##  `require()` the API services here to ensure their endpoints have been defined on the madlib-settings object before they are used anywhere else.
##
services        = require( './../../src/collections/api-services.coffee' )
