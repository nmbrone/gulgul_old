const gulp          = require('gulp');
const del           = require('del');
const gutil         = require('gulp-util');
const { SRC, DEST } = require('../config');

gulp.task('clean', () => {
  return del([
    DEST.root(),
    SRC.stylesGen()
  ]).then((paths) => {
    gutil.log('Deleted:', gutil.colors.magenta(paths.join('\n')));
  });
});
