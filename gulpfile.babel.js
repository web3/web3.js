import _ from 'lodash';
import del from 'del';
import gulp from 'gulp';
import git from 'gulp-git';

import config from './gulp/config.js';
import buildUmd from './gulp/buildUmd.js';
import fixFileVersions from './gulp/fixFileVersions.js';
import transpile from './gulp/transpile.js';
import lint from './gulp/lint.js';

// Create a build task for each package
_.each(config.packages, (p) => {
    gulp.task(p, async () => {
        await buildUmd(p);
        await buildUmd(p, true);
    });
});

gulp.task('watch', () => {
    const options = {
        delay: 200,
        ignoreInitial: false
    };

    gulp.watch(config.scripts, options, () => lint());
});

gulp.task('clean', () => {
    git.clean(`${config.DIST}`, { args: '-fxd' }, _.noop);

    return del([`${config.PACKAGES_DIR}/*/lib`]);
});

gulp.task('lint', () => lint(true));
gulp.task('build', gulp.series('lint', transpile));
gulp.task('version', fixFileVersions);
gulp.task('all', gulp.series('build', ...config.packages));
gulp.task('default', gulp.series('build', 'web3'));
