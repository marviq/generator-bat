'use strict';

//
//  Yeoman bat app generator.
//

var Generator       = require( 'yeoman-generator' )
,   yosay           = require( 'yosay' )
,   youtil          = require( './../../lib/youtil.js' )
,   mkdirp          = require( 'mkdirp' )
,   chalk           = require( 'chalk' )
,   semver          = require( 'semver' )
,   tags            = require( 'language-tags' )
,   _               = require( 'lodash' )
;

var clean           = require( 'underscore.string/clean' );

//  Use a different delimiter when our template itself is meant to be a template or template-like.
//
var tpl_tpl_settings =
        {
            delimiter:      '@'
        }
;

class AppGenerator extends Generator
{
    constructor ()
    {
        super( ...arguments );

        this.description    = this._description( 'project and barebones app' );

        this.argument(
            'packageName'
        ,   {
                type:           String
            ,   required:       false
            ,   desc:           'The name of the app to create.'
            }
        );

        //  Also add 'packageName' as a - hidden - option, defaulting to the positional argument's value.
        //  This way `_promptsPruneByOptions()` can filter away prompting for the package name too.
        //
        this.option(
            'packageName'
        ,   {
                type:           String
            ,   desc:           'The name of the app to create.'
            ,   default:        this.packageName
            ,   hide:           true
            }
        );

        //  Normal options.
        //
        this.option(
            'description'
        ,   {
                type:           String
            ,   desc:           'The purpose of this app.'
            }
        );

        this.option(
            'authorName'
        ,   {
                type:           String
            ,   desc:           'The name of the main author creating this app.'
            }
        );

        this.option(
            'authorEmail'
        ,   {
                type:           String
            ,   desc:           'The email address of this author.'
            }
        );

        this.option(
            'authorUrl'
        ,   {
                type:           String
            ,   desc:           'An optional website URL identifying this author.'
            }
        );

        this.option(
            'copyrightOwner'
        ,   {
                type:           String
            ,   desc:           'The full name of the copyright owner of this app.'
            }
        );

        this.option(
            'i18n'
        ,   {
                type:           Boolean
            ,   desc:           'Whether this app should support internationalisation'
            }
        );

        this.option(
            'i18nLocaleDefault'
        ,   {
                type:           String
            ,   desc:           'The default locale for this app.'
            ,   alias:          'locale'
            }
        );

        this.option(
            'jqueryCdn'
        ,   {
                type:           Boolean
            ,   desc:           'Whether this app should load jQuery from a CDN (googleapis.com) instead of bundling it.'
            }
        );

        this.option(
            'jqueryExpose'
        ,   {
                type:           Boolean
            ,   desc:           'Whether this app should still expose jQuery on the global scope (relevant only when jQuery is bundled).'
            }
        );

        this.option(
            'ie8'
        ,   {
                type:           Boolean
            ,   desc:           'Whether this app should still support IE8.'
            }
        );

        this.option(
            'demo'
        ,   {
                type:           Boolean
            ,   desc:           'Whether the demonstration app should also be included.'
            }
        );
    }

    initializing ()
    {
        //  Load the BAT generator's 'package.json'.
        //
        this.pkg = require( './../../package.json' );

        //  Container for template expansion data.
        //
        this.templateData = {};
    }

    prompting ()
    {
        /* jshint laxbreak: true */

        //  Ask only those question that have not yet been provided with answers via the command line.
        //
        var prompts = this._promptsPruneByOptions(
                [
                    {
                        type:       'input'
                    ,   name:       'iKnowWhatImDoing'
                    ,   message:    chalk.redBright(
                                        chalk.inverse( ' Whoa there!!  It would appear that your target directory is not empty! ' )
                                    +   '  Type "YES" if you would like to proceed anyway.'
                                    )
                    ,   default:    ''
                    ,   validate:   ( iKnowWhatImDoing ) =>
                                    {
                                        if ( 'YES' === iKnowWhatImDoing ) { return true; }
                                        this.env.error( 'Bailing out' );
                                    }
                    ,   when:       !( this._isRootSafe() )
                    }
                 ,  {
                        type:       'input'
                    ,   name:       'packageName'
                    ,   message:    (
                                        'What is the name of this '
                                    +   chalk.green( 'app' )
                                    +   ' you so desire?'
                                    )
                    ,   default:
                            _.kebabCase(
                                youtil.definedToString( this.options.packageName )
                            ||  youtil.definedToString( this.appname )
                            )
                    ,   validate:   youtil.isNpmName
                    ,   filter:     ( value ) => ( _.kebabCase( _.trim( value )) )
                    }
                ,   {
                        type:       'input'
                    ,   name:       'description'
                    ,   message:    (
                                        'What is the '
                                    +   chalk.green( 'purpose' )
                                    +   ' (description) of this app?'
                                    )
                    ,   default:    youtil.definedToString( this.options.description )
                    ,   validate:   youtil.isNonBlank
                    ,   filter:     youtil.sentencify
                    }
                ,   {
                        type:       'input'
                    ,   name:       'authorName'
                    ,   message:    (
                                        'What is the name of the '
                                    +   chalk.green( 'main author' )
                                    +   ' creating this app?'
                                    )
                    ,   default:    ( youtil.definedToString( this.options.auhorName ) || youtil.definedToString( this.user.git.name() ))
                    ,   validate:   youtil.isNonBlank
                    ,   filter:     clean
                    }
                ,   {
                        type:       'input'
                    ,   name:       'authorEmail'
                    ,   message:    (
                                        'What is the '
                                    +   chalk.green( 'email address' )
                                    +   ' of this author?'
                                    )
                    ,   default:    ( youtil.definedToString( this.options.auhorEmail ) || youtil.definedToString( this.user.git.email() ))
                    ,   validate:   youtil.isNonBlank
                    ,   filter:     _.trim
                    }
                ,   {
                        type:       'input'
                    ,   name:       'authorUrl'
                    ,   message:    (
                                        'If any, what is the '
                                    +   chalk.green( 'website URL' )
                                    +   ' identifying this author?'
                                    )
                    ,   default:    ( youtil.definedToString( this.options.auhorUrl ) || '' )
                    ,   filter:     _.trim
                    }
                ,   {
                        type:       'input'
                    ,   name:       'copyrightOwner'
                    ,   message:    (
                                        'What is the full name of the '
                                    +   chalk.green( 'copyright owner' )
                                    +   ' of this app?'
                                    )
                    ,   default:    ( answers ) => (
                                        youtil.definedToString( this.options.copyrightOwner )
                                    ||  answers.authorName
                                    ||  this.templateData.authorName
                                    )
                    ,   validate:   youtil.isNonBlank
                    ,   filter:     _.trim
                    ,   store:      true
                    }
                ,   {
                        type:       'confirm'
                    ,   name:       'i18n'
                    ,   message:    (
                                        'Should this app support '
                                    +   chalk.green( 'internationalisation' )
                                    +   '?'
                                    )
                    ,   default:    false
                    }
                ,   {
                        type:       'input'
                    ,   name:       'i18nLocaleDefault'
                    ,   message:    (   'What is the '
                                    +   chalk.green( 'default locale' )
                                    +   ' for this app?'
                                    +   chalk.gray(
                                            ' - please use a valid '
                                        +   chalk.cyan( '[' )
                                        +   'BCP 47 language tag'
                                        +   chalk.cyan( '](' )
                                        +   chalk.blue( 'https://tools.ietf.org/html/bcp47#section-2' )
                                        +   chalk.cyan( ')' )
                                        +   '.'
                                        )
                                    )
                    ,   default:    ( youtil.definedToString( this.options.i18nLocaleDefault ) || 'en-US' )
                    ,   validate:   tags.check
                    ,   filter:     ( value )   => {
                                        if ( value !== 'en-US' )
                                        {
                                            this.log( chalk.magenta(
                                                '\n\n    If this locale differs from '
                                            +   chalk.bold.yellow( 'en-US' )
                                            +   ' in terms of its number-, money- or date formatting,'
                                            +   ' then be sure to verify/correct the generated '
                                            +  chalk.bold.yellow(
                                                    '\'src/i18n/'
                                                +   value
                                                +   '.json\''
                                                )
                                            +   ' localization file afterwards.\n'
                                            ));
                                        }
                                        return tags( value ).format();
                                    }
                    ,   when:       ( answers ) => ( answers.i18n || this.templateData.i18n )
                    }
                ,   {
                        type:       'confirm'
                    ,   name:       'jqueryCdn'
                    ,   message:    (
                                        'Should this app load '
                                    +   chalk.yellow( 'jQuery' )
                                    +   ' from a '
                                    +   chalk.green( 'CDN' )
                                    +   ' '
                                    +   chalk.gray( '(googleapis.com)' )
                                    +   ' instead of bundling it?'
                                    )
                    ,   default:    false
                    }
                ,   {
                        type:       'confirm'
                    ,   name:       'jqueryExpose'
                    ,   message:    (
                                        'Should this app expose '
                                    +   chalk.yellow( 'jQuery' )
                                    +   ' on the '
                                    +   chalk.green( 'global scope' )
                                    +   '?'
                                    +   chalk.gray( ' - Perhaps because some CDN loaded code expects it to be there.' )
                                    )
                    ,   default:    false
                    ,   when:       ( answers ) => !( answers.jqueryCdn || this.templateData.jqueryCdn )
                    }
                ,   {
                        type:       'confirm'
                    ,   name:       'ie8'
                    ,   message:    (
                                        'Should this app still support '
                                    +   chalk.green( 'IE8' )
                                    +   '?'
                                    +   chalk.gray( ' - affects the jQuery version and shims HTML5 and media query support.' )
                                    )
                    ,   default:    false
                    }
                ,   {
                        type:       'confirm'
                    ,   name:       'demo'
                    ,   message:    (
                                        'Would you like the '
                                    +   chalk.green( 'demo app' )
                                    +   ' now?'
                                    +   chalk.gray( ' - if not, you can always get it later through `' )
                                    +   chalk.yellow( 'yo bat:demo ' )
                                    +   chalk.gray( '`.' )
                                    )
                    ,   default:    false
                    }
                ]
            )
        ;

        if ( prompts.length )
        {
            //  Have Yeoman greet the user.
            //
            this.log( yosay( 'Welcome to BAT, the Backbone Application Template' ));

            return (
                this
                    .prompt( prompts )
                    .then( ( answers ) => { _.extend( this.templateData, answers ); } )
            );
        }
    }

    configuring ()
    {
        var data                            = this.templateData
        ,   locale
        ,   localeOverride
        ;

        if ( data.i18n )
        {
            locale                          = tags( data.i18nLocaleDefault );

            data.i18nLocaleDefaultLanguage  = locale.language().descriptions()[0];
            data.i18nLocaleDefaultRegion    = locale.region().format();
        }

        if ( data.jqueryCdn )
        {
            data.jqueryExpose               = false;
        }

        data.copyrightYear                  = new Date().getFullYear();
        data.packageDescription             = data.description;
        data.backbone                       = ( this.config.get( 'backbone' ) || { className: 'Backbone', modulePath: 'backbone' } );

        //
        //  Save a '.yo-rc.json' config file.
        //  At the very least this marks your project root for sub-generators.
        //
        //  Note that answers to prompts that have `store: true` defined aren't stored here, but in '~/.yo-rc-global.json'.
        //

        this.config.set(
            {
                'generator-version':        this.pkg.version

            ,   ie8:                        data.ie8
            ,   i18n:                       data.i18n
            ,   i18nLocaleDefault:          data.i18nLocaleDefault
            ,   jqueryCdn:                  data.jqueryCdn
            ,   jqueryExpose:               data.jqueryExpose

            ,   backbone:                   data.backbone
            }
        );

        if ( data.demo )
        {
            //
            //  Override some settings when a demo app is wanted right now; avoids conflicts.
            //  Do not persist them to the config here so that the demo generator is still able to warn about the changes.
            //

            //  The demo app needs internationalization.
            //
            localeOverride                  = tags( 'en-GB' );

            data.i18n                       = true;
            data.i18nLocaleDefault          = localeOverride.format();
            data.i18nLocaleDefaultLanguage  = localeOverride.language().descriptions()[0];
            data.i18nLocaleDefaultRegion    = localeOverride.region().format();

            //  The demo app needs jQuery to be exposed on the global scope for Bootstrap to find.
            //
            if ( !( data.jqueryCdn ))
            {
                data.jqueryExpose           = true;
            }
        }
    }

    writing ()
    {
        //  setupDirectoryStructure:
        //
        ( () =>
        {
            var data    = this.templateData
            ,   layout  =
                [
                    //  App source:

                    'src'
                ,   'src/apis'

                    //  Backbone:

                ,   'src/collections'
                ,   'src/mixins'
                ,   'src/models'
                ,   'src/views'

                    //  Style and Compass:

                ,   'src/sass'
                ,   'src/sass/overrides'
                ,   'src/sass/settings'
                ,   'src/sass/views'

                ,   'src/style'
                ,   'src/style/images/'
                ,   'src/style/images/debug/'
                ,   'src/style/images/sprites/'

                    //  Target environment settings:

                ,   'settings'

                    //  Testing:

                ,   'test'
                ,   'test/unit'
                ,   'test/unit/asset'
                ,   'test/unit/spec'
                ,   'test/unit/spec/collections'
                ,   'test/unit/spec/mixins'
                ,   'test/unit/spec/models'
                ,   'test/unit/spec/views'

                ,   'test-report'

                    //  Utils

                ,   'utils'
                ,   'utils/hbs'
                ,   'utils/hbs/helpers'
                ,   'utils/hbs/partials'

                    //  Third-party, external libraries:

                ,   'vendor'

                    //  Version-controlled git hooks

                ,   '.git/hooks'
                ,   '.git-hooks'
                ]
            ;

            //  Location for 'i' + 'nternationalisatio'.length + 'n' definitions:
            //
            //  https://github.com/marviq/madlib-locale#readme
            //

            if ( data.i18n )
            {
                layout.push( 'src/i18n' );
            }

            for ( var i=0, l=layout.length; i < l ; i++ )
            {
                mkdirp.sync( this.destinationPath( layout[ i ] ));
            }
        }
        )();

        //  setupProjectFiles:
        //
        ( () =>
        {
            var data        = this.templateData
            ,   templates   =
                [
                    //  Project

                    '@.editorconfig'
                ,   '@.gitattributes'
                ,   '@.gitignore'
                ,   '@.gitmessage'
                ,   '@.jshintrc'
                ,   [ '@AUTHORS' ]
                ,   '@CHANGELOG.md'
                ,   [ '@Gruntfile.coffee', tpl_tpl_settings ]
                ,   [ '@LICENSE' ]
                ,   [ '@README.md' ]
                ,   '@coffeelint.json'

                ,   [ '@package.json' ]

                    //  App source:

                ,   'src/apis/default.coffee'
                ,   [ 'src/apis/env.coffee' ]
                ,   [ 'src/collections/api-services.coffee' ]
                ,   'src/models/api-service.coffee'
                ,   'src/models/build-brief.coffee'
                ,   [ 'src/models/settings-environment.coffee' ]

                    //  App source for debug builds

                ,   'src/debug.backbone-debugger.coffee'
                ,   'src/views/debug.environment-ribbon.coffee'
                ,   'src/views/debug.environment-ribbon.hbs'

                    //  Utils

                ,   'src/utils/hbs/helpers/moment.coffee'

                    //  Style and Compass:

                ,   'src/sass/settings/_compass.sass'
                ,   'src/sass/settings/_fonts.sass'
                ,   'src/sass/settings/_icons.scss'
                ,   'src/sass/settings/_layout.sass'
                ,   'src/sass/_overrides.sass'
                ,   'src/sass/_settings.sass'
                ,   'src/sass/_views.sass'
                ,   [ 'src/sass/app.sass' ]
                ,   'src/style/images/debug/internals.jpg'
                ,   'src/style/images/sprites/check-green.png'

                    //  Style for debug builds

                ,   'src/sass/debug.sass'
                ,   'src/sass/views/_debug.environment-ribbon.sass'

                    //  Utils

                ,   'src/utils/hbs/helpers/moment.coffee'

                    //  Target environment settings:

                ,   'settings/@README.md'
                ,   [ 'settings/production.json' ]
                ,   [ 'settings/acceptance.json' ]
                ,   [ 'settings/testing.json' ]
                ,   [ 'settings/local.json' ]

                    //  Testing:

                ,   [ 'test/unit/init.coffee' ]
                ,   'test/unit/spec/models/settings-environment.spec.coffee'
                ,   'test/unit/spec/trivial.spec.coffee'

                    //  Version controlled git hook scripts.

                ,   '@.git-hooks/git-hook-on-npm-lockfile-change.sh'
                ]
            ;

            if ( !( data.demo ))
            {
                //
                //  Do not write these when a demo app is wanted right now; avoids conflicts.
                //

                templates.push(

                    //  The app main entry point:

                    [ 'src/app.coffee' ]
                ,   [ 'src/index.template.html', tpl_tpl_settings ]

                    //  Backbone:

                ,   [ 'src/router.coffee' ]

                ,   'src/sass/views/_index.sass'
                ,   [ 'src/views/index.coffee' ]
                ,   'src/views/index.hbs'
                );

                if ( data.i18n )
                {
                    //  Need a name mapping for this one
                    //
                    this._templatesProcess(
                        { 'src/i18n/bcp47-language-tag.json': [ 'src/i18n/' + data.i18nLocaleDefault + '.json' ] }
                    );
                }
            }

            if ( data.jqueryExpose )
            {
                templates.push(
                    'vendor/jquery-for-cdns-shim.coffee'
                );
            }

            this._templatesProcess( templates );

            //
            //  Symlink assets for Testing:
            //

            this._symLink( 'settings/testing.json', 'test/unit/asset/settings.json' );

            //
            //  Symlink git hooks:
            //

            this._symLink( '.git-hooks/git-hook-on-npm-lockfile-change.sh', '.git/hooks/post-checkout' );
            this._symLink( '.git-hooks/git-hook-on-npm-lockfile-change.sh', '.git/hooks/post-merge' );

        }
        )();

        //  setupDemo:
        //
        ( () =>
        {
            if ( this.templateData.demo )
            {
                this.log( chalk.bold(
                    '\n'
                +   'Composing in the '
                +   chalk.yellow( 'bat:demo' )
                +   ' generator...\n'
                ));

                this.composeWith( 'bat:demo' );
            }
        }
        )();
    }

    install ()
    {
        /* jshint laxbreak: true */

        var data = this.templateData
        ,   deps =
                [
                    'backbone'
                ,   'backbone.cocktail'
                ,   'bluebird'
                ,   ( 'jquery' + ( data.ie8 ? '@<2' : '' ))
                ,   'madlib-settings'
                ,   'moment'
                ,   'underscore'
                ]
        ,   devDeps =
                [
                    'browserify'
                ,   'browserify-shim'
                ,   'coffeeify@<3'
                ,   'coffee-script@<2'
                ,   'grunt'
                ,   'grunt-browserify'
                ,   'grunt-coffee-jshint@<2'
                ,   'grunt-coffeelint@<1'
                ,   'grunt-contrib-clean'
                ,   'grunt-contrib-compass'
                ,   'grunt-contrib-compress'
                ,   'grunt-contrib-copy'
                ,   'grunt-contrib-uglify'
                ,   'grunt-contrib-watch'
                ,   'grunt-contrib-yuidoc'
                ,   'grunt-karma'
                ,   'grunt-template'
                ,   'handlebars'
                ,   'hbsfy'
                ,   'jasmine-core'
                ,   'karma'
                ,   'karma-browserify'
                ,   'karma-jasmine'
                ,   'karma-phantomjs-launcher'
                ,   'phantomjs-prebuilt'
                ,   'standard-version'
                ,   'watchify'
                ]
        ;

        if ( data.i18n )
        {
            deps.push( 'madlib-locale' );
        }

        this.log( chalk.bold(
            '\n'
        +   'Running a number of "'
        +   chalk.yellow( 'npm install ' + chalk.cyan( '<package>' ) + ' --save' + chalk.cyan( '[' ) + '-dev' + chalk.cyan( ']' ))
        +   '"s for you to install required dependencies...\n'
        ));

        this.npmInstall( devDeps,   { saveDev:  true } );
        this.npmInstall( deps,      { save:     true } );
    }

    end ()
    {
        var assessGrunt
        ,   assessCompass
        ,   epilogue
        ;

        //  prune:
        //
        ( () =>
        {
            //  Get rid of any extraneous packages; perhaps left over from previous generator attemtps.
            //
            this.spawnCommandSync( 'npm', [ 'prune' ] );
        }
        )();

        //  intro:
        //
        ( () =>
        {
            /* jshint laxbreak: true */

            this.preReqIssues = 0;

            this.log(
                '\n'
            +   chalk.bold( 'I\m all done.\n' )

            +   '\n'
            +   chalk.bold(
                    'Please do not forget to checkout the ' + chalk.cyan( '[placeholder]' ) + ' sections in the "' + chalk.yellow( 'README.md' )
                +   '" for some further things you may want to set up.\n'
                )

            +   '\n'
            +   chalk.bold( 'But for now, you may invoke "' + chalk.yellow( 'grunt' ) + chalk.cyan( ' <arg>...' ) + '" to build your project.' )
            );
        }
        )();

        assessGrunt = () =>
        {
            return new Promise(
                ( done ) =>
                {
                    var error   = () =>
                        {
                            /* jshint laxbreak: true */

                            this.log(
                                '\n'
                            +   chalk.red( 'Hang on, it appears that "' + chalk.bold.yellow( 'grunt' ) + '" hasn\'t been installed yet!\n' )
                            +   '\n'
                            +   chalk.gray(
                                    'Consider running "'
                                +   chalk.bold.yellow( chalk.cyan( '[' ) + 'sudo ' + chalk.cyan( ']' ) + 'npm install -g grunt-cli' )
                                +   '" first.\n'
                                )
                            );

                            this.preReqIssues++;
                        }
                    ;

                    this.spawnCommand( 'command', [ '-v', 'grunt' ], { stdio: 'ignore' } )
                        .on( 'exit', ( exit ) =>
                            {
                                if ( exit ) { error(); }
                                done();
                            }
                        )
                    ;
                }
            );
        };

        assessCompass = () =>
        {
            return new Promise(
                ( done ) =>
                {
                    var minver  = '1.0.0'
                    ,   version = ''
                    ,   compass = chalk.bold.yellow( 'compass' )
                    ,   error   = ( nexist ) =>
                        {
                            /* jshint laxbreak: true */

                            var first = !( this.preReqIssues );

                            this.log(
                                '\n'
                            +   chalk.red(
                                    ( first ? 'Hang on,' : 'Oh, and' )
                                +   (   nexist
                                    ?   ' it appears that "' + compass + '" hasn\'t been installed ' + ( first ? 'yet' : 'either' ) + '!\n'
                                    :   ' your "' + compass + '" version appears outdated' + ( first ? '' : ' as well' ) + '! '
                                    +   'I found only ' + chalk.underline( version ) + ' and you\'ll need ' + chalk.underline( minver + ' or newer' ) + '.\n'
                                    )
                                )
                            +   '\n'
                            +   chalk.gray(
                                    'Consider running "'
                                +   chalk.bold.yellow( chalk.cyan( '[' ) + 'sudo ' + chalk.cyan( ']' ) + 'gem install compass' ) + '" '
                                +   ( first ? 'first' : 'too' ) + '.\n'
                                +   '\n'
                                +   'Or see: ' + chalk.blue( 'http://thesassway.com/beginner/getting-started-with-sass-and-compass#install-sass-and-compass\n' )
                                )
                            );

                            this.preReqIssues++;
                        }
                    ;

                    this.spawnCommand( 'command', [ 'compass', '-q', '-v' ], { stdio: [ 'ignore', 'pipe', 'ignore' ] } )
                        .on( 'exit', ( exit ) =>
                            {
                                version = _.trim( version );

                                if ( exit || !( semver.satisfies( version, '>=' + minver )) ) { error( exit ); }
                                done();
                            }
                        )
                        .stdout.on( 'data', ( chunk ) =>
                            {
                                version += chunk;
                            }
                        )
                    ;
                }
            );
        };

        epilogue = () =>
        {
            /* jshint laxbreak: true */

            this.log(
                '\n'
            +   ( this.preReqIssues ? 'In any case, h' : 'H' ) + 'ere\'s a quick reminder of common grunt idioms:\n'

            +   '\n'
            +   chalk.bold( '  * ' + chalk.yellow( 'grunt ' + chalk.cyan( '[' ) + 'default' + chalk.cyan( ']' ) + '     ' ))
            +   '- is a shortcut for ' + chalk.bold.yellow( 'grunt dist' ) + ' unless the ' + chalk.bold.yellow( 'GRUNT_TASKS' ) + ' environment '
            +   'variable specifies a space separated list of alternative tasks to run instead;\n'

            +   '\n'
            +   chalk.bold( '  * ' + chalk.yellow( 'grunt dist          ' ))
            +   '- does a for-production, non-debugging, all-parts, tested, minified build plus artifacts;\n'

            +   chalk.bold( '  * ' + chalk.yellow( 'grunt debug         ' ))
            +   '- does a for-testing, debugging, all-parts except documentation, tested, as-is build;\n'

            +   chalk.bold( '  * ' + chalk.yellow( 'grunt dev           ' ))
            +   '- does a for-local, debugging, all-parts except documentation, as-is build;\n'
            +   '                          (' + chalk.bold( 'Note that this variant doesn\'t exit.' ) + ' Instead, it\'ll keep a close watch on\n'
            +   '                          filesystem changes, selectively re-triggering part builds as needed)\n'

            +   '\n'
            +   chalk.bold( '  * ' + chalk.yellow( 'grunt doc           ' ))
            +   '- will build just the code documentation;\n'

            +   chalk.bold( '  * ' + chalk.yellow( 'grunt lint          ' ))
            +   '- will just lint your code;\n'

            +   chalk.bold( '  * ' + chalk.yellow( 'grunt test          ' ))
            +   '- will run your test suite;\n'

            +   chalk.bold( '  * ' + chalk.yellow( 'grunt test:dev      ' ))
            +   '- will run your test suite and will keep monitoring it for changes, triggering re-runs;\n'

            +   '\n'
            +   chalk.bold( '  * ' + chalk.yellow( 'grunt --help        ' ))
            +   '- will show you all of the above and the kitchen sink;\n'
            );
        };

        return assessGrunt().then( assessCompass ).then( epilogue );
    }
}

_.extend(
    AppGenerator.prototype
,   require( './../../lib/generator.js' )
);

module.exports = AppGenerator;
