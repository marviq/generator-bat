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
##  https://github.com/marviq/madlib-hostmapping#readme
##
<% if ( i18n ) { %>

##  Setup localeManager
##
##  https://github.com/marviq/madlib-locale#readme
##
locale          = require( 'madlib-locale' )<% } %>


## ============================================================================
##
##  [App]
##

router          = require( './router.coffee' )<% if ( i18n ) { %>

##  Initialize locale passing Handlebars runtime and default locale.
##  It's loading the locale file async so wait starting the app until that's done.
##
locale.initialize( Handlebars, 'en_GB' ).done(

    () ->

        ##  Start the app when the DOM is ready.
        ##
        $( () ->

            router.startApp()

            return

        )

        return

    () ->
        console.error( 'Failed to retrieve default locale file.' )

        return

)<% } else { %>

##  Start the app when the DOM is ready.
##
$( () ->

    router.startApp()

    return

)<% } %>
