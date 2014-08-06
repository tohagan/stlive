/*
 * Copyright (C) 2014 Anthony M. J. O'Hagan  tony@ohagan.name
 *
 * Creates a new Sencha Touch app + PhoneGap 3.x + Embedded Phone Gap App 
 */

require('terminal-colors');
var fs = require('fs');
var shell = require('shelljs');
var path = require('path');

function logit(msg, highlight) {
    console.info(highlight === true ? msg.lightYellow : msg.lightGreen);
}

// Lib Resource directories
function copyDir(fromDir, toDir, highlight) {
    logit('Copying: ' + path.resolve(fromDir) + '\n     to: ' + path.resolve(toDir) + "\n", highlight);
    shell.cp('-rf', fromDir, toDir);
}

function copyFile(fromFile, toFile, highlight) {
    logit('Copying: ' + path.resolve(fromFile) + '\n     to: ' + path.resolve(toFile) + "\n", highlight);    
    fs.writeFileSync(toFile, fs.readFileSync(fromFile, 'utf8'), 'utf8');
}

function removeDir(dir) {
    console.log("Removing file: " + dir);
    shell.rm('-fr', dir);
}

function removeFile(file) {
    console.log("Removing directory: " + file);
    shell.rm('-f', file);
}

function moveFile(fromFile, toFile, highlight) {
    logit('Moving: ' + path.resolve(fromFile) + '\n     to: ' + path.resolve(toFile) + "\n", highlight);
    shell.mv('-f', fromFile, toFile);
}

module.exports = {
    // Also called by 'create' command
    add: function() {
        var dirs = require('./dirs');
        dirs.init(false);

        if (!fs.existsSync(dirs.liveDir)) {
            console.log("Adding Live App to: " + dirs.liveDir);
            copyDir(path.join(dirs.resDir, "live"), dirs.wwwDir);
            copyFile(path.join(dirs.resDir, 'start.html'), path.join(dirs.wwwDir, 'start.html'));
        }

        if (!fs.existsSync("config.xml")) {
            throw process.cwd() + ": Failed to find 'config.xml' file in current directory.";
        }

        // Copy original config.xml -> config.orig.xml if none exists
        if (!fs.existsSync('config.orig.xml')) {
            console.log("\nMaking a backup copy of config.xml");
            copyFile('config.xml', 'config.orig.xml');
        }

        // Create initial config.live.xml if none exists
        if (!fs.existsSync('config.live.xml')) {
            copyFile(path.join(dirs.resDir, 'config.live.xml'), 'config.live.xml');
        }

        copyFile('config.live.xml', 'config.xml', true);
    },

    remove: function() {
        var dirs = require('./dirs');
        dirs.init(false);

        if (!fs.existsSync('config.orig.xml')) throw "Failed to find 'config.orig.xml' file require to rollback changes";

        console.log("Removing Live App from\n  " + dirs.liveDir.lightYellow);
        removeDir(dirs.liveDir);
        removeFile(path.join(dirs.wwwDir, 'start.html'));

        console.log("\nRestoring original config.xml");
        moveFile('config.orig.xml', 'config.xml', true);
    },
    
    update: function() {
        var dirs = require('./dirs');
        dirs.init(false);
        
        if (!fs.existsSync('config.orig.xml')) throw "Failed to find 'config.orig.xml' file. Have you added 'live' app yet?";
        if (!fs.existsSync(dirs.liveDir)) throw dirs.liveDir + ": Failed to find live app directory. Have you added 'live' app yet?";
        
        console.log("Updating config.live.xml: " + dirs.liveDir);
        copyFile(path.join(dirs.resDir, 'config.live.xml'), 'config.live.xml');

        console.log("Updating Live App to: " + dirs.liveDir);
        removeDir(dirs.liveDir);
        copyDir(path.join(dirs.resDir, "live"), dirs.wwwDir);
        copyFile(path.join(dirs.resDir, 'start.html'), path.join(dirs.wwwDir, 'start.html'));

        copyFile('config.live.xml', 'config.xml', true);
    }
};
