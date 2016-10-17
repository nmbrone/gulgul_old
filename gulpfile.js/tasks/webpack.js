const gulp              = require('gulp');
const webpack           = require('webpack');
const gutil             = require('gulp-util');
const notify            = require('gulp-notify');
const path              = require('path');
const { isDev, isProd } = require('../utils/env');
const { SRC, DEST }     = require('../config');

const createWebpackConfig = () => {
  const prod = isProd();
  const dev  = isDev();

  const config = {
    context: path.join(__dirname, '../..', SRC.scripts()),
    entry: {
      onboard: './onboard/app.js'
    },
    output: {
      path: path.join(__dirname, '../..', DEST.scripts()),
      sourceMapFilename: 'map/[file].map',
      filename: '[name].js',
      publicPath: 'js/'
    },
    devtool: dev
      ? '#source-map' // '#cheap-module-eval-source-map'
      : null,
    plugins: [
      new webpack.NoErrorsPlugin()
    ],
    resolve: {
      extensions: ['', '.js']
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            presets: ['es2015'],
            plugins: ['transform-runtime']
          }
        }
      ]
    }
  };

  if (prod) {
    config.plugins.push(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    );
  }

  return config;
};


function handler(err, stats, cb) {
  const errors = stats.compilation.errors;

  if (err) throw new gutil.PluginError('webpack', err);

  if (errors.length > 0) {
    notify.onError({
      title: 'Webpack Error',
      message: '<%= error.message %>',
      sound: 'Submarine'
    }).call(null, errors[0]);
  }

  gutil.log('[webpack]', stats.toString({
    colors: true,
    chunks: false
  }));

  if (typeof cb === 'function') cb();
}

gulp.task('webpack', function(cb) {
  webpack(createWebpackConfig()).run((err, stats) => {
    handler(err, stats, cb);
  });
});

gulp.task('webpack:watch', (cb) => {
  webpack(createWebpackConfig()).watch({
    aggregateTimeout: 100,
    poll: false
  }, handler);
  cb();
});
