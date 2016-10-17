const gulp          = require('gulp');
const svgmin        = require('gulp-svgmin');
const svgStore      = require('gulp-svgstore');
const rename        = require('gulp-rename');
const cheerio       = require('gulp-cheerio');
const consolidate   = require('gulp-consolidate');
const path          = require('path');
const errorHandler  = require('../../utils/error-handler');
const { isDev }     = require('../../utils/env');
const { SRC, DEST } = require('../../config');

const { generateNamespacedTasks } = require('../../utils/utils');

const spriteSets = [{
  name: 'website', // preset name; used as name for gulp task ( [namespace]:website )
  src: SRC.icons('website/**/*.svg'),
  spritePath: '../img/', // need for preview
  spriteName: 'website-sprite', // used as name for sprite, preview and style files
  className: 'icon', // css class for icons
  preset: 'duotone',
  secondColor: '#E6F1FC', // can be any, but must be same across all icons in set
  lockedRe: /\.locked$/, // skip applying of preset for those icons whose ids match this regex
}];

const getSymbolMetaData = ($, symbol) => {
  const viewBox = symbol.attr('viewBox');
  const size    = viewBox
    ? viewBox.split(' ').splice(2)
    : [(symbol.attr('width') || 1), (symbol.attr('height') || 1)];

  return {
    name: symbol.attr('id'),
    ratio: Math.ceil((size[0] / size[1]) * 10) / 10,
    fill: symbol.attr('fill')
  };
};

const presets = {
  /**
   * Duotone (if set have 'secondColor' property)
   * or monotone (same as in iconfont) icons
   *
   * If icon is duotone:
   *   primary color can be changed via css 'fill' property,
   *   secondary - via css 'color' property
   *
   * !protip: you can set 'fill' to 'currentColor',
   *   and then change color of icon via css 'color' property
   *   icons with two colors
   *
   * @param  {Object} $      Cheerio instance, sprite file
   * @param  {Object} symbol Cheerio instance, symbol tag in sprite
   * @param  {Object} set    Current set
   * @return {undefined}
   */
  'duotone': ($, symbol, set) => {
    const { lockedRe, secondColor } = set;

    if (lockedRe instanceof RegExp) {
      const id = symbol.attr('id');

      if (lockedRe.test(id)) {
        symbol.attr('id', id.replace(lockedRe, ''));
        return;
      }
    }

    symbol
      .find('*')
      .map((i, el) => {
        const $el = $(el);
        const fill = $el.attr('fill') || '';
        if (fill.toUpperCase() === secondColor) {
          $el.attr('fill', 'currentColor');
        }
        return el;
      })
      .removeAttr('stroke')
      .removeAttr('opacity')
      .not('[fill="currentColor"]')
      .removeAttr('fill');
  }
};

const postprocess = ($, set, done) => {
  const symbols = $('svg > symbol');

  // extract metadata from icons, apply style preset
  const symbolsData = symbols.map((i, symbol) => {
    const $symbol = $(symbol);
    const preset  = presets[set.preset];
    typeof preset === 'function' && preset($, $symbol, set);
    const meta = getSymbolMetaData($, $symbol, set);
    return meta;
  }).get();

  const data = Object.assign({}, set, { icons: symbolsData });

  // render styl file with icon dimensions
  gulp.src(path.join(__dirname, 'template.styl'))
    .pipe(errorHandler())
    .pipe(consolidate('lodash', data))
    .pipe(rename({
      prefix: '_',
      basename: set.spriteName
    }))
    .pipe(gulp.dest(SRC.stylesGen()))
    .on('end', done);

  if (!isDev()) return;

  // render preview for icons
  gulp.src(path.join(__dirname, 'preview.html'))
    .pipe(errorHandler())
    .pipe(consolidate('lodash', data))
    .pipe(rename({ basename: set.spriteName }))
    .pipe(gulp.dest(DEST.previews()));
};

const generateSprite = (set) => {
  return gulp
    .src(set.src)
    .pipe(errorHandler())
    .pipe(svgmin({
      js2svg: {
        pretty: true
      },
      plugins: [{
        removeDesc: true
      }, {
        cleanupIDs: true
      }, {
        mergePaths: false
      }]
    }))
    .pipe(rename({ prefix: `${set.className}-` }))
    .pipe(svgStore({ inlineSvg: false }))
    .pipe(cheerio({
      run: ($, file, done) => postprocess($, set, done),
      parserOptions: { xmlMode: true }
    }))
    .pipe(rename({ basename: set.spriteName }))
    .pipe(gulp.dest(DEST.images()));
};

generateNamespacedTasks(gulp, 'svgsprites', generateSprite, spriteSets);
