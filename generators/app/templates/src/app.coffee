###*<% if ( packageDescription ) { %>
#
#   <%- packageDescription %><% } %>
#
#   @module         App
#
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
##  [Q]
##
##  https://github.com/kriskowal/q#readme
##

Q               = require( 'q' )

##  Comment out or remove this for your developement convenience.
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
Backbone.$      = $


## ============================================================================
##
##  [Handlebars]
##
##  https://github.com/wycats/handlebars.js#readme
##

Handlebars      = require( 'hbsfy/runtime' )

##  Register Handlebars helpers:
##
do () ->

    ### jshint forin:   false ###

    Handlebars.registerHelper( name, helper ) for name, helper of {

    ##
    ##  This would be a good place to register any Handlebars helpers:
    ##
    ##  foo:    ( value )  -> "bar: #{ value }"
    ##  etc:    ...
    ##

    }


## ============================================================================
##
##  [madlib]
##

###*
#   The app's globally sharable configuration settings.
#
#   These are exposed through the `madlib-settings` singleton object. Simply `require(...)` it wherever you have a need for them.
#
#   @class      Settings
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
##
##  Particularly, If you plan to use 'madlib-hostmapping' later, you might want to do something like:
##
##  HostMapping = require( 'madlib-locale' )
##
##  settings.set( 'hostMapping'
##
##      'some.site.some.domain':        'production'
##      'some.site-acc.some.domain':    'acceptance'
##      'some.site-tst.some.domain':    'testing'
##      'localhost':                    'developement'
##  )
##
##  settings.set( 'hostConfig'
##
##      production:
##          api:                'https://api.some.domain/'
##
##      acceptance:
##          api:                'https://api-acc.some.domain/'
##
##      testing:
##          api:                'https://api-test.some.domain/'
##
##      developement:
##          api:                'localhost/some-site-api/'
##  )
##
##  For further information, see:
##
##  https://github.com/Qwerios/madlib-hostmapping#readme
##


###*
#   The app's base url, so that resources can know what their origin is.
#
#   Often the `document` and this app will share the same base url, but not necessarily so.
#
#   @property       appBaseUrl
#
#   @type           String
#   @final
###

##  Leverage `document.currentScript` or a fallback (for IE <=11).
##
appBaseUrl = ( document.currentScript ? Array::slice.call( document.scripts, -1 )[0] ).src.match( /^.*\// )[0]

settings.init( 'appBaseUrl', appBaseUrl )


###*
#   The app's root element.
#
#   Often the `document` and this app will share the same root element, but not necessarily so.
#
#   @property       $appRoot
#
#   @type           jQuery
#   @final
###

$appRoot = $( '.<%- packageName %>' )

settings.init( '$appRoot', $appRoot )<% if ( i18n ) { %>


##  Setup localeManager
##
##  https://github.com/marviq/madlib-locale#readme
##
locale          = require( 'madlib-locale' )<% } %>


## ============================================================================
##
##  [App]
##

router          = require( './router.coffee' )

initialized = Q.all(
    [
        ##  Wait until the DOM is ready.
        ##
        new Q.Promise( ( resolve ) -> $( resolve ); return; )<% if ( i18n ) { %>

        ##  Initialize locale passing Handlebars runtime, default locale and base url for locale files.
        ##  Wait until it's been loaded.
        ##
        locale.initialize( Handlebars, 'en-GB', "#{ appBaseUrl }i18n" )<% } %>
    ]
)

initialized.done(

    () ->

        router.startApp()

        return

    () ->
        console.error( 'Failed to initialize' )

        return

)
