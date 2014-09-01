/*
 * Creates a new Sencha Touch app + PhoneGap 3.x + Embedded Phone Gap App
 * App starts up at AppName/phonegap/www/start.html
 *   start.html -> { index.html, live/index.html}
 * Copyright (C) 2014 Anthony O'Hagan  tony@ohagan.name
 */

/* jshint undef: true, unused: true */
/* global process, require, __dirname  */

require('terminal-colors');
var shell = require('shelljs');
var path = require('path');
var fs = require('fs');
var expandHome = require('./util').expandHome;
var runcmd = require('./util').runcmd;

function rmReadmes(appDir) {
    var dir = path.join(appDir, 'app');
    shell.find(dir).forEach(function(file) {
        if (file.match(/readme.md$/i)) {
            shell.rm(file);
        }
    });
}

function mkAppDir(appDir, replace) {
    if (replace === true) {
        // Kill Android Debugger to ensure app folder is unlocked
         runcmd ("adb kill-server");
         shell.rm('-r', appDir);
    }

    if (shell.test('-d', appDir)) {
        throw appDir + ": Project directory already exists. Aborting.";
    }

    shell.mkdir('-p', appDir);
}

function updateConfigXml(options, file) {
    var inp = fs.readFileSync(file, 'utf8');

    // Replace widget/@id
    var appFullName = options.appDomain + '.' + options.appName;
    var out = inp.replace(/id *= *"[^"]*"/i, 'id="' + appFullName.toLowerCase() + '"');

    // Replace widget/name/text()
    out = out.replace(/<name>[^<]*<\/name>/i, '<name>' + options.appName + '</name>');

    if (options.author) {
        var author = '<author email="' + options.author.email + '" href="' + options.author.web + '">' + options.author.name + '</author>';
        // matches multiple lines between <author></author> tags
        out = out.replace(/<author[\s\S]+<\/author>/, author);
    }

    fs.writeFileSync(file, out, 'utf8');
}

// Creates a new Sencha Touch App + Live App with PhoneGap 3.x
module.exports = function(options, args) {
    if (args.length > 1) { options.appDomain = args.shift(); }
    if (args.length > 0) { options.appName = args.shift(); }

    var liveDirRes = path.join(__dirname, '..', 'res', 'live');
    if (!shell.test('-d', liveDirRes)) {
        throw liveDirRes + ": Failed to find directory";
    }

    options.sdk = expandHome(options.sdk);

    options.appDir = options.appDir || path.resolve(options.appName);

    if (options.platforms.android) {
        ["JAVA_HOME", "ANT_HOME", "ANDROID_HOME"].forEach(function(v) {
            if (!process.env[v]) {
                throw '$' + v + ": Required environment variable for 'android' platform is not set";
            }
        });
    }

    if (shell.test('-d', options.sdk) === false) {
        throw options.sdk + ": Failed to find Sencha SDK"
            + "\nConfigured in your .stlive.json file in current, ancestor or user home directories";
    }

    mkAppDir(options.appDir, options.deleteAppDir);

    runcmd (options.cmd + ' -sdk ' + options.sdk + ' generate app ' + options.appName + ' ' + options.appDir);

    // ** ST APP **
    shell.cd (options.appDir);

    // remove README.md files
    if (options.readme === false) rmReadmes(options.appDir);

    var appFullName = options.appDomain + '.' + options.appName;
    runcmd (options.cmd + ' phonegap init ' + appFullName + ' ' + options.appName);

    // Perform before require('./live').add(options) so that .bak file created is correct.
    updateConfigXml(options, 'config.xml');

    if (options.live) {
        // options.appDir must be current dir
        require('./live').add(options);
    }

    shell.cp ('-f', 'config.xml', 'phonegap/www/config.xml');

    // ** PHONEGAP **
    shell.cd ('phonegap');

    shell.mkdir ('-p', 'res/icons/android');
    shell.mkdir ('-p', 'res/icons/ios');
    shell.mkdir ('-p', 'res/icons/wp8');

    options.platforms.forEach(function(platform) {
        runcmd('cordova platform add ' + platform);
    });

    var platformNames = options.platforms.join(' ');

    var pgProps = '../phonegap.local.properties';
    shell.sed ('-i', /phonegap.platform=.*/, 'phonegap.platform=' + platformNames, pgProps);
    if (options.build && options.build.username && options.build.password) {
        var remoteBuild = options.build.enabled === "true" ? "true" : "false";
        shell.sed ('-i', /phonegap.build.remote=.*/, "phonegap.build.remote=" + remoteBuild, pgProps);
        shell.sed ('-i', "{username}", options.build.username, pgProps);
        shell.sed ('-i', "{password}", options.build.password, pgProps);
    }

    options.plugins.forEach(function(plugin) {
        runcmd('cordova plugin add ' + plugin);
    });

    // ** ST APP **
    shell.cd (options.appDir);

    if (options.run) {
        runcmd (options.cmd + ' app build -run native');
    } else {
        runcmd (options.cmd + ' app build native');
    }

    console.log(("Completed building your '" + options.appDomain + "." + options.appName + "' app.").lightYellow);
    console.log("Now deploy you new apps to your emulators and devices and start the server ... ".lightGreen);
    console.log(("$ cd " + options.appName).lightGreen);
    console.log(("$ " + options._pkg.name + " serve").lightGreen);

    console.log('');

    return 0;
};
