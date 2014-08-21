var fs     = require('fs');
var path   = require('path');

var homedir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

var homeFile       = path.join(homedir, '.stlive.json');
var legacyHomeFile = path.join(homedir, '.stlive.config');

module.exports = function() {
    if (fs.existsSync(legacyHomeFile)) {
        console.info('Renaming :' +
                   '\n    ' + legacyHomeFile +
                   '\n => ' + homeFile);
        fs.renameSync(legacyHomeFile, homeFile);
    }
};
