import path from 'path';
import glob from 'glob';
import root from 'root-path';

const PACKAGES_DIR = root('packages');
const packages = glob.sync(`${PACKAGES_DIR}/*`).map(d => path.basename(d));
const scripts = './packages/*/src/**/*.js';

export default {
    DIST: root('dist/'),
    PACKAGES_DIR,
    packages,
    scripts,
    lintableFiles: [
        scripts,
        './*.js',
        './gulp/**/*.js'
        // Disable linting tests until we've finished converting them to ES6
        // './test/**/*.js'
    ]
};
