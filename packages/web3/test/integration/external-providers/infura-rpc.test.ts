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

import Web3 from '../../../src/index';
import { describeIf, isIpc, itIf } from '../../shared_fixtures/system_tests_utils';

describeIf(!isIpc)('compatibility with `infura` remote rpc providers', () => {
	itIf(
		process.env.INFURA_GOERLI_WS
			? process.env.INFURA_GOERLI_WS.toString().includes('ws')
			: false,
	)('should create Web3 class instance with `ws` string connection', () => {
		const web3 = new Web3(process.env.INFURA_GOERLI_WS);
		// eslint-disable-next-line jest/no-standalone-expect
		expect(web3).toBeInstanceOf(Web3);
	});

	itIf(
		process.env.INFURA_GOERLI_HTTP
			? process.env.INFURA_GOERLI_HTTP.toString().includes('http')
			: false,
	)('should create Web3 class instance with `http` string connection', () => {
		const web3 = new Web3(process.env.INFURA_GOERLI_HTTP);
		// eslint-disable-next-line jest/no-standalone-expect
		expect(web3).toBeInstanceOf(Web3);
	});
});
