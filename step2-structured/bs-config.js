/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
const modRewrite = require('connect-modrewrite');

module.exports = {
    "ui": {
        "port": 3001,
        "weinre": {
            "port": 8080
        }
    },
    "files": ['public'],
    "server": {
        baseDir: './public/',
        middleware: [modRewrite(['!^/(assets)  /index.html'])]
    },
    "port": 3000,
    "reloadDebounce": 500
};
