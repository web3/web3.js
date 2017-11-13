import gulp from 'gulp';
import eslint from 'gulp-eslint';

import config from './config.js';

export default (failOnError) => {
    let stream = gulp.src(config.lintableFiles)
        .pipe(eslint())
        .pipe(eslint.format());

    if (failOnError) {
        stream = stream.pipe(eslint.failAfterError());
    }

    return stream;
};
