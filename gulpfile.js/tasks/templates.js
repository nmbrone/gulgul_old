const gulp           = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const gulpif         = require('gulp-if');
const gutil          = require('gulp-util');
const data           = require('gulp-data');
const changed        = require('gulp-changed');
const prettify       = require('gulp-prettify');
const path           = require('path');
const fs             = require('fs');
const errorHandler   = require('../utils/error-handler');
const { SRC, DEST }  = require('../config');

const readData = (file) => {
  try {
    const { name } = path.parse(file.path);
    const dataFile = SRC.templatesData(`${name}.json`);
    return JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  } catch (err) {
    if (err.code !== 'ENOENT') {
      gutil.beep();
      gutil.log(err);
    }
    return {};
  }
};

const renderHtml = (onlyChanged) => {
  return gulp
    .src(SRC.templates('**/[^_]*.html'))
    .pipe(errorHandler())
    .pipe(gulpif(onlyChanged, changed(DEST.html())))
    .pipe(data(readData))
    .pipe(nunjucksRender({
      path: SRC.templates(),
      envOptions: {
        watch: false,
        trimBlocks: true,
        lstripBlocks: true
      }
    }))
    .pipe(prettify({
      indent_size: 2,
      wrap_attributes: 'auto',
      preserve_newlines: true,
      end_with_newline: true
    }))
    .pipe(gulp.dest(DEST.html()));
};

gulp.task('templates', () => renderHtml());

gulp.task('templates:changed', () => renderHtml(true));

gulp.task('templates:watch', () => {
  gulp.watch(SRC.templates('**/[^_]*.html'), ['templates:changed']);
  gulp.watch([SRC.templates('**/_*.html'), SRC.templatesData('**/*.json')], ['templates']);
});
