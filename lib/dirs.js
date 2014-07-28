/*
 * Copyright (C) 2014 Anthony M. J. O'Hagan tony@ohagan.name
 *
 * Export directories used to the following project types:
 *
 * - Sencha Touch with PhoneGap 3.x (Tested) or Cordova 3.x App (To be tested)
 * - Cordova 3.x App    (Probably works for jQuery Mobile or any framework that places source files in www/ folder)
 * - PhoneGap 3.x App   (Probably works for jQuery Mobile or any framework that places source files in www/ folder)
 * 
 */

require('terminal-colors');
var fs = require('fs');
var path = require('path');

// Adapts lib directories based on discovery of Sencha/Cordova/PhoneGap context.

module.exports = {
    isSencha: function()            { return fs.existsSync('.sencha'); },
    isSenchaPhoneGap: function()    { return this.isSencha() && fs.existsSync('./phonegap/www'); },
    isSenchaCordova: function ()    { return this.isSencha() && fs.existsSync('./cordova/www'); },
    isPhoneGapOrCordova: function() { return fs.existsSync("www") && fs.existsSync("platforms") && fs.existsSync("plugins"); },
    
    // Initialised by init() function
    resDir: null,    // Lib Resource files
    pgDir: null,     // PhoneGap or Cordova
    wwwDir: null,    // PhoneGap WWW directory
    liveDir: null,   // Live App (under wwwDir)
    
    init: function() {
        this.resDir = path.join(__dirname, "../res");
        if(!fs.existsSync(this.resDir)) {
            throw this.resDir + ": Failed to find resource directory. Aborting."; 
        }
        
        // User may have attempted to run app from cordova or phonegap folder inside a Sencha Touch app.
        var cwdName = path.basename(process.cwd());
        if (fs.existsSync("../.sencha") && (cwdName === "cordova" || cwdName === "phonegap")) {
            throw process.cwd() + ": Run this app from the Sencha parent directory."; 
        }
        
        if (this.isSencha()) {            
            if (fs.existsSync("phonegap")) {
                this.pgDir = "phonegap";
            } else if (fs.existsSync("cordova")) {
                this.pgDir = "cordova";
            } else {
                throw process.cwd() + ": Current directory is a Sencha Project but does not yet have PhoneGap 3.x or Cordova 3.x added. Aborting."; 
            }
        } else if (this.isPhoneGapOrCordova()) {
            this.pgDir = ".";
        } else {
            throw process.cwd() + ": Current directory is not a Sencha Touch, PhoneGap 3.x or Cordova 3.x project. Aborting."; 
        }
        
        this.wwwDir  = path.join(this.pgDir, 'www');
        this.liveDir = path.join(this.wwwDir, 'live');
        
        return this;
    }
};

