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

)((
    Backbone
    template
    localeManager
) ->

    'use strict'

    ###*
    #   i18n view
    #
    #   @author         rdewit
    #   @class          I18nView
    #   @extends        Backbone.View
    #   @module         view
    #   @constructor
    #   @version        0.1
    ###
    class I18nView extends Backbone.View

        # We need to expose our name to the router
        #
        viewName:   'i18n'
        className:  'i18n-view'

        events:
            'change select[name="language"]': '_changeLanguage'

        ###*
        # Function renders the view
        #
        # @method     render
        # @return     viewInstance
        ###
        render: () ->

            # Set the template to el
            #
            @$el.html( template(
                date:       new Date()
                money:      100000
                number:     1090870987
            ))

            # Set the current locale as selected option
            #
            @$el.find( "select[name='language'] option[value='#{ localeManager.getLocaleName() }']" ).attr( 'selected', true )

            # By convention always return this so people can chain functions
            # for example grab the .el after rendering ;-)
            #
            return @


        ###*
        # Private function called when the lanaguage select changes
        #
        # @method     render
        # @private
        ###
        _changeLanguage: () ->
            $select = @$el.find( 'select[name="language"]' )

            localeManager.setLocale( $select.val() ).then(
                () =>
                    @render()
                ( error ) =>
                    console.log( error )
            ).done()

            return

)
