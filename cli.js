#!/usr/bin/env node

try {
    // rename ~/.stlive.config => ~/.stlive.json
    require('./lib/legacy')();

    require('cli-config').run({
        dirname: __dirname,
        clone: true,        // Clones .stlive.json to '~/.stlive.json'
        ancestors: true,    // Search curr and ancestor dirs for '.stlive.json' files
        cmdTree: require('./lib')
    });
} catch (ex) {
    console.error(ex);
    process.exit(1);
}
