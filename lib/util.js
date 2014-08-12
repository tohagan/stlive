require('terminal-colors');

var shell = require('shelljs');
var path  = require('path');
var homedir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

module.exports = {
    expandHome: function(fileName) {
        if (!fileName) return fileName;      
        if (fileName == '~') return homedir;
        if (fileName.slice(0, 2) != '~/') return fileName;
        return path.join(homedir, fileName.slice(2));
    },
    
    runcmd: function(cmd) {
        console.log(cmd.lightYellow);
        shell.exec(cmd);
    }
};

