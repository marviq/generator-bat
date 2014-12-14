chai                = require "chai"
expect              = chai.expect
ExampleModel        = require "../src/models/example.coffee"

# Create a model instance
#

describe( "exampleModel tests:", () ->

    # Create an instance without any data to test the defaults
    #
    emptyModel = new ExampleModel()

    describe( "defaults", () ->

        it( "propertyOne should be a string", () ->
            expect( emptyModel.get( "propertyOne" ) ).to.be.a( "string" )
        )

        it( "propertyTwo should be a boolean", () ->
            expect( emptyModel.get( "propertyTwo" ) ).to.be.a( "boolean" )
        )
    )

    # Test the set function by overwriting one of the defaults
    #
    describe( "set", () ->

        it( "try setting a property", () ->

            newString = "This should be overriden now"

            emptyModel.set( "propertyOne", newString )

            expect( emptyModel.get( "propertyOne" ) ).to.equal( newString )
        )
    )

    # Test the model when passing it data, check if defaults are overriden
    #
    filledModel = new ExampleModel( {
        propertyOne: "This should be overriden now"
        propertyTwo: false
    } )

    describe( "Override defaults", () ->

        it( "Default sshould be overriden", () ->
            expect( filledModel.get( "propertyOne" ) ).to.equal( "This should be overriden now" )
            expect( filledModel.get( "propertyTwo" ) ).to.equal( false )
        )
    )

    # Test a async function, could be your fetch for example ;-)
    #
    describe( "async test", () ->

        it( "it should return true", ( testCompleted ) ->

            emptyModel.exampleAsyncFunction( ( response ) ->
                expect( response ).to.be.a( "boolean" );
                expect( response ).to.equal( true );

                testCompleted()
            )
        )
    )
)