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
// eslint-disable-next-line import/no-extraneous-dependencies
import Web3, { BlockHeaderOutput } from 'web3';

import {
	closeOpenConnection,
	getSystemTestBackend,
	itIf,
	waitForOpenConnection,
} from '../fixtures/system_test_utils';
import { getSystemE2ETestProvider } from './e2e_utils';

describe(`${getSystemTestBackend()} tests - subscription newHeads`, () => {
	const provider = getSystemE2ETestProvider();
	const expectedNumberOfNewHeads = 1;

	let web3: Web3;

	beforeAll(() => {
		web3 = new Web3(provider);
	});

	afterAll(async () => {
		await closeOpenConnection(web3);
	});

	itIf(provider.startsWith('ws'))(
		`should subscribe to newHeads and receive ${expectedNumberOfNewHeads}`,
		async () => {
			const newHeadsSubscription = await web3.eth.subscribe('newHeads');

			let numberOfNewHeadsReceived = 0;

			await waitForOpenConnection(web3.eth);
			const assertionPromise = new Promise((resolve, reject) => {
				newHeadsSubscription.on('data', (data: BlockHeaderOutput) => {
					try {
						expect(data).toMatchObject<BlockHeaderOutput>({
							hash: expect.any(String),
							parentHash: expect.any(String),
							receiptsRoot: expect.any(String),
							miner: expect.any(String),
							stateRoot: expect.any(String),
							transactionsRoot: expect.any(String),
							logsBloom: expect.any(String),
							difficulty: expect.any(BigInt),
							number: expect.any(BigInt),
							gasLimit: expect.any(BigInt),
							gasUsed: expect.any(BigInt),
							timestamp: expect.any(BigInt),
							extraData: expect.any(String),
							nonce: expect.any(BigInt),
							sha3Uncles: expect.any(String),
							baseFeePerGas: expect.any(BigInt),
							mixHash: expect.any(String),
							withdrawalsRoot: expect.any(String),
						});
					} catch (error) {
						reject(error);
					}

					numberOfNewHeadsReceived += 1;
					if (numberOfNewHeadsReceived === expectedNumberOfNewHeads) resolve(undefined);
				});

				newHeadsSubscription.on('error', error => reject(error));
			});

			await assertionPromise;
			await web3.eth.subscriptionManager?.removeSubscription(newHeadsSubscription);
		},
	);
});
