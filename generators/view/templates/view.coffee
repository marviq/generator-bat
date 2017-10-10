( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( '<%- backbone.modulePath %>' )

            require( './<%- fileBase %>.hbs' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            '<%- backbone.modulePath %>'

            './<%- fileBase %>.hbs'
        ], factory )
    return
)((
    <%- backbone.className %>

    template
) ->

    ###*
    #   @author         <%- userName %>
    #   @module         App
    #   @submodule      Views
    ###

    'use strict'


    ###*<% if ( description ) { %>
    #   <%- description %>
    #<% } %>
    #   @class          <%- className %>
    #   @extends        <%- backbone.className %>.View
    #   @constructor
    ###

    class <%- className %> extends <%- backbone.className %>.View

        ###*
        #   Expose this view's name to the router.
        #
        #   @property       viewName
        #   @type           String
        #   @final
        #
        #   @default        '<%- viewName %>'
        ###

        viewName:           '<%- viewName %>'


        ###*
        #   CSS class(es) to set on this view's root DOM element.
        #
        #   @property       className
        #   @type           String
        #   @final
        #
        #   @default        '<%- cssClassName %>'
        ###

        className:          '<%- cssClassName %>'


        ###*
        #   The compiled handlebars template expander function.
        #
        #   @property       template
        #   @type           Function
        #   @protected
        #   @final
        ###

        template:           template


        ###*
        #   Delegated DOM event handler definition.
        #
        #   Format:
        #
        #   ```coffee
        #       '<event>[ <selector>]': '<methodName>' || <Function>
        #       ...
        #   ```
        #
        #   @property       events
        #   @type           Object
        #   @final
        ###

        events:             undefined


        ###*
        #   @method         initialize
        #   @protected
        #
        #   @param          {Object}            options                 The options object passed in from the constructor.
        ###

        initialize: ( options ) ->

            ##
            ##  This would be a good place to do any set up work.
            ##  This method may be removed altogether if none needed.
            ##
            ##  If you are not going to use the `options` parameter, remove it or jshint will complain.
            ##  Alternatively, leave in the jshint directive below:
            ##

            ### jshint  unused: false   ###

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

            return {}

)
