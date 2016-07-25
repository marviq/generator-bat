##
##  ====
##
##  Anatomy of a build:
##
##    * The build's filesystem layout
##        * Source directory:
##            * src/
##
##        * Distribution artifacts' destination directory:
##            * dist/
##
##        * Assembly directories:
##            * dist/app/   - collects the app's build results
##            * dist/doc/   - collects the app's code documentation
##
##        * Tests directory:
##            * test/
##
##    * The build's distribution artifacts
##
##        * The application
##        * The application's code documentation
##
##    * The build parts:
##        * app<@ if ( i18n ) { @>
##            * i18n<@ } @>
##            * style
##            * brief
##            * bootstrap
##        * documentation
##
##    * The build's debugging mode:
##        * debugging,      - alias debug
##        * non-debugging,  - alias dist - note the overloading of the 'dist' term.
##
##    * The build packing:
##        * as-is
##        * minified        - alias uglified
##
##    * The build's tests
##
##    * The build tools. These almost map 1-to-1 on the npm-loaded grunt tasks:
##
##        * browserify      - for the app build part
##        * clean
##        * compass         - for the style build part
##        * compress        - for the application and documentation build artifacts
##        * copy
##        * template        - for the bootstrap build part
##        * uglify
##        * yuidoc          - for the documentation build part
##
##      The above all have to do with the actual assembly of the build.
##      Apart from these, there are also:
##
##        * Verification and testing:
##            * coffeelint
##            * coffee_jshint
##            * mochaTest
##
##        * Development support tools:
##            * watch
##
##
##  Note that the above factors are not entirely clear-cut:
##
##    * The build's packing and build debugging-type are somewhat intertwined:
##
##        * A debugging build implies as-is packing.
##        * Minified packing implies a non-debugging build.
##
##    * The build's artifacts are an all-or-nothing deal, currently.
##
##    * The build parts can be processed seperately, but some depend on others:
##          * The bootstrap build part needs a brief.
##          * The app build part will also trigger builds of the <@ if ( i18n ) { @>i18n, <@ } @>style, brief, and bootstrap build parts.
##
##
##  Mapping to grunt tasks and targets:
##
##  As briefly indicated, the build tools map 1-to-1 onto the npm-loaded grunt tasks.
##  Where applicable, for these tools, build parts and debugging mode map to their task's targets.
##
##  For instance, the `browserify` grunt task is one of the tools needed to build the app part, either in
##  debugging (app_debug), or non-debugging (app_dist) mode.
##
##      browserify:
##          app_dist:
##              <specific config>
##
##          app_debug:
##              <specific config>
##
##
##  Build parts may map to more than one tool. In fact, generally, part builds have three phases:
##
##      * clean phase           - maps to clean task, one target per build part
##      * copy phase            - maps to copy task, one target per build part
##      * construction phase    - maps to part specific tasks, one target per build part and possibly, debugging mode
##
##
##  Some part builds have more phases than these; verification and testing phases for instance.
##
##  Grunt tasks per build part exist, controlling these phases.
##
##
##  Finally, this is how the main grunt commandline tasks are mapped to all of the above:
##
##      * grunt [default]   - does a production, non-debugging, all-parts, minified build plus artifacts;
##      * grunt debug       - does a testing, debugging, all-parts except documentation, as-is build;
##      * grunt dev         - does a local, debugging, all-parts except documentation, as-is build;
##                            (Note that this variant doesn't exit. Instead, it'll keep a close watch on
##                            filesystem changes, selectively re-triggering part builds as needed)
##
##  ====
##

path    = require( 'path' )

module.exports = ( grunt ) ->

    grunt.initConfig(

        ##  ------------------------------------------------
        ##  Build configuration
        ##  ------------------------------------------------

        ##
        ##  Contents of npm's 'package.json' file as '<%= npm.* %>'
        ##

        npm:
            grunt.file.readJSON(        'package.json' )


        ##
        ##  Local data as '<%= build.* %>'
        ##

        build:

            ##
            ##  Filesystem:
            ##

            source:                     'src/'
            dist:                       'dist/'
            assembly:
                app:                    '<%= build.dist %>app/'
                doc:                    '<%= build.dist %>doc/'

            test:                       'test/'

            artifactBase:               '<%= build.dist %><%= npm.name %>-<%= npm.version %>'

            ##
            ##  Parts:
            ##

            part:
                app:
                    src:
                        browserify:     '<%= build.source %>app.coffee'
                        lint:           '<%= build.source %>**/*.coffee'

                    ##                  NOTE:   <%= npm.main %> should have <%= build.dist %> as its prefix:
                    ##
                    tgt:                '<%= npm.main %>'

                brief:
                    tgt:                '<%= build.assembly.app %>build.json'

                bootstrap:
                    src:                '<%= build.source %>index.template.html'
                    tgt:                '<%= build.assembly.app %>index.html'

                doc:
                    ##                  NOTE:   Directories to include and to exclude cannot be expressed in a single expression.
                    ##
                    src:                '<%= build.source %>'
                    srcExclude:         []

                    ##                  NOTE:   `tgt` - must - be a directory.
                    ##
                    tgt:                '<%= build.assembly.doc %>'<@ if ( i18n ) { @>

                i18n:
                    src:                '<%= build.source %>i18n/'
                    tgt:                '<%= build.assembly.app %>i18n/'<@ } @>

                style:
                    src:
                        copy:           '<%= build.source %>style/'
                        compass:        '<%= build.source %>sass/'
                    tgtDir:             '<%= build.assembly.app %>style/'

                    ##                  NOTE:   This file will be created because the `style.src.compass` dir contains a file 'app.sass'
                    ##                          This will be true for any '*.sass' file, except when its filename contains a leading underscore ('_') character.
                    ##
                    tgt:                '<%= build.part.style.tgtDir %>app.css'


        ##  ------------------------------------------------
        ##  Configuration for each npm-loaded task:target
        ##  ------------------------------------------------
        ##
        ##  Where applicable these task have a target per build part and sometimes, debugging mode.
        ##

        ##
        ##  Compile and bundle your code.
        ##
        ##  https://github.com/jmreidy/grunt-browserify#readme
        ##
        ##  https://github.com/substack/node-browserify#readme
        ##  https://github.com/substack/node-browserify#browserifyfiles--opts
        ##
        ##  https://github.com/substack/browserify-handbook#packagejson
        ##      file:./package.json
        ##        - browser : https://gist.github.com/defunctzombie/4339901
        ##        - browserify-shim : https://github.com/thlorenz/browserify-shim#readme
        ##        - browserify.transform : https://github.com/substack/browserify-handbook#browserifytransform-field
        ##
        ##  https://github.com/jnordberg/coffeeify#readme
        ##
        ##  https://github.com/epeli/node-hbsfy#readme
        ##

        browserify:

            options:

                ##  Transforms are ideally set in 'package.json' as 'browserify.transform'.
                ##  Shadowed here as comments for easy reference.
                ###
                transform: [
                                        'browserify-shim'
                                        'coffeeify'
                                        'hbsfy'
                ]
                ###

                browserifyOptions:

                    ##  Scan all files for process, global, __filename, and __dirname, defining as necessary.
                    ##  With this option npm modules are more likely to work but bundling takes longer.
                    ##
                    ##  When you find yourself using 'browserify-shim', you're likely to want to leave this set to `true`.
                    ##  If not, have a try at setting this to `false` for extra build speed.
                    ##
                    detectGlobals:      true

                    extensions: [
                                        '.coffee'
                                        '.hbs'
                    ]

                    ##  Skip all require() and global parsing for each file in this array.
                    ##  For giant libs like jquery or threejs that don't have any requires or node-style globals but
                    ##  take forever to parse.
                    ##
                    noParse: [
                                        'jquery'
                    ]

            ##  Non-debugging build
            ##
            app_dist:
                files: [
                    src:                '<%= build.part.app.src.browserify %>'
                    dest:               '<%= build.part.app.tgt %>'
                ]

            ##  Debugging build
            ##
            app_debug:
                options:
                    watch:              true
                    browserifyOptions:
                        detectGlobals:  '<%= browserify.options.browserifyOptions.detectGlobals %>'
                        extensions:     '<%= browserify.options.browserifyOptions.extensions %>'
                        noParse:        '<%= browserify.options.browserifyOptions.noParse %>'
                        debug:          true

                files:                  '<%= browserify.app_dist.files %>'


        ##
        ##  Remove your previously built build results.
        ##
        ##  https://github.com/gruntjs/grunt-contrib-clean#readme
        ##

        clean:

            ##
            ##  Distribution artifact destination directory:
            ##

            dist:
                files: [
                    src:                '<%= build.dist %>'
                ]

            ##
            ##  Per build part cleaning within the above destination directory:
            ##

            app:
                files: [
                    src:                '<%= build.part.app.tgt %>'
                ]

            brief:
                files: [
                    src:                '<%= build.part.brief.tgt %>'
                ]

            bootstrap:
                files: [
                    src:                '<%= build.part.bootstrap.tgt %>'
                ]

            doc:
                files: [
                    src:                '<%= build.part.doc.tgt %>'
                ]<@ if ( i18n ) { @>

            i18n:
                files: [
                    src:                '<%= build.part.i18n.tgt %>'
                ]<@ } @>

            style:
                files: [
                    src:                '<%= build.part.style.tgtDir %>'
                ]


        ##
        ##  Delint your coffeescript - before transpilation to javascript.
        ##
        ##  https://github.com/vojtajina/grunt-coffeelint#readme
        ##
        ##  http://www.coffeelint.org/
        ##  file:./coffeelint.json
        ##

        coffeelint:

            options:
                configFile:             'coffeelint.json'

            app:
                files: [
                    src:                '<%= build.part.app.src.lint %>'
                ]

            gruntfile:
                files: [
                    src:                'Gruntfile.coffee'
                ]

            test:
                files: [
                    src:                '<%= build.test %>**/*.coffee'
                ]


        ##
        ##  Delint your coffeescript - after transpilation to javascript.
        ##
        ##  https://github.com/bmac/grunt-coffee-jshint#readme
        ##
        ##  https://github.com/Clever/coffee-jshint#readme
        ##  http://www.jshint.com/docs/options/
        ##  http://www.jshint.com/
        ##

        coffee_jshint:

            options:

                ##  NOTE:   The use of browserify and the UMD (Universal Module Definition) pattern implies the legimate use of the globals below.
                ##
                ##  I would have liked to specify these globals and other jshint options through a '.jshintrc' file instead but have been unsuccessful so far.
                ##
                ##  Look at the supplied 'file:./.jshintrc' for further inspiration.
                ##
                globals: [
                                        'define'
                ]

                ##  Caveat: Using the extra variable `jshintOptions` to share a common set between the different targets below. Afaict this can't be done any
                ##  other way. (Duplicating doesn't count).
                ##
                jshintOptions: ( jshintOptions = [

                    ##                  Enforcing options:
                                        'eqeqeq'
                                        'forin'
                                        'noarg'
                                        'nonew'
                                        'undef'
                                        'unused'

                    ##                  Relaxing options:
                                        'debug'
                                        'loopfunc'
                ])

            app:
                options:
                    jshintOptions:      jshintOptions.concat( [
                        ##              Environment options:
                                        'browserify'
                                        'browser'
                                        'devel'
                    ] )

                files:                  '<%= coffeelint.app.files %>'

            gruntfile:
                options:
                    jshintOptions:      jshintOptions.concat( [
                        ##              Environment options:
                                        'node'
                    ] )

                files:                  '<%= coffeelint.gruntfile.files %>'

            test:
                options:                '<%= coffee_jshint.gruntfile.options %>'

                files:                  '<%= coffeelint.test.files %>'


        ##
        ##  Compile your sass to bundled css.
        ##
        ##  https://github.com/gruntjs/grunt-contrib-compass#readme
        ##
        ##  http://compass-style.org/help/documentation/configuration-reference/
        ##
        ##  http://sass-lang.com/documentation/file.SASS_REFERENCE.html#options
        ##  http://sass-lang.com/documentation/file.SASS_REFERENCE.html#output_style
        ##

        compass:

            options:

                ##  This is not a "rails" app `project_type`
                ##
                app:                    'stand_alone'

                ##  Source
                sassDir:                '<%= build.part.style.src.compass %>'

                ##  Destination
                cssDir:                 '<%= build.part.style.tgtDir %>'

                ##  Images and fonts will have been copied here first by means of the `copy:style` task.
                ##
                imagesDir:              '<%= build.part.style.tgtDir %>images/'
                fontsDir:               '<%= build.part.style.tgtDir %>fonts/'

                ##  Compass's asset helper functions should produce urls relative to the stylesheet.
                ##
                relativeAssets:         true

                raw:                    'sass_options = { :property_syntax => :new }\n'

            style_dist:
                options:
                    environment:        'production'
                    outputStyle:        'compressed'

            style_debug:
                options:
                    environment:        'development'
                    outputStyle:        'nested'
                    sourcemap:          true


        ##
        ##  Create your distribution artifacts.
        ##
        ##  https://github.com/gruntjs/grunt-contrib-compress#readme
        ##

        compress:

            app_dist:
                options:
                    archive:            '<%= build.artifactBase %>.zip'

                files: [
                    expand:             true
                    cwd:                '<%= build.assembly.app %>'
                    src:                '**/*'
                    dest:               '.'
                ]

            app_debug:
                options:
                    archive:            '<%= build.artifactBase %>-debug.zip'

                files:                  '<%= compress.app_dist.files %>'

            doc:
                options:
                    archive:            '<%= build.artifactBase %>-doc.zip'

                files: [
                    expand:             true
                    cwd:                '<%= build.assembly.doc %>'
                    src:                '**/*'
                    dest:               '.'
                ]


        ##
        ##  Copy your build bits that needs no transformation.
        ##
        ##  https://github.com/gruntjs/grunt-contrib-copy#readme
        ##

        copy:

            options:
                mode:                   true
                timestamp:              true<@ if ( i18n ) { @>

            i18n:
                files: [
                    filter:             'isFile'
                    expand:             true
                    cwd:                '<%= build.part.i18n.src %>'
                    src:                '**/*'
                    dest:               '<%= build.part.i18n.tgt %>'
                ]<@ } @>

            style:
                files: [
                    filter:             'isFile'
                    expand:             true
                    cwd:                '<%= build.part.style.src.copy %>'
                    src:                '**/*'
                    dest:               '<%= build.part.style.tgtDir %>'
                ]


        ##
        ##  Test your build.
        ##
        ##  https://github.com/pghalliday/grunt-mocha-test#readme
        ##
        ##  https://github.com/mochajs/mocha#readme
        ##  http://mochajs.org/
        ##

        mochaTest:

            test:
                options:
                    reporter:           'spec'
                    timeout:            30000

                files: [
                    src:                '<%= build.test %>**/*.{coffee,js}'
                ]


        ##
        ##  Substitute build targets and - for cache-busting reasons - a build-run identifier into your app's main
        ##  entry point.
        ##
        ##  https://github.com/mathiasbynens/grunt-template#readme
        ##

        template:

            bootstrap:
                options:
                    data: () ->

                        file = grunt.config( 'build.part.brief.tgt' )

                        ##  Don't let grunt handle the exception if this fails.
                        ##
                        try brief = grunt.file.readJSON( file )

                        grunt.fail.fatal( "Unable to read the build brief (\"#{file}\"). Wasn't it created?" ) unless brief?.timestamp

                        app:            path.relative( grunt.config( 'build.assembly.app' ), grunt.config( 'build.part.app.tgt' ))
                        style:          path.relative( grunt.config( 'build.assembly.app' ), grunt.config( 'build.part.style.tgt' ))
                        styleBase:      path.relative( grunt.config( 'build.assembly.app' ), grunt.config( 'build.part.style.tgtDir' ))

                        buildRun:       brief.buildNumber or brief.timestamp
                        debugging:      brief.debugging

                        npm:            grunt.config( 'npm' )

                files: [
                    src:                '<%= build.part.bootstrap.src %>'
                    dest:               '<%= build.part.bootstrap.tgt %>'
                ]


        ##
        ##  Minify your compiled and bundled code.
        ##
        ##  https://github.com/gruntjs/grunt-contrib-uglify#readme
        ##
        ##  https://github.com/mishoo/UglifyJS2#readme
        ##  http://lisperator.net/uglifyjs/
        ##

        uglify:

            app:
                options:
                    compress:
                        drop_console:   true

                files: [
                    src:                '<%= build.part.app.tgt %>'
                    dest:               '<%= build.part.app.tgt %>'
                ]


        ##
        ##  https://github.com/gruntjs/grunt-contrib-watch#readme
        ##
        ##  Note that 'watch' isn't your garden-variety multi-task even though its config makes it deceivingly look
        ##  like one.
        ##
        ##  Its intended mode of operation is as a (non-multi-) task, like: `grunt watch`.
        ##  Doing so will make it watch **all** targets' files and fork their associated `tasks` on any detected change.
        ##
        ##  That doesn't mean that it isn't possible to, say, `grunt watch:coffee`, it is, but its a one or all choice;
        ##  Making it work for multiple targets (except all) is not possible.
        ##
        ##  Also note that a value for `files` can only be a pattern string or an array of such values
        ##  (yes that definition is recursive).
        ##

        watch:

            ##
            ##  The browserify task does its own watching.
            ##
            ##  But for linting purposes we watch all coffee files here too.
            ##

            app:
                files:                  '<%= build.part.app.src.lint %>'
                tasks:                  'lint:app'

            bootstrap:
                options:
                    spawn:              false
                    livereload:         true

                files: [
                    ##                  Watch for changed assembly - targets -
                    ##
                                        '<%= build.part.app.tgt %>'<@ if ( i18n ) { @>
                                        '<%= build.part.i18n.tgt %>**/*'<@ } @>
                                        '<%= build.part.style.tgtDir %>**/*.css'

                    ##                  Watch for changed bootstrap - source -
                    ##
                                        '<%= build.part.bootstrap.src %>'
                ]
                tasks: [
                                        'brief:debug'
                                        'bootstrap:debug'
                ]<@ if ( i18n ) { @>

            i18n:
                files: [
                                        '<%= build.part.i18n.src %>**/*'
                ]
                tasks:                  'i18n'<@ } @>

            style:
                files: [
                                        '<%= build.part.style.src.copy %>**/*'
                                        '<%= build.part.style.src.compass %>**/*'
                ]
                tasks:                  'style:debug'


        ##
        ##  Generate your code's documentation
        ##
        ##  https://github.com/gruntjs/grunt-contrib-yuidoc#readme
        ##
        ##  http://yui.github.io/yuidoc/args/#command-line
        ##  http://yui.github.io/yuidoc/args/#yuidocjson-fields
        ##

        yuidoc:

            app:
                name:                   '<%= npm.name %>'
                description:            '<%= npm.description %>'
                url:                    '<%= npm.homepage %>'
                version:                '<%= npm.version %>'

                options:
                    ##                  NOTE:   Globbing patterns in `paths` cannot match - any - symbolically linked directories; yuidoc will not find them.
                    ##
                    ##                          Therefore, the 'doc' task will do any globbing expansion beforehand, and then reset `paths` to the result.
                    ##
                    paths:              '<%= build.part.doc.src %>'

                    ##                  NOTE:   `exclude` must be a string containing comma separated paths to directories.
                    ##
                    ##                          This is exactly what the template expansion below will achieve:
                    ##
                    exclude:            '<%= grunt.file.expand( grunt.config( "build.part.doc.srcExclude" )) %>'

                    ##                  NOTE:   Yuidoc will empty the `outdir` directory before construction.
                    ##
                    outdir:             '<%= build.part.doc.tgt %>'

                    extension:          '.coffee'
                    syntaxtype:         'coffee'

    )


    ##  ================================================
    ##  The build tools, npm-loaded tasks:
    ##
    ##  Be sure to have `npm install <plugin> --save-dev`-ed each of these:
    ##  ================================================

    grunt.loadNpmTasks( 'grunt-browserify' )
    grunt.loadNpmTasks( 'grunt-coffeelint' )
    grunt.loadNpmTasks( 'grunt-coffee-jshint' )
    grunt.loadNpmTasks( 'grunt-contrib-clean' )
    grunt.loadNpmTasks( 'grunt-contrib-compass' )
    grunt.loadNpmTasks( 'grunt-contrib-compress' )
    grunt.loadNpmTasks( 'grunt-contrib-copy' )
    grunt.loadNpmTasks( 'grunt-contrib-uglify' )
    grunt.loadNpmTasks( 'grunt-contrib-watch' )
    grunt.loadNpmTasks( 'grunt-contrib-yuidoc' )
    grunt.loadNpmTasks( 'grunt-mocha-test' )
    grunt.loadNpmTasks( 'grunt-template' )


    ##  ================================================
    ##  The build tools, internally defined tasks:
    ##  ================================================

    grunt.registerTask(
        'create_brief'
        'Generate \'build.json\' file containing the build details'
        ( debugging ) ->

            stamp       = new Date()
            buildNumber = process.env.BUILD_NUMBER

            unless buildNumber
                localBuild  = 'build.localNumber'
                localNumber = grunt.config( localBuild ) or 0
                buildNumber = "+#{localNumber}"

                grunt.config.set( localBuild, localNumber + 1 )

            buildInfo   =
                buildNumber:    buildNumber
                buildId:        process.env.BUILD_ID or null
                revision:       process.env.GIT_COMMIT or 'working dir'

                grunted:        grunt.template.date( stamp, 'yyyy mmm dd HH:MM:ss' )
                debugging:      ( debugging is 'debug' )

                name:           grunt.config( 'npm.name' )
                version:        grunt.config( 'npm.version' )

                timestamp:      +stamp

            grunt.file.write( grunt.config( 'build.part.brief.tgt' ), JSON.stringify( buildInfo, null, 4 ))

            return
    )


    ##  ================================================
    ##  Per build part tasks:
    ##  ================================================

    grunt.registerTask(
        'app'
        'Build the app.'
        ( debugging ) ->
            grunt.task.run(
                'lint:app'

                'clean:app'

                "browserify:app_#{debugging}"<@ if ( i18n ) { @>
                'i18n'<@ } @>
                "style:#{debugging}"

                ##  brief before bootstrap

                "brief:#{debugging}"
                'bootstrap'
            )
    )

    grunt.registerTask(
        'brief'
        'Build the build\'s brief.'
        ( debugging ) ->
            grunt.task.run(
                'clean:brief'
                "create_brief:#{debugging}"
            )
    )

    grunt.registerTask(
        'doc'
        'Build the documentation'
        () ->

            ##  Fully, expand any globs in 'build.part.doc.src' before passing the result to `yuidoc`.
            ##
            ##  Because `yuidoc` expects either a string containing a single directory path or an array of such strings
            ##  We cannot use the grunt template mechanism to do the substitution.
            ##
            path = 'yuidoc.app.options.paths'

            grunt.config( path, grunt.file.expand( grunt.config( path )))

            ##

            grunt.task.run(
                'clean:doc'
                'yuidoc:app'
            )
    )

    grunt.registerTask(
        'bootstrap'
        'Build the app\'s startup entry point.'
        [
            'clean:bootstrap'
            'template:bootstrap'
        ]
    )<@ if ( i18n ) { @>

    grunt.registerTask(
        'i18n'
        'Build the app\'s internationalization files'
        [
            'clean:i18n'
            'copy:i18n'
        ]
    )<@ } @>

    grunt.registerTask(
        'lint'
        'Look for lint in the app\'s code'
        ( target = '' ) ->
            grunt.task.run(
                "coffeelint:#{target}"
                "coffee_jshint:#{target}"
            )
    )

    grunt.registerTask(
        'style'
        'Build the app\'s stylesheet and related assets'
        ( debugging ) ->
            grunt.task.run(
                'clean:style'
                'copy:style'
                "compass:style_#{debugging}"
            )
    )


    ##  ================================================
    ##  Command line tasks; the usual suspects anyway:
    ##  ================================================

    grunt.registerTask(
        'default'
        [
            'clean:dist'

            'app:dist'

            'uglify:app'

            'test'

            'compress:app_dist'

            'doc'
            'compress:doc'
        ]
    )

    grunt.registerTask(
        'debug'
        [
            'clean:dist'

            'app:debug'

            'compress:app_debug'
        ]
    )

    grunt.registerTask(
        'dev'
        [
            'clean:dist'

            'app:debug'

            'watch'
        ]
    )

    grunt.registerTask(
        'test'
        [
            'mochaTest'
        ]
    )
