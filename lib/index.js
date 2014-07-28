// Sencha Touch App Tools
var path = require('path');

var create = require('../lib/create');
var live = require('../lib/live');
var serve = require('../lib/serve');
var shell = require('shelljs');

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

module.exports = {    
    version: function(options) {
        console.info(options.pkg.name + " " + options.pkg.version); 
    },

    settings: function(options) {
        console.info(options);
    },
    
    help: function(options) {
        var appName = (options.pkg && options.pkg.name) || path.basename(process.argv[1]);
        console.log(appName + ' create [domain] [name] - Creates & builds a new Sencha Touch + PhoneGap project with "live edit" client added.');
        console.log(appName + ' build    - Rebuilds Sencha Touch native apps.');
        console.log(appName + ' add      - Adds "live edit" client to existing Sencha Touch or PhoneGap project.');
        console.log(appName + ' remove   - Removes "live edit" client from a project.');
        console.log(appName + ' update   - Updates "live edit" client with latest version.');
        console.log(appName + ' serve    - Runs live edit server for Sencha Touch or PhoneGap project.');
        console.log(appName + ' version  - Display app name & version');
        console.log(appName + ' settings - Display configured options');
    },

    // Create new ST + PG project
    create: create,
    
    build: function(options) {
        var cmd = options.senchaCmd + ' app build native';
        console.log(cmd.lightYellow);
        shell.exec(cmd);
        console.log(("Completed building your '" + options.appDomain + "." + options.appName + "' app.").lightYellow);
    },

    // Add live client to project
    add: wrapper(live, live.add),

    // Remove live client from project
    remove: wrapper(live, live.remove),

    // Update live client to latest version
    update: wrapper(live, live.update),
    
    // Run "Live Edit" App server
    serve: serve,
    server: serve   // Someone's sure to misspell it :) .
};