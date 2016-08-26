( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )
            require( 'jquery' )
            require( 'q' )

            require( './../models/build-brief.coffee' )
            require( './../models/settings-environment.coffee' )

            require( './../utils/hbs/helpers/moment.coffee' )

            require( './debug.environment-ribbon.hbs' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'backbone'
            'jquery'
            'q'

            './../models/build-brief.coffee'
            './../models/settings-environment.coffee'

            './../utils/hbs/helpers/moment.coffee'

            './debug.environment-ribbon.hbs'
        ], factory )
    return
)((
    Backbone
    $
    Q

    buildBrief
    settingsEnv

    hbsHelperMoment

    template
) ->

    ###*
    #   @author         David Bouman
    #   @module         App
    #   @submodule      Views
    ###

    'use strict'


    ###*
    #   Visually decorate site with a ribbon revealing the target environment and latest build info.
    #
    #     * Fades to transparent on mouse hover.
    #     * Removes itself from the DOM when clicked.
    #
    #   @class          EnvironmentRibbonView
    #   @extends        Backbone.View
    #   @constructor
    ###

    class EnvironmentRibbonView extends Backbone.View

        ###*
        #   CSS class(es) to set on this view's root DOM element.
        #
        #   @property       className
        #   @type           String
        #   @static
        #   @final
        #
        #   @default        'environment-ribbon-view'
        ###

        className:          'environment-ribbon-view'


        ###*
        #   The compiled handlebars template expander function.
        #
        #   @property       template
        #   @type           Function
        #   @protected
        #   @static
        #   @final
        ###

        template:           template


        ###*
        #   Delegated DOM event handler definition.
        #
        #   @property       events
        #   @type           Object
        #   @static
        #   @final
        ###

        events:
            'click':        '_onPokeIntent'


        ###*
        #   Attach view to the DOM and `@render()` as soon as the data becomes available.
        #
        #   @method         initialize
        #   @protected
        ###

        initialize: () ->

            Q.all(
                [
                    ##  Wait until the DOM is ready.
                    ##
                    new Q.Promise( ( resolve ) -> $( resolve ); return; )

                ,
                    ##  Wait until the target-environment settings have been loaded.
                    ##
                    settingsEnv.initialized

                ,
                    ##  Wait until the buid's briefing data have been loaded.
                    ##
                    buildBrief.initialized

                ,
                ]

            ).done( () =>

                @render().$el.appendTo( $( 'body' ))

                return
            )

            return


        ###*
        #   @method         render
        #
        #   @chainable
        ###

        render: () ->

            ##  Expand the handlebars template into this view's container element.
            ##
            @$el.html( @template( @renderData() ) )

            ##  This method is chainable.
            ##
            return @


        ###*
        #   Collect and return all data needed to expand the handlebars `@template` with.
        #
        #   @method         renderData
        #   @protected
        #
        #   @return         {Object}
        ###

        renderData: () ->

            settings:       settingsEnv.attributes
            buildBrief:     buildBrief.attributes


        ###*
        #   Respond to the user interacting with the ribbon, removing it from the DOM.
        #
        #   @method         _onPokeIntent
        #   @protected
        ###

        _onPokeIntent: () ->

            ##  Remove ourselves from the DOM
            ##
            @remove()

            return


    ##  Export singleton.
    ##
    return new EnvironmentRibbonView()

)
