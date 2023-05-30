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

import { waitWithTimeout, setRequestIdStart } from 'web3-utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import In3Client from 'in3';

import Web3 from '../../../src/index';

// Actually it could take long time to get something from `in3` because of its decentralized nature.
// 	And because of that, this test only try to get the last block number. And this also simplifies the configuration needed.
describe('compatibility with `in3` provider', () => {
	it.skip('should get last block number', async () => {
		// use the In3Client as Http-Provider for web3.js
		const web3 = new Web3(
			new In3Client({
				proof: 'none',
				signatureCount: 0,
				requestCount: 1,
				chainId: 'mainnet',
			}).createWeb3Provider(),
		);

		// TODO: remove the next line after this issue is closed: https://github.com/blockchainsllc/in3/issues/46
		setRequestIdStart(0);

		// get the last block number
		const blockNumber = await waitWithTimeout(web3.eth.getBlockNumber(), 25000);

		if (typeof blockNumber === 'undefined') {
			console.warn(
				'It took too long for in3 provider to get a block. The test of in3 will be skipped',
			);
			return;
		}
		expect(typeof blockNumber).toBe('bigint');
	});
});
