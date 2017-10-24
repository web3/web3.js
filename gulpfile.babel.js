import _ from 'lodash';
import del from 'del';
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import watch from 'gulp-watch';
import runSequence from 'run-sequence';

import buildUmd from './gulp/buildUmd.js';
import fixFileVersions from './gulp/fixFileVersions.js';
import transpile from './gulp/transpile.js';
import config from './gulp/config.js';

gulp.task('lint', () => gulp.src(config.lintableFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));

gulp.task('watch', ['lint'], () => {
    watch(config.scripts, { debounceDelay: 200 }, () => {
        gulp.start('lint');
    });
});

gulp.task('build', transpile);
gulp.task('version', fixFileVersions);
gulp.task('clean', () => del([config.DIST, `${config.PACKAGES_DIR}/*/lib`]));
gulp.task('all', ['lint'], (done) => {
    runSequence(...config.packages, () => done());
});
gulp.task('default', ['lint', 'web3']);

// Create task for each package
_.each(config.packages, (p) => {
    gulp.task(p, () =>
        Promise.all([
            buildUmd(p),
            buildUmd(p, true)
        ]));
});
