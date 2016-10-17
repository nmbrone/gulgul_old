const gulp = require('gulp');

gulp.task('watch', [
  'sprites:watch',
  'iconfonts:watch',
  'svgsprites:watch',
  'styles:watch',
  'scripts:watch',
  'webpack:watch'
]);
