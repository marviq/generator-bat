Q = require "q"

# Disable Q's unhandled exception tracking (it will often give false positives)
#
Q.stopUnhandledRejectionTracking()

# **DEVELOPMENT**
# On the other hand, when a real promise rejection *does* go unnoticed... rub it in.
#
Q.onerror = ( error ) ->
    message = "[Q] :: Unhandled promise rejection."

    console.log( message + " Error: ", error, error.stack )
    throw( error )

# Include required bootstrap modules
#
console     = require "madlib-console"
settings    = require "madlib-settings"
HostMapping = require "madlib-hostmapping"

# Initialise your settings and create hostMapping instance
#
hostMapping = new hostMapping( settings )

# Set the debug log level to WARN for production
#
# hostMapping.determineTarget()
# if hostMapping.getCurrentHostMapping() is "production"
#     console.logLevel = "WARN"
# else
#     console.logLevel = "DEBUG"


# Start your application here
#
