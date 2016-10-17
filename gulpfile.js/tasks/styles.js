const gulp          = require('gulp');
const postcss       = require('gulp-postcss');
const stylus        = require('gulp-stylus');
const sourcemaps    = require('gulp-sourcemaps');
const gulpif        = require('gulp-if');
const autoprefixer  = require('autoprefixer');
const mqpacker      = require('css-mqpacker');
const errorHandler  = require('../utils/error-handler');
const { isProd }    = require('../utils/env');
const { SRC, DEST } = require('../config');

/**
 * Compile *.styl files insilde of 'src/css' and subdirectories
 * Files prefixed with "_" are ignored. Such files can be included
 * into source file via @require or @include directive
 */

const isMax = (mq) => /max-width/.test(mq);
const isMin = (mq) => /min-width/.test(mq);

const sortMediaQueries = (a, b) => {
  const A = a.replace(/\D/g, '');
  const B = b.replace(/\D/g, '');

  if (isMax(a) && isMax(b)) {
    return B - A;
  } else if (isMin(a) && isMin(b)) {
    return A - B;
  } else if (isMax(a) && isMin(b)) {
    return 1;
  } else if (isMin(a) && isMax(b)) {
    return -1;
  }

  return 1;
};

gulp.task('styles', () => {
  const prod = isProd();

  const processors = [
    autoprefixer({
      browsers: ['last 2 versions']
    }),
    mqpacker({
      sort: sortMediaQueries
    })
  ];

  return gulp
    .src(SRC.styles('**/[^_]*.styl'))
    .pipe(errorHandler())
    .pipe(gulpif(!prod, sourcemaps.init()))
    .pipe(stylus({ compress: prod }))
    .pipe(postcss(processors))
    .pipe(gulpif(!prod, sourcemaps.write('./map')))
    .pipe(gulp.dest(DEST.styles()));
});

gulp.task('styles:watch', () => {
  gulp.watch(SRC.styles('**/*.styl'), ['styles']);
});
