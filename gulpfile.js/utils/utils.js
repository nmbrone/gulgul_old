const fs    = require('fs');
const path  = require('path');
const gutil = require('gulp-util');

const joinPaths = (paths, prepend = '', append = '') => {
  return Object.keys(paths)
    .reduce((result, key) => {
      const val = paths[key];

      if (Array.isArray(val)) {
        result[key] = val.map(v => path.join(prepend, v, append));
      } else {
        result[key] = path.join(prepend, val, append);
      }

      return result;

    }, {});
};

const getFullPath = (base, ...globs) => {
  const re = /^!/;

  if (!globs.length) return base;

  const res = globs.map(glob => {
    let prepend = '';

    if (re.test(glob)) {
      prepend = '!';
      glob = glob.replace(re, '');
    }

    return path.join(prepend + base, glob);
  });

  return res.length === 1 ? res[0] : res;
};

const setupPathsGetters = (paths) => {
  return Object.keys(paths)
    .reduce((result, key) => {
      const val = paths[key];

      if (Array.isArray(val)) {
        result[key] = (...params) => val.reduce(
          (acc, v) => acc.concat(getFullPath(v, ...params)),
          []
        );
      } else {
        result[key] = getFullPath.bind(null, val);
      }

      return result;
    }, {});
};

/**
 * Get json from file
 * @param  {String} pathToFile Path to json file
 * @return {Object}            Parsed json object, or empty object,
 *                             if file doesn't exist or error occurred while parsing
 */
const readJSON = (pathToFile) => {
  try {
    return JSON.parse(fs.readFileSync(pathToFile, 'utf-8'));
  } catch (err) {
    gutil.beep();
    gutil.log(err.message);
    return {};
  }
};

/**
 * Get array of subdirectories in src
 * @param  {String} src Source path
 * @return {Array}  Array of paths (strings)
 */
const getDirs = (src) => {
  return fs.readdirSync(src)
    .filter(file => fs.statSync(path.join(src, file)).isDirectory());
};

/**
 * Generate namespaced gulp tasks for given collection of sets (of icons, for example)
 *
 * @param  {Object}   gulp       Gulp instance
 * @param  {Sting}    namespace  Namespace for set of tasks
 * @param  {Function} fn         Function that will be invoked with current set as parameter
 * @param  {Array}    collection Array of objects that describe current set.
 * @return {undefined}
 *
 * Schema for set
 * {
 *   'name':  required - 'name' of set, will be used as task name,
 *   'src':   required - path to sources,
 *   'watch': optional - path to sources for gulp.watch (if omit then 'src' will be used)
 * }
 * In addition set can contain any other specific properties
 *
 */
const generateNamespacedTasks = (gulp, namespace, fn, collection) => {

  if (!collection.length) return;

  // define set of tasks
  const tasks = collection.map((set, i) => {
    const { name = `task${i + 1}` } = set;
    const taskName = `${namespace}:${name}`;
    gulp.task(taskName, () => fn(set));
    return taskName;
  });

  // define main task
  gulp.task(namespace, tasks);

  // define main watch task
  gulp.task(`${namespace}:watch`, () => {
    collection.forEach((set, i) => {
      const { src, watch = src } = set;
      gulp.watch(watch, [tasks[i]]);
    });
  });

};

module.exports = {
  joinPaths,
  getDirs,
  readJSON,
  setupPathsGetters,
  generateNamespacedTasks
};
