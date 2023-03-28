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

const { getWebPackConfig } = require('../../webpack.base.config');

const config = getWebPackConfig(
	__dirname,
	'web3.min.js',
	'Web3',
	'src/web3.ts',
	'tsconfig.cjs.json',
);
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
	...config,
	plugins: [
		...config.plugins,
		new BundleAnalyzerPlugin({
			generateStatsFile: true,
			statsFilename: process.env.STATS_FILE ?? 'stats.json',
			defaultSizes: process.env.ANALYZE_SERVER ? 'stat' : 'gzip',
			analyzerMode: process.env.ANALYZE_SERVER ? 'server' : 'json',
		}),
	],
};
