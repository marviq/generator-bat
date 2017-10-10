'use strict'

Promise         = require( 'bluebird' )
settings        = require( 'madlib-settings' )
settingsJSON    = require( './../../asset/settings.json' )
settingsEnv     = require( './../../../../src/models/settings-environment.coffee' )

##  `settings-environment` is exporting a singleton object.
##  But in order to unit-test properly, once is simply not enough. We want to start from the class; hence:
##
SettingsEnvironmentModel = Object.getPrototypeOf( settingsEnv ).constructor

describe( 'Target-environment settings', () ->

    beforeEach( () ->

        settings.unset( 'environment' )
    )

    it( 'should reject its `initialized` Promise property when loading fails.', ( done ) ->

        ##  Stub `@fetch` call into failure.
        ##
        spyOn( SettingsEnvironmentModel::, 'fetch' ).and.returnValue( Promise.reject( new Error( 'because we can' )))

        settingsEnv = new SettingsEnvironmentModel()

        failureSpy  = jasmine.createSpy( 'rejected' )

        settingsEnv.initialized.catch( failureSpy ).finally( () ->

            expect( failureSpy ).toHaveBeenCalled()

            done()

            return
        )

        return
    )

    it( 'should resolve its `initialized` Promise property when loading succeeds.', ( done ) ->

        ##  Stub `@fetch` call into succcess.
        ##
        spyOn( SettingsEnvironmentModel::, 'fetch' ).and.returnValue( Promise.resolve( settingsJSON ))

        settingsEnv = new SettingsEnvironmentModel()

        successSpy  = jasmine.createSpy( 'resolved' )

        settingsEnv.initialized.then( successSpy ).finally( () ->

            expect( successSpy ).toHaveBeenCalled()

            done()

            return
        )

        return
    )

    it( 'should initialize an `environment` section within the application\'s settings.', ( done ) ->

        ##  Stub `@fetch` call to succcess.
        ##
        spyOn( SettingsEnvironmentModel::, 'fetch' ).and.returnValue( Promise.resolve( settingsJSON ))

        settingsEnv = new SettingsEnvironmentModel()

        settingsEnv.initialized.then(
            () ->
                actual = settings.get( 'environment' )

                expect( actual ).toBe( settingsEnv.attributes )

                done()

                return
        )

        return
    )

    return
)
