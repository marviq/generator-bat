( ( factory ) ->
    if typeof exports is "object"
        module.exports = factory(
            require "madlib-settings"
            require "madlib-xml-objectifier"
            require "madlib-xml-parse"
            require "madlib-xml-serialize"
        )
    else if typeof define is "function" and define.amd
        define( [
            "madlib-settings"
            "madlib-xml-objectifier"
            "madlib-xml-parse"
            "madlib-xml-serialize"
        ], factory )

)( ( settings, objectifier, stringParser, serializer ) ->

    # XML Conversion settings
    #
    settings.init( "xmlConversionMode", "strict" )
    settings.init( "xmlSmartModeTags",  [] )

    xml =
        # Turn provided string into a DOM document
        #
        parse: stringParser

        # TODO Detect document or node
        #
        serialize: serializer

        # Expose objectifier methods with settings based parameters
        #
        documentToObject: ( xmlDocument ) ->
            objectifier.documentToObject( xmlDocument, settings.get( "xmlConversionMode" ), settings.get( "xmlSmartModeTags" ) )

        nodeToObject: ( xmlNode ) ->
            objectifier.nodeToObject( xmlNode, settings.get( "xmlConversionMode" ), settings.get( "xmlSmartModeTags" ) )
)