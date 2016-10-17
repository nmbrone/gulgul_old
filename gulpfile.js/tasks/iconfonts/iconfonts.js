const gulp          = require('gulp');
const iconfont      = require('gulp-iconfont');
const consolidate   = require('gulp-consolidate');
const rename        = require('gulp-rename');
const path          = require('path');
const errorHandler  = require('../../utils/error-handler');
const { isDev }     = require('../../utils/env');
const { SRC, DEST } = require('../../config');

const { generateNamespacedTasks } = require('../../utils/utils');

const iconsSets = [{
  name: 'onboard',
  src: SRC.icons('onboard/**/*.svg'),
  fontName: 'onboard-iconfont',
  fontPath: '../fonts/',
  className: 'icon'
}];

const generateStylAndPreview = (set, glyphs) => {
  const props = Object.assign({}, set, { glyphs });

  gulp.src(path.join(__dirname, 'template.styl'))
    .pipe(errorHandler())
    .pipe(consolidate('lodash', props))
    .pipe(rename({
      prefix: '_',
      basename: props.fontName
    }))
    .pipe(gulp.dest(SRC.stylesGen()));

  if (!isDev()) return;

  gulp.src(path.join(__dirname, 'preview.html'))
    .pipe(errorHandler())
    .pipe(consolidate('lodash', props))
    .pipe(rename({ basename: props.fontName }))
    .pipe(gulp.dest(DEST.previews()));
};

const generateIconfont = (set) => {
  return gulp.src(set.src)
    .pipe(errorHandler())
    .pipe(iconfont({
      fontName: set.fontName,
      formats: ['eot', 'woff', 'woff2'],
      normalize: true,
      fontHeight: 1001,
      fontStyle: 'normal',
      fontWeight: 'normal'
    }))
    .on('glyphs', generateStylAndPreview.bind(null, set))
    .pipe(gulp.dest(DEST.fonts()));
};

generateNamespacedTasks(gulp, 'iconfonts', generateIconfont, iconsSets);
