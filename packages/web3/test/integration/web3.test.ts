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

import { JsonRpcOptionalRequest, Web3BaseProvider, SupportedProviders } from 'web3-types';
import Contract from 'web3-eth-contract';
import HttpProvider from 'web3-providers-http';
import IpcProvider from 'web3-providers-ipc';
import WebsocketProvider from 'web3-providers-ws';
import { FMT_BYTES, FMT_NUMBER } from 'web3-utils';
import Web3 from '../../src/index';
import { BasicAbi } from '../shared_fixtures/Basic';
import { validEncodeParametersData } from '../shared_fixtures/data';
import {
	createTempAccount,
	closeOpenConnection,
	describeIf,
	getSystemTestProvider,
	isHttp,
	isIpc,
	isWs,
	waitForOpenConnection,
} from '../shared_fixtures/system_tests_utils';
import { GreeterAbi, GreeterBytecode } from '../shared_fixtures/build/Greeter';

// describe.only('error', () => {
// 	// eslint-disable-next-line jest/expect-expect
// 	it('should throw an error if no contract address is provided', async () => {
// 		const abi = [
// 			{
// 				inputs: [],
// 				payable: false,
// 				stateMutability: 'nonpayable',
// 				type: 'constructor',
// 			},
// 			{
// 				anonymous: false,
// 				inputs: [
// 					{
// 						indexed: true,
// 						internalType: 'address',
// 						name: 'owner',
// 						type: 'address',
// 					},
// 					{
// 						indexed: true,
// 						internalType: 'address',
// 						name: 'spender',
// 						type: 'address',
// 					},
// 					{
// 						indexed: false,
// 						internalType: 'uint256',
// 						name: 'value',
// 						type: 'uint256',
// 					},
// 				],
// 				name: 'Approval',
// 				type: 'event',
// 			},
// 			{
// 				anonymous: false,
// 				inputs: [
// 					{
// 						indexed: true,
// 						internalType: 'address',
// 						name: 'previousOwner',
// 						type: 'address',
// 					},
// 					{
// 						indexed: true,
// 						internalType: 'address',
// 						name: 'newOwner',
// 						type: 'address',
// 					},
// 				],
// 				name: 'OwnershipTransferred',
// 				type: 'event',
// 			},
// 			{
// 				anonymous: false,
// 				inputs: [
// 					{
// 						indexed: true,
// 						internalType: 'address',
// 						name: 'from',
// 						type: 'address',
// 					},
// 					{ indexed: true, internalType: 'address', name: 'to', type: 'address' },
// 					{
// 						indexed: false,
// 						internalType: 'uint256',
// 						name: 'value',
// 						type: 'uint256',
// 					},
// 				],
// 				name: 'Transfer',
// 				type: 'event',
// 			},
// 			{
// 				constant: true,
// 				inputs: [],
// 				name: '_decimals',
// 				outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
// 				payable: false,
// 				stateMutability: 'view',
// 				type: 'function',
// 			},
// 			{
// 				constant: true,
// 				inputs: [],
// 				name: '_name',
// 				outputs: [{ internalType: 'string', name: '', type: 'string' }],
// 				payable: false,
// 				stateMutability: 'view',
// 				type: 'function',
// 			},
// 			{
// 				constant: true,
// 				inputs: [],
// 				name: '_symbol',
// 				outputs: [{ internalType: 'string', name: '', type: 'string' }],
// 				payable: false,
// 				stateMutability: 'view',
// 				type: 'function',
// 			},
// 			{
// 				constant: true,
// 				inputs: [
// 					{ internalType: 'address', name: 'owner', type: 'address' },
// 					{ internalType: 'address', name: 'spender', type: 'address' },
// 				],
// 				name: 'allowance',
// 				outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
// 				payable: false,
// 				stateMutability: 'view',
// 				type: 'function',
// 			},
// 			{
// 				constant: false,
// 				inputs: [
// 					{ internalType: 'address', name: 'spender', type: 'address' },
// 					{ internalType: 'uint256', name: 'amount', type: 'uint256' },
// 				],
// 				name: 'approve',
// 				outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
// 				payable: false,
// 				stateMutability: 'nonpayable',
// 				type: 'function',
// 			},
// 			{
// 				constant: true,
// 				inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
// 				name: 'balanceOf',
// 				outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
// 				payable: false,
// 				stateMutability: 'view',
// 				type: 'function',
// 			},
// 			{
// 				constant: false,
// 				inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
// 				name: 'burn',
// 				outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
// 				payable: false,
// 				stateMutability: 'nonpayable',
// 				type: 'function',
// 			},
// 			{
// 				constant: true,
// 				inputs: [],
// 				name: 'decimals',
// 				outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
// 				payable: false,
// 				stateMutability: 'view',
// 				type: 'function',
// 			},
// 			{
// 				constant: false,
// 				inputs: [
// 					{ internalType: 'address', name: 'spender', type: 'address' },
// 					{ internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
// 				],
// 				name: 'decreaseAllowance',
// 				outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
// 				payable: false,
// 				stateMutability: 'nonpayable',
// 				type: 'function',
// 			},
// 			{
// 				constant: true,
// 				inputs: [],
// 				name: 'getOwner',
// 				outputs: [{ internalType: 'address', name: '', type: 'address' }],
// 				payable: false,
// 				stateMutability: 'view',
// 				type: 'function',
// 			},
// 			{
// 				constant: false,
// 				inputs: [
// 					{ internalType: 'address', name: 'spender', type: 'address' },
// 					{ internalType: 'uint256', name: 'addedValue', type: 'uint256' },
// 				],
// 				name: 'increaseAllowance',
// 				outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
// 				payable: false,
// 				stateMutability: 'nonpayable',
// 				type: 'function',
// 			},
// 			{
// 				constant: false,
// 				inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
// 				name: 'mint',
// 				outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
// 				payable: false,
// 				stateMutability: 'nonpayable',
// 				type: 'function',
// 			},
// 			{
// 				constant: true,
// 				inputs: [],
// 				name: 'name',
// 				outputs: [{ internalType: 'string', name: '', type: 'string' }],
// 				payable: false,
// 				stateMutability: 'view',
// 				type: 'function',
// 			},
// 			{
// 				constant: true,
// 				inputs: [],
// 				name: 'owner',
// 				outputs: [{ internalType: 'address', name: '', type: 'address' }],
// 				payable: false,
// 				stateMutability: 'view',
// 				type: 'function',
// 			},
// 			{
// 				constant: false,
// 				inputs: [],
// 				name: 'renounceOwnership',
// 				outputs: [],
// 				payable: false,
// 				stateMutability: 'nonpayable',
// 				type: 'function',
// 			},
// 			{
// 				constant: true,
// 				inputs: [],
// 				name: 'symbol',
// 				outputs: [{ internalType: 'string', name: '', type: 'string' }],
// 				payable: false,
// 				stateMutability: 'view',
// 				type: 'function',
// 			},
// 			{
// 				constant: true,
// 				inputs: [],
// 				name: 'totalSupply',
// 				outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
// 				payable: false,
// 				stateMutability: 'view',
// 				type: 'function',
// 			},
// 			{
// 				constant: false,
// 				inputs: [
// 					{ internalType: 'address', name: 'recipient', type: 'address' },
// 					{ internalType: 'uint256', name: 'amount', type: 'uint256' },
// 				],
// 				name: 'transfer',
// 				outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
// 				payable: false,
// 				stateMutability: 'nonpayable',
// 				type: 'function',
// 			},
// 			{
// 				constant: false,
// 				inputs: [
// 					{ internalType: 'address', name: 'sender', type: 'address' },
// 					{ internalType: 'address', name: 'recipient', type: 'address' },
// 					{ internalType: 'uint256', name: 'amount', type: 'uint256' },
// 				],
// 				name: 'transferFrom',
// 				outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
// 				payable: false,
// 				stateMutability: 'nonpayable',
// 				type: 'function',
// 			},
// 			{
// 				constant: false,
// 				inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
// 				name: 'transferOwnership',
// 				outputs: [],
// 				payable: false,
// 				stateMutability: 'nonpayable',
// 				type: 'function',
// 			},
// 		];
// 		const web3 = new Web3('https://bsc-dataseed.binance.org');
// 		const contract = new web3.eth.Contract(abi, '0xe9e7cea3dedca5984780bafc599bd69add087d56');

// 		const transferEvent = await contract.getPastEvents(
// 			'Transfer',
// 			{
// 				fromBlock: '2518880',
// 				toBlock: '2518880',
// 			},
// 			{
// 				number: FMT_NUMBER.HEX,
// 				bytes: FMT_BYTES.HEX,
// 			},
// 		);

// 		console.log(transferEvent);
// 	});
// });
describe('Web3 instance', () => {
	let clientUrl: string;
	let accounts: string[];
	let web3: Web3;
	let currentAttempt = 0;

	beforeAll(async () => {
		clientUrl = getSystemTestProvider();
		const acc1 = await createTempAccount();
		const acc2 = await createTempAccount();
		accounts = [acc1.address, acc2.address];
	});
	afterAll(async () => {
		await closeOpenConnection(web3);
	});

	beforeEach(() => {
		currentAttempt = 0;
	});

	afterEach(async () => {
		if (isWs) {
			// make sure we try to close the connection after it is established
			if (
				web3?.provider &&
				(web3.provider as unknown as Web3BaseProvider).getStatus() === 'connecting'
			) {
				await waitForOpenConnection(web3, currentAttempt);
			}

			if (web3?.provider) {
				(web3.provider as unknown as Web3BaseProvider).disconnect(1000, '');
			}
		}
	});

	it('should be able to create web3 object without provider', () => {
		expect(() => new Web3()).not.toThrow();
	});

	it('should be able use "utils" without provider', () => {
		web3 = new Web3();

		expect(web3.utils.hexToNumber('0x5')).toBe(5);
	});

	it('should be able use "abi" without provider', () => {
		web3 = new Web3();
		const validData = validEncodeParametersData[0];

		const encodedParameters = web3.eth.abi.encodeParameters(
			validData.input[0],
			validData.input[1],
		);
		expect(encodedParameters).toEqual(validData.output);
	});

	it('should throw error when we make a request when provider not available', async () => {
		web3 = new Web3();

		await expect(web3.eth.getChainId()).rejects.toThrow('Provider not available');
	});

	describeIf(isHttp)('Create Web3 class instance with http string providers', () => {
		it('should create instance with string provider', () => {
			web3 = new Web3(clientUrl);
			expect(web3).toBeInstanceOf(Web3);
		});
	});

	describeIf(isWs)('Create Web3 class instance with ws string providers', () => {
		it('should create instance with string of ws provider', () => {
			web3 = new Web3(clientUrl);
			expect(web3).toBeInstanceOf(Web3);
		});
	});

	describe('Web3 providers', () => {
		it('should set the provider with `.provider=`', async () => {
			web3 = new Web3('http://dummy.com');

			web3.provider = clientUrl;

			expect(web3).toBeInstanceOf(Web3);
			if (isWs) {
				await waitForOpenConnection(web3, 0);
			}
			const response = await web3.eth.getBalance(accounts[0]);

			expect(response).toEqual(expect.any(BigInt));
		});

		it('should set the provider with `.setProvider`', () => {
			let newProvider: Web3BaseProvider;
			web3 = new Web3('http://dummy.com');
			if (isHttp) {
				newProvider = new Web3.providers.HttpProvider(clientUrl);
			} else if (isWs) {
				newProvider = new Web3.providers.WebsocketProvider(clientUrl);
			} else {
				newProvider = new Web3.providers.IpcProvider(clientUrl);
			}
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			web3.setProvider(newProvider as SupportedProviders);

			expect(web3.provider).toBe(newProvider);
		});

		it('should set the provider with `.setProvider` of empty initialized object', async () => {
			web3 = new Web3();

			web3.setProvider(getSystemTestProvider());

			await expect(web3.eth.getChainId()).resolves.toBeDefined();
		});

		it('should set the provider with `.provider=` of empty initialized object', async () => {
			web3 = new Web3();

			web3.provider = getSystemTestProvider();

			await expect(web3.eth.getChainId()).resolves.toBeDefined();
		});

		it('should unset the provider with `.setProvider`', async () => {
			web3 = new Web3(getSystemTestProvider());
			await expect(web3.eth.getChainId()).resolves.toBeDefined();

			web3.setProvider(undefined);
			await expect(web3.eth.getChainId()).rejects.toThrow('Provider not available');
		});

		it('should unset the provider with `.provider=`', async () => {
			web3 = new Web3(getSystemTestProvider());
			await expect(web3.eth.getChainId()).resolves.toBeDefined();

			web3.provider = undefined;
			await expect(web3.eth.getChainId()).rejects.toThrow('Provider not available');
		});

		it('providers', () => {
			const res = Web3.providers;

			expect(Web3.providers.HttpProvider).toBe(HttpProvider);
			expect(res.WebsocketProvider).toBe(WebsocketProvider);
			expect(res.IpcProvider).toBe(IpcProvider);
		});

		it('currentProvider', () => {
			web3 = new Web3(clientUrl);

			let checkWithClass;
			if (isWs) {
				checkWithClass = Web3.providers.WebsocketProvider;
			} else if (isHttp) {
				checkWithClass = Web3.providers.HttpProvider;
			} else {
				checkWithClass = Web3.providers.IpcProvider;
			}
			expect(web3.currentProvider).toBeInstanceOf(checkWithClass);
		});

		it('givenProvider', () => {
			const { givenProvider } = web3;
			expect(givenProvider).toBeUndefined();
		});
	});

	describe('Module instantiations', () => {
		it('should create contract', () => {
			const basicContract = new web3.eth.Contract(BasicAbi);
			expect(basicContract).toBeInstanceOf(Contract);
		});
	});

	// TODO: remove describeIf when finish #5144
	describeIf(!isIpc)('Batch Request', () => {
		let request1: JsonRpcOptionalRequest;
		let request2: JsonRpcOptionalRequest;
		beforeEach(() => {
			request1 = {
				id: 10,
				method: 'eth_getBalance',
				params: [accounts[0], 'latest'],
			};
			request2 = {
				id: 11,
				method: 'eth_getBalance',
				params: [accounts[1], 'latest'],
			};
		});

		it('should execute batch requests', async () => {
			web3 = new Web3(clientUrl);
			if (isWs) {
				await waitForOpenConnection(web3, 0);
			}
			const batch = new web3.BatchRequest();

			const request1Promise = batch.add(request1);
			const request2Promise = batch.add(request2);

			const executePromise = batch.execute();
			const response = await Promise.all([request1Promise, request2Promise, executePromise]);
			expect(response[0]).toEqual(expect.stringMatching(/0[xX][0-9a-fA-F]+/));
			expect(response[1]).toEqual(expect.stringMatching(/0[xX][0-9a-fA-F]+/));

			expect(response[2]).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: request1.id,
						result: response[0],
					}),
					expect.objectContaining({
						id: request2.id,
						result: response[1],
					}),
				]),
			);
		});
	});

	describe('defaults', () => {
		let contract: Contract<typeof GreeterAbi>;
		let deployOptions: Record<string, unknown>;
		let sendOptions: Record<string, unknown>;
		let acc: { address: string; privateKey: string };

		beforeAll(() => {
			web3 = new Web3(clientUrl);
		});

		beforeEach(async () => {
			acc = await createTempAccount();

			// todo import GreeterBytecode
			deployOptions = {
				data: GreeterBytecode,
				arguments: ['My Greeting'],
			};

			sendOptions = { from: acc.address, gas: '1000000' };
		});

		it('should update defaults on contract instance', () => {
			const hardfork = 'berlin';

			web3.eth.Contract.sync_with_globals = true;
			contract = new web3.eth.Contract(GreeterAbi, undefined, {
				provider: getSystemTestProvider(),
			});

			web3.defaultHardfork = hardfork;

			expect(contract.defaultHardfork).toBe(hardfork);
		});

		it('should update defaults on deployed contract instance', async () => {
			const hardfork = 'berlin';

			web3.eth.Contract.sync_with_globals = true;
			contract = new web3.eth.Contract(GreeterAbi, undefined, {
				provider: getSystemTestProvider(),
			});
			contract = await contract.deploy(deployOptions).send(sendOptions);

			web3.defaultHardfork = hardfork;

			expect(contract.defaultHardfork).toBe(hardfork);
		});
	});
});
