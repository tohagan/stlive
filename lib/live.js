/*
 * Copyright (C) 2014 Anthony M. J. O'Hagan  tony@ohagan.name
 *
 * Creates a new Sencha Touch app + PhoneGap 3.x + Embedded Phone Gap App
 */

require('terminal-colors');
var assert = require('assert');
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
    console.log("Removing directory: " + dir);
    shell.rm('-fr', dir);
}

function removeFile(file) {
    console.log("Removing file: " + file);
    shell.rm('-f', file);
}

function moveFile(fromFile, toFile, highlight) {
    logit('Moving: ' + path.resolve(fromFile) + '\n     to: ' + path.resolve(toFile) + "\n", highlight);
    shell.mv('-f', fromFile, toFile);
}

//// Same as inp.replace(pattern, repl) but with logging and asserts
//function replace(inp, pattern, repl)
//{
//    //console.log('\nReplace', pattern, repl);
//    assert.ok(inp.match(pattern), pattern + ": Failed to find pattern");
//    var out = inp.replace(pattern, repl);
//    //console.log(' => ', out);
//    return out;
//}


// config.xml with LIVE ON ...

//    <!-- LIVE:ON:BEGIN -->
//    <access origin="*" />
//    <content src="start.html" />
//    <!-- LIVE:ON:END -->
//
//    <!-- LIVE:OFF:BEGIN
//    <content src="index.html" />
//         LIVE:OFF:END -->

// config.xml with LIVE OFF ...

//    <!-- LIVE:ON:BEGIN
//    <access origin="*" />
//    <content src="start.html" />
//         LIVE:ON:END -->
//
//    <!-- LIVE:OFF:BEGIN -->
//    <content src="index.html" />
//    <!-- LIVE:OFF:END -->

function setLive(dirs, isLive) {
    var configXml = path.join(dirs.srcDir, 'config.xml');
    var configXmlBackup = path.join(dirs.srcDir, 'config.xml.bak');

    if (!fs.existsSync(configXml)) {
        throw configXml + ": File not found.";
    }

    console.log();
    console.log(configXml +  'Updating config.xml to be LIVE:' + (isLive ? 'ON' : 'OFF'));

    var xml = fs.readFileSync(configXml, 'utf8');

    if (!xml.match(/start\.html/)) {  // First time?
        copyFile(configXml, configXmlBackup);  // keep a back up of original file.

        var insertFile = path.join(__dirname, '..', 'res', 'config.live.insert');
        var insertText = fs.readFileSync(insertFile, 'utf8');

        // insertText contains a $& that replaces 1st access origin rule
        xml = xml.replace(/.*<access origin="[^"]*".*/, insertText);
    }

    xml = xml.replace(/(<!-- LIVE:ON:BEGIN).*/,  (isLive ? '$1 -->' : '$1'));
    xml = xml.replace(/.*(LIVE:ON:END -->)/    , (isLive ? '    <!-- $1': '         $1'));
    xml = xml.replace(/(<!-- LIVE:OFF:BEGIN).*/, (isLive ? '$1': '$1 -->'));
    xml = xml.replace(/.*(LIVE:OFF:END -->)/   , (isLive ? '         $1': '    <!-- $1'));

    fs.writeFileSync(configXml, xml, 'utf8');
}

module.exports = {

    // Also called by 'create' command
    add: function(options) {
        var dirs = require('./dirs');
        dirs.init(false);

        if (!fs.existsSync(dirs.liveDir)) {
            console.log("Adding Live App to: " + dirs.liveDir);
            copyDir(path.join(dirs.resDir, "live"), dirs.wwwDir);
            var startHtml = path.join(dirs.wwwDir, 'start.html');
            copyFile(path.join(dirs.resDir, 'start.html'), startHtml);
            shell.sed('-i', /Your App/, "Run " + options.appName, startHtml);
        }

        setLive(dirs, true);
    },

    remove: function(options) {
        var dirs = require('./dirs');
        dirs.init(false);

        if (!fs.existsSync(dirs.liveDir)) throw dirs.liveDir + ": Failed to find live app directory. Have you added 'live' app yet?";

        console.log("Removing Live App from\n  " + dirs.liveDir.lightYellow);
        removeDir(dirs.liveDir);
        removeFile(path.join(dirs.wwwDir, 'start.html'));

        setLive(dirs, false);
    },

    update: function(options) {
        var dirs = require('./dirs');
        dirs.init(false);

        this.remove(options);
        this.add(options);
    }
};
