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

import {
	InvalidResponseError,
	Web3BaseProvider,
	jsonRpc,
	JsonRpcPayload,
	JsonRpcBatchRequest,
	JsonRpcBatchResponse,
	JsonRpcResponseWithError,
	JsonRpcResponseWithResult,
} from 'web3-common';
import HttpProvider from 'web3-providers-http';
import WSProvider from 'web3-providers-ws';
import IpcProvider from 'web3-providers-ipc';
import { Web3RequestManager, Web3RequestManagerEvent } from '../../src/web3_request_manager';
import * as utils from '../../src/utils';

describe('Web3RequestManager', () => {
	describe('constructor', () => {
		it('should create instance of request manager without any params', () => {
			const manager = new Web3RequestManager();

			expect(manager).toBeInstanceOf(Web3RequestManager);
		});

		it('should create instance of request manager without given provider', () => {
			const provider = 'http://mydomain.com';
			jest.spyOn(Web3RequestManager.prototype, 'setProvider').mockReturnValue();

			const manager = new Web3RequestManager(provider);

			expect(manager.setProvider).toHaveBeenCalledTimes(1);
			expect(manager.setProvider).toHaveBeenCalledWith(provider, undefined);
			expect(manager).toBeInstanceOf(Web3RequestManager);
		});
	});

	describe('providers', () => {
		it('should return providers on instance', () => {
			const manager = new Web3RequestManager();

			expect(Object.keys(manager.providers)).toEqual([
				'HttpProvider',
				'WebsocketProvider',
				'IpcProvider',
			]);
		});

		it('should return providers of particular instances', () => {
			expect(Web3RequestManager.providers.HttpProvider).toBe(HttpProvider);
			expect(Web3RequestManager.providers.WebsocketProvider).toBe(WSProvider);
			expect(Web3RequestManager.providers.IpcProvider).toBe(IpcProvider);
		});
	});

	describe('setProvider()', () => {
		let myProvider: Web3BaseProvider;
		let emitSpy: jest.Mock;

		beforeEach(() => {
			myProvider = { request: jest.fn() } as any;
			emitSpy = jest.spyOn(Web3RequestManager.prototype, 'emit') as jest.Mock;
		});

		describe('http provider', () => {
			beforeEach(() => {
				jest.spyOn(Web3RequestManager.prototype, 'providers', 'get').mockReturnValue({
					...Web3RequestManager.prototype.providers,
					HttpProvider: jest.fn().mockImplementation(() => myProvider) as any,
				});
			});

			it('should detect and set http provider', () => {
				const providerString = 'http://mydomain.com';

				const manager = new Web3RequestManager();
				manager.setProvider(providerString);

				expect(manager.providers.HttpProvider).toHaveBeenCalledTimes(1);
				expect(manager.providers.HttpProvider).toHaveBeenCalledWith(providerString);
				expect(manager.provider).toEqual(myProvider);
			});

			it('should emit events before changing the provider', () => {
				const providerString = 'http://mydomain.com';

				const manager = new Web3RequestManager();
				manager.setProvider(providerString);

				expect(emitSpy).toHaveBeenCalledTimes(2);
				expect(emitSpy).toHaveBeenCalledWith(
					Web3RequestManagerEvent.BEFORE_PROVIDER_CHANGE,
					undefined,
				);
				expect(emitSpy).toHaveBeenCalledWith(
					Web3RequestManagerEvent.PROVIDER_CHANGED,
					myProvider,
				);
			});
		});

		describe('https provider', () => {
			beforeEach(() => {
				jest.spyOn(Web3RequestManager.prototype, 'providers', 'get').mockReturnValue({
					...Web3RequestManager.prototype.providers,
					HttpProvider: jest.fn().mockImplementation(() => myProvider) as any,
				});
			});

			it('should detect and set http provider', () => {
				const providerString = 'https://mydomain.com';

				const manager = new Web3RequestManager();
				manager.setProvider(providerString);

				expect(manager.providers.HttpProvider).toHaveBeenCalledTimes(1);
				expect(manager.providers.HttpProvider).toHaveBeenCalledWith(providerString);
				expect(manager.provider).toEqual(myProvider);
			});

			it('should emit events before changing the provider', () => {
				const providerString = 'https://mydomain.com';

				const manager = new Web3RequestManager();
				manager.setProvider(providerString);

				expect(emitSpy).toHaveBeenCalledTimes(2);
				expect(emitSpy).toHaveBeenCalledWith(
					Web3RequestManagerEvent.BEFORE_PROVIDER_CHANGE,
					undefined,
				);
				expect(emitSpy).toHaveBeenCalledWith(
					Web3RequestManagerEvent.PROVIDER_CHANGED,
					myProvider,
				);
			});
		});

		describe('ws provider', () => {
			beforeEach(() => {
				jest.spyOn(Web3RequestManager.prototype, 'providers', 'get').mockReturnValue({
					...Web3RequestManager.prototype.providers,
					WebsocketProvider: jest.fn().mockImplementation(() => myProvider),
				});
			});

			it('should detect and set ws provider', () => {
				const providerString = 'ws://mydomain.com';

				const manager = new Web3RequestManager();
				manager.setProvider(providerString);

				expect(manager.providers.WebsocketProvider).toHaveBeenCalledTimes(1);
				expect(manager.providers.WebsocketProvider).toHaveBeenCalledWith(providerString);
				expect(manager.provider).toEqual(myProvider);
			});

			it('should emit events before changing the provider', () => {
				const providerString = 'ws://mydomain.com';

				const manager = new Web3RequestManager();
				manager.setProvider(providerString);

				expect(emitSpy).toHaveBeenCalledTimes(2);
				expect(emitSpy).toHaveBeenCalledWith(
					Web3RequestManagerEvent.BEFORE_PROVIDER_CHANGE,
					undefined,
				);
				expect(emitSpy).toHaveBeenCalledWith(
					Web3RequestManagerEvent.PROVIDER_CHANGED,
					myProvider,
				);
			});
		});

		describe('ipc provider', () => {
			beforeEach(() => {
				jest.spyOn(Web3RequestManager.prototype, 'providers', 'get').mockReturnValue({
					...Web3RequestManager.prototype.providers,
					IpcProvider: jest.fn().mockImplementation(() => myProvider),
				});
			});

			it('should detect and set ipc provider', () => {
				const providerString = 'ipc://mydomain.com';
				const socket = { connect: () => jest.fn() } as any;

				const manager = new Web3RequestManager();
				manager.setProvider(providerString, socket);

				expect(manager.providers.IpcProvider).toHaveBeenCalledTimes(1);
				expect(manager.providers.IpcProvider).toHaveBeenCalledWith(providerString, socket);
				expect(manager.provider).toEqual(myProvider);
			});

			it('should emit events before changing the provider', () => {
				const providerString = 'ipc://mydomain.com';
				const socket = { connect: () => jest.fn() } as any;

				const manager = new Web3RequestManager();
				manager.setProvider(providerString, socket);

				expect(emitSpy).toHaveBeenCalledTimes(2);
				expect(emitSpy).toHaveBeenCalledWith(
					Web3RequestManagerEvent.BEFORE_PROVIDER_CHANGE,
					undefined,
				);
				expect(emitSpy).toHaveBeenCalledWith(
					Web3RequestManagerEvent.PROVIDER_CHANGED,
					myProvider,
				);
			});
		});

		it('should throw error if can not detect the provider', () => {
			const providerString = 'pc://mydomain.com';
			const manager = new Web3RequestManager();

			expect(() => manager.setProvider(providerString)).toThrow(
				`Can't autodetect provider for "pc://mydomain.com'"`,
			);
		});
	});

	describe('send()', () => {
		let request: any;
		let payload: JsonRpcPayload;
		let errorResponse!: JsonRpcResponseWithError;
		let successResponse!: JsonRpcResponseWithResult;

		beforeEach(() => {
			request = { method: 'my_method', params: [] };
			payload = { method: 'my_method', params: [], id: 1, jsonrpc: '2.0' };
			errorResponse = {
				id: 1,
				jsonrpc: '2.0',
				error: { code: 123, message: 'my-rejected-value' },
			};
			successResponse = {
				id: 1,
				jsonrpc: '2.0',
				result: 'my-resolved-value',
			};

			jest.spyOn(jsonRpc, 'toPayload').mockReturnValue(payload);
		});

		it('should throw error if no provider is set', async () => {
			const manager = new Web3RequestManager();

			await expect(manager.send(request)).rejects.toThrow('Provider not available');
		});

		describe('web3-provider', () => {
			beforeEach(() => {
				jest.spyOn(utils, 'isWeb3Provider').mockReturnValue(true);
				jest.spyOn(utils, 'isLegacyRequestProvider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacySendProvider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacySendAsyncProvider').mockReturnValue(false);
			});

			it('should pass request to provider and resolve if provider resolves it', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation(async () => Promise.resolve(successResponse)),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).resolves.toEqual(successResponse.result);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload);
			});

			it('should pass request to provider and reject if provider rejects it', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation(async () => Promise.reject(new Error('my-error'))),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow('my-error');
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload);
			});
		});

		describe('legacy-request-provider', () => {
			beforeEach(() => {
				jest.spyOn(utils, 'isWeb3Provider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacyRequestProvider').mockReturnValue(true);
				jest.spyOn(utils, 'isLegacySendProvider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacySendAsyncProvider').mockReturnValue(false);
			});

			it('should pass request to provider and resolve if provider resolves it', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(undefined, successResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).resolves.toEqual(successResponse.result);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject if provider throws error', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(errorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toEqual(errorResponse);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject if provider returns error', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(null, errorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(
					new InvalidResponseError(errorResponse),
				);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});
		});

		describe('legacy-send-provider', () => {
			beforeEach(() => {
				jest.spyOn(utils, 'isWeb3Provider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacyRequestProvider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacySendProvider').mockReturnValue(true);
				jest.spyOn(utils, 'isLegacySendAsyncProvider').mockReturnValue(false);
			});

			it('should pass request to provider and resolve if provider resolves it', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					send: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(undefined, successResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).resolves.toEqual(successResponse.result);
				expect(myProvider.send).toHaveBeenCalledTimes(1);
				expect(myProvider.send).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject if provider throws error', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					send: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(errorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toEqual(errorResponse);
				expect(myProvider.send).toHaveBeenCalledTimes(1);
				expect(myProvider.send).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject if provider returns error', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					send: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(null, errorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(
					new InvalidResponseError(errorResponse),
				);
				expect(myProvider.send).toHaveBeenCalledTimes(1);
				expect(myProvider.send).toHaveBeenCalledWith(payload, expect.any(Function));
			});
		});

		describe('legacy-send-async-provider', () => {
			beforeEach(() => {
				jest.spyOn(utils, 'isWeb3Provider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacyRequestProvider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacySendProvider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacySendAsyncProvider').mockReturnValue(true);
			});

			it('should pass request to provider and resolve if provider resolves it', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					sendAsync: jest
						.fn()
						.mockImplementation(async () => Promise.resolve(successResponse)),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).resolves.toEqual(successResponse.result);
				expect(myProvider.sendAsync).toHaveBeenCalledTimes(1);
				expect(myProvider.sendAsync).toHaveBeenCalledWith(payload);
			});

			it('should pass request to provider and reject if provider rejects it', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					sendAsync: jest
						.fn()
						.mockImplementation(async () => Promise.reject(new Error('my-error'))),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow('my-error');
				expect(myProvider.sendAsync).toHaveBeenCalledTimes(1);
				expect(myProvider.sendAsync).toHaveBeenCalledWith(payload);
			});
		});
	});

	describe('sendBatch()', () => {
		let request: JsonRpcBatchRequest;
		let payload: JsonRpcPayload;
		let errorResponse!: JsonRpcBatchResponse;
		let successResponse!: JsonRpcBatchResponse;

		beforeEach(() => {
			request = [
				{ id: 1, jsonrpc: '2.0', method: 'my_method', params: [] },
				{ id: 2, jsonrpc: '2.0', method: 'my_method', params: [] },
			];
			payload = [...request];
			errorResponse = [
				{
					id: 1,
					jsonrpc: '2.0',
					error: { code: 123, message: 'my-rejected-value-1' },
				},
				{
					id: 2,
					jsonrpc: '2.0',
					error: { code: 123, message: 'my-rejected-value-2' },
				},
			];
			successResponse = [
				{
					id: 1,
					jsonrpc: '2.0',
					result: 'my-resolved-value1',
				},
				{
					id: 1,
					jsonrpc: '2.0',
					result: 'my-resolved-value1',
				},
			];

			jest.spyOn(jsonRpc, 'toBatchPayload').mockReturnValue(payload);
		});

		it('should throw error if no provider is set', async () => {
			const manager = new Web3RequestManager();

			await expect(manager.sendBatch(request)).rejects.toThrow('Provider not available');
		});

		describe('web3-provider', () => {
			beforeEach(() => {
				jest.spyOn(utils, 'isWeb3Provider').mockReturnValue(true);
				jest.spyOn(utils, 'isLegacyRequestProvider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacySendProvider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacySendAsyncProvider').mockReturnValue(false);
			});

			it('should pass request to provider and resolve if provider resolves it', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation(async () => Promise.resolve(successResponse)),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.sendBatch(request)).resolves.toEqual(successResponse);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload);
			});

			it('should pass request to provider and reject if provider rejects it', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation(async () => Promise.reject(new Error('my-error'))),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.sendBatch(request)).rejects.toThrow('my-error');
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload);
			});

			it('should pass request to provider and return response if provider returns error', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation(async () => Promise.resolve(errorResponse)),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.sendBatch(request)).resolves.toEqual(errorResponse);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload);
			});
		});

		describe('legacy-request-provider', () => {
			beforeEach(() => {
				jest.spyOn(utils, 'isWeb3Provider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacyRequestProvider').mockReturnValue(true);
				jest.spyOn(utils, 'isLegacySendProvider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacySendAsyncProvider').mockReturnValue(false);
			});

			it('should pass request to provider and resolve if provider resolves it', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(undefined, successResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.sendBatch(request)).resolves.toEqual(successResponse);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject if provider throws error', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(errorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.sendBatch(request)).rejects.toEqual(errorResponse);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject if provider returns error', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(null, errorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.sendBatch(request)).resolves.toEqual(errorResponse);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});
		});

		describe('legacy-send-provider', () => {
			beforeEach(() => {
				jest.spyOn(utils, 'isWeb3Provider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacyRequestProvider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacySendProvider').mockReturnValue(true);
				jest.spyOn(utils, 'isLegacySendAsyncProvider').mockReturnValue(false);
			});

			it('should pass request to provider and resolve if provider resolves it', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					send: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(undefined, successResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.sendBatch(request)).resolves.toEqual(successResponse);
				expect(myProvider.send).toHaveBeenCalledTimes(1);
				expect(myProvider.send).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject if provider throws error', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					send: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(errorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.sendBatch(request)).rejects.toEqual(errorResponse);
				expect(myProvider.send).toHaveBeenCalledTimes(1);
				expect(myProvider.send).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and return response if provider returns error', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					send: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(null, errorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.sendBatch(request)).resolves.toEqual(errorResponse);
				expect(myProvider.send).toHaveBeenCalledTimes(1);
				expect(myProvider.send).toHaveBeenCalledWith(payload, expect.any(Function));
			});
		});

		describe('legacy-send-async-provider', () => {
			beforeEach(() => {
				jest.spyOn(utils, 'isWeb3Provider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacyRequestProvider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacySendProvider').mockReturnValue(false);
				jest.spyOn(utils, 'isLegacySendAsyncProvider').mockReturnValue(true);
			});

			it('should pass request to provider and resolve if provider resolves it', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					sendAsync: jest
						.fn()
						.mockImplementation(async () => Promise.resolve(successResponse)),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.sendBatch(request)).resolves.toEqual(successResponse);
				expect(myProvider.sendAsync).toHaveBeenCalledTimes(1);
				expect(myProvider.sendAsync).toHaveBeenCalledWith(payload);
			});

			it('should pass request to provider and reject if provider rejects it', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					sendAsync: jest
						.fn()
						.mockImplementation(async () => Promise.reject(new Error('my-error'))),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.sendBatch(request)).rejects.toThrow('my-error');
				expect(myProvider.sendAsync).toHaveBeenCalledTimes(1);
				expect(myProvider.sendAsync).toHaveBeenCalledWith(payload);
			});

			it('should pass request to provider and return response if provider returns error', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					sendAsync: jest
						.fn()
						.mockImplementation(async () => Promise.resolve(errorResponse)),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.sendBatch(request)).resolves.toEqual(errorResponse);
				expect(myProvider.sendAsync).toHaveBeenCalledTimes(1);
				expect(myProvider.sendAsync).toHaveBeenCalledWith(payload);
			});
		});
	});
});
