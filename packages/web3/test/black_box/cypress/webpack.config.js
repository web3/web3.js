const webpack = require('webpack');

module.exports = {
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: [/node_modules/],
				use: [
					{
						loader: 'ts-loader',
					},
				],
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
		fallback: {
			fs: false,
			net: false,
			crypto: require.resolve('crypto-browserify'),
			stream: require.resolve('readable-stream'),
		},
	},
	plugins: [
		new webpack.ProvidePlugin({
			Buffer: ['buffer', 'Buffer'],
		}),
		new webpack.ProvidePlugin({
			process: 'process/browser',
		}),
	],
};
