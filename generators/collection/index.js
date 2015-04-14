"use strict";

var yeoman  = require( "yeoman-generator" )
,   yosay   = require( "yosay" )
,   varname = require( "varname" )
,   fs      = require( "fs" )
;

// Get the current running directory name
//
var fullPath        = process.cwd()
,   rootLocation    = fullPath
;

module.exports = yeoman.generators.Base.extend(
{
    // Function is used to determine if we are currently in the root off the project
    // if not, try to find the root and change to that directory
    //
    determineRoot: function()
    {
        var callback        = this.async()
        ,   rootFound       = false
        ,   tries           = 0
        ;

        if( fs.existsSync( "src" ) === false )
        {
            while( rootFound === false && tries < 10 )
            {
                // Split old path
                //
                var previousLocation = rootLocation.split( "/" );

                // Pop the last folder from the path
                //
                previousLocation.pop();

                // Create the new path and open it
                //
                rootLocation = previousLocation.join( "/" );

                // Change the process location
                //
                process.chdir( rootLocation );

                // Check if we found the project root, up the counter
                // we should stop looking some time.....
                //
                rootFound = fs.existsSync( "src" );
                tries++;
            }

            // If we couldn't find the root, let the user know and exit the proces...
            //
            if( rootFound === false )
            {
                yeoman.log( "Failed to find root of the project, check that you are somewhere within your project." );
                process.exit();
            }
        }

        callback();
    }

,   askSomeQuestions: function ()
    {
        var callback = this.async();

        // Have Yeoman greet the user.
        //
        this.log( yosay( "So you want a BAT collection?" ) );

        // Ask the user for the webapp details
        //
        var prompts = [
            {
                name:       "collectionName"
            ,   message:    "What's the name of this collection you so desire? ( use camelcasing! )"
            }
        ,   {
                name:       "description"
            ,   message:    "What's the description for this collection?"
            ,   default:    "No description"
            }
        ,   {
                type:       "confirm"
            ,   name:       "singleton"
            ,   message:    "Should this collection be a singleton?"
            ,   default:    false
            }
        ];

        this.prompt( prompts, function( props )
        {
            this.collectionName = props.collectionName;
            this.description    = props.description;
            this.singleton      = props.singleton;

            callback();
        }.bind( this ) );
    }


,   askModelQuestions: function()
    {
        var callback = this.async();

        // We are gonna do a "smart" guess for the modelName to have a default value
        // If the last characters of the collectionName is a "s" we are gonna assume it's
        // plural and remove the trailing as and use that a default modelName
        //
        var modelName = this.collectionName;

        if( this.collectionName.slice( -1 ) === "s" )
        {
            modelName = this.collectionName.slice( 0, -1 );
        }

        var prompts = [
            {
                name:       "modelName"
            ,   message:    "Whats the model name for this collection ( use camelcasing! )"
            ,   default:    modelName
            }
        ,   {
                type:       "confirm"
            ,   name:       "createModel"
            ,   message:    "Should i create this model now as well?"
            ,   default:    true
            }
        ];

        this.prompt( prompts, function( props )
        {
            this.modelName      = props.modelName;
            this.createModel    = props.createModel;

            callback();
        }.bind( this ) );

    }

,   createCollection: function()
    {
        // Create the needed variables
        this.modelClass     = this.modelName.charAt(0).toUpperCase() + this.modelName.slice(1);
        this.className      = this.collectionName.charAt(0).toUpperCase() + this.collectionName.slice(1);
        this.modelFileName  = varname.dash( this.modelName );
        this.fileName       = varname.dash( this.collectionName );

        // Create the collection
        this.template( "collection.coffee", "src/collections/" + this.fileName + ".coffee" );

        // Create the model if needed
        if( this.createModel === true )
        {
            this.invoke( "bat:model", {
                options: {
                    nested:         true
                ,   modelName:      this.modelName
                ,   description:    "Model for the " + this.collectionName
                ,   singleton:      false
                }
            } );
        }
    }
} );
