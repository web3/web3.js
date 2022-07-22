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
import { FilterResultsAPI, Filter } from 'web3-types';

export const mockRpcResponse: FilterResultsAPI = [
	{
		logIndex: '0x1',
		blockNumber: '0x1b4',
		blockHash: '0x8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcfdf829c5a142f1fccd7d',
		transactionHash: '0xdf829c5a142f1fccd7d8216c5785ac562ff41e2dcfdf5785ac562ff41e2dcf',
		transactionIndex: '0x0',
		address: '0x16c5785ac562ff41e2dcfdf829c5a142f1fccd7d',
		data: '0x0000000000000000000000000000000000000000000000000000000000000000',
		topics: ['0x59ebeb90bc63057b6515673c3ecf9438e5058bca0f92585014eced636878c9a5'],
	},
];

const filter: Filter = {
	address: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
	topics: [
		'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
		// Using "null" value intentionally for validation
		// eslint-disable-next-line no-null/no-null
		null,
		[
			'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
			'0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
		],
	],
};

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - filter
 */
type TestData = [string, [Filter]];
export const testData: TestData[] = [[JSON.stringify(filter), [filter]]];
