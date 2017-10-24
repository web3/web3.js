import gulp from 'gulp';
import replace from 'gulp-replace';

import { version } from '../lerna.json';

export default () => {
    if (!version) {
        throw new Error('version property is missing from lerna.json');
    }

    const jsonPattern = /"version": "[.0-9\-a-z]*"/;
    const jsPattern = /version: '[.0-9\-a-z]*'/;
    const meteorPattern = /ethereum:web3@[.0-9\-a-z]*/;
    const files = [
        './package.json',
        './package.js',
        './.versions'
    ];

    gulp.src(files, { base: './' })
        .pipe(replace(jsonPattern, `"version": "${version}"`))
        .pipe(replace(jsPattern, `version: '${version}'`))
        .pipe(replace(meteorPattern, `ethereum:web3@${version}`))
        .pipe(gulp.dest('./'));
};
