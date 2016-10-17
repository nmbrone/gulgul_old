const gulp          = require('gulp');
const gutil         = require('gulp-util');
const server        = require('browser-sync').create();
const { isDev }     = require('../utils/env');
const { SRC, DEST } = require('../config');

/**
 * Run local dev server with livereload.
 * Run with --no-open to prevent opening browser
 * Run with --port 8888 to change port to 8888
 * Run with --tunnel 'mysite' to share over www.mysite.localtunnel.me
 */

gulp.task('server', () => {
  server.init({
    server: isDev() ? [DEST.root(), SRC.root()] : DEST.root(),
    files: [
      DEST.html('*.html'),
      DEST.styles('*.css'),
      DEST.scripts('*.js')
    ],
    port: gutil.env.port || 3000,
    logLevel: 'info',
    logConnections: false,
    logFileChanges: true,
    open: gutil.env.open !== false,
    notify: false,
    ghostMode: false,
    online: Boolean(gutil.env.tunnel),
    tunnel: gutil.env.tunnel || null
  });
});

module.exports = server;
