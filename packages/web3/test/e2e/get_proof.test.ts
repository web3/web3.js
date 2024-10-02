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
/* eslint-disable jest/no-conditional-expect */

import Web3, { AccountObject } from '../../src';
import { getSystemE2ETestProvider } from './e2e_utils';
import {
	closeOpenConnection,
	getSystemTestBackend,
	BACKEND,
} from '../shared_fixtures/system_tests_utils';
import { toAllVariants } from '../shared_fixtures/utils';
import { mainnetBlockData, mainnetProof } from './fixtures/mainnet';
import { sepoliaBlockData, sepoliaProof } from './fixtures/sepolia';

describe(`${getSystemTestBackend()} tests - getProof`, () => {
	const provider = getSystemE2ETestProvider();
	const blockData =
		getSystemTestBackend() === BACKEND.SEPOLIA ? sepoliaBlockData : mainnetBlockData;
	const expectedProof = getSystemTestBackend() === BACKEND.SEPOLIA ? sepoliaProof : mainnetProof;

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
				| 'earliest'
				| 'latest'
				| 'pending'
				| 'finalized'
				| 'safe'
				| 'blockHash'
				| 'blockNumber';
		}>({
			block: [
				// 'earliest', // error "distance to target block exceeds maximum proof window"
				'latest',
				// 'pending', // error "unknown block number"
				'safe',
				'finalized',
				// 'blockHash', // error "distance to target block exceeds maximum proof window"
				// 'blockNumber', // error "distance to target block exceeds maximum proof window"
			],
		}),
	)('getProof', async ({ block }) => {
		const result = await web3.eth.getProof(
			'0x0000000000000000000000000000000000000000',
			[],
			blockData[block],
		);

		if (block === 'blockHash' || block === 'blockNumber') {
			expect(result).toEqual(expectedProof);
		} else if (block === 'pending') {
			expect(result).toMatchObject({
				balance: expect.any(BigInt),
				codeHash: expect.any(String),
				nonce: expect.any(BigInt),
				storageHash: expect.any(String),
				storageProof: expect.any(Array<string>),
			});
		} else {
			expect(result).toMatchObject<AccountObject>({
				accountProof: expect.any(Array<string>),
				balance: expect.any(BigInt),
				codeHash: expect.any(String),
				nonce: expect.any(BigInt),
				storageHash: expect.any(String),
				storageProof: expect.any(Array<string>),
			});
		}
	});
});
