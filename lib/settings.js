require('terminal-colors');

module.exports = function(options) {
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
};
