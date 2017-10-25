import path from 'path';
import gutil from 'gulp-util';
import { rollup } from 'rollup';
import rollupBabelrc from 'babelrc-rollup';
import rollupReplace from 'rollup-plugin-replace';
import rollupBabel from 'rollup-plugin-babel';
import rollupProgress from 'rollup-plugin-progress';
import rollupResolve from 'rollup-plugin-node-resolve';
import rollupJson from 'rollup-plugin-json';
import rollupCommonjs from 'rollup-plugin-commonjs';
import rollupUglify from 'rollup-plugin-uglify';
import rollupGlobals from 'rollup-plugin-node-globals';
import rollupBuiltins from 'rollup-plugin-node-builtins';

import moduleNameMappings from './moduleNameMappings.js';
import config from './config.js';

export default buildUmd;

function log(msg, color = 'green') {
    if (!msg) {
        // eslint-disable-next-line no-console
        console.log(); // Blank line

        return;
    }

    gutil.log(gutil.colors[color](msg));
}

async function buildUmd(p, minify = false) {
    const rbc = rollupBabelrc();
    rbc.runtimeHelpers = true;
    rbc.exclude = 'node_modules/**';

    try {
        log(`Compiling ${p} (minified: ${minify})...`);

        const bundle = await rollup({
            input: path.resolve(config.PACKAGES_DIR, p, 'src/index.js'),
            external: [
                'websocket'
            ],
            plugins: [
                rollupProgress(),
                rollupResolve({
                    preferBuiltins: false,
                    browser: true
                }),
                rollupJson(),
                rollupCommonjs(),
                rollupGlobals(),
                rollupBuiltins({ crypto: true }),
                rollupBabel(rbc),
                rollupReplace({
                    exclude: `./packages/${p}/node_modules/**`,
                    ENV: JSON.stringify(process.env.NODE_ENV || 'production')
                }),
                minify ? rollupUglify() : {}
            ],
            onwarn
        });

        const baseFilename = `${p}${minify ? '.min' : ''}.js`;
        const file = path.resolve(config.DIST, baseFilename);
        log();
        log(`Saving compiled module to ${baseFilename}...`);

        await bundle.write({
            file,
            name: getModuleName(p),
            format: 'umd',
            sourcemap: minify,
            globals: {
                websocket: 'WebSocket'
            }
        });

        log('Done.');
    } catch (err) {
        log();
        log(err, 'red');
    }
}

function onwarn(warning, warn) {
    switch (warning.code) {
        case 'EVAL':
            return;

        case 'NON_EXISTENT_EXPORT':
            throw new Error(warning.message);

        default:
            warn(warning);
    }
}

function getModuleName(p) {
    const moduleName = moduleNameMappings[p];

    if (!moduleName) {
        throw new Error(`Could not find a module name for the package: ${p}`);
    }

    return moduleName;
}
