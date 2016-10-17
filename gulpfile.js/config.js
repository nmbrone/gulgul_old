const gutil      = require('gulp-util');
const { setEnv } = require('./utils/env');

const { joinPaths, setupPathsGetters } = require('./utils/utils');

/**
 * SETUP ENVIRONMENT
 * By default all tasks will run in 'development' environment,
 * but with flag --prod we can set it to 'production'.
 * This is useful when we need to run separate task
 * with 'production' settings.
 * For example, run task 'gulp webpack --prod'
 * and you get production ready (optimized) scripts.
 *
 * Keep in mind, that tasks 'build:dev' and 'build:prod' will override
 * value of NODE_ENV as 'development' and 'production' correspondingly
 */
setEnv(gutil.env.prod ? 'production' : 'development');


const SRC_ROOT  = gutil.env.src  || 'src';
const DEST_ROOT = gutil.env.dest || 'build';

// SRC-path getters
// Usage: SRC.images('**/*.{png,svg}') => 'src/img/**/*.{png,svg}'
const SRC = setupPathsGetters(joinPaths({

  root          : '',
  scripts       : 'js',
  styles        : 'css',
  stylesGen     : 'css/generated',
  templates     : 'templates',
  templatesData : 'templates/data',
  images        : 'img',
  fonts         : 'fonts',
  icons         : 'icons',
  video         : 'video'

}, SRC_ROOT));

// DEST-path getters
// Usage: DEST.images() => 'build/img'
const DEST = setupPathsGetters(joinPaths({

  root          : '',
  fonts         : 'fonts',
  images        : 'img',
  styles        : 'css',
  scripts       : 'js',
  previews      : 'previews',
  video         : 'video',
  html          : ''

}, DEST_ROOT));


module.exports = {
  SRC_ROOT,
  DEST_ROOT,
  SRC,
  DEST
};
