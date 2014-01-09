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
                    "dist/bundle.js": sourceFiles
                options:
                    transform: [ "coffeeify" ]

            debug:
                files:
                    "dist/bundle.js": sourceFiles
                options:
                    debug:     true
                    transform: [ "coffeeify" ]

    # These plugins provide the necessary tasks
    #
    grunt.loadNpmTasks "grunt-browserify"
    grunt.loadNpmTasks "grunt-contrib-watch"
    grunt.loadNpmTasks "grunt-contrib-clean"

    # Default tasks
    #
    grunt.registerTask "default", [ "browserify:dist"  ]
    grunt.registerTask "debug",   [ "browserify:debug" ]