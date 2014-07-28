#!/usr/bin/env node

try {
    require('cli-config').run({
        dirname: __dirname, 
        clone: true,        // Clones default.config to '~/.stlive.config' 
        ancestors: true,    // Search curr and ancestor dirs for '.stlive.config' files
        cmdTree: require('./lib')
    });
} catch (ex) {
    console.error(ex);
    process.exit(1);
}
