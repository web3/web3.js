// rollup.config.js
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';

export default {
  input: 'src/index.js',
  output: {
    file: 'bundle.js',
    format: 'umd',
    name: 'Web3Bzz',
  },
  plugins: [
    resolve({
      preferBuiltins: true,
      browser: true,
    }),
    json(),
    commonjs(),
    globals(),
    builtins(),
    babel({
      "presets": [
        ["env", { modules: false }]
      ],
      "plugins": [
        "lodash",
        "transform-class-properties",
        "external-helpers",
      ],
      "babelrc": false,
      exclude: 'node_modules/**',
    })
  ],
  // indicate which modules should be treated as external
  external: ['lodash']
};
