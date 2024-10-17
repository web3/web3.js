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

import { ValidChains, Hardfork, TransactionReceipt } from 'web3-types';
import * as Web3Eth from 'web3-eth';
import { TransactionBlockTimeoutError } from 'web3-errors';
import { Contract } from '../../src';
import { GreeterBytecode, GreeterAbi } from '../shared_fixtures/build/Greeter';
import {
	getSystemTestProvider,
	createTempAccount,
	describeIf,
	isWs,
	isHttp,
	closeOpenConnection,
} from '../fixtures/system_test_utils';

type Resolve = (value?: unknown) => void;
const MAX_32_SIGNED_INTEGER = 2147483647;

jest.mock('web3-eth', () => {
	const original = jest.requireActual('web3-eth');
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return {
		...original,
		call: jest.fn().mockImplementation(original.call),
		sendTransaction: jest.fn().mockImplementation(original.sendTransaction),
	};
});

describe('contract defaults (extra)', () => {
	let contract: Contract<typeof GreeterAbi>;
	let deployOptions: Record<string, unknown>;
	let sendOptions: Record<string, unknown>;
	let acc: { address: string; privateKey: string };

	beforeAll(async () => {
		contract = new Contract(GreeterAbi, undefined, {
			provider: getSystemTestProvider(),
		});

		acc = await createTempAccount();

		deployOptions = {
			data: GreeterBytecode,
			arguments: ['My Greeting'],
		};

		sendOptions = { from: acc.address, gas: '1000000' };
	});

	afterAll(async () => {
		await closeOpenConnection(contract);
	});

	it('should use "defaultHardfork" on "instance" level', async () => {
		const hardfork = 'berlin';

		const deployedContract = await contract.deploy(deployOptions).send(sendOptions);
		deployedContract.defaultHardfork = hardfork;

		await deployedContract.methods.setGreeting('New Greeting').send(sendOptions);
		await deployedContract.methods.greet().send(sendOptions);

		expect(deployedContract.defaultHardfork).toBe(hardfork);
		const callSpy = jest.spyOn(Web3Eth, 'call');

		await deployedContract.methods.greet().call();

		expect(callSpy).toHaveBeenLastCalledWith(
			expect.objectContaining({
				config: expect.objectContaining({ defaultHardfork: hardfork }),
			}),
			expect.any(Object),
			undefined,
			expect.any(Object),
		);
	});

	describe('defaultChain', () => {
		it('should use "defaultChain" on "instance" level', async () => {
			const deployedContract = await contract.deploy(deployOptions).send(sendOptions);

			expect(deployedContract.defaultChain).toBe('mainnet');

			const defaultChain = 'ropsten';
			deployedContract.defaultChain = defaultChain;

			expect(deployedContract.defaultChain).toBe(defaultChain);

			await deployedContract.methods.setGreeting('New Greeting').send(sendOptions);

			const callSpy = jest.spyOn(Web3Eth, 'call');

			await deployedContract.methods.greet().call();

			expect(callSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					config: expect.objectContaining({ defaultChain }),
				}),
				expect.any(Object),
				undefined,
				expect.any(Object),
			);
		});
	});

	describe('defaultCommon', () => {
		const baseChain = 'mainnet' as ValidChains;
		const common = {
			customChain: { name: 'testnet', networkId: '1337', chainId: '1337' },
			baseChain,
			hardfork: 'london' as Hardfork,
		};

		it('should use "defaultCommon" on "instance" level', async () => {
			const deployedContract = await contract.deploy(deployOptions).send(sendOptions);
			deployedContract.defaultCommon = common;
			const callSpy = jest.spyOn(Web3Eth, 'call');

			await deployedContract.methods.greet().call();

			expect(callSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					config: expect.objectContaining({ defaultCommon: common }),
				}),
				expect.any(Object),
				undefined,
				expect.any(Object),
			);
		});
	});

	describeIf(isWs)('transactionBlockTimeout', () => {
		it('should use "transactionBlockTimeout" on "instance" level', async () => {
			const deployedContract = await contract.deploy(deployOptions).send(sendOptions);

			const sendTransactionSpy = jest.spyOn(Web3Eth, 'sendTransaction');
			expect(deployedContract.transactionBlockTimeout).toBe(50);

			deployedContract.transactionBlockTimeout = 32;
			expect(deployedContract.transactionBlockTimeout).toBe(32);

			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			await deployedContract.methods.setGreeting('New Greeting').send(sendOptions);

			expect(sendTransactionSpy).toHaveBeenLastCalledWith(
				expect.objectContaining({
					config: expect.objectContaining({ transactionBlockTimeout: 32 }),
				}),
				expect.any(Object),
				expect.any(Object),
				expect.any(Object),
			);
		});

		it('should fail if transaction was not mined within `transactionBlockTimeout` blocks', async () => {
			const deployedContract = await contract.deploy(deployOptions).send(sendOptions);

			// Make the test run faster by casing the polling to start after 2 blocks
			deployedContract.transactionBlockTimeout = 1;
			// Prevent transaction from stucking for a long time if the provider (like Ganache v7.4.0)
			//	does not respond, when raising the nonce
			deployedContract.transactionSendTimeout = MAX_32_SIGNED_INTEGER;
			// Increase other timeouts
			deployedContract.transactionPollingTimeout = MAX_32_SIGNED_INTEGER;

			// Setting a high `nonce` when sending a transaction, to cause the RPC call to stuck at the Node
			// The previous test has the nonce set to Number.MAX_SAFE_INTEGER.
			//	So, just decrease 1 from it here to not fall into another error.
			const sentTx = deployedContract.methods
				.setGreeting('New Greeting with high nonce')
				.send({
					...sendOptions,
					nonce: (Number.MAX_SAFE_INTEGER - 1).toString(),
				});

			// Some providers (mostly used for development) will make blocks only when there are new transactions
			// So, send 2 transactions because in this test `transactionBlockTimeout = 2`. And do nothing if an error happens.
			setTimeout(() => {
				(async () => {
					try {
						await deployedContract.methods
							.setGreeting('New Greeting')
							.send(sendOptions);
					} catch (error) {
						// Nothing needed to be done.
					}
					try {
						await deployedContract.methods
							.setGreeting('New Greeting')
							.send(sendOptions);
					} catch (error) {
						// Nothing needed to be done.
					}
				})() as unknown;
			}, 100);

			await expect(sentTx).rejects.toThrow(/was not mined within [0-9]+ blocks/);

			await expect(sentTx).rejects.toThrow(TransactionBlockTimeoutError);
		});
	});

	describeIf(isWs)('blockHeaderTimeout', () => {
		it('should use "blockHeaderTimeout" on "instance" level', async () => {
			const deployedContract = await contract.deploy(deployOptions).send(sendOptions);

			expect(deployedContract.blockHeaderTimeout).toBe(10);

			const blockHeaderTimeout = 1;
			deployedContract.blockHeaderTimeout = blockHeaderTimeout;

			expect(deployedContract.blockHeaderTimeout).toBe(blockHeaderTimeout);

			const sentTx = deployedContract.methods.setGreeting('New Greeting').send(sendOptions);

			const confirmationPromise = new Promise((resolve: Resolve) => {
				// Tx promise is handled separately
				// eslint-disable-next-line no-void
				void sentTx.on(
					'confirmation',
					async ({ confirmations }: { confirmations: bigint }) => {
						if (confirmations >= blockHeaderTimeout) {
							resolve();
						} else {
							// Send a transaction to cause dev providers creating new blocks to fire the 'confirmation' event again.
							await deployedContract.methods
								.setGreeting('New Greeting')
								.send(sendOptions);
						}
					},
				);
			});
			await new Promise((resolve: Resolve) => {
				// Tx promise is handled separately
				// eslint-disable-next-line no-void
				void sentTx.on('receipt', (params: TransactionReceipt) => {
					expect(params.status).toBe(BigInt(1));
					resolve();
				});
			});

			await sentTx;
			await confirmationPromise;
			sentTx.removeAllListeners();
		});
	});

	describeIf(isHttp)('transactionPollingInterval', () => {
		it('should use "transactionPollingTimeout" on "instance" level', async () => {
			const deployedContract = await contract.deploy(deployOptions).send(sendOptions);

			const transactionPollingInterval = 500;
			deployedContract.transactionPollingInterval = transactionPollingInterval;

			expect(deployedContract.transactionPollingInterval).toBe(transactionPollingInterval);
		});
	});

	it('should use "handleRevert" on "instance" level', async () => {
		const deployedContract = await contract.deploy(deployOptions).send(sendOptions);

		expect(deployedContract.handleRevert).toBeFalsy();

		const handleRevert = true;
		deployedContract.handleRevert = handleRevert;

		expect(deployedContract.handleRevert).toBe(handleRevert);

		const sendTransactionSpy = jest.spyOn(Web3Eth, 'sendTransaction');

		await deployedContract.methods.setGreeting('New Greeting').send(sendOptions);

		expect(sendTransactionSpy).toHaveBeenCalled();
	});
});
