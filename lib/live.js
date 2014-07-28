/*
 * Copyright (C) 2014 Anthony M. J. O'Hagan  tony@ohagan.name
 *
 * Creates a new Sencha Touch app + PhoneGap 3.x + Embedded Phone Gap App 
 */

require('terminal-colors');
var fs = require('fs');
var shell = require('shelljs');
var path = require('path');

// Lib Resource directories
function copy(opts, fromFile, toFile, highlight) {
    var msg = 'Copying: ' + path.resolve(fromFile) + '\n     to: ' + path.resolve(toFile) + "\n";
    if (highlight === true) {
        console.info(msg.lightYellow);
    } else {
        console.info(msg.lightGreen);
    }
    shell.cp(opts, fromFile, toFile);
}

module.exports = {
    add: function() {
        var dirs = require('./dirs');
        dirs.init();

        if (!fs.existsSync(dirs.liveDir)) {
            console.log("Adding Live App to: " + dirs.liveDir);
            copy('-r', path.join(dirs.resDir, "live"), dirs.wwwDir);
            copy('-f', path.join(dirs.resDir, 'start.html'), dirs.wwwDir);
        }

        if (!fs.existsSync("config.xml")) {
            throw process.cwd() + ": Failed to find 'config.xml' file in current directory.";
        }

        // Copy original config.xml -> config.orig.xml if none exists
        if (!fs.existsSync('config.orig.xml')) {
            console.log("\nMaking a backup copy of config.xml");
            copy('', 'config.xml', 'config.orig.xml');
        }

        // Create initial config.live.xml if none exists
        if (!fs.existsSync('config.live.xml')) {
            copy('', path.join(dirs.resDir, 'config.live.xml'), 'config.live.xml');
        }

        copy('-f', 'config.live.xml', 'config.xml', true);
    },

    remove: function() {
        var dirs = require('./dirs');
        dirs.init();

        if (!fs.existsSync('config.orig.xml')) throw "Failed to find 'config.orig.xml' file require to rollback changes";

        console.log("Removing Live App from\n  " + dirs.liveDir.lightYellow);
        shell.rm('-fr', dirs.liveDir);
        shell.rm('-f',  path.join(dirs.wwwDir, 'start.html'));

        console.log("\nRestoring original config.xml");
        copy('-f', 'config.orig.xml', 'config.xml', true);
    },
    
    update: function() {
        var dirs = require('./dirs');
        dirs.init();
        
        if (!fs.existsSync('config.orig.xml')) throw "Failed to find 'config.orig.xml' file require to perform an update of 'live' app";
        if (!fs.existsSync(dirs.liveDir)) throw dirs.liveDir + ": Failed to find directory required to perform an update of the 'live' app";
        
        console.log("Updating config.live.xml: " + dirs.liveDir);
        copy('', path.join(dirs.resDir, 'config.live.xml'), 'config.live.xml');

        console.log("Updating Live App to: " + dirs.liveDir);
        shell.rm('-fr', dirs.liveDir);
        copy('-r', path.join(dirs.resDir, "live"), dirs.wwwDir);
        copy('-f', path.join(dirs.resDir, 'start.html'), dirs.wwwDir);

        copy('-f', 'config.live.xml', 'config.xml', true);
    }
};

//function changeStartPage(optionsXml) {
//    optionsXml = path.resolve(optionsXml);
//    if (!fs.existsSync(optionsXml)) throw optionsXml + ": Failed to find file";
//    
//    console.log(("Updating " + optionsXml).lightGreen);
//    
//    // Ensure LIVE App can load from any IP origin
//    shell.sed ('-i', /<access origin=".*"\/>.*/, '<access origin="*"/>', optionsXml);
//
//    // Modify PhoneGap to start at 'start.html'
//    shell.sed ('-i', '</widget>', '\t<content src="start.html" />\n$&', optionsXml);
//}

//function removeLive(wwwdir) {
//    
//    if (!fs.existsSync(wwwdir)) throw path.resolve(wwwdir)   + ": Failed to find directory";
//    
//    shell.cp('config.live.xml', 'config.xml');
//}

//            //shell.mkdir('-p', 'phonegap/www');
//            shell.cp ('-r', liveDirRes, 'phonegap/www');
//            shell.cp (path.join(liveDirRes, '../start.html'), 'phonegap/www');
//
//        //    // start.html links to live.html and index.html
//        //    var json = [
//        //    '   "html": [',
//        //    '	    {',
//        //    '           "path": "start.html",',
//        //    '           "remote": true',
//        //    '       },',
//        //    '       {',
//        //    '           "path": "live.html",',
//        //    '           "remote": true',
//        //    '       }',
//        //    '   ],',
//        //    ''
//        //    ];
//
//        //    // Add start.html and live.html to Sencha build
//        //    shell.sed ('-i', /.*"js":/, json.join('\n') + '$&', 'app.json');
//
//            // Ensure LIVE App can load from any IP origin
//            shell.sed ('-i', /<access origin=".*"\/>.*/, '<access origin="*"/>', 'config.xml');
//
//            // Modify PhoneGap to start at 'start.html'
//            shell.sed ('-i', '</widget>', '\t<content src="start.html" />\n$&', 'config.xml');
