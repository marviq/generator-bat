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
        this.log( yosay( "So you want an BAT collection?" ) );

        // Ask the user for the webapp details
        //
        var prompts = [
            {
                name:       "collectionName"
            ,   message:    "What's the name of this collection you so desire?"
            }
        ,   {
                name:       "description"
            ,   message:    "What's the description for this collection?"
            ,   default:    "No description"
            }
        ,   {
                name:       "modelName"
            ,   message:    "What's the model name for this collection"
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
            this.description    = props.description;
            this.singleton      = props.singleton;

            callback();
        }.bind( this ) );
    }

,   createCollection: function()
    {
        this.template( "collection.coffee", "src/collections/" + this.collectionName + ".coffee" );
    }
} );