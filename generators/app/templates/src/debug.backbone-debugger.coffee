'use strict'

( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'backbone'
        ], factory )
    return
)((
    Backbone
) ->

    ###*
    #   @author         David Bouman
    #   @module         App
    ###


    ##
    ##  Engage the [Backbone debugger browser plugin](https://github.com/Maluen/Backbone-Debugger#install-from-chrome-web-store) if present.
    ##

    window.__backboneAgent?.handleBackbone( Backbone )

    return

)
