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
                sourcemap: true,
                exports: 'named'
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
                                node: '8'
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
                format: 'iife',
                sourcemap: true,
                exports: 'named',
                globals: {}
            }
        ],
        plugins: [
            commonjs(),
            babel(
                {
                    babelrc: false,
                    runtimeHelpers: true,
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                modules: false,
                                targets: {
                                    browsers: 'last 2 versions'
                                }
                            }
                        ]
                    ],
                    plugins: [
                        ['@babel/plugin-transform-runtime', {'regenerator': true}]
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
        ]
    }
];

/**
 * Returns the rollup configuration with globals and names set.
 *
 * @param {String} name
 * @param {String} outputFileName
 * @param {Object} globals
 * @param {Array} dedupe
 *
 * @returns {Array}
 */
export default (name, outputFileName, globals, dedupe) => {
    // CJS
    config[0].output[0].file = 'dist/' + outputFileName + '.cjs.js';

    // ESM
    config[1].output[0].file = 'dist/' + outputFileName + '.esm.js';

    // Minified UMD
    config[2].output[0].name = name;
    config[2].output[0].file = 'dist/' + outputFileName + '.min.js';
    config[2].output[0].globals = globals;
    config[2].plugins = [
        resolve({
            browser: true,
            preferBuiltins: true,
            dedupe: ['@babel/runtime'].concat(dedupe)
        })
    ].concat(config[2].plugins);

    return config;
};
