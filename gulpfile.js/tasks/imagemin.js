const gulp             = require('gulp');
const imagemin         = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const filter           = require('gulp-filter');
const hashsum          = require('gulp-hashsum');
const gulpif           = require('gulp-if');
const path             = require('path');
const crypto           = require('crypto');
const errorHandler     = require('../utils/error-handler');
const { readJSON }     = require('../utils/utils');
const { SRC }          = require('../config');
const manifestFileName = 'HASHSUMS';
const hashType         = 'sha1';

const optimize = (src, dest, force = false) => {

  const manifest = readJSON(
    path.resolve(process.cwd(), dest, manifestFileName)
  );

  const filterChanged = filter(file => {
    const key = path.relative(SRC.images(), file.path);
    const hash = crypto
      .createHash(hashType)
      .update(file.contents, 'binary')
      .digest('hex');
    return manifest[key] !== hash;
  }, { restore: true });

  return gulp
    .src(src)
    .pipe(errorHandler())
    .pipe(gulpif(!force, filterChanged))
    .pipe(imagemin([
      imagemin.gifsicle(),
      imagemin.jpegtran(),
      imageminPngquant(),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest(dest))
    .pipe(gulpif(!force, filterChanged.restore))
    .pipe(hashsum({
      dest,
      hash: hashType,
      filename: manifestFileName,
      json: true
    }));
};

const optimizeSrcImages = (force) => optimize(
  SRC.images('**/*.{png,jpg,jpeg,gif,svg}'),
  SRC.images(),
  force
);

gulp.task('imagemin', () => optimizeSrcImages());

gulp.task('imagemin:force', () => optimizeSrcImages(true));
