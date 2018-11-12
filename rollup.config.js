import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import autoExternal from 'rollup-plugin-auto-external';
import commonjs from 'rollup-plugin-commonjs';
import builtins from 'rollup-plugin-node-builtins';

const config = [
    {
        input: 'src/index.js',
        output: {
            name: 'Web3',
            file: '',
            format: 'umd'
        },
        plugins: [
            autoExternal(),
            commonjs(),
            builtins(),
            resolve(),
            json(),
            babel({
                exclude: 'node_modules/**',
                plugins: [
                    '@babel/plugin-proposal-export-default-from',
                    '@babel/plugin-proposal-export-namespace-from'
                ]
            }),
        ]
    },
    {
        input: 'src/index.js',
        output: [
            {
                file: '',
                format: 'cjs',
            },
            {
                file: '',
                format: 'es',
            }
        ],
        plugins: [
            json(),
            autoExternal()
        ]
    }
];

export default (name, outputFileName) => {
    config[0].output.name = name;
    config[0].output.file = 'dist/' + outputFileName + '.umd.js';
    config[1].output[0].file = 'dist/' + outputFileName + '.cjs.js';
    config[1].output[1].file = 'dist/' + outputFileName + '.esm.js';

    return config;
};
