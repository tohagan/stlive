/*
 * Runs a customised PhoneGap App server for a Sencha Touch App.
 * Copyright (C) 2014 Anthony O'Hagan  tony@ohagan.name
 */

require('terminal-colors');
var path = require('path');
var fs = require('fs');
var dirs = require('./dirs');
var server = require('connect-phonegap');

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

module.exports = function(options, args) {
    if (args.length > 0) options.dir = args.shift();
    if (options.dir) {
        if (!fs.existsSync(options.dir)) throw options.dir + ": Directory not found";
        process.chdir(options.dir);
    }

    options = addServerOptions(options);  // Must perform *after* chdir()

    // All paths except platform/plugin JS files are relative to cwd.
    console.log(('Starting in ' + process.cwd() + ' ... ').lightGreen);

    var reloads = 0;

    server.listen(options)
        .on('error', function(msg) {
            console.log(msg.lightRed);
        })
        .on('warn', function(msg) {
            console.log(msg.lightYellow);
        })
        .on('log', function(statusCode, url, staticpath) {
            if (url == '/__api__/autoreload') {
                process.stdout.write('\033[0GReloads: ' + ('' + reloads++).lightGreen);
            } else {
                if (reloads > 0) { console.log(); }
                var msg = statusCode;
                if (url) { msg += ' ' + url; }            
                if (statusCode != 200) { msg = msg.lightYellow; }
                console.log(msg);

                if (staticpath) {
                    console.log('  ' + staticpath.lightGreen); 
                }
                reloads = 0;
            }
        })
        .on('complete', function(data) {
            console.log('\nCtrl-C to stop the server\n');
            //console.log('Listening on ', (data.address + ':' + data.port).lightYellow);  // already displayed by 'server'
        });
};