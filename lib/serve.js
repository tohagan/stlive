/*
 * Copyright (C) 2014 Anthony O'Hagan  tony@ohagan.name
 *
 * Runs a customised PhoneGap App server for a Sencha Touch App.
 */

require('terminal-colors');
var path = require('path');
var fs = require('fs');
var server = require('connect-phonegap');
var dirs = require('./dirs');
var bgTask = require('./bgtask');
var qrcode = require('qrcode-terminal');

// Configure .www and .www_<platform> server options
function addServerOptions(options) {
    dirs.init(true);    // flag allows server to start in either Sencha or PhoneGap folders
    options.vdir = {};

    if (dirs.isSencha()) {
        options.vdir.www = ".";   // Non platform source files
        options.watches = options.watch.sencha;
    } else if (dirs.isPhoneGapOrCordova()) {
        options.vdir.www = "www"; // Non platform source files
        options.watches = options.watch.cordova;
        if (options.sass) {
            console.warn('[sass]'.lightGreen + ' SASS Compiler is only with Sencha projects'.yellow);
            options.sass = false;
        }
    } else {
        console.error("You need to start the server in a Sencha Touch or PhoneGap project directory".lightRed);
        return;
    }

    // PhoneGap/Cordova platforms configured
    var platformsDir = path.join(dirs.pgDir, 'platforms');
    fs.readdirSync(platformsDir).forEach(function(platform) {
        var wwwPlatformDir = path.join(dirs.pgDir, 'platforms', platform, platform === "android" ? 'assets/www' : 'www');
        options.vdir[platform] = wwwPlatformDir;
        if (!fs.existsSync(wwwPlatformDir)) {
            console.warn(wwwPlatformDir.lightGreen + (": Cannot find " + platform + " platform directory").lightYellow);
        }
    });

    return options;
}

function startBgTasks(options, cb) {
    if (options.sass) {
        options.noctrlc = true; // Suppress Ctrl-C message from SASS compiler
        bgTask('sass', cb, options);
    } else {
        cb();
    }
}

module.exports = function(options, args) {
    if (args.length > 0) options.dir = args.shift();
    if (options.dir) {
        if (!fs.existsSync(options.dir)) throw options.dir + ": Directory not found";
        process.chdir(options.dir);
    }

    options = addServerOptions(options);  // Must be *after* chdir() and before startBgTasks()

    startBgTasks(options, function() {

        // All paths except platform/plugin JS files are relative to cwd.
        console.log(('Starting in ' + process.cwd() + ' ... ').lightGreen);

        var reloads = 0;

        server.listen(options)
            .on('error', function(err) {
                if (err.code === 'EADDRINUSE') {
                    console.log(("Socket port " + options.port + " is already in use.").lightRed);
                    console.log("Stop the other server or select a different port via:".lightGreen);
                    console.log(("--port port option OR set port in ~/.stlive.config").lightGreen);
                } else {
                    console.log(err.message.lightRed);
                }
            })
            .on('warn', function(err) {
                console.log(err.message.lightYellow);
            })
            .on('log', function(msg, url, staticpath) {
                if (url == '/__api__/autoreload') {
                    if (options.debug) process.stdout.write('\033[0G[debug] Reloads: ' + ('' + reloads++).lightGreen);
                } else {
                    // Display QR code for server end point
                    if (options.qr && (msg === 'listening on' || msg === 'localtunnel :')) {
                        qrcode.generate(url);
                    }

                    if (reloads > 0) { console.log(); }
                    var statusCode = msg;
                    if (url) { msg += ' ' + url; }
                    if (statusCode != 200 || /^\/app/.test(url)) { msg = msg.lightYellow; }
                    console.log(msg);

                    if (staticpath) {
                        console.log('  ' + staticpath.lightGreen);
                    }
                    reloads = 0;
                }
            })
            .on('complete', function(data) {
                console.log('\nCtrl-C to stop the server\n');
            });
    });
};