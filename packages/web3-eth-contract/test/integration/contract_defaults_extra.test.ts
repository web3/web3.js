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

// import { Web3BaseProvider, Web3AccountProvider } from 'web3-types';
import {
	Web3BaseProvider,
	Web3BaseWallet,
	Web3BaseWalletAccount,
	ValidChains,
	Hardfork,
	Receipt,
	TransactionReceipt,
} from 'web3-types';
import { Web3Context, TransactionBuilder, TransactionTypeParser, Web3PromiEvent } from 'web3-core';
import { Wallet } from 'web3-eth-accounts';
// import * as accountProvider from 'web3-eth-accounts/src/account';
import * as Web3Eth from 'web3-eth';
import { TransactionBlockTimeoutError } from 'web3-errors';
import { DEFAULT_RETURN_FORMAT } from 'web3-utils';
import { Contract } from '../../src';
import { GreeterBytecode, GreeterAbi } from '../shared_fixtures/build/Greeter';
import {
	getSystemTestProvider,
	createTempAccount,
	createAccountProvider,
	describeIf,
	itIf,
	isWs,
	isHttp,
} from '../fixtures/system_test_utils';

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

describe('contract defaults', () => {
	let contract: Contract<typeof GreeterAbi>;
	let deployOptions: Record<string, unknown>;
	let sendOptions: Record<string, unknown>;
	let acc: { address: string; privateKey: string };

	beforeEach(async () => {
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

	describe('defaultHardfork', () => {
		// todo this test is not working, bug or error in test?
		// it.only('should use "defaultHardfork" on "Contract" level', async () => {
		// 	const hardfork = 'berlin';

		// 	Contract.defaultHardfork = hardfork;

		// 	contract = await contract.deploy(deployOptions).send(sendOptions);

		// 	// await contract.methods.setGreeting('New Greeting').send(sendOptions);
		// 	// await contract.methods.greet().send(sendOptions);

		// 	expect(contract.defaultHardfork).toBe(hardfork);
		// 	const callSpy = jest.spyOn(Web3Eth, 'call');

		// 	await contract.methods.greet().call();

		// 	expect(callSpy).toHaveBeenCalledWith(
		// 		expect.objectContaining({
		// 			_config: expect.objectContaining({ defaultHardfork: hardfork }),
		// 		}),
		// 		expect.any(Object),
		// 		undefined,
		// 		expect.any(Object),
		// 	);
		// });

		it('should use "defaultHardfork" on "instance" level', async () => {
			const hardfork = 'berlin';
			contract.defaultHardfork = hardfork;

			contract = await contract.deploy(deployOptions).send(sendOptions);

			await contract.methods.setGreeting('New Greeting').send(sendOptions);
			await contract.methods.greet().send(sendOptions);

			expect(contract.defaultHardfork).toBe(hardfork);
			const callSpy = jest.spyOn(Web3Eth, 'call');

			await contract.methods.greet().call();

			expect(callSpy).toHaveBeenLastCalledWith(
				expect.objectContaining({
					_config: expect.objectContaining({ defaultHardfork: hardfork }),
				}),
				expect.any(Object),
				undefined,
				expect.any(Object),
			);
		});

		// eslint-disable-next-line jest/expect-expect
		// it('should use "defaultHardfork" on "instance" level', async () => {
		// const wallet: Wallet = new Wallet(accountProvider as Web3AccountProvider<any>);
		// const wallet: Wallet = new Wallet();
		// wallet.create(1);
		// console.log('----', getSystemTestProvider());
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call

		// const account = new Accounts.Accounts();
		// const account = create();
		// const con = new Web3Context({
		// 	provider: getSystemTestProvider(),
		// 	// wallet: wallet as Web3BaseWallet<Web3BaseWalletAccount>,
		// });

		// const accountProvider = createAccountProvider(con);
		// const wallet = new Wallet(accountProvider);
		// wallet.create(1);

		// console.log('account', account.address);
		// const w = new Wallet(account);
		// account.console.log(wallet);

		// console.log('-------------------');
		// console.log(context.wallet?.get(0)?.address, wallet);
		// console.log('-------------------');

		// const context = new Web3Context({
		// 	wallet,
		// 	provider: getSystemTestProvider(),
		// });

		// console.log('@@@@@@@@@@@@@@@', context.wallet?.get(0));
		// contract = new Contract(GreeterAbi, context);
		// // const a = account.create('random');
		// // const wallet = new Wallet(a as Accounts));
		// contract = await contract
		// 	.deploy(deployOptions)
		// 	.send({ from: context.wallet?.get(0)?.address });

		// await contract.methods.setGreeting('New Greeting').send();

		// const requestSpy = jest.spyOn(
		// 	contract.currentProvider as Web3BaseProvider,
		// 	'request',
		// );
		// contract.defaultHardfork = 'pending';
		// Contract.defaultHardfork = undefined;

		// await contract.methods.greet().call();

		// expect(requestSpy).toHaveBeenCalledWith(
		// 	expect.objectContaining({ params: [expect.any(Object), 'pending'] }),
		// );
		// const wallet = new Accounts.Wallet();
		// });
	});

	describe('defaultChain', () => {
		it('should use "defaultChain" on "instance" level', async () => {
			expect(contract.defaultChain).toBe('mainnet');

			const defaultChain = 'ropsten';
			contract.defaultChain = defaultChain;
			expect(contract.defaultChain).toBe(defaultChain);

			contract = await contract.deploy(deployOptions).send(sendOptions);

			await contract.methods.setGreeting('New Greeting').send(sendOptions);

			const callSpy = jest.spyOn(Web3Eth, 'call');

			await contract.methods.greet().call();

			expect(callSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					_config: expect.objectContaining({ defaultChain }),
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

		// todo this doesn't set defaultCommon, too
		// it.only('should use "defaultCommon" on "Contract" level', async () => {
		// 	Contract.defaultCommon = common;

		// 	const callSpy = jest.spyOn(Web3Eth, 'sendTransaction');

		// 	contract = await contract.deploy(deployOptions).send(sendOptions);

		// 	expect(callSpy).toHaveBeenCalledWith(
		// 		expect.objectContaining({
		// 			_config: expect.objectContaining({ defaultCommon: common }),
		// 		}),
		// 		expect.any(Object),
		// 		undefined,
		// 		expect.any(Object),
		// 	);
		// });

		it('should use "defaultCommon" on "instance" level', async () => {
			contract.defaultCommon = common;

			contract = await contract.deploy(deployOptions).send(sendOptions);

			const callSpy = jest.spyOn(Web3Eth, 'call');

			await contract.methods.greet().call();

			expect(callSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					_config: expect.objectContaining({ defaultCommon: common }),
				}),
				expect.any(Object),
				undefined,
				expect.any(Object),
			);
		});
	});
	describeIf(isWs)('transactionBlockTimeout', () => {
		const baseChain = 'mainnet' as ValidChains;
		const common = {
			customChain: { name: 'testnet', networkId: '1337', chainId: '1337' },
			baseChain,
			hardfork: 'london' as Hardfork,
		};

		// todo this doesn't set defaultCommon, too
		// it.only('should use "defaultCommon" on "Contract" level', async () => {
		// 	Contract.defaultCommon = common;

		// 	const callSpy = jest.spyOn(Web3Eth, 'sendTransaction');

		// 	contract = await contract.deploy(deployOptions).send(sendOptions);

		// 	expect(callSpy).toHaveBeenCalledWith(
		// 		expect.objectContaining({
		// 			_config: expect.objectContaining({ defaultCommon: common }),
		// 		}),
		// 		expect.any(Object),
		// 		undefined,
		// 		expect.any(Object),
		// 	);
		// });

		it('should use "transactionBlockTimeout" on "instance" level', async () => {
			contract = await contract.deploy(deployOptions).send(sendOptions);

			expect(contract.transactionBlockTimeout).toBe(50);

			contract.transactionBlockTimeout = 32;
			expect(contract.transactionBlockTimeout).toBe(32);

			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			await contract.methods.setGreeting('New Greeting').send(sendOptions);
			// 	.on('confirmation', data => {
			// 		console.log('receipt', data);
			// 	});
			// console.log('tx', tx);
			// await contract.methods.greet().call();
		});

		it('should fail if transaction was not mined within `transactionBlockTimeout` blocks', async () => {
			contract = await contract.deploy(deployOptions).send(sendOptions);

			// Make the test run faster by casing the polling to start after 2 blocks
			contract.transactionBlockTimeout = 2;
			// Prevent transaction from stucking for a long time if the provider (like Ganache v7.4.0)
			//	does not respond, when raising the nonce
			contract.transactionSendTimeout = MAX_32_SIGNED_INTEGER;
			// Increase other timeouts
			contract.transactionPollingTimeout = MAX_32_SIGNED_INTEGER;

			// Setting a high `nonce` when sending a transaction, to cause the RPC call to stuck at the Node
			// The previous test has the nonce set to Number.MAX_SAFE_INTEGER.
			//	So, just decrease 1 from it here to not fall into another error.
			const sentTx = contract.methods
				.setGreeting('New Greeting')
				.send({ ...sendOptions, nonce: (Number.MAX_SAFE_INTEGER - 1).toString() });

			// Some providers (mostly used for development) will make blocks only when there are new transactions
			// So, send 2 transactions because in this test `transactionBlockTimeout = 2`. And do nothing if an error happens.
			setTimeout(() => {
				(async () => {
					try {
						await contract.methods.setGreeting('New Greeting').send(sendOptions);
					} catch (error) {
						// Nothing needed to be done.
					}
					try {
						await contract.methods.setGreeting('New Greeting').send(sendOptions);
					} catch (error) {
						// Nothing needed to be done.
					}
				})() as unknown;
			}, 100);

			try {
				await sentTx;
			} catch (error) {
				// eslint-disable-next-line jest/no-conditional-expect
				expect(error).toBeInstanceOf(TransactionBlockTimeoutError);
				// eslint-disable-next-line jest/no-conditional-expect
				expect((error as Error).message).toMatch(/was not mined within [0-9]+ blocks/);
			}
		});
	});
});
