( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )
            require( './<%= fileName %>.hbs' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'backbone'
            './<%= fileName %>.hbs'
        ], factory )

)((
    Backbone
    template
) ->

    ###*
    #   @author         <%= user.git.name() %>
    #   @module         App
    #   @submodule      Views
    ###

    'use strict'

    ###*
    #   <%= description %>
    #
    #   @class          <%= className %>View
    #   @extends        Backbone.View
    #   @constructor
    ###

    class <%= className %>View extends Backbone.View

        ###*
        #   Expose this view's name to the router.
        #
        #   @property       viewName
        #
        #   @default        '<%= viewName %>'
        #   @type           String
        #   @static
        #   @final
        ###

        viewName:           '<%= viewName %>'


        ###*
        #   CSS class(es) to set on this view's root DOM element.
        #
        #   @property       className
        #
        #   @default        '<%= fileName %>-view'
        #   @type           String
        #   @static
        #   @final
        ###

        className:          '<%= fileName %>-view'


        ###*
        #   The compiled handlebars template expander function.
        #
        #   @property       template
        #
        #   @type           Function
        #   @protected
        #   @static
        #   @final
        ###

        template:           template


        ###*
        #   @method         initialize
        #   @protected
        #
        #   @param          {Object}    options     The options object passed in from the constructor.
        #
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
        #
        ###

        render: () ->

            ##  Expand the handlebars template into this view's container element.
            ##
            @$el.html( @template( @renderData() ) )

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
        #
        ###

        renderData: () ->

            return {}

)
