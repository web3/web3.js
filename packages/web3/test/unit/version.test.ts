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

import { Web3PkgInfo } from '../../src/version';
import packageFile from '../../package.json';

describe('web3 package info', () => {
	it('should Web3PkgInfo.version returns the same version set at package.json', () => {
		expect(packageFile.version).toEqual(Web3PkgInfo.version);
	});
});
