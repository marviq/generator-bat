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
        this.log( yosay( "So you want an BAT model?" ) );

        // Ask the user for the webapp details
        //
        var prompts = [
            {
                name:       "modelName"
            ,   message:    "What's the name of this model you so desire? ( use camelcasing! )"
            }
        ,   {
                name:       "description"
            ,   message:    "What's the description for this model?"
            ,   default:    "No description"
            }
        ,   {
                type:       "confirm"
            ,   name:       "singleton"
            ,   message:    'Should this model be a singleton?'
            ,   default:    false
            }
        ];

        this.prompt( prompts, function( props )
        {
            this.modelName      = props.modelName;

            this.fileName       = varname.dash( this.modelName )

            // Class names start with a capital by convention
            //
            this.className      = props.modelName.charAt(0).toUpperCase() + props.modelName.slice(1);
            this.description    = props.description;
            this.singleton      = props.singleton;

            callback();
        }.bind( this ) );
    }

,   createModel: function()
    {
        this.template( "model.coffee", "src/models/" + this.fileName + ".coffee" );
    }
} );