import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import pkg from './package.json';

export default [
    {
        input: 'src/index.js',
        output: {
            name: 'Web3Providers',
            file: pkg.browser,
            format: 'umd'
        },
        plugins: [
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
                file: pkg.main,
                format: 'cjs',
                plugins: [
                    json()
                ]
            },
            {
                file: pkg.module,
                format: 'es',
                plugins: [
                    json()
                ]
            }
        ]
    }
];
