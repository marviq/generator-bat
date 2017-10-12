( ( factory ) ->
    if typeof exports is 'object'
        module.exports = factory(
            require( 'backbone' )
            require( 'bluebird' )
            require( 'moment' )

            require( './../apis/env.coffee' )
        )
    else if typeof define is 'function' and define.amd
        define( [
            'backbone'
            'bluebird'
            'moment'

            './../apis/env.coffee'
        ], factory )
    return
)((
    Backbone
    Promise
    moment

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
    log = ( args... ) -> console.log( '[BUILDINFO]', args... )


    ###*
    #   The current build's briefing information.
    #
    #   @class          BuildBrief
    #   @extends        Backbone.Model
    #   @static
    ###

    class BuildBriefModel extends Backbone.Model

        ###*
        #   List of [valid attribute names](#attrs).
        #
        #   @property       schema
        #   @type           Array[String]
        #   @final
        ###

        ###*
        #   The value of the `BUILD_NUMBER` environment variable at the time of build.
        #   Expected to be provided from the ci/cd build job.
        #   Expected to be a count of the number of these build jobs triggered so far.
        #
        #   If `BUILD_NUMBER` has not been set, this will instead be the number of builds triggered from a watched `grunt dev` run since invocation.
        #
        #   @attribute      buildNumber
        #   @type           String
        ###

        ###*
        #   The value of the `BUILD_ID` environment variable at the time of build.
        #   Expected to be provided from the ci/cd build job.
        #   Expected to be reference-id of the build job meaningful to your ci/cd.
        #
        #   @attribute      buildId
        #   @type           String
        ###

        ###*
        #   The value of the `GIT_COMMIT` environment variable at the time of build.
        #   Expected to be provided from the ci/cd build job.
        #   Expected to be the git commit hash that the ci/cd build job checked out.
        #
        #   If `GIT_COMMIT` has not been set, this will be the string `working dir` instead.
        #
        #   @attribute      revision
        #   @type           String
        ###

        ###*
        #   Human readable timestamp of when this build brief was generated. Indicative of when the build was run/completed.
        #
        #   @attribute      grunted
        #   @type           String
        ###

        ###*
        #   The build's target-environment's name.
        #
        #   Typically:
        #       * `production`
        #       * `acceptance`
        #       * `testing`
        #       * `local`
        #
        #   @attribute      environment
        #   @type           String
        ###

        ###*
        #   Flag for signalling whether this was a debugging build.
        #
        #   @attribute      debugging
        #   @type           Boolean
        ###

        ###*
        #   The app's name as listed in its `package.json`.
        #
        #   @attribute      name
        #   @type           String
        ###

        ###*
        #   The app's version as listed in its `package.json`.
        #
        #   See also: http://semver.org/
        #
        #   @attribute      version
        #   @type           Semver
        ###

        ###*
        #   Unix timestamp of the build's run; equal to `grunted`
        #
        #   @attribute      timestamp
        #   @type           Number
        ###

        schema: [

            'buildNumber'
            'buildId'
            'revision'
            'grunted'
            'environment'
            'debugging'
            'name'
            'version'
            'timestamp'
        ]


        ###*
        #   Service API endpoint; defined in the {{#crossLink 'EnvApi/buildBrief:attribute'}}`EnvApi`{{/crossLink}}.
        #
        #   @property       url
        #   @type           ApiServiceModel
        #   @final
        #
        #   @default        '<EnvApi.url>/build.json'
        ###

        url:                api.get( 'buildBrief' )


        ###*
        #   @method         initialize
        #   @protected
        ###

        initialize: () ->

            ###*
            #   A `Promise` that the build's briefing data will have been loaded.
            #
            #   @property       initialized
            #   @type           Promise
            #   @final
            ###

            @initialized =
                Promise.resolve( @fetch( cache: false ) ).then(

                    ( attributes ) =>

                        ### jshint unused:  false ###

                        return @


                    ( jqXHR ) ->

                        ### jshint unused:  false ###

                        message = 'Unable to load build briefing information.'

                        log( message )

                        throw new Error( message )
                )

            return


        ###*
        #   @method         parse
        #   @protected
        ###

        parse: ( data ) ->

            key         = 'timestamp'
            data[ key ] = moment( data[ key ] )

            return data


    ##  Export singleton.
    ##
    return new BuildBriefModel()

)
