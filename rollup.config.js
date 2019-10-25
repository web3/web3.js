import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import autoExternal from 'rollup-plugin-auto-external';
import cleanup from 'rollup-plugin-cleanup';
import sourcemaps from 'rollup-plugin-sourcemaps';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import minify from 'rollup-plugin-babel-minify';
import builtins from 'rollup-plugin-node-builtins';
import bundleSize from 'rollup-plugin-bundle-size';

const config = [
    {
        input: 'src/index.js',
        output: [
            {
                file: '',
                format: 'cjs',
                sourcemap: true
            },
            {
                name: '',
                file: '',
                format: 'umd',
                globals: {},
                sourcemap: true
            }
        ],
        plugins: [
            commonjs(),
            babel({
                exclude: 'node_modules/**',
                babelrc: false,
                runtimeHelpers: true,
                presets: [
                    [
                        '@babel/env',
                        {
                            modules: false,
                            targets: {
                                node: '8',
                                browsers: 'last 2 versions'
                            }
                        }
                    ]
                ],
                plugins: [
                    ['@babel/plugin-transform-runtime', {
                        'helpers': true,
                        'regenerator': true
                    }]
                ]
            }),
            json(),
            autoExternal(),
            cleanup(),
            sourcemaps()
        ]
    },
    {
        input: 'src/index.js',
        output: [
            {
                file: '',
                format: 'es',
                sourcemap: true
            }
        ],
        plugins: [
            commonjs(),
            babel({
                exclude: 'node_modules/**'
            }),
            json(),
            autoExternal(),
            cleanup(),
            sourcemaps()
        ]
    },
    {
        input: 'src/index.js',
        output: [
            {
                name: '',
                file: '',
                format: 'umd',
                sourcemap: true
            }
        ],
        plugins: [
            resolve({
                browser: true,
                dedupe: ['bn.js'],
                preferBuiltins: true
            }),
            commonjs(),
            babel(
                {
                    babelrc: false,
                    presets: [
                        ['@babel/preset-env', {modules: false}]
                    ]
                }
            ),
            builtins(),
            json(),
            cleanup(),
            minify({
                comments: false
            }),
            bundleSize()
        ],
        onwarn: (warning, warn) => {
            console.log(warning.code, warning.importer);
        }
    }
];

/**
 * Returns the rollup configuration with globals and names set.
 *
 * @param {String} name
 * @param {String} outputFileName
 * @param {Object} globals
 *
 * @returns {Array}
 */
export default (name, outputFileName, globals) => {
    // CJS
    config[0].output[0].file = 'dist/' + outputFileName + '.cjs.js';

    // UMD
    config[0].output[1].name = name;
    config[0].output[1].file = 'dist/' + outputFileName + '.umd.js';
    config[0].output[1].globals = globals;

    // ESM
    config[1].output[0].file = 'dist/' + outputFileName + '.esm.js';

    // Minified UMD
    config[2].output[0].name = name;
    config[2].output[0].file = 'dist/' + outputFileName + '.min.js';

    return config;
};
