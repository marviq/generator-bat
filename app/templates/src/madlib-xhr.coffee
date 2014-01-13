( ( factory ) ->
    if typeof exports is "object"
        module.exports = factory(
            require "madlib-console"
            require "madlib-settings"
            require "madlib-xhr-browser"
        )
    else if typeof define is "function" and define.amd
        define( [
            "madlib-console"
            "madlib-settings"
            "madlib-xhr-browser"
        ], factory )

)( ( console, settings, XHR ) ->

    console.log( "[XHR] Setting up host mapping and XDM support" )

    # Setup XHR host mappings
    # These are example values that need to be changed or removed
    #
    settings.init( "hostMapping",
        "www.myhost.com":       "production"
        "acc.myhost.com":       "acceptance"
        "tst.myhost.com":       "testing"
        "localhost":            "development"
    )

    settings.init( "hostConfig",
        "production":
            "api":              "https://api.myhost.com"
        "acceptance":
            "api":              "https://api-acc.myhost.com"
        "testing":
            "api":              "https://api-tst.myhost.com"
        "development":
            "api":              "https://api-tst.myhost.com"
    )

    # Setup XHR host settings
    #
    settings.init(
        "api.myhost.com":
            cors:               true
            xdmVersion:         3
            xdmProvider:        "https://api.myhost.com/support/xdm/services.html"
        "api-acc.myhost.com":
            cors:               true
            xdmVersion:         3
            xdmProvider:        "https://api-acc.myhost.com/support/xdm/services.html"
        "api-tst.myhost.com":
            cors:               true
            xdmVersion:         3
            xdmProvider:        "https://api-tst.myhost.com/support/xdm/services.html"
    )

    return XHR
)