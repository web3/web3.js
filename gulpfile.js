

const version = require('./lerna.json');
const fs = require('fs');
const path = require('path');
const through = require('through2');
const chalk = require('chalk');
const del = require('del');
const plumber = require('gulp-plumber');
const gulp = require('gulp');
const gutil = require('gulp-util');
const replace = require('gulp-replace');
const watch = require('gulp-watch');
const newer = require('gulp-newer');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const glob = require('glob');

const rollup = require('rollup');
const rollupBabelrc = require('babelrc-rollup').default;
const rollupReplace = require('rollup-plugin-replace');
const rollupBabel = require('rollup-plugin-babel');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupJson = require('rollup-plugin-json');
const rollupCommonjs = require('rollup-plugin-commonjs');
const rollupUglify = require('rollup-plugin-uglify');
const rollupGlobals = require('rollup-plugin-node-globals');
const rollupBuiltins = require('rollup-plugin-node-builtins');

const scripts = './packages/*/src/**/*.js';
const PACKAGES_DIR = path.join(__dirname, 'packages');
const DIST = path.join(__dirname, 'dist');

const packages = glob.sync(`${PACKAGES_DIR}/*`).map(d => path.basename(d));
const packageModules = packages.reduce((result, p) => {
  result[p] = p.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
  return result;
}, {});

const swapSrcWithLib = (srcPath) => {
  const parts = srcPath.split(path.sep);
  parts[1] = 'lib';
  return parts.join(path.sep);
};

const pkgDependencies = (p) => {
  const pkgFile = path.resolve(PACKAGES_DIR, p, 'package.json');
  const result = JSON.parse(fs.readFileSync(pkgFile, { encoding: 'utf8' })).dependencies || {};
  return Object.keys(result);
};

const onwarn = ({ code, message }) => {
  // skip unresolved import
  if (code === 'THIS_IS_UNDEFINED' || code === 'MISSING_GLOBAL_NAME') {
    return;
  }

  // throw on others
  if (code === 'NON_EXISTENT_EXPORT') {
    throw new Error(message);
  }

  // console.warn everything else
  console.warn(message);
};

const buildUmd = (p, moduleName, minify = false) => {
  const rbc = rollupBabelrc();
  return rollup.rollup({
    input: path.resolve(PACKAGES_DIR, p, 'src/index.js'),
    external: [
      'websocket',
    ],
    plugins: [
      rollupResolve({
        preferBuiltins: false,
        browser: true,
      }),
      rollupJson(),
      rollupCommonjs(),
      rollupGlobals(),
      rollupBuiltins(),
      rollupBabel(rbc),
      rollupReplace({
        exclude: `./packages/${p}/node_modules/**`,
        ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
      }),
      minify ? rollupUglify() : {},
    ],
    onwarn,
  }).then(bundle => bundle.write({
    file: path.resolve(DIST, `${p}${minify ? '.min' : ''}.js`),
    name: moduleName,
    format: 'umd',
    sourcemap: minify,
    globals: {
      websocket: 'WebSocket',
    },
  })).catch((e) => {
    gutil.log(e);
  });
};


//
// Babel tasks
//

gulp.task('version', () => {
  if (!version.version) return;
  gulp.src(['./package.json'])
    .pipe(replace(/\"version\"\: \"([\.0-9\-a-z]*)\"/, `"version": "${version.version}"`))
    .pipe(gulp.dest('./'));
  gulp.src(['./bower.json'])
    .pipe(replace(/\"version\"\: \"([\.0-9\-a-z]*)\"/, `"version": "${version.version}"`))
    .pipe(gulp.dest('./'));
  gulp.src(['./package.js'])
    .pipe(replace(/version\: \'([\.0-9\-a-z]*)\'/, `version: '${version.version}'`))
    .pipe(gulp.dest('./'));
});

gulp.task('lint', () => gulp.src(scripts)
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError()));

gulp.task('clean', () => del([DIST, `${PACKAGES_DIR}/*/lib`]));

gulp.task('build', () => gulp
  .src(scripts, { base: PACKAGES_DIR })
  .pipe(plumber({
    errorHandler (err) {
      gutil.log(err.stack);
    },
  }))
  .pipe(newer({
    dest: PACKAGES_DIR,
    map: swapSrcWithLib,
  }))
  .pipe(through.obj((file, enc, callback) => {
    gutil.log('Compiling', `'${chalk.cyan(file.relative)}'...`);
    callback(null, file);
  }))
  .pipe(babel())
  .pipe(through.obj((file, enc, callback) => {
    // Passing 'file.relative' because newer() above uses a relative path and this keeps it consistent.
    file.path = path.resolve(file.base, swapSrcWithLib(file.relative));
    callback(null, file);
  }))
  .pipe(gulp.dest(PACKAGES_DIR)));

gulp.task('watch', ['build'], () => {
  watch(scripts, { debounceDelay: 200 }, () => {
    gulp.start('build');
  });
});

// Create task for each package name
packages.forEach((p) => {
  gulp.task(p, ['build'], () => {
    // Get module name for umd/iife
    const moduleName = packageModules[p];
    return Promise.all([
      buildUmd(p, moduleName),
      buildUmd(p, moduleName, true),
    ]);
  });
});

gulp.task('all', ['build', ...packages]);
gulp.task('default', ['build', 'web3']);
