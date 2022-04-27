/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
const path = require('path');
const webpack = require('webpack');
const os = require('os');
const { lstatSync, readdirSync } = require('fs');

const basePath = path.resolve(__dirname, 'packages');
const packages = readdirSync(basePath).filter(name => {
	if (name === 'web3-providers-ipc') {
		return false;
	}
	return lstatSync(path.join(basePath, name)).isDirectory();
});

const listOfTests = packages.map(packageName =>
	path.join('packages', packageName, 'test', 'integration', '**', '*.test.ts'),
);
const outputPath = path.join(os.tmpdir(), '_karma_webpack_');

const webpackConfig = {
	mode: 'development',
	output: {
		path: outputPath,
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
				exclude: [/node_modules/, /unit/],
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
			'node_modules',
			...packages.map(packageName =>
				path.join(__dirname, 'packages', packageName, 'node_modules'),
			),
			path.join(__dirname, 'node_modules'),
		],
		fallback: {
			crypto: require.resolve('crypto-browserify'),
			stream: 'readable-stream',
			assert: require.resolve('assert'),
			// jest: require.resolve('jest'),
		},
		alias: {
			'isomorphic-ws': path.join(__dirname, 'tools', 'isomorphic-ws'),
			jest: path.join(__dirname, 'node_modules', 'jest'),
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
		frameworks: ['webpack', 'jasmine', 'browserify'],
		plugins: [
			'karma-browserify',
			'karma-webpack',
			'karma-jasmine',
			'karma-chrome-launcher',
			// 'karma-firefox-launcher',
		],
		browsers: [
			// 'Chrome',
			'ChromeHeadless',
			// 'FirefoxHeadless',
		],
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: false,
		singleRun: true,
		port: 9876,
		concurrency: 10,
		files: ['./karma.setup.js', ...listOfTests],
		exclude: ['**/web3_instance_ipc_string.test.ts'],
		preprocessors: {
			'./karma.setup.js': ['webpack', 'browserify'],
			...listOfTests.reduce(
				(res, packagePath) => ({ ...res, [packagePath]: ['webpack', 'browserify'] }),
				{},
			),
		},
		browserify: {
			basedir: outputPath,
		},
		webpack: webpackConfig,
	});
};
