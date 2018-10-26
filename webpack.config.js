var path = require('path');
var DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
var BabelMinify = require('babel-minify-webpack-plugin');

module.exports = {
    entry: './packages/web3/src/index.js',
    output: {
        filename: 'web3.min.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        alias: {
            'web3-core': path.resolve(__dirname, 'packages/web3-core/src'),
            'web3-core-method': path.resolve(__dirname, 'packages/web3-core-method/src'),
            'web3-core-subscriptions': path.resolve(__dirname, 'packages/web3-core-subscriptions/src'),
            'web3-core-promievent': path.resolve(__dirname, 'packages/web3-core-promievent/src'),
            'web3-core-helpers': path.resolve(__dirname, 'packages/web3-core-helpers/src'),
            'web3-utils': path.resolve(__dirname, 'packages/web3-utils/src'),
            'web3-providers': path.resolve(__dirname, 'packages/web3-providers/src'),
            'web3-eth-abi': path.resolve(__dirname, 'packages/web3-eth-abi/src'),
            'web3-eth-accounts': path.resolve(__dirname, 'packages/web3-eth-accounts/src'),
            'web3-eth-contract': path.resolve(__dirname, 'packages/web3-eth-contract/src'),
            'web3-eth-ens': path.resolve(__dirname, 'packages/web3-eth-ens/src'),
            'web3-eth-iban': path.resolve(__dirname, 'packages/web3-eth-iban/src'),
            'web3-eth-personal': path.resolve(__dirname, 'packages/web3-eth-personal/src'),
            'web3-bzz': path.resolve(__dirname, 'packages/web3-bzz/src'),
            'bn.js': path.resolve(__dirname, 'node_modules/bn.js'),
            'underscore': path.resolve(__dirname, 'node_modules/underscore'),
            'elliptic': path.resolve(__dirname, 'node_modules/elliptic'),
            'asn1.js': path.resolve(__dirname, 'node_modules/asn1.js'),
            'hash.js': path.resolve(__dirname, 'node_modules/hash.js'),
            'browser.js': path.resolve(__dirname, 'node_modules/browser.js'),
            'eth-lib': path.resolve(__dirname, 'node_modules/eth-lib'),
            'browserify-aes': path.resolve(__dirname, 'node_modules/browserify-aes'),
            'browserify-sign': path.resolve(__dirname, 'node_modules/browserify-sign'),
            'sha.js': path.resolve(__dirname, 'node_modules/sha.js'),
            'des.js': path.resolve(__dirname, 'node_modules/des.js'),
            'diffie-hellman': path.resolve(__dirname, 'node_modules/diffie-hellman'),
            'md5.js': path.resolve(__dirname, 'node_modules/md5.js'),
            'js-sha3': path.resolve(__dirname, 'node_modules/js-sha3'),
            'parse-asn1': path.resolve(__dirname, 'node_modules/parse-asn1')
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                useBuiltIns: 'usage',
                                targets: {
                                    browsers: [
                                        'last 2 Chrome versions',
                                        'last 2 Safari versions',
                                        'last 2 Edge versions',
                                        'last 2 Firefox versions',
                                        'last 2 Electron versions',
                                        'last 2 Opera versions'
                                    ],
                                    node: true
                                }
                            }
                        ]
                    ],
                    plugins: [
                        '@babel/plugin-proposal-export-default-from',
                        '@babel/plugin-proposal-export-namespace-from'
                    ]
                }
            }
        ]
    },
    plugins: [new DuplicatePackageCheckerPlugin()],
    optimization: {
        minimizer: [new BabelMinify()]
    }
};
