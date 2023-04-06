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
import { FMT_BYTES, FMT_NUMBER } from 'web3-utils';
import { validator } from 'web3-validator';
import { blockSchema } from 'web3-eth';
import { Transaction } from 'web3-types';

import Web3 from '../../src';
import { getSystemE2ETestProvider } from './get_system_e2e_test_provider';
import { closeOpenConnection, getSystemTestBackend } from '../shared_fixtures/system_tests_utils';
import { toAllVariants } from '../shared_fixtures/utils';

describe(`${getSystemTestBackend()} tests - getBlock`, () => {
	const provider = getSystemE2ETestProvider();

	let web3: Web3;
	const blockData: {
		earliest: 'earliest';
		latest: 'latest';
		pending: 'pending';
		finalized: 'finalized';
		safe: 'safe';
		blockNumber: number;
		blockHash: string;
	} = {
		pending: 'pending',
		latest: 'latest',
		earliest: 'earliest',
		finalized: 'finalized',
		safe: 'safe',
		blockNumber: 3228743,
		blockHash: '0x0920dc080c576f88a5280fb5fb0b8fe70f1afa91ebcef52593a80f7fecf0838f',
	};

	beforeAll(() => {
		web3 = new Web3(provider);
	});

	afterAll(async () => {
		await closeOpenConnection(web3);
	});

	it.each(
		toAllVariants<{
			block:
				| 'earliest'
				| 'latest'
				| 'pending'
				| 'finalized'
				| 'safe'
				| 'blockHash'
				| 'blockNumber';
			hydrated: boolean;
			format: string;
		}>({
			block: ['earliest', 'latest', 'safe', 'finalized', 'blockHash', 'blockNumber'],
			hydrated: [true, false],
			format: Object.values(FMT_NUMBER),
		}),
	)('getBlock', async ({ hydrated, block, format }) => {
		const b = {
			...(await web3.eth.getBlock(blockData[block], hydrated, {
				number: format as FMT_NUMBER,
				bytes: FMT_BYTES.HEX,
			})),
		};
		if (blockData[block] === 'pending') {
			b.nonce = '0x0';
			b.miner = '0x0000000000000000000000000000000000000000';
			b.totalDifficulty = '0x0';
		}
		expect(validator.validateJSONSchema(blockSchema, b)).toBeUndefined();

		if (hydrated && b.transactions?.length > 0) {
			// eslint-disable-next-line jest/no-conditional-expect
			expect(b.transactions).toBeInstanceOf(Array<Transaction>);
		}
	});
});
