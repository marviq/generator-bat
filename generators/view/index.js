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
        this.log( yosay( "So you want an BAT view?" ) );

        // Ask the user for the webapp details
        //
        var prompts = [
            {
                name:       "viewName"
            ,   message:    "What's the name of this view you so desire?"
            }
        ,   {
                name:       "description"
            ,   message:    "What's the description for this view?"
            ,   default:    "No description"
            }
        ,   {
                type:       "confirm"
            ,   name:       "sassFile"
            ,   message:    'Would you like an SASS file for this view?'
            ,   default:    true
            }
        ];

        // Ask the question and when done make answers available
        // on the this scope. This way they are reachable in the template
        // function for example
        //
        this.prompt( prompts, function( props )
        {
            this.viewName       = props.viewName;

            // Classnames are uppercase by convention
            //
            this.className      = props.viewName.charAt( 0 ).toUpperCase() + props.viewName.slice( 1 );

            // Whether the user wants a sass file or not
            //
            this.sassFile       = props.sassFile;

            // Call the callback so yeoman knows this async function is done
            //
            callback();

        }.bind( this ) );
    }

,   createView: function()
    {
        // Create the views coffee file and handlebars template file
        //
        this.template( "view.hbs", "src/views/" + this.viewName + ".hbs"  );
        this.template( "view.coffee", "src/views/" + this.viewName + ".coffee" );

        // Check if a sass file should be created for this view
        //
        if( this.sassFile === true )
        {
            // Create the sass file with the same name as the view
            //
            this.template( "view.sass", "src/sass/views/_" + this.viewName + ".sass" );

            // Read in the _views.sass file so we can add the import statement
            // for the newly created sass file
            //
            var views   = this.readFileAsString( "src/sass/_views.sass" )
            ,   insert  = '@import "views/_' + this.viewName;

            // Check if there isn't already in import for this file
            // just in case....
            //
            if( views.indexOf( insert ) === -1 )
            {
                this.write( "src/sass/_views.sass", views + "\n" + insert );
            }
        }
    }
} );