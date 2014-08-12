/*
 * Copyright (C) 2014 Anthony O'Hagan  tony@ohagan.name
 * 
 * Start/Stop SASS Compass Compiler
 * SASS compiler will watch & auto compile *.scss files => *.css files to trigger reloads.
 */

require('terminal-colors');
var spawn = require('child_process').spawn;
var path = require('path');
var fs = require('fs');

function getLog(key) {
    var prefix = '[' + key + '] ';
    return {
        log:   function(msg) { console.log(prefix.lightGreen + msg); },
        error: function(msg) { console.log(prefix.lightRed   + msg); },
        debug: function(msg) { console.log(prefix.lightGreen + msg); }
    };
}

function getOpts(options, key) {
    var opts = options.bgtasks && options.bgtasks[key];
    if (!opts)         throw "bgtasks." + key + " settings are not configured.";
    if (!opts.dir)     throw "bgtasks." + key + ".dir setting is not configured.";
    if (!opts.cmd)     throw "bgtasks." + key + ".cmd setting is not configured.";
    if (!opts.name)    throw "bgtasks." + key + ".name setting is not configured.";
    if (!opts.success) throw "bgtasks." + key + ".success pattern setting is not configured.";
    return opts;
}

// Starts a background task
module.exports = function(key, cb, options) {
    var opts = getOpts(options, key);
    var log  = getLog(key);

    if (!fs.existsSync(opts.dir)) {
        throw path.resolve(opts.dir) + ': Failed to find SASS directory';
    }

    var args = opts.cmd.split(/ +/g);
    var app = args.shift();

    log.log(opts.name + ' starting');
    var child = spawn(app, args, {cwd: opts.dir, env: process.env, setsid: false});

    child.on('error', function(err) {
        log.error('Failed to start ' + opts.name + ' running ... ');
        log.error(' ' + opts.cmd);
        log.error(' in: ' + path.resolve(opts.dir));
        log.error(err);
        if (cb) { cb(err); cb = null; }
    });

    child.on('close', function() {
        if (child.pid !== 0) {
            log.log(opts.name + ' stopped');
        }
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
        log.error(data);
    });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function (data) {
        if (options.noctrlc) data = data.replace('Press Ctrl-C to Stop.', '');
        log.log(data);
        
        // Detect successful start
        var successPattern = new RegExp(opts.success);
        if (successPattern.test(data)) {
            if (cb) { cb(); cb = null; }
        }
    });
};

