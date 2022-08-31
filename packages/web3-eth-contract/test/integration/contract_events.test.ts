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

import { Contract } from '../../src';
import { BasicAbi, BasicBytecode } from '../shared_fixtures/build/Basic';
import { processAsync } from '../shared_fixtures/utils';
import {
	getSystemTestProvider,
	describeIf,
	isWs,
	itIf,
	isHttp,
	createTempAccount,
} from '../fixtures/system_test_utils';

describe('contract', () => {
	let contract: Contract<typeof BasicAbi>;
	let contractDeployed: Contract<typeof BasicAbi>;
	let deployOptions: Record<string, unknown>;
	let sendOptions: Record<string, unknown>;

	beforeAll(async () => {
		contract = new Contract(BasicAbi, undefined, {
			provider: getSystemTestProvider(),
		});
	});
	beforeEach(async () => {
		const acc = await createTempAccount();

		deployOptions = {
			data: BasicBytecode,
			arguments: [10, 'string init value'],
		};

		sendOptions = { from: acc.address, gas: '1000000' };

		contractDeployed = await contract.deploy(deployOptions).send(sendOptions);
	});

	describe('events', () => {
		itIf(isWs)('should trigger the "contract.events.<eventName>"', async () => {
			// eslint-disable-next-line jest/no-standalone-expect
			return expect(
				processAsync(async resolve => {
					const event = contractDeployed.events.MultiValueEvent();

					event.on('data', resolve);

					// trigger event
					await contractDeployed.methods
						.firesMultiValueEvent('value', 12, true)
						.send(sendOptions);
				}),
			).resolves.toEqual(
				expect.objectContaining({
					event: 'MultiValueEvent',
				}),
			);
		});

		itIf(isWs)(
			'should trigger the "contract.events.<eventName>" for indexed parameters',
			async () => {
				// eslint-disable-next-line jest/no-standalone-expect
				return expect(
					processAsync(async resolve => {
						const event = contractDeployed.events.MultiValueIndexedEvent({
							filter: { val: 100 },
						});

						event.on('data', resolve);

						// trigger event
						await contractDeployed.methods
							.firesMultiValueIndexedEvent('value', 12, true)
							.send(sendOptions);
						await contractDeployed.methods
							.firesMultiValueIndexedEvent('value', 100, true)
							.send(sendOptions);
					}),
				).resolves.toEqual(
					expect.objectContaining({
						event: 'MultiValueIndexedEvent',
						returnValues: expect.objectContaining({ val: '100' }),
					}),
				);
			},
		);

		itIf(isWs)(
			'should trigger when "fromBlock" is passed to contract.events.<eventName>',
			async () => {
				// eslint-disable-next-line jest/no-standalone-expect
				return expect(
					processAsync(async resolve => {
						const event = contractDeployed.events.MultiValueEvent({
							fromBlock: 'latest',
						});

						event.on('data', resolve);

						// trigger event
						await contractDeployed.methods
							.firesMultiValueEvent('Event Value', 11, false)
							.send(sendOptions);
					}),
				).resolves.toEqual(
					expect.objectContaining({
						event: 'MultiValueEvent',
					}),
				);
			},
		);

		itIf(isHttp)('should fail to subscribe', async () => {
			// eslint-disable-next-line no-async-promise-executor, @typescript-eslint/no-misused-promises
			const failedSubscriptionPromise = new Promise<void>((resolve, reject) => {
				const event = contractDeployed.events.MultiValueEvent({ fromBlock: 'latest' });

				event.on('data', () => {
					resolve();
				});
				event.on('error', (err: Error) => {
					reject(err);
				});
			});

			// eslint-disable-next-line jest/no-standalone-expect
			await expect(failedSubscriptionPromise).rejects.toThrow('Failed to subscribe.');
		});
	});

	describeIf(isWs)('getPastEvents', () => {
		// TODO: Debug why this tests is hanging the websocket
		it('should return all past events', async () => {
			await contractDeployed.methods
				.firesMultiValueEvent('New Greeting 1', 11, true)
				.send(sendOptions);
			await contractDeployed.methods
				.firesMultiValueEvent('New Greeting 2', 12, true)
				.send(sendOptions);

			expect(
				await contractDeployed.getPastEvents('MultiValueEvent', {
					fromBlock: 'earliest',
					toBlock: 'latest',
				}),
			).toHaveLength(2);
		});
	});
});
