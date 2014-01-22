module.exports = ( grunt ) ->

    sourceFiles = [ "src/**/*.coffee", "src/**/*.js" ]

    # Project configuration
    #
    grunt.initConfig
        clean:
            dist:
                src: [ "dist" ]

        watch:
            src:
                files: sourceFiles
                tasks: [ "browserify:debug" ]

        browserify:
            dist:
                files:
                    "lib/bundle.js": sourceFiles
                options:
                    transform: [ "coffeeify" ]

            debug:
                files:
                    "lib/bundle.js": sourceFiles
                options:
                    debug:     true
                    transform: [ "coffeeify" ]

        # Prepare the dist folder
        #
        copy:
            dist:
                files:
                    [
                        expand: true
                        cwd: "."
                        src:
                            [
                                "**/*"
                                "!src"
                                "!**/*.coffee"
                                "!log/*.log"
                                "!node_modules/**"
                                "!test/**"
                                "!GruntFile.js"
                                "!package.json"
                            ]
                        dest: "dist/src"
                    ]

        # Create the distribution archive
        #
        compress:
            dist:
                options:
                    archive: "dist/<%= pkg.name %>.zip"
                expand: true
                cwd:    "dist/src"
                src:    [ "**/*" ]
                dest:   "."

            debug:
                options:
                    archive: "dist/<%= pkg.name %>-<%= pkg.version %>-DEBUG.zip"
                expand: true
                cwd:    "dist/src"
                src:    [ "**/*" ]
                dest:   "."

        mochaTest:
            test:
                options:
                    reporter: 'spec'
                    require:  'coffee-script'
                src: [ 'test/**/*.js', "test/**/*.coffee" ]


    # These plug-ins provide the necessary tasks
    #
    grunt.loadNpmTasks "grunt-browserify"
    grunt.loadNpmTasks "grunt-contrib-watch"
    grunt.loadNpmTasks "grunt-contrib-clean"
    grunt.loadNpmTasks "grunt-contrib-copy"
    grunt.loadNpmTasks "grunt-contrib-compress"
    grunt.loadNpmTasks 'grunt-mocha-test'

    # Default tasks
    #
    grunt.registerTask "default",
    [
        "clean:dist"
        "browserify:dist"
        "copy:dist"
        "compress:dist"
    ]

    grunt.registerTask "debug",
    [
        "clean:dist"
        "browserify:debug"
        "copy:dist"
        "compress:debug"
    ]

    grunt.registerTask "test",
    [
        "clean:dist"
        "browserify:dist"
        "copy:dist"
        "mochaTest"
    ]