import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import autoExternal from 'rollup-plugin-auto-external';
import cleanup from 'rollup-plugin-cleanup';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import {terser} from 'rollup-plugin-terser';
import bundleSize from 'rollup-plugin-bundle-size';

const config = [
    {
        input: 'src/index.js',
        output: [
            {
                file: '',
                format: 'cjs',
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
                                node: '8'
                            }
                        }
                    ]
                ],
                plugins: [
                    ['@babel/plugin-transform-runtime']
                ]
            }),
            json(),
            autoExternal(),
            cleanup()
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
            cleanup()
        ]
    },
    {
        input: 'src/index.js',
        output: [
            {
                name: '',
                file: '',
                format: 'umd',
                exports: 'named',
                sourcemap: true,
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
                                forceAllTransforms: true,
                                modules: false,
                                targets: {
                                    browsers: 'last 2 versions'
                                }
                            }
                        ]
                    ],
                    plugins: [
                        ['@babel/plugin-transform-runtime', {useESModules: true}]
                    ]
                }
            ),
            json(),
            builtins(),
            terser({sourcemap: true}),
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
 * @param {boolean} cjsNamedExports
 *
 * @returns {Array}
 */
export default (name, outputFileName, globals, dedupe, cjsNamedExports) => {
    // CJS
    config[0].output[0].file = 'dist/' + outputFileName + '.cjs.js';

    if (cjsNamedExports) {
        config[0].output[0].exports = 'named';
    }

    // ESM
    config[1].output[0].file = 'dist/' + outputFileName + '.esm.js';

    if (process.env.MINIFIED_BUNDLES === 'true') {
        // Minified UMD
        config[2].output[0].name = name;
        config[2].output[0].file = 'dist/' + outputFileName + '.min.js';
        config[2].output[0].globals = globals;

        config[2].plugins = [
            resolve({
                browser: true,
                preferBuiltins: true,
                dedupe: dedupe
            })
        ].concat(config[2].plugins);
    } else {
        config.pop();
    }

    return config;
};
