const webpack = require('webpack');
const path = require('path');
const os = require('os');
const { lstatSync, readdirSync } = require('fs');
// get listing of packages in the mono repo
const basePath = path.resolve(__dirname, 'packages');
const packages = readdirSync(basePath).filter(name => {
	return lstatSync(path.join(basePath, name)).isDirectory();
});
const listOfTests = packages.map(packageName =>
	path.join('packages', packageName, 'test', 'integration', '**', '*.ts'),
);

const webpackConfig = {
	mode: 'development',
	output: {
		filename: '[name].js',
		path: path.join(os.tmpdir(), '_karma_webpack_'),
	},
	stats: {
		modules: false,
		colors: true,
	},
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	externals: {
		fs: 'commonjs fs',
		path: 'commonjs path',
		net: 'commonjs net',
	},
	resolve: {
		extensions: ['.ts', '.js'],
		modules: [
			...packages.map(packageName =>
				path.join(__dirname, 'packages', packageName, 'node_modules'),
			),
			path.join(__dirname, 'node_modules'),
		],
		fallback: {
			crypto: require.resolve('crypto-browserify'),
			stream: 'readable-stream',
			// stream: require.resolve('stream-browserify'),
			path: require.resolve('path-browserify'),
			assert: require.resolve('assert/'),
			// buffer: require.resolve('buffer/'),
			hdwalletprovider: require.resolve('@truffle/hdwallet-provider'),
			// fs: require.resolve('fs/'),
			// net: require.resolve('net-browserify'),
			// util: require.resolve('util/'),
			// assert: require.resolve('assert/'),
			// url: false,
			// fs: false,
			// net: false,
			// util: false,
			// assert: false,
		},
	},
	watch: false,
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			minSize: 0,
			cacheGroups: {
				commons: {
					name: 'commons',
					chunks: 'initial',
					minChunks: 1,
				},
			},
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
module.exports = function (config) {
	config.set({
		plugins: [
			'karma-webpack',
			'karma-jasmine',
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			// 'karma-browserify',
		],
		browsers: ['ChromeHeadless', 'FirefoxHeadless'],
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: false,
		singleRun: true,
		port: 9876,
		concurrency: 10,
		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		// frameworks: ['webpack', 'jasmine', 'karma-browserify'],
		frameworks: ['webpack', 'jasmine'],
		// list of files / patterns to load in the browser
		// Here I'm including all of the the Jest tests which are all under the __tests__ directory.
		// You may need to tweak this patter to find your test files/
		files: listOfTests,
		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			// Use webpack to bundle our tests files
			...listOfTests.reduce(
				(res, packagePath) => ({ ...res, [packagePath]: ['webpack'] }),
				{},
			),
		},
		webpack: webpackConfig,
	});
};
