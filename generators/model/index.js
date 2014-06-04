var yeoman  = require( "yeoman-generator" );
var yosay   = require( "yosay" );
var path    = require( 'path' );


// Get the current running directory name
//
var fullPath   = process.cwd();
var folderName = fullPath.split( '/' ).pop();


module.exports = yeoman.generators.Base.extend(
{
    askSomeQuestions: function ()
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
            ,   message:    "What's the name of this model you so desire?"
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
        this.template( "model.coffee", "src/models/" + this.modelName + ".coffee" );
    }
} );