import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import autoExternal from 'rollup-plugin-auto-external';
import cleanup from 'rollup-plugin-cleanup';
import nodeGlobals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import {terser} from 'rollup-plugin-terser';
import bundleSize from 'rollup-plugin-bundle-size';
import resolve from 'path';

/**
 * Returns the rollup configuration with globals and names set.
 *
 * @param {String} name
 * @param {String} outputFileName
 * @param {Object} globals
 * @param {Array} dedupe
 * @param {boolean} namedExports
 *
 * @returns {Array}
 */
export default (name, outputFileName, globals, dedupe, namedExports) => {
    let mappedConfig = [];

    // CJS
    if (process.env.CJS === 'true') {
        mappedConfig.push(
            rollupConfig(
                'src/index.js',
                'dist/' + outputFileName + '.cjs.js',
                name,
                'cjs',
                namedExports ? 'named' : 'auto',
                {},
                {
                    exclude: 'node_modules/**',
                    targets: {
                        node: '8'
                    }
                }
            )
        );
    }

    // ESM
    if (process.env.ESM === 'true') {
        mappedConfig.push(
            rollupConfig(
                'src/index.js',
                'dist/' + outputFileName + '.esm.js',
                name,
                'es',
                'auto',
                {},
                {
                    exclude: 'node_modules/**',
                    targets: {
                        node: '8'
                    }
                }
            )
        );
    }

    // Minified UMD
    if (process.env.MINIFIED_BUNDLES === 'true') {
        mappedConfig.push(
            rollupConfig(
                'src/index.js',
                'dist/' + outputFileName + '.min.js',
                name,
                'min',
                namedExports ? 'named' : 'auto',
                globals,
                {
                    forceAllTransforms: true,
                    exclude: 'node_modules/@babel/runtime/**',
                    minified: true,
                    targets: {
                        browsers: 'last 2 versions'
                    },
                    transformRuntimeOptions: {absoluteRuntime: true}
                },
                {
                    dedupe: dedupe
                }
            )
        );
    }

    return mappedConfig;
};

/**
 * Generates and returns a rollup config item
 *
 * @method rollupConfig
 *
 * @param {string} input
 * @param {string} outputFile
 * @param {string} outputName
 * @param {string} outputType
 * @param {string} exports
 * @param {object} globals
 * @param {object} babelOptions
 * @param {object} resolverOptions
 *
 * @returns {{output: ({file, sourcemap, exports, globals, name, format}|{file, sourcemap, exports, format}), input: *, plugins: *[]}}
 */
function rollupConfig(input, outputFile, outputName, outputType, exports = 'auto', globals = {}, babelOptions = {}, resolverOptions = {}) {
    return {
        input: input,
        output: getOutput(outputFile, outputType, outputName, exports, globals),
        plugins: getPlugins(outputType, babelOptions, resolverOptions)
    };
}

/**
 * Returns the correct output configuration
 *
 * @method getOutput
 *
 * @param {string} file
 * @param {string} type
 * @param {string} name
 * @param {string} exports
 * @param {object} globals
 *
 * @returns {{file: *, sourcemap: boolean, exports, format: *}|{file: *, sourcemap: boolean, exports: string, globals: *, name: *, format: string}}
 */
function getOutput(file, type, name, exports, globals) {
    switch (type) {
        case 'min':
            return {
                exports: 'default',
                name: name,
                file: file,
                format: 'umd',
                sourcemap: true,
                globals: globals
            };
        case 'es':
        case 'cjs':
            return {
                exports: exports,
                name: name,
                file: file,
                format: type,
                sourcemap: true
            };
    }
}

/**
 * Returns the correct plugins array
 *
 * @method getPlugins
 *
 * @param {string} type
 * @param {object} babelOptions
 * @param {object} resolverOptions
 *
 * @returns {Array}
 */
function getPlugins(type, babelOptions, resolverOptions) {
    const babelPlugin = babel(
        getBabelConfig(
            babelOptions.exclude,
            babelOptions.targets,
            babelOptions.forceAllTransforms,
            babelOptions.transformRuntimeOptions,
            babelOptions.minified
        )
    );

    switch (type) {
        case 'min':
            return [
                resolve(
                    {
                        browser: true,
                        preferBuiltins: true
                    }.assign(resolverOptions)
                ),
                commonjs(),
                babelPlugin,
                nodeGlobals(),
                json(),
                builtins(),
                terser({sourcemap: true}),
                bundleSize()
            ];
        case 'cjs':
        case 'es':
            return [
                commonjs(),
                babelPlugin,
                json(),
                autoExternal(),
                cleanup()
            ];
    }
}


/**
 * Returns the correct babel config
 *
 * @method getBabelConfig
 *
 * @param {Array|string} exclude
 * @param {object} targets
 * @param {boolean} forceAllTransforms
 * @param {object} transformRuntimeOptions
 * @param {boolean} minified
 *
 * @returns {{minified: boolean, presets: *[][], babelrc: boolean, plugins: *[][], runtimeHelpers: boolean, exclude: *}}
 */
function getBabelConfig(exclude, targets, forceAllTransforms = false, transformRuntimeOptions = {}, minified = false) {
    let plugins = [
        [
            '@babel/plugin-transform-runtime',
            Object.assign({useESModules: true}, transformRuntimeOptions)
        ]
    ];

    if (process.env.TEST) {
        plugins.push('istanbul');
    }

    return {
        exclude: exclude,
        babelrc: false,
        runtimeHelpers: true,
        minified: minified,
        presets: [
            [
                '@babel/preset-env',
                {
                    forceAllTransforms: forceAllTransforms,
                    modules: false,
                    targets: targets
                }
            ]
        ],
        plugins: plugins
    };
}
