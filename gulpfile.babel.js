import _ from 'lodash';
import del from 'del';
import gulp from 'gulp';
import eslint from 'gulp-eslint';
import watch from 'gulp-watch';

import buildUmd from './gulp/buildUmd.js';
import fixFileVersions from './gulp/fixFileVersions.js';
import transpile from './gulp/transpile.js';
import config from './gulp/config.js';

// Create task for each package
_.each(config.packages, (p) => {
    gulp.task(p, async () => {
        await buildUmd(p);
        await buildUmd(p, true);
    });
});

gulp.task('lint', () => gulp.src(config.lintableFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));

gulp.task('watch', gulp.series('lint', () => {
    watch(config.scripts, { debounceDelay: 200 }, () => {
        gulp.start('lint');
    });
}));

gulp.task('build', transpile);
gulp.task('version', fixFileVersions);
gulp.task('clean', () => del([config.DIST, `${config.PACKAGES_DIR}/*/lib`]));
gulp.task('all', gulp.series('lint', ...config.packages));
gulp.task('default', gulp.series('lint', 'web3'));
