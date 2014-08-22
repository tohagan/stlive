// Sencha Touch App Tools
var path = require('path');
require('terminal-colors');

var live   = require('./live');
var serve  = require('./serve');
var bgTask = require('./bgtask');

// Wrapper calls
function wrapper(scope, method)
{
    return function(options, args) {
        method.call(scope, options, args);

        console.info("Now rebuild using ...".lightGreen);
        console.info(("$ " + options.cmd + " app build native").lightGreen);
    };
}

var usage = [
    'create [[domain] name] - Create & build new "live edit" Sencha Touch native project',
    '   --run  Deploy & run app on attached devices/emulators',
    '',
    'build  - Recompiles app.',
    '   --run  Deploy & run app on attached devices/emulators',
    '',
    'add             - Adds "live edit" client to existing Sencha Touch or PhoneGap project',
    'remove          - Removes "live edit" client from a project',
    'update          - Updates "live edit" client in a project with latest version from installed stlive app',
    '',
    'sass            - Run SASS compiler. Compiles resources/sass/*.scss => resources/css/app.css',
    'serve [dir]     - Run "live edit" server in Sencha Touch or PhoneGap project directory',
    '   --port port   Socket port number. Defaults to 3000',
    '   --localtunnel Connects to <random>.localtunnel.me',
    '   --sass        Runs SASS compiler beside the ST Live Server',
    '   --qr          Displays QR code of server address',
    '',
    'settings show   - Show configured settings',
    'settings diff [file] - Compare package and user settings (or a local settings file)',
    'version         - Show app name & version',
    '',
    ' Refer to the ~/.stlive.json file for other command line options.'
];

function help(options) {
    if (options.version) {
        // allow --version as a command
        console.info(options._pkg.name + " " + options._pkg.version);
        return;
    }

    var appName = (options._pkg && options._pkg.name) || path.basename(process.argv[1]);
    usage.forEach(function (line) {
        if (line.length > 0 && line[0] != ' ' ) line = appName + ' ' + line;
        console.log(line);
    });
}

// All command functions ...
//  * Accept the option parameter that contain all configuration and command line and package properties
//  * Are synchronous and report errors by throwing exceptions
module.exports = {
    help: help,
    version: function(options) { console.info(options._pkg.name + " " + options._pkg.version);  },
    settings: require('./settings'),
    create:   require('./create'),    // Create new ST + PG project
    build:    require('./build'),
    add:      wrapper(live, live.add),        // Add live client to project
    remove:   wrapper(live, live.remove),     // Remove live client from project
    update:   wrapper(live, live.update),     // Update live client to latest version
    sass:     bgTask.bind(bgTask, 'sass', null),
    serve:    serve,    // Run "Live Edit" App server
    server:   serve,    // Someone's sure to misspell it ... We forgive them :) .
};