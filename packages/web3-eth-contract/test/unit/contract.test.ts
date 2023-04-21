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

import * as eth from 'web3-eth';
import { ValidChains, Hardfork, AccessListResult, Address } from 'web3-types';
import { Web3ContractError } from 'web3-errors';
import { Web3Context } from 'web3-core';

import { Contract } from '../../src';
import { sampleStorageContractABI } from '../fixtures/storage';
import { GreeterAbi, GreeterBytecode } from '../shared_fixtures/build/Greeter';
import { AllGetPastEventsData, getLogsData, getPastEventsData } from '../fixtures/unitTestFixtures';
import { getSystemTestProvider } from '../fixtures/system_test_utils';

jest.mock('web3-eth');

describe('Contract', () => {
	describe('constructor', () => {
		it('should init with only the abi', () => {
			const contract = new Contract([]);

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should init with abi and address', () => {
			const contract = new Contract([], '0x00000000219ab540356cBB839Cbe05303d7705Fa');

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should init with abi and options', () => {
			const contract = new Contract([], { gas: '123' });

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should init with abi, options and context', () => {
			const contract = new Contract(
				[],
				{ gas: '123' },
				{ config: { defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa' } },
			);

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should init with abi, address and options', () => {
			const contract = new Contract([], '0x00000000219ab540356cBB839Cbe05303d7705Fa', {
				gas: '123',
			});

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should init with abi, address, options and context', () => {
			const contract = new Contract(
				[],
				'0x00000000219ab540356cBB839Cbe05303d7705Fa',
				{ gas: '123' },
				{ config: { defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa' } },
			);

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should set the provider upon instantiation', () => {
			const provider = getSystemTestProvider();
			const contract = new Contract([], '', {
				provider,
			});

			expect(contract.provider).toEqual({
				clientUrl: provider,
				httpProviderOptions: undefined,
			});
		});
	});

	describe('Contract functions and defaults', () => {
		let sendOptions: Record<string, unknown>;
		const deployedAddr = '0x20bc23D0598b12c34cBDEf1fae439Ba8744DB426';

		beforeAll(() => {
			sendOptions = {
				from: '0x12364916b10Ae90076dDa6dE756EE1395BB69ec2',
				gas: '1000000',
			};
		});

		it('should deploy contract', async () => {
			const input = `${GreeterBytecode}0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b4d79204772656574696e67000000000000000000000000000000000000000000`;
			const contract = new Contract(GreeterAbi);

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const deploySpy = jest
				.spyOn(eth, 'sendTransaction')
				.mockImplementation((_objInstance, tx) => {
					expect(tx.to).toBeUndefined();
					expect(tx.gas).toStrictEqual(sendOptions.gas);
					expect(tx.gasPrice).toBeUndefined();
					expect(tx.from).toStrictEqual(sendOptions.from);
					expect(tx.input).toStrictEqual(input); // padded data

					const newContract = contract.clone();
					newContract.options.address = deployedAddr;

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(newContract) as any;
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			expect(deployedContract).toBeDefined();
			expect(deployedContract.options.address).toStrictEqual(deployedAddr);
			deploySpy.mockClear();
		});

		// eslint-disable-next-line @typescript-eslint/require-await
		it('should not deploy contract with empty data', async () => {
			const contract = new Contract(GreeterAbi);

			expect(() => contract.deploy({ data: '' }).send(sendOptions)).toThrow(
				'contract creation without any data provided',
			);
		});

		// eslint-disable-next-line @typescript-eslint/require-await
		it('send method on deployed contract should work', async () => {
			const arg = 'Hello';
			const contract = new Contract(GreeterAbi);

			// eslint-disable-next-line @typescript-eslint/no-empty-function
			// const send = jest.spyOn(
			// 	{
			// 		send: () => {
			// 			return { on: () => {} };
			// 		},
			// 	},
			// 	'send',
			// );

			// const setResolverMock = jest.spyOn(ens['_registry'], 'setResolver').mockReturnValue({
			// 	send,
			// } as unknown as Web3PromiEvent<any, any>);
			const spyTx = jest
				.spyOn(eth, 'sendTransaction')
				.mockImplementation((_objInstance, _tx) => {
					const newContract = contract.clone();
					newContract.options.address = deployedAddr;

					// jest.spyOn(newContract.methods.setGreeting(arg), 'send').mockReturnValue({
					// 	send,
					// 	status: '0x1',
					// } as unknown as Web3PromiEvent<any, any>);

					if (
						_tx.input ===
						'0xa41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000'
					) {
						// eslint-disable-next-line
						expect(_tx.to).toStrictEqual(deployedAddr);
						// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-empty-function
						return { status: '0x1', on: () => {} } as any;
					}

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-empty-function
					return Promise.resolve(Object.assign(newContract, { on: () => {} })) as any;
				});
			// const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation((...args) => {
			// 	// const actualEth = jest.requireActual('web3-eth');

			// 	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			// 	// const transactionToSend = actualEth.sendTransaction(args);
			// 	// Object.assign(transactionToSend, { on: () => {} });
			// 	// return transactionToSend;
			// 	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			// 	// eslint-disable-next-line @typescript-eslint/no-empty-function
			// 	return { on: () => {} } as unknown as Web3PromiEvent<any, any>;
			// });
			const deployedContract = await contract
				.deploy({
					input: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			const receipt = await deployedContract.methods.setGreeting(arg).send(sendOptions);
			expect(receipt.status).toBe('0x1');

			spyTx.mockClear();
		});

		it('call on deployed contract should decode result', async () => {
			const arg = 'Hello';
			const encodedArg =
				'0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000';

			const contract = new Contract(GreeterAbi);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const spyEthCall = jest.spyOn(eth, 'call').mockImplementation((_objInstance, _tx) => {
				expect(_tx.to).toStrictEqual(deployedAddr);
				expect(_tx.input).toBe('0xcfae3217');
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(encodedArg) as any; // contract class should decode encodedArg
			});

			const deployedContract = await contract
				.deploy({
					input: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			const res = await deployedContract.methods.greet().call();
			expect(res).toStrictEqual(arg);

			spyTx.mockClear();
			spyEthCall.mockClear();
		});

		it('should clone pre deployed contract with address', () => {
			const contract = new Contract(
				sampleStorageContractABI,
				'0x00000000219ab540356cBB839Cbe05303d7705Fa',
				{ gas: '0x97254' },
			);

			const clonnedContract = contract.clone();

			expect(JSON.stringify(contract)).toStrictEqual(JSON.stringify(clonnedContract));

			contract.options.jsonInterface = GreeterAbi;
		});

		it('should clone new contract', () => {
			const contract = new Contract(sampleStorageContractABI);

			const clonnedContract = contract.clone();
			expect(JSON.stringify(contract)).toStrictEqual(JSON.stringify(clonnedContract));
		});

		it('should be able to update the jsonInterface', () => {
			const contract = new Contract(sampleStorageContractABI);

			expect(contract.methods.retrieveNum).toBeDefined();
			expect(contract.methods.storeNum).toBeDefined();

			expect(contract.methods.greet).toBeUndefined();
			expect(contract.methods.increment).toBeUndefined();
			expect(contract.methods.setGreeting).toBeUndefined();

			contract.options.jsonInterface = GreeterAbi;

			expect(contract.methods.retrieveNum).toBeUndefined();
			expect(contract.methods.storeNum).toBeUndefined();

			expect(contract.methods.greet).toBeDefined();
			expect(contract.methods.increment).toBeDefined();
			expect(contract.methods.setGreeting).toBeDefined();
		});

		it('defaults set and get should work', () => {
			const contract = new Contract([], '0x00000000219ab540356cBB839Cbe05303d7705Fa');

			const defaultAddr = '0xd7E30ae310C1D1800F5B641Baa7af95b2e1FD98C';
			expect(contract.defaultAccount).toBeUndefined();
			contract.defaultAccount = defaultAddr;
			expect(contract.defaultAccount).toStrictEqual(defaultAddr);

			const defaultBlock = '0xC43A';
			expect(contract.defaultBlock).toBe('latest');
			contract.defaultBlock = defaultBlock;
			expect(contract.defaultBlock).toStrictEqual(defaultBlock);

			const defaultHardfork = 'constantinople';
			expect(contract.defaultHardfork).toBe('london');
			contract.defaultHardfork = defaultHardfork;
			expect(contract.defaultHardfork).toStrictEqual(defaultHardfork);

			const baseChain = 'mainnet' as ValidChains;
			contract.defaultChain = baseChain;
			expect(contract.defaultChain).toBe(baseChain);

			const defaultCommonDifferentHardfork = {
				customChain: { name: 'testnet', networkId: '5678', chainId: '5634' },
				baseChain,
				hardfork: 'petersburg' as Hardfork,
			};
			expect(contract.defaultCommon).toBeUndefined();

			// Test that defaultcommon will error when defaulthardfork is not matching
			// Has to be wrapped in another function to check Error
			expect(() => {
				contract.defaultCommon = defaultCommonDifferentHardfork;
			}).toThrow(
				new Error(
					'Web3Config hardfork doesnt match in defaultHardfork constantinople and common.hardfork petersburg',
				),
			);

			expect(contract.defaultCommon).toBeUndefined();

			// Should error when defaultCommon has different chain than defaultChain
			const defaultCommonDifferentChain = {
				customChain: { name: 'testnet', networkId: '5678', chainId: '5634' },
				baseChain: 'sepolia' as ValidChains,
				hardfork: 'constantinople' as Hardfork,
			};
			expect(() => {
				contract.defaultCommon = defaultCommonDifferentChain;
			}).toThrow(
				new Error(
					'Web3Config chain doesnt match in defaultHardfork mainnet and common.hardfork sepolia',
				),
			);

			expect(contract.defaultCommon).toBeUndefined();

			const defaultCommon = {
				customChain: { name: 'testnet', networkId: '5678', chainId: '5634' },
				baseChain: 'mainnet' as ValidChains,
				hardfork: 'constantinople' as Hardfork,
			};
			contract.defaultCommon = defaultCommon;
			expect(contract.defaultCommon).toBe(defaultCommon);

			const transactionBlockTimeout = 130;
			expect(contract.transactionBlockTimeout).toBe(50);
			contract.transactionBlockTimeout = transactionBlockTimeout;
			expect(contract.transactionBlockTimeout).toStrictEqual(transactionBlockTimeout);

			const transactionConfirmationBlocks = 30;
			expect(contract.transactionConfirmationBlocks).toBe(24);
			contract.transactionConfirmationBlocks = transactionConfirmationBlocks;
			expect(contract.transactionConfirmationBlocks).toStrictEqual(
				transactionConfirmationBlocks,
			);

			const transactionPollingInterval = 1000;
			expect(contract.transactionPollingInterval).toBe(1000);
			contract.transactionPollingInterval = transactionPollingInterval;
			expect(contract.transactionPollingInterval).toStrictEqual(transactionPollingInterval);

			const transactionPollingTimeout = 800000;
			expect(contract.transactionPollingTimeout).toBe(750000);
			contract.transactionPollingTimeout = transactionPollingTimeout;
			expect(contract.transactionPollingTimeout).toStrictEqual(transactionPollingTimeout);

			const transactionReceiptPollingInterval = 2000; // its new in 4.x
			expect(contract.transactionReceiptPollingInterval).toBe(1000);
			contract.transactionReceiptPollingInterval = transactionReceiptPollingInterval;
			expect(contract.transactionReceiptPollingInterval).toStrictEqual(
				transactionReceiptPollingInterval,
			);

			const transactionConfirmationPollingInterval = 2501; // its new in 4.x
			expect(contract.transactionConfirmationPollingInterval).toBe(1000);
			contract.transactionConfirmationPollingInterval =
				transactionConfirmationPollingInterval;
			expect(contract.transactionConfirmationPollingInterval).toStrictEqual(
				transactionConfirmationPollingInterval,
			);

			const transactionSendTimeout = 730000; // its new in 4.x
			expect(contract.transactionSendTimeout).toBe(750000);
			contract.transactionSendTimeout = transactionSendTimeout;
			expect(contract.transactionSendTimeout).toStrictEqual(transactionSendTimeout);

			const blockHeaderTimeout = 12;
			expect(contract.blockHeaderTimeout).toBe(10);
			contract.blockHeaderTimeout = blockHeaderTimeout;
			expect(contract.blockHeaderTimeout).toStrictEqual(blockHeaderTimeout);

			expect(contract.handleRevert).toBe(false);
			contract.handleRevert = true;
			expect(contract.handleRevert).toBe(true);
		});

		it('should set and get correct address', () => {
			const addr = '0x1230B93ffd14F2F022039675fA3fc3A46eE4C701';
			const contract = new Contract(
				[],
				'',
				{ gas: '123' },
				{ config: { defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa' } },
			);

			contract.options.address = addr;
			expect(contract.options.address).toStrictEqual(addr);
		});

		it.skip('should set and get jsonInterface', () => {
			const contract = new Contract(
				sampleStorageContractABI,
				'0x1230B93ffd14F2F022039675fA3fc3A46eE4C701',
				{ gas: '123' },
				{ config: { defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa' } },
			);

			// contract.options.jsonInterface = ERC20TokenAbi; //TODO also check changing abi on the fly bug: https://github.com/web3/web3.js/issues/5474
			expect(contract.options.jsonInterface).toStrictEqual(sampleStorageContractABI);
		});

		it('getPastEvents with filter should work', async () => {
			const contract = new Contract<typeof GreeterAbi>(GreeterAbi);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const spyGetLogs = jest
				.spyOn(eth, 'getLogs')
				.mockImplementation((_objInstance, _params) => {
					expect(_params.address).toStrictEqual(deployedAddr.toLocaleLowerCase());
					expect(_params.fromBlock).toStrictEqual(getLogsData.request.fromBlock);
					expect(_params.toBlock).toStrictEqual(getLogsData.request.toBlock);
					expect(_params.topics).toStrictEqual(getLogsData.request.topics);

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(getLogsData.response) as any;
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			const fromBlock = 'earliest';
			const toBlock = 'latest';
			const pastEvent = await deployedContract.getPastEvents(getPastEventsData.event as any, {
				fromBlock,
				toBlock,
			});

			expect(pastEvent).toStrictEqual(getPastEventsData.response);
			spyTx.mockClear();
			spyGetLogs.mockClear();
		});

		it('getPastEvents for all events should work', async () => {
			const contract = new Contract<typeof GreeterAbi>(GreeterAbi);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const spyGetLogs = jest
				.spyOn(eth, 'getLogs')
				.mockImplementation((_objInstance, _params) => {
					expect(_params.address).toStrictEqual(deployedAddr.toLocaleLowerCase());
					expect(_params.fromBlock).toBeUndefined();
					expect(_params.toBlock).toBeUndefined();
					expect(_params.topics).toBeUndefined();

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(AllGetPastEventsData.getLogsData) as any; // AllGetPastEventsData.getLogsData data test is for: assume two transactions sent to contract with contractInstance.methods.setGreeting("Hello") and contractInstance.methods.setGreeting("Another Greeting")
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			const pastEvent = await deployedContract.getPastEvents('allEvents');

			expect(pastEvent).toStrictEqual(AllGetPastEventsData.response);
			spyTx.mockClear();
			spyGetLogs.mockClear();
		});

		it('estimateGas should work', async () => {
			const arg = 'Hello';

			const contract = new Contract(
				GreeterAbi,
				// {data: GreeterBytecode,} // TODO bug fix https://github.com/web3/web3.js/issues/5473 setting data via options causing this issue
			);

			const spyTx = jest.spyOn(eth, 'sendTransaction').mockImplementation(() => {
				const newContract = contract.clone();
				newContract.options.address = deployedAddr;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Promise.resolve(newContract) as any;
			});

			const spyEstimateGas = jest
				.spyOn(eth, 'estimateGas')
				.mockImplementation((_objInstance, _tx, _block) => {
					expect(_block).toBe('latest');
					expect(_tx.to).toStrictEqual(deployedAddr);
					expect(_tx.from).toStrictEqual(sendOptions.from);
					expect(_tx.input).toBe(
						'0xa41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000',
					);

					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(BigInt(36916)) as any;
				});

			const deployedContract = await contract
				.deploy({
					data: GreeterBytecode,
					arguments: ['My Greeting'],
				})
				.send(sendOptions);

			const result = await deployedContract.methods.setGreeting(arg).estimateGas(sendOptions);
			expect(result).toStrictEqual(BigInt(36916));

			spyTx.mockClear();
			spyEstimateGas.mockClear();
		});

		it('contract method send without contract address should throw error', async () => {
			const arg = 'Hello';

			const contract = new Contract(GreeterAbi);

			await expect(async () => {
				await contract.methods.setGreeting(arg).send(sendOptions);
			}).rejects.toThrow(new Web3ContractError('Contract address not specified'));
		});

		it('contract method send without from address should throw error', async () => {
			const gas = '1000000';
			const sendOptionsSpecial = { gas };
			const arg = 'Hello';

			const contract = new Contract(GreeterAbi);
			contract.options.address = '0x12364916b10Ae90076dDa6dE756EE1395BB69ec2';

			/* eslint-disable no-useless-escape */
			await expect(async () => {
				await contract.methods.setGreeting(arg).send(sendOptionsSpecial);
			}).rejects.toThrow('Contract "from" address not specified');
		});

		it('contract method createAccessList should work', async () => {
			const fromAddr: Address = '0x20bc23D0598b12c34cBDEf1fae439Ba8744DB426';
			const result: AccessListResult = {
				accessList: [
					{
						address: deployedAddr,
						storageKeys: [
							'0x0000000000000000000000000000000000000000000000000000000000000001',
						],
					},
				],
				gasUsed: '0x644e',
			};

			const contract = new Contract(GreeterAbi, deployedAddr);

			const spyEthCall = jest
				.spyOn(eth, 'createAccessList')
				.mockImplementation((_objInstance, _tx) => {
					expect(_tx.to).toStrictEqual(deployedAddr);
					expect(_tx.input).toBe('0xcfae3217');
					expect(_tx.from).toBe(fromAddr);
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return Promise.resolve(result) as any; // contract class should decode encodedArg
				});

			const res = await contract.methods.greet().createAccessList({ from: fromAddr });
			expect(res).toStrictEqual(result);

			spyEthCall.mockClear();
		});

		it('should correctly apply provided Web3Context to new Contract instance', async () => {
			const expectedProvider = 'http://127.0.0.1:8545';
			const web3Context = new Web3Context({
				provider: expectedProvider,
				config: { handleRevert: true, defaultTransactionType: '0x2' },
			});
			const contract = new Contract(GreeterAbi, web3Context);
			expect(contract.config).toStrictEqual(web3Context.config);
		});
	});
});
