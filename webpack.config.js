const path = require("path");
const webpack = require("webpack");

module.exports = {
    mode: "production",
    entry: {
        web3: "./packages/web3/lib/index.js",
    },
    plugins: [
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
        },
        fallback: {
            buffer: require.resolve('buffer'),
            https: require.resolve('https-browserify'),
            http: require.resolve("stream-http"),
            stream: require.resolve("stream-browserify"),
            crypto: require.resolve("crypto-browserify"),
        },

    },
    plugins: [
		new webpack.ProvidePlugin({
			process: 'process/browser',
		}),
        new webpack.ProvidePlugin({
			Buffer: ['buffer', 'Buffer'],
		}),
	],
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
        clean: true,
    },
};
