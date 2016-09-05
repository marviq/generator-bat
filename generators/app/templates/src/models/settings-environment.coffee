( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )
            require( 'madlib-settings' )
            require( 'q' )

            require( './../apis/env.coffee' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'backbone'
            'madlib-settings'
            'q'

            './../apis/env.coffee'
        ], factory )
    return
)((
    Backbone
    settings
    Q

    api
) ->

    ###*
    #   @author         David Bouman
    #   @module         App
    #   @submodule      Models
    ###

    'use strict'


    ##  Stamped logs
    ##
    log = ( args... ) -> console.log( '[SETTINGS]', args... )


    ###*
    #   Settings for the target environment.
    #
    #   @class          SettingsEnvironment
    #   @extends        Backbone.Model
    #   @static
    ###

    class SettingsEnvironmentModel extends Backbone.Model

        ###*
        #   List of [valid attribute names](#attrs).
        #
        #   @property       schema
        #   @type           Array[String]
        #   @final
        ###

        ###*
        #   The base URL to use for consuming API services. All `services` URL settings are assumed to be relative to this one.
        #
        #   @attribute      apiBaseUrl
        #   @type           String
        ###

        ###*
        #   The name of the environment that these settings target. Useful values include:
        #
        #     * `'local'`
        #     * `'testing'`
        #     * `'acceptance'`
        #     * `'production'`
        #
        #   @attribute      environment
        #   @type           String
        ###<% if ( i18n ) { %>

        ###*
        #   All available locales.
        #
        #   The value is an object, mapping [BCP 47 language tags](https://tools.ietf.org/html/bcp47) to pre-localized language names.
        #   Pre-localization includes that the language name be written in, and capitalized according to that locale's language and rules.
        #
        #   The [language tag](https://tools.ietf.org/html/bcp47#section-2) should include these, and -only- these parts:
        #
        #     * A single primary language subtag based on a two-letter language code from
        #       [ISO 639-1 (2002)](https://en.wikipedia.org/wiki/ISO_639-1).
        #
        #     * A optional region subtag based on a two-letter country code from
        #       [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) (usually written in upper case).
        #
        #   See also: [IETF language tags](https://en.wikipedia.org/wiki/IETF_language_tag#Syntax_of_language_tags).
        #
        #   @attribute      locales
        #   @type           {Object}
        ###<% } %>

        schema: [

            'apiBaseUrl'
            'environment'<% if ( i18n ) { %>
            'locales'<% } %>
        ]


        ###*
        #   Service API endpoint; defined in the {{#crossLink 'EnvApi/settingsEnvironment:attribute'}}EnvApi{{/crossLink}}.
        #
        #   @property       url
        #   @type           ApiServiceModel
        #   @final
        #
        #   @default        '<EnvApi.url>/settings.json'
        ###

        url:                api.get( 'settingsEnvironment' )


        ###*
        #   @method         initialize
        #   @protected
        ###

        initialize: () ->

            ###*
            #   A `Promise` that the environment settings will have been loaded and initialized on the `madlib-settings` singleton object.
            #
            #   @property       initialized
            #   @type           Promise
            #   @final
            ###

            @initialized =
                new Q( @fetch( cache: false ) ).then(

                    ( attributes ) =>

                        ### jshint unused:  false ###


                        ###*
                        #   The target-environment's settings.
                        #
                        #   @attribute      environment
                        #   @for            Settings
                        #   @type           Object
                        ###

                        ###*
                        #   The base URL to use for consuming API services. All `services` URL settings are assumed to be relative to this one.
                        #
                        #   @attribute      environment.apiBaseUrl
                        #   @for            Settings
                        #   @type           String
                        #   @final
                        ###

                        ###*
                        #   The name of the environment that these settings target. Useful values include:
                        #
                        #     * `'local'`
                        #     * `'testing'`
                        #     * `'acceptance'`
                        #     * `'production'`
                        #
                        #   @attribute      environment.environment
                        #   @for            Settings
                        #   @type           String
                        #   @final
                        ###<% if ( i18n ) { %>

                        ###*
                        #   All available locales.
                        #
                        #   The value is an object, mapping [BCP 47 language tags](https://tools.ietf.org/html/bcp47) to pre-localized language names.
                        #   Pre-localization includes that the language name be written in, and capitalized according to that locale's language and rules.
                        #
                        #   The [language tag](https://tools.ietf.org/html/bcp47#section-2) should include these, and -only- these parts:
                        #
                        #     * A single primary language subtag based on a two-letter language code from
                        #       [ISO 639-1 (2002)](https://en.wikipedia.org/wiki/ISO_639-1).
                        #
                        #     * A optional region subtag based on a two-letter country code from
                        #       [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) (usually written in upper case).
                        #
                        #   See also: [IETF language tags](https://en.wikipedia.org/wiki/IETF_language_tag#Syntax_of_language_tags).
                        #
                        #   @attribute      environment.locales
                        #   @for            Settings
                        #   @type           {Object}
                        #   @final
                        ###<% } %>

                        settings.init( 'environment', @attributes )

                        environment = settings.get( 'environment.environment' )

                        log( "Environment settings loaded for \"#{environment}\" target." )

                        return @


                    ( jqXHR ) ->

                        ### jshint unused:  false ###

                        message = 'Unable to load target environment settings.'

                        log( message )

                        throw new Error( message )
                )

            return


    ##  Export singleton.
    ##
    return new SettingsEnvironmentModel()

)
