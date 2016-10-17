const gulp          = require('gulp');
const buffer        = require('vinyl-buffer');
const imagemin      = require('gulp-imagemin');
const merge         = require('merge-stream');
const spritesmith   = require('gulp.spritesmith');
const errorHandler  = require('../utils/error-handler');
const { SRC, DEST } = require('../config');

const { generateNamespacedTasks } = require('../utils/utils');

const spriteSets = [{
  name: 'logotypes',
  src: SRC.icons('logotypes/**/*.png'),
  spriteOptions: {}
}, {
  name: 'logotypes2',
  src: SRC.icons('logotypes2/**/*.png')
}];

const generateSprite = ({ name, src, spriteOptions = {} }) => {
  const spriteData = gulp
    .src(src)
    .pipe(errorHandler())
    .pipe(spritesmith(Object.assign({
      imgName: `${name}-sprite.png`,
      cssName: `_${name}-sprite.styl`,
      imgPath: `../img/${name}-sprite.png`,
      retinaSrcFilter: SRC.icons(`${name}/**/*@2x.png`),
      retinaImgName: `${name}-sprite@2x.png`,
      retinaImgPath: `../img/${name}-sprite@2x.png`,
      // cssSpritesheetName: `${name}`,
      // cssVarMap: (sprite) => { sprite.name = `${name}_${sprite.name}`; },
      padding: 4
    }, spriteOptions)));

  const imgStream = spriteData.img
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(gulp.dest(DEST.images()));

  const cssStream = spriteData.css
    .pipe(gulp.dest(SRC.stylesGen()));

  return merge(imgStream, cssStream);
};

generateNamespacedTasks(gulp, 'sprites', generateSprite, spriteSets);
