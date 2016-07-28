( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )
            require( './i18n.hbs' )
            require( 'madlib-locale' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'backbone'
            './i18n.hbs'
            'madlib-locale'
        ], factory )
    return
)((
    Backbone
    template
    localeManager
) ->

    ###*
    #   @author         rdewit
    #   @module         App
    #   @submodule      Views
    ###

    'use strict'

    ###*
    #   i18n view
    #
    #   @class          I18nView
    #   @extends        Backbone.View
    #   @constructor
    ###

    class I18nView extends Backbone.View

        ###*
        #   Expose this view's name to the router.
        #
        #   @property       viewName
        #   @type           String
        #   @static
        #   @final
        #
        #   @default        'i18n'
        ###

        viewName:           'i18n'


        ###*
        #   CSS class(es) to set on this view's root DOM element.
        #
        #   @property       className
        #   @type           String
        #   @static
        #   @final
        #
        #   @default        'i18n-view'
        ###

        className:          'i18n-view'


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
        #   Setup UI event handler definitions.
        #
        #   @property       events
        #   @type           Object
        #   @protected
        #   @static
        #   @final
        ###

        events:
            'change select[name="language"]': '_changeLanguage'


        ###*
        #   @method         render
        #
        #   @chainable
        ###

        render: () ->

            ##  Expand the handlebars template into this view's container element.
            ##
            @$el.html( @template( @renderData() ) )

            ##  Set the current locale as selected option.
            ##
            @$el.find( "select[name='language'] option[value='#{ localeManager.getLocaleName() }']" ).attr( 'selected', true )

            ##  This method is chainable.
            ##
            return @


        ###*
        #   Collect and return all data needed to expand the handlebars `@template` with
        #
        #   @method         renderData
        #   @protected
        #
        #   @return         {Object}
        ###

        renderData: () ->

            date:       new Date()
            money:      100000
            number:     1090870987


        ###*
        #   Handles changes to the selected language.
        #
        #   @method         _changeLanguage
        #   @protected
        ###

        _changeLanguage: () ->

            $select = @$el.find( 'select[name="language"]' )

            localeManager.setLocale( $select.val() ).then(
                () =>
                    @render()
                ( error ) ->
                    console.log( error )
            ).done()

            return

)
