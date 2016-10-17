const gulp                 = require('gulp');
const runSequence          = require('run-sequence');
const { setEnv, printEnv } = require('../utils/env');

const tasks = [
  'clean',
  'sprites',
  'iconfonts',
  'svgsprites',
  'styles',
  'scripts',
  'webpack',
  'copy'
];

gulp.task('build', ['build:prod']);

gulp.task('build:dev', (cb) => {
  setEnv('development');
  printEnv();
  runSequence(...tasks, cb);
});

gulp.task('build:prod', (cb) => {
  setEnv('production');
  printEnv();
  runSequence(...tasks, cb);
});
