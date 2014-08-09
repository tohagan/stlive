var dirs    = require('./dirs');
var shell   = require('shelljs');
var fs      = require('fs');
var path    = require('path');

function runcmd(cmd) {
    console.log(cmd.lightYellow);
    shell.exec(cmd);
}

function perPlatform(action, options, platforms)
{
    var dirs = require('./dirs');
    dirs.init(false);

    // cd to 'phonegap' or 'cordova' dir
    process.chdir(dirs.pgDir);

    if (platforms.length === 0) {
        // default to run all project platforms
        platforms = fs.readdirSync('platforms');
    }

    platforms.forEach(function(platform) {
        var platDir = path.join('platforms', platform);
        if (!fs.existsSync(platDir)) throw platform + ": Platform not implemented in this project";

        var cmd = action + ' ' + platform;
        console.log(cmd.lightYellow);
        shell.exec(cmd);
    });
}


module.exports = function(options, platforms) {
    dirs.init(false);

    if (dirs.isSencha()) {
        if (options.run) {
            runcmd(options.senchaCmd + ' app build -run native');
        } else {
            runcmd(options.senchaCmd + ' app build native');
        }
    } else {
        perPlatform('phonegap run', options, platforms);
    }
    console.log(("Completed building your app.").lightYellow);
};