'use strict'

ExampleModel    = require( './../../../../src/models/example.coffee' )

describe( 'An `ExampleModel` unit test suite', () ->

    ##  Create an instance without any data to test the defaults.
    ##
    emptyModel = new ExampleModel()

    describe( 'A newly created model instance without an `attributes` argument', () ->

        it( 'should have a default `attributeOne` attribute of type `String`', () ->
            expect( emptyModel.get( 'attributeOne' )).toEqual( jasmine.any( String ))

            return
        )

        it( 'should have a default `attributeTwo` attribute of type `Boolean`', () ->
            expect( emptyModel.get( 'attributeTwo' )).toEqual( jasmine.any( Boolean ))

            return
        )

        return
    )

    ##  Test the set function by overwriting one of the defaults.
    ##
    describe( 'A default attribute, when set', () ->

        it( 'should be overridden', () ->

            newString = 'This should be overriden now'

            emptyModel.set( 'attributeOne', newString )

            expect( emptyModel.get( 'attributeOne' )).toEqual( newString )

            return
        )

        return
    )

    ##  Test model when xxx it data, check if defaults are overriden
    ##
    populatedModel =
        new ExampleModel(

            attributeOne:    'This should be overriden now'
            attributeTwo:    false
        )

    describe( 'A newly created model instance with a custom `attributes` argument', () ->

        it( 'Should have been populated with the attributes as they were passed-in on its constructor', () ->

            expect( populatedModel.get( 'attributeOne' )).toEqual( 'This should be overriden now' )
            expect( populatedModel.get( 'attributeTwo' )).toEqual( false )

            return
        )

        return
    )

    ##  Test an async method.
    ##
    describe( 'A custom async method', () ->

        it( 'it should return true', ( done ) ->

            emptyModel.exampleAsyncFunction( ( response ) ->

                expect( response ).toEqual( true )

                done()

                return
            )

            return
        )

        return
    )

    return
)
