var yeoman  = require( "yeoman-generator" )
,   yosay   = require( "yosay" )
,   path    = require( 'path' )
,   varname = require( "varname" )
,   fs      = require( "fs" )
;

// Get the current running directory name
//
var fullPath        = process.cwd()
,   folderName      = fullPath.split( '/' ).pop()
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
            if( rootFound == false )
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
        this.log( yosay( "So you want an BAT collection?" ) );

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
                name:       "modelName"
            ,   message:    "What's the model name for this collection ( use camelcasing! )"
            }

        ,   {
                type:       "confirm"
            ,   name:       "singleton"
            ,   message:    'Should this collection be a singleton?'
            ,   default:    false
            }
        ];

        this.prompt( prompts, function( props )
        {
            this.collectionName = props.collectionName;
            this.className      = props.collectionName.charAt(0).toUpperCase() + props.collectionName.slice(1);
            this.modelName      = props.modelName;
            this.modelClass     = props.modelName.charAt(0).toUpperCase() + props.modelName.slice(1);
            this.modelFileName  = varname.dash( this.modelName )
            this.description    = props.description;
            this.singleton      = props.singleton;

            this.fileName       = varname.dash( this.collectionName )

            callback();
        }.bind( this ) );
    }

,   createCollection: function()
    {
        this.template( "collection.coffee", "src/collections/" + this.fileName + ".coffee" );
    }
} );