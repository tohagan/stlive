// Sencha Touch App Tools
var path = require('path');

var create = require('../lib/create');
var live = require('../lib/live');
var serve = require('../lib/serve');
var settings = require('../lib/settings');

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
        console.log(appName + ' create [domain] [name] - Creates & builds a new Sencha Touch + PhoneGap project with "live edit" client added.');
        console.log('');
        console.log(appName + ' build                  - Compiles Sencha Touch + PhoneGap for each platform.');
        console.log(appName + ' run [platform ...]     - Compiles PhoneGap and installs app on emulators/devices.');
        console.log(appName + ' install [platform ...] - Installs app on emulators/devices.');
        console.log('');
        console.log(appName + ' add      - Adds "live edit" client to existing Sencha Touch or PhoneGap project.');
        console.log(appName + ' remove   - Removes "live edit" client from a project.');
        console.log(appName + ' update   - Updates "live edit" client with latest version.');
        console.log('');
        console.log(appName + ' serve [dir]  - Run "live edit" server in Sencha Touch or PhoneGap project directory.');
        console.log('');
        console.log(appName + ' version  - Display app name & version');
        console.log(appName + ' settings - Display configured options');
    },

    // Create new ST + PG project
    create: create,
    
    build: function(options) {
        runcmd(options.senchaCmd + ' app build native');
        console.log(("Completed building your app.").lightYellow);
    },
    
    run: function(options, platforms) {
        perPlatform('phonegap run', options, platforms);
    },
        
    install: function (options, platforms) {
        perPlatform('phonegap install', options, platforms);
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