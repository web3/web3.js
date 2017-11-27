import gulp from 'gulp';
import plumber from 'gulp-plumber';
import babel from 'gulp-babel';
import newer from 'gulp-newer';
import gutil from 'gulp-util';
import path from 'path';
import chalk from 'chalk';
import through from 'through2';

import config from './config.js';

export default transpile;

function transpile() {
    return gulp
        .src(config.scripts, { base: config.PACKAGES_DIR })
        .pipe(plumber({
            errorHandler(err) {
                gutil.log(err.stack);
            }
        }))
        .pipe(newer({
            dest: config.PACKAGES_DIR,
            map: swapSrcWithLib
        }))
        .pipe(through.obj((file, _enc, callback) => {
            gutil.log('Compiling', `'${chalk.cyan(file.relative)}'...`);
            callback(null, file);
        }))
        .pipe(babel())
        .pipe(through.obj((file, _enc, callback) => {
            // Passing 'file.relative' for consistency with newer() above
            // eslint-disable-next-line no-param-reassign
            file.path = path.resolve(file.base, swapSrcWithLib(file.relative));
            callback(null, file);
        }))
        .pipe(gulp.dest(config.PACKAGES_DIR));
}

function swapSrcWithLib(srcPath) {
    const parts = srcPath.split(path.sep);
    parts[1] = 'lib';

    return parts.join(path.sep);
}
