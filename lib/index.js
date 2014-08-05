// Sencha Touch App Tools
var path = require('path');

var create = require('../lib/create');
var live = require('../lib/live');
var serve = require('../lib/serve');
var shell = require('shelljs');
var fs = require('fs');
require('terminal-colors');

// Wrapper calls
function wrapper(scope, method) 
{
    return function(options, args) {
        method.call(scope, options, args);

        console.info("Now rebuild using ...".lightGreen);
        console.info(("$ " + options.senchaCmd + " app build native").lightGreen);
    };
}

// All command methods are synchronous and report errors by throwing exceptions.

function runcmd(cmd) {
    console.log(cmd.lightYellow);
    shell.exec(cmd);
}

function NotImplemented(options) {
    console.log('This feature is not yet implemented.');
}

module.exports = {
    version: function(options) {
        console.info(options.pkg.name + " " + options.pkg.version); 
    },

    settings: function(options) {
        console.info((options.pkg.name + " " + options.pkg.version).lightYellow); 
        // hide package properties
        delete options.pkg;
        delete options._pkg;
        delete options._;
        console.info(options);
        console.info('');        
        var configFile = (process.platform === "win32") ? '%USERPROFILE%\\.stlive.config' : '~/.stlive.config';
        console.info(("Edit " + configFile + " to configure app settings.").lightYellow); 
    },
    
    help: function(options) {
        var appName = (options.pkg && options.pkg.name) || path.basename(process.argv[1]);
        console.log(appName + ' create [domain] [name] - Creates & builds a new Sencha Touch + PhoneGap project with "live edit" client added.');
        console.log(appName + ' build    - Rebuilds Sencha Touch native apps for each platform.');
        console.log(appName + ' run [platform] - Deploys to ALL or one platform emulator.');
        console.log(appName + ' add      - Adds "live edit" client to existing Sencha Touch or PhoneGap project.');
        console.log(appName + ' remove   - Removes "live edit" client from a project.');
        console.log(appName + ' update   - Updates "live edit" client with latest version.');
        console.log(appName + ' serve [dir]  - Runs "live edit" server for Sencha Touch or PhoneGap project. Optionally specify a project directory.');
        console.log(appName + ' version  - Display app name & version');
        console.log(appName + ' settings - Display configured options');
    },

    // Create new ST + PG project
    create: create,
    
    build: function(options) {
        runcmd(options.senchaCmd + ' app build native');
        console.log(("Completed building your '" + options.appDomain + "." + options.appName + "' app.").lightYellow);
    },
    
    run: function(options, platform) {
        var dirs = require('./dirs');
        dirs.init(false);

        process.chdir(dirs.pgDir);

        var platformsDir = path.join(dirs.pgDir, platform);
        var platforms = platform ? [platform] : fs.readdirSync(platformsDir);
        platforms.forEach(function(plat) {
            var platDir = path.join(dirs.pgDir, plat);
            if (!fs.existsSync(platDir)) throw plat + ": Platform not implemented in this project";
            
            runcmd('phonegap run ' + platform);            
        });
    },

    // Add live client to project
    add: wrapper(live, live.add),

    // Remove live client from project
    remove: wrapper(live, live.remove),

    // Update live client to latest version
    update: wrapper(live, live.update),
    
    sass: {
        start: NotImplemented,
        stop: NotImplemented
    },
    
    // Run "Live Edit" App server
    serve: serve,
    server: serve   // Someone's sure to misspell it :) .
};