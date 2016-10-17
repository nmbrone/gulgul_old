const gutil = require('gulp-util');
const env   = require('gulp-env');

const PROD = 'production';
const DEV  = 'development';

const isProd = () =>
  process.env.NODE_ENV === PROD;

const isDev = () =>
  process.env.NODE_ENV === DEV;

const printEnv = () => gutil.log(
  'Current environment:',
  gutil.colors.white.bgRed(' ' + process.env.NODE_ENV + ' ')
);

const setEnv = (type) => {
  if (type === process.env.NODE_ENV) return;
  env({ vars: { NODE_ENV: type } });
};

module.exports = {
  isProd,
  isDev,
  printEnv,
  setEnv
};
