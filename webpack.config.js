const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// https://github.com/webpack/webpack/issues/13572#issuecomment-923736472
const crypto = require("crypto");
const crypto_createHash_alg = crypto.createHash;
crypto.createHash = (algorithm, options ) => crypto_createHash_alg(algorithm == "md4" ? "sha256" : algorithm, options);

module.exports = {
    mode: "production",
    entry: {
        web3: "./packages/web3/lib/index.js",
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.SourceMapDevToolPlugin({
            filename: "[file].map",
        }),
        new webpack.IgnorePlugin({
            checkResource(resource) {
                // "@ethereumjs/common/genesisStates" consists ~800KB static files which are no more needed
                return /(.*\/genesisStates\/.*\.json)/.test(resource)
            },
        }),
    ],
    resolve: {
        alias: {
            // To avoid blotting up the `bn.js` library all over the packages 
            // use single library instance. 
            "bn.js": path.resolve(__dirname, 'node_modules/bn.js')
        }
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    useBuiltIns: "entry",
                                    corejs: 3,
                                    targets: {
                                        ie: 10,
                                    },
                                },
                            ],
                        ],
                        plugins: [
                            "@babel/plugin-transform-runtime",
                            "@babel/plugin-transform-modules-commonjs",
                        ],
                    },
                },
            },
        ],
    },
    output: {
        filename: "[name].min.js",
        path: path.resolve(__dirname, "dist"),
        library: "Web3",
        libraryTarget: "umd",
    },
};
