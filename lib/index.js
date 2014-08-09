// Sencha Touch App Tools
var path = require('path');

var live  = require('./live');
var serve = require('./serve');

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

function NotImplemented() {
    console.log('This feature is not yet implemented.');
}

module.exports = {
    help: function(options) {
        if (options.version) {
            // allow --version as a command
            console.info(options.pkg.name + " " + options.pkg.version);
            return;
        }

        var appName = (options.pkg && options.pkg.name) || path.basename(process.argv[1]);
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

    version: function(options) { console.info(options.pkg.name + " " + options.pkg.version);  },
    settings: require('./settings'),
    create:   require('./create'),    // Create new ST + PG project
    build:    require('./build'),
    add:      wrapper(live, live.add),        // Add live client to project
    remove:   wrapper(live, live.remove),     // Remove live client from project
    update:   wrapper(live, live.update),     // Update live client to latest version
    sass:     { start: NotImplemented, stop: NotImplemented },
    serve:  serve,    // Run "Live Edit" App server
    server: serve     // Someone's sure to misspell it ... We forgive them :) .
};