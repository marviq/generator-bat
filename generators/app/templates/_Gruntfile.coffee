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
##        * app#% if ( i18n ) { %#
##            * i18n#% } %#
##            * style
##        * documentation
##
##    * The build's debugging mode:
##        * debugging,      - alias debug
##        * non-debugging,  - alias dist - note the overloading of the 'dist' term.
##
##    * The build tools. These almost map 1-to-1 on the npm-loaded grunt tasks:
##
##        * browserify      - for the app build part
##        * clean
##        * compass         - for the style build part
##        * compress        - for the application and documentation build artifacts
##        * copy
##        * yuidoc          - for the documentation build part
##
##      The above all have to do with the actual assembly of the build.
##      Apart from these, there are also:
##
##        * Development support tools:
##            * watch
##
##  ====
##

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

                    ##                  NOTE:   <%= npm.main %> should have <%= build.dist %> as its prefix:
                    ##
                    tgt:                '<%= npm.main %>'

                doc:
                    ##                  NOTE:   Directories to include and to exclude cannot be expressed in a single expression.
                    ##
                    src:                '<%= build.source %>'
                    srcExclude:         []

                    ##                  NOTE:   `tgt` - must - be a directory.
                    ##
                    tgt:                '<%= build.assembly.doc %>'#% if ( i18n ) { %#

                i18n:
                    src:                '<%= build.source %>i18n/'
                    tgt:                '<%= build.assembly.app %>i18n/'#% } %#

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
        ##  https://github.com/substack/node-browserify#var-b--browserifyfiles-or-opts
        ##
        ##  https://github.com/substack/browserify-handbook#packagejson
        ##      file:./package.json
        ##        - browser : https://gist.github.com/defunctzombie/4339901
        ##        - browserify-shim : https://github.com/thlorenz/browserify-shim#readme
        ##        - browserify.transform : https://github.com/substack/browserify-handbook#browserifytransform-field
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
                    ##  When you find yourself using 'browserify-shim', you're likely to want to set this to `true`.
                    ##
                    detectGlobals:      false

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

            doc:
                files: [
                    src:                '<%= build.part.doc.tgt %>'
                ]#% if ( i18n ) { %#

            i18n:
                files: [
                    src:                '<%= build.part.i18n.tgt %>'
                ]#% } %#

            style:
                files: [
                    src:                '<%= build.part.style.tgtDir %>'
                ]


            uglify:
                src: [ 'dist/app/bundle.js' ]

            index:
                src: [ 'dist/app/index.html' ]


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
                ##  Source
                sassDir:                '<%= build.part.style.src.compass %>'

                ##  Destination
                cssDir:                 '<%= build.part.style.tgtDir %>'

                ##  Images will have been copied here first by means of the `copy:style` task.
                ##
                imagesDir:              '<%= build.part.style.tgtDir %>images/'

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
                timestamp:              true#% if ( i18n ) { %#

            i18n:
                files: [
                    filter:             'isFile'
                    expand:             true
                    cwd:                '<%= build.part.i18n.src %>'
                    src:                '**/*'
                    dest:               '<%= build.part.i18n.tgt %>'
                ]#% } %#

            index:
                files:
                    [
                        expand: true
                        cwd:    'src'
                        src:    [ 'index.html' ]
                        dest:   'dist/app'
                    ]

            style:
                files: [
                    filter:             'isFile'
                    expand:             true
                    cwd:                '<%= build.part.style.src.copy %>'
                    src:                '**/*'
                    dest:               '<%= build.part.style.tgtDir %>'
                ]


        # Optimize the JavaScript code
        #
        uglify:
            dist:
                files:
                    'dist/app/bundle.min.js': [ 'dist/app/bundle.js' ]

        # Add the build number to the bundle loader for cache busting reasons
        #
        'string-replace':
            dist:
                files:
                    'dist/app/index.html': 'app/index.html'
                options:
                    replacements: [
                        pattern:        'bundle.min.js'
                        replacement:    'bundle.min.js?build=' + ( grunt.option( 'bambooNumber' ) or +( new Date() ) )
                    ]
            debug:
                files:
                    'dist/app/index.html': 'app/index.html'
                options:
                    replacements: [
                        pattern:        'bundle.min.js'
                        replacement:    'bundle.js?build=' + ( grunt.option( 'bambooNumber' ) or +( new Date() ) )
                    ]


        mochaTest:
            test:
                options:
                    reporter:   'spec'
                    require:    'coffee-script'
                    timeout:    30000
                src: [ 'test/**/*.js', 'test/**/*.coffee' ]


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

            options:
                livereload: true

            index:
                files: [ 'src/index.html' ]
                tasks: [ 'clean:index', 'copy:index', 'string-replace:debug' ]#% if ( i18n ) { %#

            i18n:
                files: [
                                        '<%= build.part.i18n.src %>**/*'
                ]
                tasks:                  'i18n'#% } %#

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

                    extension:          '.coffee,.js'
                    syntaxtype:         'jsAndCoffee'

                    themedir:           'node_modules/yuidoc-marviq-theme'
                    helpers:            [ 'node_modules/yuidoc-marviq-theme/helpers/helpers.js' ]

    )


    ##  ================================================
    ##  The build tools, npm-loaded tasks:
    ##
    ##  Be sure to have `npm install <plugin> --save-dev`-ed each of these:
    ##  ================================================

    grunt.loadNpmTasks( 'grunt-browserify' )
    grunt.loadNpmTasks( 'grunt-contrib-clean' )
    grunt.loadNpmTasks( 'grunt-contrib-compass' )
    grunt.loadNpmTasks( 'grunt-contrib-compress' )
    grunt.loadNpmTasks( 'grunt-contrib-copy' )
    grunt.loadNpmTasks( 'grunt-contrib-uglify' )
    grunt.loadNpmTasks( 'grunt-contrib-watch' )
    grunt.loadNpmTasks( 'grunt-contrib-yuidoc-iq' )
    grunt.loadNpmTasks( 'grunt-mocha-test' )
    grunt.loadNpmTasks( 'grunt-string-replace' )


    ##  ================================================
    ##  The build tools, internally defined tasks:
    ##  ================================================

    grunt.registerTask( 'writeBuildFile', 'Create build description file', () ->
        # Get the bamboo variables if they are present
        #
        pkg       = grunt.file.readJSON( 'package.json' )
        buildInfo =
            number:     grunt.option( 'bambooNumber' ) or +( new Date() )
            key:        grunt.option( 'bambooKey'    ) or 'SES-LOCALBUILD'
            name:       pkg.name
            version:    pkg.version
            created:    new Date()

        grunt.file.write( 'dist/app/build.json', JSON.stringify( buildInfo, null, '  ' ) )
    )


    ##  ================================================
    ##  Per build part tasks:
    ##  ================================================

    grunt.registerTask(
        'app'
        'Build the app.'
        ( debugging ) ->
            grunt.task.run(
                'clean:app'

                "browserify:app_#{debugging}"#% if ( i18n ) { %#
                'i18n'#% } %#
                "style:#{debugging}"

                "string-replace:#{debugging}"
                'writeBuildFile'
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
    )#% if ( i18n ) { %#

    grunt.registerTask(
        'i18n'
        'Build the app\'s internationalization files'
        [
            'clean:i18n'
            'copy:i18n'
        ]
    )#% } %#

    grunt.registerTask(
        'style'
        'Build the app\'s style'
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

            'uglify:dist'
            'clean:uglify'

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