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
import { validator } from 'web3-validator';
import { blockSchema } from 'web3-eth';
import { Transaction } from 'web3-types';

import Web3, { FMT_BYTES, FMT_NUMBER } from '../../src';
import { getSystemE2ETestProvider } from './e2e_utils';
import { closeOpenConnection, getSystemTestBackend, BACKEND } from '../shared_fixtures/system_tests_utils';
import { toAllVariants } from '../shared_fixtures/utils';
import { sepoliaBlockData } from './fixtures/sepolia';
import { mainnetBlockData } from './fixtures/mainnet';

describe(`${getSystemTestBackend()} tests - getBlock`, () => {
	const provider = getSystemE2ETestProvider();
	const blockData = getSystemTestBackend() === BACKEND.SEPOLIA ? sepoliaBlockData : mainnetBlockData;

	let web3: Web3;

	beforeAll(() => {
		web3 = new Web3(provider);
	});

	afterAll(async () => {
		await closeOpenConnection(web3);
	});

	it.each(
		toAllVariants<{
			block:
				| 'latest'
				| 'pending'
				| 'finalized'
				| 'safe'
			hydrated: boolean;
			format: string;
		}>({
			block: ['pending', 'latest', 'safe', 'finalized'],
			hydrated: [true, false],
			format: Object.values(FMT_NUMBER),
		}),
	)('getBlock', async ({ hydrated, block, format }) => {
		const result = {
			...(await web3.eth.getBlock(blockData[block], hydrated, {
				number: format as FMT_NUMBER,
				bytes: FMT_BYTES.HEX,
			})),
		};

		if (blockData[block] === 'pending') {
			result.nonce = '0x0';
			result.miner = '0x0000000000000000000000000000000000000000';
			result.totalDifficulty = '0x0';
		}

		// eslint-disable-next-line jest/no-conditional-expect
		expect(validator.validateJSONSchema(blockSchema, result)).toBeUndefined();

		if (hydrated && result.transactions?.length > 0) {
			// eslint-disable-next-line jest/no-conditional-expect
			expect(result.transactions).toBeInstanceOf(Array<Transaction>);
		}
	});
});
