const gulp          = require('gulp');
const include       = require('gulp-include');
const sourcemaps    = require('gulp-sourcemaps');
const uglify        = require('gulp-uglify');
const gulpif        = require('gulp-if');
const errorHandler  = require('../utils/error-handler');
const { isProd }    = require('../utils/env');
const { SRC, DEST } = require('../config');

const { generateNamespacedTasks } = require('../utils/utils');

const entries = [{
  name: 'website',
  src: SRC.scripts('website.js'),
  watch: SRC.scripts('**/*.js', '!/onboard/**/*')
}];

const buildEntry = ({ src, dest = DEST.scripts() }) => {
  const prod = isProd();
  return gulp
    .src(src)
    .pipe(errorHandler())
    .pipe(gulpif(!prod, sourcemaps.init()))
    .pipe(include())
    .pipe(gulpif(prod, uglify({ preserveComments: 'license' })))
    .pipe(gulpif(!prod, sourcemaps.write('./map')))
    .pipe(gulp.dest(dest));
};

generateNamespacedTasks(gulp, 'scripts', buildEntry, entries);
