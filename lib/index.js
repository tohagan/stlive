// Sencha Touch App Tools
var path = require('path');

var create   = require('./create');
var live     = require('./live');
var serve    = require('./serve');
var settings = require('./settings');
var dirs     = require('./dirs');

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

function NotImplemented() {
    console.log('This feature is not yet implemented.');
}

function perPlatform(action, options, platforms)
{
    var dirs = require('./dirs');
    dirs.init(false);

    // cd to 'phonegap' or 'cordova' dir
    process.chdir(dirs.pgDir);

    if (platforms.length === 0) {
        // default to run all project platforms
        platforms = fs.readdirSync('platforms');
    }

    platforms.forEach(function(platform) {
        var platDir = path.join('platforms', platform);
        if (!fs.existsSync(platDir)) throw platform + ": Platform not implemented in this project";

        var cmd = action + ' ' + platform;
        console.log(cmd.lightYellow);
        shell.exec(cmd);
    });
}

module.exports = {
    version: function(options) {
        console.info(options.pkg.name + " " + options.pkg.version); 
    },

    settings: settings,
    
    help: function(options) {
        var appName = (options.pkg && options.pkg.name) || path.basename(process.argv[1]);
        if (options.version) return;  // allow --version
        console.log(appName + ' version  - Show app name & version');
        console.log(appName + ' settings - Show configured settings');
        console.log('');
        console.log(appName + ' create [--run] [domain] [name] - Creates & builds new "live edit" Sencha Touch native project.');
        console.log(appName + ' build  [--run]                 - Rebuilds app.  --run = deploy/run on devices.');
        console.log('');
        console.log(appName + ' add    - Adds "live edit" client to existing Sencha Touch or PhoneGap project.');
        console.log(appName + ' remove - Removes "live edit" client from a project.');
        console.log(appName + ' update - Updates "live edit" client in a project with latest version from installed stlive app.');
        console.log('');
        console.log(appName + ' serve [dir]  - Run "live edit" server in Sencha Touch or PhoneGap project directory.');
    },

    // Create new ST + PG project
    create: create,
    
    build: function(options, platforms) {
        dirs.init(false);

        if (dirs.isSencha()) {
            if (options.run) {
                runcmd(options.senchaCmd + ' app build -run native');
            } else {
                runcmd(options.senchaCmd + ' app build native');
            }
        } else {
            perPlatform('phonegap run', options, platforms);
        }
        console.log(("Completed building your app.").lightYellow);
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