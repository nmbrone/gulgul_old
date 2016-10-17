const plumber = require('gulp-plumber');
const notify  = require('gulp-notify');

module.exports = (title) =>
  plumber({
    errorHandler: notify.onError({
      title: title || 'Error',
      message: '<%= error.message %>',
      sound: 'Submarine'
    })
  });
