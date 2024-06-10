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
	Web3BaseProvider,
	JsonRpcPayload,
	JsonRpcBatchRequest,
	JsonRpcBatchResponse,
	JsonRpcResponseWithError,
	JsonRpcResponseWithResult,
	JsonRpcIdentifier,
} from 'web3-types';
import { jsonRpc } from 'web3-utils';
import {
	InvalidResponseError,
	ParseError,
	InvalidRequestError,
	MethodNotFoundError,
	InvalidParamsError,
	InternalError,
	InvalidInputError,
	ResourcesNotFoundError,
	TransactionRejectedError,
	MethodNotSupported,
	LimitExceededError,
	VersionNotSupportedError,
	RpcError,
	ResourceUnavailableError,
	ResponseError,
} from 'web3-errors';
import HttpProvider from 'web3-providers-http';
import WSProvider from 'web3-providers-ws';
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
			jest.spyOn(Web3RequestManager.prototype, 'setProvider').mockReturnValue(true);

			const manager = new Web3RequestManager(provider);

			expect(manager.setProvider).toHaveBeenCalledTimes(1);
			expect(manager.setProvider).toHaveBeenCalledWith(provider);
			expect(manager).toBeInstanceOf(Web3RequestManager);
		});
	});
	describe('isMetaMaskProvider', () => {
		it('check params', () => {
			const request = {
				constructor: {
					name: 'AsyncFunction',
				},
			};

			expect(
				utils.isMetaMaskProvider({
					// @ts-expect-error incorrect param
					request,
					isMetaMask: true,
				}),
			).toBe(true);
		});
	});
	describe('isSupportSubscriptions', () => {
		it('check params', () => {
			// @ts-expect-error incorrect param
			expect(utils.isSupportSubscriptions({ supportsSubscriptions: () => true })).toBe(true);
			// @ts-expect-error incorrect param
			expect(utils.isSupportSubscriptions({})).toBe(false);
		});
	});
	describe('providers', () => {
		it('should return providers on instance', () => {
			const manager = new Web3RequestManager();

			expect(Object.keys(manager.providers)).toEqual(['HttpProvider', 'WebsocketProvider']);
		});

		it('should return providers of particular instances', () => {
			expect(Web3RequestManager.providers.HttpProvider).toBe(HttpProvider);
			expect(Web3RequestManager.providers.WebsocketProvider).toBe(WSProvider);
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

			it('should unset provider', () => {
				const manager = new Web3RequestManager();
				manager.setProvider(undefined);
				expect(manager.provider).toBeUndefined();
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

		it('should throw error if can not detect the provider', () => {
			const providerString = 'pc://mydomain.com';
			const manager = new Web3RequestManager();

			expect(() => manager.setProvider(providerString)).toThrow(
				`Can't autodetect provider for "pc://mydomain.com"`,
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

		it('promise of legacy provider should be resolved', async () => {
			const manager = new Web3RequestManager(undefined, undefined);
			const pr = new Promise(resolve => {
				resolve('test');
			});
			const myProvider = {
				request: jest.fn().mockImplementation(async () => pr),
			} as any;
			manager.setProvider(myProvider);
			await manager.send(request);
			expect(myProvider.request).toHaveBeenCalledTimes(1);
			expect(await pr).toBe('test');
		});

		it('Got a "nullish" response from provider', async () => {
			const manager = new Web3RequestManager(undefined, undefined);
			const myProvider = {
				send: jest.fn().mockImplementation((_, cb: (error?: any, data?: any) => void) => {
					cb(undefined, undefined);
				}),
			} as any;
			manager.setProvider(myProvider);

			await expect(async () => manager.send(request)).rejects.toThrow(
				'Got a "nullish" response from provider',
			);
		});
		it('Provider does not have a request or send method to use', async () => {
			const manager = new Web3RequestManager(undefined, undefined);
			const myProvider = {} as any;
			manager.setProvider(myProvider);

			await expect(async () => manager.send(request)).rejects.toThrow(
				'Provider does not have a request or send method to use.',
			);
		});
		describe('test rpc errors', () => {
			it('should pass request to provider and reject with a generic rpc error when rpc call specification flag is undefined', async () => {
				const parseErrorResponse = {
					id: 1,
					jsonrpc: '2.0' as JsonRpcIdentifier,
					error: { code: -32700, message: 'Parse error' },
				};
				const manager = new Web3RequestManager(undefined, undefined);
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(parseErrorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(
					new InvalidResponseError(parseErrorResponse),
				);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject with a generic rpc error when rpc call specification flag is false', async () => {
				const parseErrorResponse = {
					id: 1,
					jsonrpc: '2.0' as JsonRpcIdentifier,
					error: { code: -32700, message: 'Parse error' },
				};
				const manager = new Web3RequestManager(undefined, false);
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(parseErrorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(
					new InvalidResponseError(parseErrorResponse),
				);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject with a parse rpc error when rpc call specification flag is true', async () => {
				const parseErrorResponse = {
					id: 1,
					jsonrpc: '2.0' as JsonRpcIdentifier,
					error: { code: -32700, message: 'Parse error' },
				};
				const manager = new Web3RequestManager(undefined, true);
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(parseErrorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(
					new ParseError(parseErrorResponse),
				);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject with an invalid request rpc error  when rpc call specification flag is true', async () => {
				const rpcErrorResponse = {
					id: 1,
					jsonrpc: '2.0' as JsonRpcIdentifier,
					error: { code: -32600, message: 'Invalid request' },
				};
				const manager = new Web3RequestManager(undefined, true);
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(rpcErrorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(
					new InvalidRequestError(rpcErrorResponse),
				);
				// await expect(manager.send(request)).rejects.toThrow(parseErrorResponse.error.message);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject with an invalid Method error when rpc call specification flag is true', async () => {
				const rpcErrorResponse = {
					id: 1,
					jsonrpc: '2.0' as JsonRpcIdentifier,
					error: { code: -32601, message: 'Method not found' },
				};
				const manager = new Web3RequestManager(undefined, true);
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(rpcErrorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(
					new MethodNotFoundError(rpcErrorResponse),
				);
				// await expect(manager.send(request)).rejects.toThrow(parseErrorResponse.error.message);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject with an invalid method rpc error when rpc call specification flag is true', async () => {
				const rpcErrorResponse = {
					id: 1,
					jsonrpc: '2.0' as JsonRpcIdentifier,
					error: { code: -32602, message: 'Invalid params' },
				};
				const manager = new Web3RequestManager(undefined, true);
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(rpcErrorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(
					new InvalidParamsError(rpcErrorResponse),
				);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject with an internal rpc error when rpc call specification flag is true', async () => {
				const rpcErrorResponse = {
					id: 1,
					jsonrpc: '2.0' as JsonRpcIdentifier,
					error: { code: -32603, message: 'Internal error' },
				};
				const manager = new Web3RequestManager(undefined, true);
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(rpcErrorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(
					new InternalError(rpcErrorResponse),
				);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject with an invalid input rpc error when rpc call specification flag is true', async () => {
				const rpcErrorResponse = {
					id: 1,
					jsonrpc: '2.0' as JsonRpcIdentifier,
					error: { code: -32000, message: 'Invalid input' },
				};
				const manager = new Web3RequestManager(undefined, true);
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(rpcErrorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(
					new InvalidInputError(rpcErrorResponse),
				);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject with a resource not found rpc error when rpc call specification flag is true', async () => {
				const rpcErrorResponse = {
					id: 1,
					jsonrpc: '2.0' as JsonRpcIdentifier,
					error: { code: -32001, message: 'Resource not found' },
				};
				const manager = new Web3RequestManager(undefined, true);
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(rpcErrorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(
					new ResourcesNotFoundError(rpcErrorResponse),
				);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject with a resource unavailable rpc error when rpc call specification flag is true', async () => {
				const rpcErrorResponse = {
					id: 1,
					jsonrpc: '2.0' as JsonRpcIdentifier,
					error: { code: -32002, message: 'Resource unavailable' },
				};
				const manager = new Web3RequestManager(undefined, true);
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(rpcErrorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(
					new ResourceUnavailableError(rpcErrorResponse),
				);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject with a transaction rejected rpc error when rpc call specification flag is true', async () => {
				const rpcErrorResponse = {
					id: 1,
					jsonrpc: '2.0' as JsonRpcIdentifier,
					error: { code: -32003, message: 'Transaction rejected' },
				};
				const manager = new Web3RequestManager(undefined, true);
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(rpcErrorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(
					new TransactionRejectedError(rpcErrorResponse),
				);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject with a method not supported rpc error when rpc call specification flag is true', async () => {
				const rpcErrorResponse = {
					id: 1,
					jsonrpc: '2.0' as JsonRpcIdentifier,
					error: { code: -32004, message: 'Method not supported' },
				};
				const manager = new Web3RequestManager(undefined, true);
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(rpcErrorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(
					new MethodNotSupported(rpcErrorResponse),
				);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject with a limited exceeded rpc error when rpc call specification flag is true', async () => {
				const rpcErrorResponse = {
					id: 1,
					jsonrpc: '2.0' as JsonRpcIdentifier,
					error: { code: -32005, message: 'Limit exceeded' },
				};
				const manager = new Web3RequestManager(undefined, true);
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(rpcErrorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(
					new LimitExceededError(rpcErrorResponse),
				);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject with a JSON-RPC version not supported rpc error when rpc call specification flag is true', async () => {
				const rpcErrorResponse = {
					id: 1,
					jsonrpc: '2.0' as JsonRpcIdentifier,
					error: { code: -32006, message: 'JSON-RPC version not supported' },
				};
				const manager = new Web3RequestManager(undefined, true);
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(rpcErrorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(
					new VersionNotSupportedError(rpcErrorResponse),
				);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject with a generic rpc error when rpc call specification flag is true', async () => {
				const rpcErrorResponse = {
					id: 1,
					jsonrpc: '2.0' as JsonRpcIdentifier,
					error: { code: -32015, message: 'Custom rpc error' },
				};
				const manager = new Web3RequestManager(undefined, true);
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(rpcErrorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(new RpcError(rpcErrorResponse));
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});
			it('should reject and include inner error when send method errors with an error property', async () => {
				const rpcErrorResponse = {
					id: 1,
					jsonrpc: '2.0' as JsonRpcIdentifier,
					error: {
						code: 4001,
						message: 'MetaMask Tx Signature: User denied transaction signature.',
					},
				};
				const manager = new Web3RequestManager(undefined, true);
				const myProvider = {
					request: jest.fn().mockImplementation(async () => {
						return Promise.resolve(successResponse.result);
					}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);
				// use any as a way to test private method '_sendRequest'
				jest.spyOn(manager as any, '_sendRequest').mockReturnValue(rpcErrorResponse);
				let err;
				try {
					await manager.send(request);
				} catch (error: any) {
					err = error;
				} finally {
					expect(err).toBeInstanceOf(ResponseError);
					expect(err.cause).toEqual(rpcErrorResponse.error);
				}
			});
		});

		describe('web3-provider', () => {
			beforeEach(() => {
				// isWeb3Provider uses instanceof to check if the provider is a Web3Provider
				// So we have to mock the response
				jest.spyOn(utils, 'isWeb3Provider').mockReturnValue(true);
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
			it('should throw an error when payload batch request and response is not an array', async () => {
				jest.spyOn(jsonRpc, 'toPayload').mockReturnValue([
					{ method: 'my_method', params: [], id: 1, jsonrpc: '2.0' },
				]);
				const manager = new Web3RequestManager();

				const pr = new Promise(resolve => {
					resolve({ response: 'random' });
				});
				const myProvider = {
					request: jest.fn().mockImplementation(async () => pr),
				} as any;
				manager.setProvider(myProvider);

				await expect(manager.send(request)).rejects.toThrow();

				jest.clearAllMocks();
			});
			it('should throw an error when payload batch request is an array and response is not', async () => {
				jest.spyOn(jsonRpc, 'toPayload').mockReturnValue({
					method: 'my_method',
					params: [],
					id: 1,
					jsonrpc: '2.0',
				});
				const manager = new Web3RequestManager();

				const pr = new Promise(resolve => {
					resolve([{ response: 'unknown response' }, { response: 'unknown response' }]);
				});
				const myProvider = {
					request: jest.fn().mockImplementation(async () => pr),
				} as any;
				manager.setProvider(myProvider);

				await expect(manager.send(request)).rejects.toThrow();

				jest.clearAllMocks();
			});
			it('should throw an when invalid response', async () => {
				jest.spyOn(jsonRpc, 'toPayload').mockReturnValue({
					method: 'my_method',
					params: [],
					id: 1,
					jsonrpc: '2.0',
				});
				const manager = new Web3RequestManager();

				const pr = new Promise(resolve => {
					resolve({ response: 'unknown response' });
				});
				const myProvider = {
					request: jest.fn().mockImplementation(async () => pr),
				} as any;
				manager.setProvider(myProvider);

				await expect(manager.send(request)).rejects.toThrow();

				jest.clearAllMocks();
			});
		});

		describe('legacy-request-provider', () => {
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

				await expect(manager.send(request)).rejects.toThrow(errorResponse.error.message);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject if provider returns error', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							// eslint-disable-next-line no-null/no-null
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

		describe('eip1193-provider', () => {
			beforeEach(() => {
				// isEIP1193Provider uses typeof to check if the provider is a EIP1193Provider
				// So we have to mock the response
				jest.spyOn(utils, 'isEIP1193Provider').mockReturnValue(true);
			});

			it('should pass request to provider and resolve if provider resolves it', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest.fn().mockImplementation(async () => {
						return Promise.resolve(successResponse);
					}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).resolves.toEqual(successResponse.result);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload);
			});

			it('should pass request to provider and reject if provider throws error', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest.fn().mockImplementation(async () => {
						return Promise.reject(errorResponse);
					}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(errorResponse.error.message);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload);
			});

			it('should pass request to provider and reject if provider returns error', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest.fn().mockImplementation(async () => {
						return Promise.resolve(errorResponse);
					}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(
					new InvalidResponseError(errorResponse),
				);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload);
			});
		});

		describe('eip1193-provider - return non json-rpc compliance response', () => {
			beforeEach(() => {
				// isEIP1193Provider uses typeof to check if the provider is a EIP1193Provider
				// So we have to mock the response
				jest.spyOn(utils, 'isEIP1193Provider').mockReturnValue(true);
			});

			it('should pass request to provider and resolve if provider resolves it', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest.fn().mockImplementation(async () => {
						return Promise.resolve(successResponse.result);
					}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).resolves.toEqual(successResponse.result);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload);
			});

			it('should pass request to provider and reject if provider throws error', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest.fn().mockImplementation(async _ => {
						return Promise.reject(errorResponse.error);
					}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).rejects.toThrow(errorResponse.error.message);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload);
			});

			it('should pass request to provider and pass if provider returns "null', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest.fn().mockImplementation(async _ => {
						// Explicitly used for test case
						// eslint-disable-next-line no-null/no-null
						return null;
					}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).resolves.toBeNull();
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload);
			});

			it('should pass request to provider and pass if provider returns "undefined', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest.fn().mockImplementation(async _ => {
						return undefined;
					}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.send(request)).resolves.toBeNull();
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload);
			});
		});

		describe('legacy-send-provider', () => {
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

				await expect(manager.send(request)).rejects.toThrow(errorResponse.error.message);
				expect(myProvider.send).toHaveBeenCalledTimes(1);
				expect(myProvider.send).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should pass request to provider and reject if provider returns error', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					send: jest
						.fn()
						.mockImplementation((_, cb: (error?: any, data?: any) => void) => {
							cb(undefined, errorResponse);
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
				// isWeb3Provider is using `Symbol` to identify which get change with the
				// mock implementation of the provider, so we have to mock it's response.
				jest.spyOn(utils, 'isWeb3Provider').mockReturnValue(true);
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

			it('should error in isPromise', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation(async () => Promise.reject(errorResponse)),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.sendBatch(request)).rejects.toEqual(errorResponse);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});

			it('should catch error and process json response in isPromise', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest
						.fn()
						.mockImplementation(async () => Promise.reject(errorResponse)),
				} as any;
				jest.spyOn(manager as any, '_processJsonRpcResponse').mockImplementation(() => {
					return errorResponse;
				});
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
							cb(undefined, errorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.sendBatch(request)).resolves.toEqual(errorResponse);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload, expect.any(Function));
			});
		});

		describe('eip1193-provider', () => {
			beforeEach(() => {
				// isEIP1193Provider is using `Symbol.toStringTag` which get change with the
				// mock implementation of the provider, so we have to mock it's response.
				jest.spyOn(utils, 'isEIP1193Provider').mockReturnValue(true);
			});

			it('should pass request to provider and resolve if provider resolves it', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest.fn().mockImplementation(async _ => {
						return Promise.resolve(successResponse);
					}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.sendBatch(request)).resolves.toEqual(successResponse);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload);
			});

			it('should pass request to provider and reject if provider throws error', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest.fn().mockImplementation(async _ => {
						throw errorResponse;
					}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.sendBatch(request)).rejects.toEqual(errorResponse);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload);
			});

			it('should pass request to provider and reject if provider returns error', async () => {
				const manager = new Web3RequestManager();
				const myProvider = {
					request: jest.fn().mockImplementation(async _ => {
						return Promise.resolve(errorResponse);
					}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.sendBatch(request)).resolves.toEqual(errorResponse);
				expect(myProvider.request).toHaveBeenCalledTimes(1);
				expect(myProvider.request).toHaveBeenCalledWith(payload);
			});
		});

		describe('legacy-send-provider', () => {
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
							cb(undefined, errorResponse);
						}),
				} as any;

				jest.spyOn(manager, 'provider', 'get').mockReturnValue(myProvider);

				await expect(manager.sendBatch(request)).resolves.toEqual(errorResponse);
				expect(myProvider.send).toHaveBeenCalledTimes(1);
				expect(myProvider.send).toHaveBeenCalledWith(payload, expect.any(Function));
			});
		});

		describe('legacy-send-async-provider', () => {
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
