const webpack = require('webpack');

module.exports = {
	// mode: 'development',
	target: 'web',
	stats: {
		modules: true,
		colors: true,
	},
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: 'ts-loader',
				exclude: [/node_modules/, /unit/],
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
		fallback: {
			fs: false,
			net: false,
			util: require.resolve('util'),
			http: require.resolve('http-browserify'),
			https: require.resolve('https-browserify'),
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
