require('terminal-colors');
var path    = require('path');
var util    = require('./util');
var expandHome  = util.expandHome;
var runcmd      = util.runcmd;


// KEEP for cli-config

//// TODO: Move to cli-config
//function getConfigSchema (file) {
//    // Remove BOM: https://github.com/joyent/node/issues/1918
//    var str = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
//
//    // Example: "_schema": "2.0",
//    var result = /"_schema": +"([^"]+)"/.exec(str)[1];
//    if (result === null) return null;
//    return result[1];        
//}
//
//// TODO: Move to cli-config
//function checkSchema (options) {
//    var defaultsSchema = this.getConfigSchema(defaultsConfig);
//    if (options._schema !== defaultsSchema) {
//        console.info('The schema of settings files has changed.'); 
//        console.info('Compare your local settings against: '); 
//        console.info(' ' + defaultsConfig);
//        console.info("or run 'stlive diff [file]' to compare defaults.config with a settings file or ~/.stlive.config"); 
//    }
//}

module.exports = {
    show: function(options, args) {
        console.info((options.pkg.name + " " + options.pkg.version).lightYellow); 

        if (options.platforms.android) {
            ["JAVA_HOME", "ANT_HOME", "ANDROID_HOME"].forEach(function(v) {
                if (!process.env[v]) {
                    console.warn('$' + v + ": Required environment variable for 'android' platform is not set");
                } else {
                    console.info('$' + v + " = " + process.env[v]);
                }
            });
        }

        // Hide package properties
        delete options.pkg;
        delete options._;
        console.info(options);

        console.info('');        
        var configFile = (process.platform === "win32") ? '%USERPROFILE%\\.stlive.config' : '~/.stlive.config';
        console.info(("Edit " + configFile + " to configure app settings.").lightYellow); 
    },
    
    diff: function(options, args) {
        var homeFile = expandHome('~/.stlive.config');
        var settingsFile = (args.length > 0 && args[0]) || homeFile;
        var defaultsFile = path.join(__dirname, '..', 'defaults.config');
        
        runcmd('diff -c ' + defaultsFile + ' ' + settingsFile);
        
        
    }
};
