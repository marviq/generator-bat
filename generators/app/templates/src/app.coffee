###*<% if ( packageDescription ) { %>
#
#   <%- packageDescription %><% } %>
#
#   @module         App
###

'use strict'

##
##  Declare and load app pre-requisites, then start.
##

## ============================================================================
##
##  [Yuidoc]
##
##  This section merely serves the Yuidoc documentation generator. It declares the submodules wanted.
##
##  The `@submodule` tags below, are merely declarations. They are not meant to indicate that any documentation following it is part of any submodule.
##  That is why the `@module App` declaration is repeated at the bottom; to indicate this intent to Yuidoc.
##

###*
#   The app's APIs.
#
#   @submodule      Apis
###

###*
#   The app's backbone collections.
#
#   @submodule      Collections
###

###*
#   The app's backbone mixins.
#
#   @submodule      Mixins
###

###*
#   The app's backbone models.
#
#   @submodule      Models
###

###*
#   The app's backbone routers.
#
#   @submodule      Routers
###

###*
#   The app's backbone views.
#
#   @submodule      Views
###

###*
#   @module         App
###


## ============================================================================
##
##  [npm]
##
##  https://docs.npmjs.com/files/package.json
##

npm             = require( './../package.json' )


## ============================================================================
##
##  [Q]
##
##  https://github.com/kriskowal/q#readme
##

Q               = require( 'q' )

##  Comment out or remove this for your development convenience.
##
##  https://github.com/kriskowal/q/wiki/API-Reference#qstopunhandledrejectiontracking
##
Q.stopUnhandledRejectionTracking()

##  Set this to true for your development convenience.
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

Backbone        = require( 'backbone' )<% if ( jqueryCdn ) { %>

##  Expose jQuery to Backbone.
##  Needed because Backbone's jquery dependency will not be bundled with the build distribution artifact.
##
Backbone.$      = $<% } %>


## ============================================================================
##
##  [Handlebars]
##
##  https://github.com/wycats/handlebars.js#readme
##

Handlebars      = require( 'hbsfy/runtime' )

##  Register Handlebars helpers:
##
require( './utils/hbs/helpers/moment.coffee' )

##  Register Handlebars partials:
##
#require( './utils/hbs/partials/...' )


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

##
##  This would be a good place to declare any settings:
##
##  settings.set( 'someSetting', { ... } )
##  settings.set( 'a.namespaced.setting', { ... } )
##  settings.set( 'an.other.namespaced.setting', { ... } )
##
##  etc...
##


###*
#   The app's base url, so that resources can know what their origin is.
#
#   Often the `document` and this app will share the same base url, but not necessarily so.
#
#   @attribute      appBaseUrl
#   @type           String
#   @final
###

##  Leverage `document.currentScript` or a fallback (for IE <=11).
##
appBaseUrl = ( document.currentScript ? Array::slice.call( document.scripts, -1 )[0] ).src.match( /^(.*)\// )[1]

settings.init( 'appBaseUrl', appBaseUrl )


###*
#   The app's root element.
#
#   Often the `document` and this app will share the same root element, but not necessarily so.
#
#   @attribute      $appRoot
#   @type           jQuery
#   @final
###

$appRoot = $( ".#{ npm.name }" )

settings.init( '$appRoot', $appRoot )<% if ( i18n ) { %>


##  Setup localeManager
##
##  https://github.com/marviq/madlib-locale#readme
##
localeManager   = require( 'madlib-locale' )


###*
#   The app's currently active locale as a BCP 47 language tag string representation.
#
#   https://tools.ietf.org/html/bcp47#section-2
#
#   @attribute      locale
#   @type           String
#
#   @default        '<%= i18nLocaleDefault %>'
###

##  Derive default locale from either the app root element, the document root, or failing that, a hardcoded default.
##  Set `lang` attribute on the app's root element when missing.
##
locale          = $appRoot.attr( 'lang' )

$appRoot.attr( 'lang', locale = $( 'html' ).attr( 'lang' ) ? '<%= i18nLocaleDefault %>' ) unless ( locale? )

settings.init( 'locale', locale )<% } %>


## ============================================================================
##
##  [App]
##

##  The target environment's settings to be loaded (async) through its "service" and incorporated into the madlib-settings object.
##
settingsEnv     = require( './models/settings-environment.coffee' )

initialized     = Q.all(
    [
        ##  Wait until the DOM is ready.
        ##
        new Q.Promise( ( resolve ) -> $( resolve ); return; )<% if ( i18n ) { %>

        ##  Initialize `localeManager`, passing in the Handlebars runtime, the default locale, and base url for locale files.
        ##  Wait until it's been loaded.
        ##
        ##  At this point we cannot know for sure that this locale really is available.
        ##  Once the `settingsEnv` has been initialized we -will- know this, but we're not going to wait for that; instead, just assume it'll be there.
        ##
        localeManager.initialize( Handlebars, locale, "#{ appBaseUrl }/i18n" )<% } %>

        ##  Wait until the target-environment settings have been loaded.<% if ( i18n ) { %>
        ##  This should list the available locales.<% } %>
        ##
        settingsEnv.initialized
    ]
)

initialized.done(

    () ->

        ##  Load router only now, so the environment settings are known to have been loaded, and so the `DefaultApi` is ready to be used.
        ##
        router  = require( './router.coffee' )

        router.startApp()

        return

    () ->
        console.error( 'Failed to initialize' )

        return

)
