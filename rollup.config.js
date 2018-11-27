import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import autoExternal from 'rollup-plugin-auto-external';

const config = [
    {
        input: 'src/index.js',
        output: [
            {
                file: '',
                format: 'cjs'
            },
            {
                name: '',
                file: '',
                format: 'umd',
                globals: {}
            }
        ],
        plugins: [
            babel({
                exclude: 'node_modules/**',
                babelrc: false,
                presets: [
                    [
                        '@babel/env',
                        {
                            modules: false,
                            targets: {
                                node: '6',
                                browsers: 'last 2 versions'
                            }
                        }
                    ]
                ],
                plugins: [
                    '@babel/plugin-proposal-export-default-from',
                    '@babel/plugin-proposal-export-namespace-from'
                ]
            }),
            json(),
            autoExternal()
        ]
    },
    {
        input: 'src/index.js',
        output: [
            {
                file: '',
                format: 'es'
            }
        ],
        plugins: [
            babel({
                exclude: 'node_modules/**',
                plugins: [
                    '@babel/plugin-proposal-export-default-from',
                    '@babel/plugin-proposal-export-namespace-from'
                ]
            }),
            json(),
            autoExternal()
        ]
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

    return config;
};
