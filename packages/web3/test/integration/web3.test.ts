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

import Contract from 'web3-eth-contract';
import HttpProvider from 'web3-providers-http';
import { IpcProvider } from 'web3-providers-ipc';
import WebSocketProvider from 'web3-providers-ws';
import { JsonRpcOptionalRequest, SupportedProviders, Web3BaseProvider } from 'web3-types';
import { Web3 } from '../../src/index';
import { BasicAbi } from '../shared_fixtures/Basic';
import { GreeterAbi } from '../shared_fixtures/build/Greeter';
import { validEncodeParametersData } from '../shared_fixtures/data';
import {
	closeOpenConnection,
	createTempAccount,
	describeIf,
	getSystemTestProvider,
	getSystemTestProviderUrl,
	isHttp,
	isIpc,
	isSocket,
	isWs,
	itIf,
	waitForOpenConnection,
} from '../shared_fixtures/system_tests_utils';

/* eslint-disable jest/no-standalone-expect */

describe('Web3 instance', () => {
	let provider: string | SupportedProviders;
	let providerUrl: string;
	let accounts: string[];
	let web3: Web3;
	let currentAttempt = 0;

	beforeAll(async () => {
		provider = getSystemTestProvider();
		providerUrl = getSystemTestProviderUrl();
		const acc1 = await createTempAccount();
		const acc2 = await createTempAccount();
		accounts = [acc1.address, acc2.address];
	});
	afterAll(async () => {
		try {
			await closeOpenConnection(web3);
		} catch (e) {
			console.warn('Failed to close open con', e);
		}
	});

	beforeEach(() => {
		currentAttempt = 0;
	});

	afterEach(async () => {
		if (
			isWs &&
			web3?.provider?.supportsSubscriptions &&
			web3.provider?.supportsSubscriptions()
		) {
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

	it('check disconnect function', async () => {
		const web3Instance = new Web3(provider);
		await web3Instance.eth.getBlockNumber();
		expect(typeof web3Instance.provider?.disconnect).toBe('function');
		expect(typeof web3Instance.eth.provider?.disconnect).toBe('function');
		expect(typeof web3Instance.currentProvider?.disconnect).toBe('function');
		expect(typeof web3Instance.eth.currentProvider?.disconnect).toBe('function');
		if (isSocket) {
			web3Instance.currentProvider?.disconnect();
		}
	});
	itIf(isWs)('check disconnect function for WebSocket provider', async () => {
		const web3Instance = new Web3(new WebSocketProvider(providerUrl));
		await web3Instance.eth.getBlockNumber();
		expect(typeof web3Instance.provider?.disconnect).toBe('function');
		expect(typeof web3Instance.eth.provider?.disconnect).toBe('function');
		expect(typeof web3Instance.currentProvider?.disconnect).toBe('function');
		expect(typeof web3Instance.eth.currentProvider?.disconnect).toBe('function');
		web3Instance.currentProvider?.disconnect();
	});
	itIf(isIpc)('check disconnect function for ipc provider', async () => {
		const web3Instance = new Web3(new IpcProvider(providerUrl));
		await web3Instance.eth.getBlockNumber();
		expect(typeof web3Instance.provider?.disconnect).toBe('function');
		expect(typeof web3Instance.eth.provider?.disconnect).toBe('function');
		expect(typeof web3Instance.currentProvider?.disconnect).toBe('function');
		expect(typeof web3Instance.eth.currentProvider?.disconnect).toBe('function');
		web3Instance.currentProvider?.disconnect();
	});
	itIf(isHttp)('check disconnect function for http provider', async () => {
		const web3Instance = new Web3(new HttpProvider(providerUrl));
		await web3Instance.eth.getBlockNumber();
		expect(typeof web3Instance.provider?.disconnect).toBe('function');
		expect(typeof web3Instance.eth.provider?.disconnect).toBe('function');
		expect(typeof web3Instance.currentProvider?.disconnect).toBe('function');
		expect(typeof web3Instance.eth.currentProvider?.disconnect).toBe('function');
	});

	it('should be able use "utils"', () => {
		web3 = new Web3();
		expect(web3.utils.hexToNumber('0x5')).toBe(5);
	});

	it('should be able use "abi"', () => {
		web3 = new Web3();
		const validData = validEncodeParametersData[0];

		const encodedParameters = web3.eth.abi.encodeParameters(
			validData.input[0],
			validData.input[1],
		);
		expect(encodedParameters).toEqual(validData.output);
	});

	describeIf(isHttp)('Create Web3 class instance with http string providers', () => {
		it('should create instance with string provider', () => {
			web3 = new Web3(provider);
			expect(web3).toBeInstanceOf(Web3);
		});
	});

	describeIf(isWs)('Create Web3 class instance with ws string providers', () => {
		it('should create instance with string of ws provider', () => {
			web3 = new Web3(provider);
			expect(web3).toBeInstanceOf(Web3);
		});
	});

	describe('Web3 providers', () => {
		it('should set the provider with `.provider=`', async () => {
			web3 = new Web3('http://dummy.com');

			web3.provider = provider;

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
				newProvider = new Web3.providers.HttpProvider(providerUrl);
			} else if (isWs) {
				newProvider = new Web3.providers.WebsocketProvider(providerUrl);
			} else {
				newProvider = new IpcProvider(providerUrl);
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
			expect(res.WebsocketProvider).toBe(WebSocketProvider);
		});

		it('currentProvider', () => {
			web3 = new Web3(provider);

			let checkWithClass;
			if (isWs) {
				checkWithClass = Web3.providers.WebsocketProvider;
			} else if (isHttp) {
				checkWithClass = Web3.providers.HttpProvider;
			} else {
				checkWithClass = IpcProvider;
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
			web3 = new Web3(provider);
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

		beforeAll(() => {
			web3 = new Web3(provider);
		});

		afterAll(() => {
			try {
				web3.provider?.disconnect();
			} catch (e) {
				// ignored
			}
		});

		it('should update defaults on contract instance', () => {
			const hardfork = 'berlin';

			contract = new web3.eth.Contract(GreeterAbi, undefined, {
				provider: getSystemTestProvider(),
				syncWithContext: true,
			});

			web3.defaultHardfork = hardfork;

			expect(contract.defaultHardfork).toBe(hardfork);
			try {
				contract.provider?.disconnect();
			} catch (e) {
				// ignored
			}
		});
	});
});
