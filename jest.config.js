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
const { lstatSync, readdirSync } = require('fs');
// get listing of packages in the mono repo
const basePath = path.resolve(__dirname, 'packages');
const packages = readdirSync(basePath).filter(name =>
	lstatSync(path.join(basePath, name)).isDirectory(),
);
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleNameMapper: {
		...packages.reduce(
			(acc, name) => ({
				...acc,
				[`${name}(.*)$`]: `<rootDir>/packages/./${name}/$1`,
			}),
			{},
		),
	},
};
