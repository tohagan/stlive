// Sencha Touch App Tools
var path = require('path');

var create = require('../lib/create');
var live = require('../lib/live');
var serve = require('../lib/serve');
    
module.exports = {    
    // CLI commands
    version: function(options) {
        console.info(options.pkg.name + " " + options.pkg.version); 
    },
    settings: function(options) {
        console.info(options);
    },
    help: function(options) {
        var appName = (options.pkg && options.pkg.name) || path.basename(process.argv[1]);
        console.log(appName + ' create [domain] [AppName] - Creates and compiles a new Sencha Touch / PhoneGap 3.x app. Adds live update client.');
        console.log(appName + ' live add    - Add embedded live update client to existing Sencha Touch or PhoneGap project.');
        console.log(appName + ' live remove - Removes live update client from a Sencha Touch or PhoneGap project.');
        console.log(appName + ' live update - Updates live update client with latest version.');
        console.log(appName + ' serve       - Runs live update server for Sencha Touch or PhoneGap project.');
        console.log(appName + ' version     - Display app name & version');
        console.log(appName + ' settings    - Display configured options');
    },

    // LIB commands
    create: create,

    live: {
        // Add live client to project
        add: function(options) { 
            live.add();

            console.info("Now rebuild using ...".lightGreen);
            console.info(("$ " + options.senchaCmd + " app build native").lightGreen);
        },

        // Remove live client from project
        remove: function(options) {
            live.remove();

            console.info("Now rebuild using ...".lightGreen);
            console.info(("$ " + options.senchaCmd + " app build native").lightGreen);
        },

        // Update live client to latest version
        update: function(options) {
            live.update();

            console.info("Now rebuild using ...".lightGreen);
            console.info(("$ " + options.senchaCmd + " app build native").lightGreen);
        }

    },
    serve: serve,
    server: serve   // Someone's sure to misspell it :) .
};