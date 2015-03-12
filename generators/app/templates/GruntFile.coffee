module.exports = ( grunt ) ->

    sourceFiles     = [ './src/bootstrap.coffee', './src/**/*.hbs' ]
    sassFiles       = [ './src/sass/**/*.scss', './src/sass/**/*.sass' ]

    # Put any large files that shouldn't be parsed by browserify in this array
    # this makes the compile proces faster
    #
    noParseFiles    = []

    # When opts.detectGlobals is true, scan all files for process, global, __filename, and __dirname,
    # defining as necessary. With this option npm modules are more likely to work but bundling takes longer.
    #
    browserifyDetectGlobals = false

    # Project configuration
    #
    grunt.initConfig(
        pkg:    grunt.file.readJSON( 'package.json' )

        # Clean the distribution folder
        #
        clean:
            dist:
                src: [ 'dist' ]

            uglify:
                src: [ 'dist/src/bundle.js' ]

            index:
                src: [ 'dist/src/index.html' ]

        # Watch the files for changes and rebuild as needed
        #
        watch:
            options:
                livereload: true

            sass:
                files: sassFiles
                tasks: [ 'compass:debug', 'copy:dist', 'string-replace:debug' ]

            index:
                files: [ 'src/index.html' ]
                tasks: [ 'clean:index', 'copy:index', 'string-replace:debug' ]

            demo:
                files: [ 'src/style/index.html' ]


        # Bundle the code modules
        #
        browserify:
            dist:
                files:
                    'dist/src/bundle.js': sourceFiles

                options:
                    browserifyOptions:
                        extensions:         [ '.coffee', '.hbs' ]
                        noParse:            noParseFiles
                        detectGlobals:      browserifyDetectGlobals
            debug:
                files:
                    'dist/src/bundle.js': sourceFiles

                options:
                    watch:                  true

                    browserifyOptions:
                        extensions:         [ '.coffee', '.hbs' ]
                        debug:              true
                        noParse:            noParseFiles
                        detectGlobals:      browserifyDetectGlobals

            watch:
                files:
                    'dist/src/bundle.js': sourceFiles

                options:
                    watch:                  true

                    browserifyOptions:
                        extensions:         [ '.coffee', '.hbs' ]
                        debug:              true
                        noParse:            noParseFiles
                        detectGlobals:      browserifyDetectGlobals



        # Optimize the JavaScript code
        #
        uglify:
            dist:
                files:
                    'dist/src/bundle.min.js': [ 'dist/src/bundle.js' ]

        # Add the build number to the bundle loader for cache busting reasons
        #
        'string-replace':
            dist:
                files:
                    'dist/src/index.html': 'src/index.html'
                options:
                    replacements: [
                        pattern:        'bundle.min.js'
                        replacement:    'bundle.min.js?build=' + ( grunt.option( 'bambooNumber' ) or +( new Date() ) )
                    ]
            debug:
                files:
                    'dist/src/index.html': 'src/index.html'
                options:
                    replacements: [
                        pattern:        'bundle.min.js'
                        replacement:    'bundle.js?build=' + ( grunt.option( 'bambooNumber' ) or +( new Date() ) )
                    ]

        # Generate code documentation
        #
        yuidoc:
            compile:
                name: '<%= pkg.name %>'
                description: '<%= pkg.description %>'
                version: '<%= pkg.version %>'
                url: '<%= pkg.homepage %>'
                options:
                    paths: grunt.file.expand( [ 'src' ] )
                    outdir: 'dist/docs'
                    themedir: 'node_modules/yuidoc-marviq-theme'
                    exclude: 'vendor'
                    syntaxtype: 'jsAndCoffee'
                    extension: '.coffee,.js'
                    helpers: [ 'node_modules/yuidoc-marviq-theme/helpers/helpers.js' ]

        # Prepare the dist folder
        #
        copy:
            dist:
                files:
                    [
                        expand: true
                        cwd: 'src'
                        src:
                            [
                                '**/*'
                                '!**/*.coffee'
                                '!collections/**'
                                '!models/**'
                                '!views/**'
                                '!routers/**'
                                '!sass/**'
                                '!vendor/**'
                                '!style/images/icons/*.{png,gif,jpg}'
                                '!config.rb'
                            ]
                        dest: 'dist/src'
                    ]

            index:
                files:
                    [
                        expand: true
                        cwd:    'src'
                        src:    [ 'index.html' ]
                        dest:   'dist/src'
                    ]

        # Create the distribution archive
        #
        compress:
            dist:
                options:
                    archive: 'dist/<%= pkg.name %>-<%= pkg.version %>.zip'
                expand: true
                cwd:    'dist/src'
                src:    [ '**/*' ]
                dest:   '.'

            debug:
                options:
                    archive: 'dist/<%= pkg.name %>-<%= pkg.version %>-DEBUG.zip'
                expand: true
                cwd:    'dist/src'
                src:    [ '**/*' ]
                dest:   '.'

            yuidoc:
                options:
                    archive:  'dist/<%= pkg.name %>-<%= pkg.version %>-docs.zip'
                expand: true
                cwd:    'dist/docs'
                src:    [ '**/*' ]
                dest:   '.'

        # Setup the SASS compiling using compass
        #
        compass:
            config:                 'config.rb'
            dist:
                options:
                    sassDir:        'src/sass'
                    cssDir:         'dist/src/style'
                    environment:    'production'

            debug:
                options:
                    sassDir:        'src/sass'
                    cssDir:         'dist/src/style'
                    outputStyle:    'nested'

        mochaTest:
            test:
                options:
                    reporter:   'spec'
                    require:    'coffee-script'
                    timeout:    30000
                src: [ 'test/**/*.js', 'test/**/*.coffee' ]
    )

    # These plug-ins provide the necessary tasks
    #
    grunt.loadNpmTasks( 'grunt-browserify' )
    grunt.loadNpmTasks( 'grunt-contrib-watch' )
    grunt.loadNpmTasks( 'grunt-contrib-clean' )
    grunt.loadNpmTasks( 'grunt-contrib-copy' )
    grunt.loadNpmTasks( 'grunt-contrib-compress' )
    grunt.loadNpmTasks( 'grunt-contrib-compass' )
    grunt.loadNpmTasks( 'grunt-contrib-yuidoc-iq' )
    grunt.loadNpmTasks( 'grunt-contrib-uglify' )
    grunt.loadNpmTasks( 'grunt-mocha-test' )
    grunt.loadNpmTasks( 'grunt-string-replace' )

    # Write the build file
    #
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

        grunt.file.write( 'dist/src/build.json', JSON.stringify( buildInfo, null, '  ' ) )
    )

    # Default tasks
    #
    grunt.registerTask(
        'default'
        [
            'clean:dist'
            'browserify:dist'
            'uglify:dist'
            'clean:uglify'
            'compass:dist'
            'yuidoc'
            'copy:dist'
            'string-replace:dist'
            'writeBuildFile'
            'compress:dist'
            'compress:yuidoc'
        ]
    )

    grunt.registerTask(
        'debug'
        [
            'clean:dist'
            'browserify:debug'
            'compass:debug'
            'copy:dist'
            'string-replace:debug'
            'writeBuildFile'
            'compress:debug'
        ]
    )

    grunt.registerTask(
        'dev'
        [
            'clean:dist'
            'browserify:debug'
            'compass:debug'
            'copy:dist'
            'string-replace:debug'
            'watch'
        ]
    )

    grunt.registerTask(
        'test'
        [
            'mochaTest'
        ]
    )
