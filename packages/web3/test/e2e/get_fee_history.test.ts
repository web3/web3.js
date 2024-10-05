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
import { feeHistorySchema } from 'web3-eth';

import Web3, { FMT_BYTES, FMT_NUMBER, Numbers } from '../../src';
import { getSystemE2ETestProvider } from './e2e_utils';
import { closeOpenConnection, getSystemTestBackend } from '../shared_fixtures/system_tests_utils';
import { toAllVariants } from '../shared_fixtures/utils';

describe(`${getSystemTestBackend()} tests - estimateGas`, () => {
	const provider = getSystemE2ETestProvider();
	const blockData: {
		earliest: 'earliest';
		latest: 'latest';
		pending: 'pending';
		finalized: 'finalized';
		safe: 'safe';
		blockNumber: number;
		blockHash: string;
	} = {
		earliest: 'earliest',
		latest: 'latest',
		pending: 'pending',
		finalized: 'finalized',
		safe: 'safe',
		blockNumber: getSystemTestBackend() === 'sepolia' ? 3240768 : 17029884,
		blockHash:
			getSystemTestBackend() === 'sepolia'
				? '0xe5e66eab79bf9236eface52c33ecdbad381069e533dc70e3f54e2f7727b5f6ca'
				: '0x2850e4a813762b2de589fa5268eacb92572defaf9520608deb129699e504cab2',
	};

	let web3: Web3;

	beforeAll(() => {
		web3 = new Web3(provider);
	});

	afterAll(async () => {
		await closeOpenConnection(web3);
	});

	it.each(
		toAllVariants<{
			blockCount: Numbers;
			newestBlock: 'earliest' | 'latest' | 'pending' | 'finalized' | 'safe' | 'blockNumber';
			rewardPercentiles: Numbers[];
			format: string;
		}>({
			blockCount: [1, '2', 3, BigInt(4)],
			newestBlock: ['earliest', 'latest', 'safe', 'finalized', 'blockNumber'],
			rewardPercentiles: [['0xa', '20', 30, BigInt(40)]],
			format: Object.values(FMT_NUMBER),
		}),
	)('getFeeHistory', async ({ blockCount, newestBlock, rewardPercentiles, format }) => {
		const result = await web3.eth.getFeeHistory(
			blockCount,
			blockData[newestBlock],
			rewardPercentiles,
			{
				number: format as FMT_NUMBER,
				bytes: FMT_BYTES.HEX,
			},
		);

		const resultKeys = Object.keys(result);
		const schemaProperties = Object.keys(feeHistorySchema.properties);
		resultKeys.forEach(prop => expect(schemaProperties).toContain(prop));
	});
});
