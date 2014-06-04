var yeoman  = require( "yeoman-generator" );
var yosay   = require( "yosay" );
var path    = require( "path" );


// Get the current running directory name
//
var fullPath   = process.cwd();
var folderName = fullPath.split( "/" ).pop();


module.exports = yeoman.generators.Base.extend(
{
    askSomeQuestions: function ()
    {
        var callback = this.async();

        // Have Yeoman greet the user.
        //
        this.log( yosay( "Welcome to the BAT generator! (Backbone Application Template) \n Powered by Marviq" ) );

        // Ask the user for the webapp details
        //
        var prompts = [
            {
                name:       "packageName"
            ,   message:    "What is the name of this webapp?"
            ,   default:    folderName
            }
        ,   {
                name:       "packageDescription"
            ,   message:    "What is the purpose (description) of this webapp?"
            }
        ,   {
                name:       "mainName"
            ,   message:    "What is the main JavaScript file name of this webapp?"
            ,   default:    "index"
            }
        ,   {
                name:       "authorName"
            ,   message:    "What is your name?"
            ,   default:    this.user.git.username
            }
        ,   {
                name:       "authorEmail"
            ,   message:    "What is your email?"
            ,   default:    this.user.git.email
            }
        // ,   {
        //         name:       "bootstrap"
        //     ,   type:       "confirm"
        //     ,   message:    "Would you like some Twitter Bootstrap with that?"
        //     ,   default:    true
        //     }

        ,   {
                name:       "multiLanguage"
            ,   type:       "confirm"
            ,   message:    "Do you need multilanguage support?"
            ,   default:    false
            }
        ,   {
                name:       "ie8"
            ,   type:       "confirm"
            ,   message:    "Do you need IE8 and lower support? (Affects the jQuery version)"
            ,   default:    false
            }
        ];

        this.prompt( prompts, function( props )
        {
            this.packageName        = props.packageName;
            this.packageDescription = props.packageDescription;
            this.mainName           = props.mainName;
            this.authorName         = props.authorName;
            this.authorEmail        = props.authorEmail;
            this.bootstrap          = props.bootstrap;
            this.ie8                = props.ie8;
            this.multiLanguage      = props.multiLanguage;

            callback();
        }.bind( this ) );
    }

,   setupDirectoryStructure: function ()
    {
        // Create base folders
        //
        this.mkdir( "src"  );
        this.mkdir( "test" );

        // Create Backbone folders
        //
        this.mkdir( "src/models"        );
        this.mkdir( "src/collections"   );
        this.mkdir( "src/routers"       );
        this.mkdir( "src/views"         );

        // Create vendor library folder
        //
        this.mkdir( "src/vendor"        );

        // Create compass folders
        //
        this.mkdir( "src/sass"          );
        this.mkdir( "src/style"         );
        this.mkdir( "src/style/images"  );
        this.mkdir( "src/style/images/sprites"  );
    }


,   setupProjectFiles: function()
    {
        // Setup the config files for git, editor etc.
        //
        this.copy( "editorconfig",  ".editorconfig" );
        this.copy( "jshintrc",      ".jshintrc"     );
        this.copy( "gitignore",     ".gitignore"    );

        // Determine jQuery version
        //
        if( this.ie8 === true )
        {
            this.jQueryVersion = "1.11.1";
        }
        else {
            this.jQueryVersion = "2.1.1";
        }

        // write package.sjon and readme file
        //
        this.template( "_package.json",     "package.json" );
        this.template( "README.md",         "README.md"    );
        this.copy( "LICENSE",               "LICENSE"           );

        // Setup build, watch files etc
        //
        this.copy( "GruntFile.coffee",      "GruntFile.coffee"  );
        this.copy( "src/config.rb",         "src/config.rb" );
        this.copy( "watchify.sh",           "watchify.sh"   );

        // Setup the sass files
        //
        this.copy( "src/sass/app.sass",             "src/sass/app.sass" );
        this.copy( "src/sass/_settings.sass",       "src/sass/_settings.sass" );
        this.copy( "src/sass/_views.sass",          "src/sass/_views.sass" );
        this.copy( "src/sass/views/_index.sass",    "src/sass/views/_index.sass" );
        this.copy( "src/sass/check-green.png",      "src/style/images/sprites/check-green.png" );

        // Create index files
        //
        this.template( "src/index.html",    "src/index.html"   );
        this.copy( "src/index.coffee",      "src/" + this._.slugify( this.mainName ) + ".coffee" );

        // Setup the router
        //
        this.template( "src/router.coffee", "src/router.coffee" );

        // Copy index view
        //
        this.copy( "src/views/index.coffee",            "src/views/index.coffee" );
        this.copy( "src/views/index.hbs",               "src/views/index.hbs" );
        this.copy( "src/style/images/batman-logo.jpg",  "src/style/images/batman-logo.jpg" );
    }


,   install: function()
    {
        this.installDependencies();

        // if( this.bootstrap === true )
        // {
        //     this.bowerInstall( "git://github.com/twbs/bootstrap-sass.git", { save: true } );
        // }
    }
} );