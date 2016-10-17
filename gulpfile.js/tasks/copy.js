const gulp          = require('gulp');
const errorHandler  = require('../utils/error-handler');
const { SRC, DEST } = require('../config');

gulp.task('copy:fonts', () => {
  return gulp
    .src(SRC.fonts('**/*.{woff,woff2,eot,ttf}'))
    .pipe(errorHandler())
    .pipe(gulp.dest(DEST.fonts()));
});

gulp.task('copy:img', () => {
  return gulp
    .src(SRC.images('**/*.{jpg,jpeg,png,gif,svg}'))
    .pipe(errorHandler())
    .pipe(gulp.dest(DEST.images()));
});

gulp.task('copy:video', () => {
  return gulp
    .src(SRC.video('*'))
    .pipe(errorHandler())
    .pipe(gulp.dest(DEST.video()));
});

gulp.task('copy', [
  'copy:fonts',
  'copy:img',
  'copy:video'
]);
