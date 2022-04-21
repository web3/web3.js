import { WebSocket } from 'isomorphic-ws';
import { EthExecutionAPI, Web3APIPayload } from 'web3-common';
import WebSocketProvider from '../../src/index';
import {
	invalidConnectionStrings,
	validConnectionStrings,
	wsProviderOptions,
} from '../fixtures/test_data';

jest.mock('isomorphic-ws');

describe('WebSocketProvider', () => {
	let wsProvider: WebSocketProvider;
	let jsonRpcPayload: Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;
	let jsonRpcResponse: Record<string, unknown>;

	beforeAll(() => {
		jest.spyOn(WebSocket.prototype, 'send');

		wsProvider = new WebSocketProvider('ws://localhost:8545');

		jsonRpcPayload = {
			jsonrpc: '2.0',
			id: 42,
			method: 'eth_getBalance',
			params: ['0x407d73d8a49eeb85d32cf465507dd71d507100c1', 'latest'],
		};
		jsonRpcResponse = { ...jsonRpcPayload, result: JSON.stringify(jsonRpcPayload) };
	});

	describe('constructor', () => {
		it('should construct with expected methods', () => {
			expect(wsProvider.request).toBeDefined();
			expect(wsProvider.getStatus).toBeDefined();
			expect(wsProvider.supportsSubscriptions).toBeDefined();
			expect(wsProvider.request).toBeDefined();
			expect(wsProvider.on).toBeDefined();
			expect(wsProvider.removeListener).toBeDefined();
			expect(wsProvider.once).toBeDefined();
			expect(wsProvider.removeAllListeners).toBeDefined();
			expect(wsProvider.connect).toBeDefined();
			expect(wsProvider.disconnect).toBeDefined();
			expect(wsProvider.reset).toBeDefined();
		});

		it('should allow for providerOptions to be passed upon instantiation', () => {
			expect(
				() => new WebSocketProvider('ws://localhost:8545', wsProviderOptions),
			).not.toThrow();
		});

		it.each(validConnectionStrings)(
			'should instantiation with valid client - %s',
			validClient => {
				expect(() => new WebSocketProvider(validClient)).not.toThrow();
			},
		);

		it.each(invalidConnectionStrings)(
			'should instantiation with invalid client - %s',
			invalidClient => {
				expect(
					() =>
						// @ts-expect-error - Purposefully passing invalid types to check validation
						new WebSocketProvider(invalidClient),
				).toThrow(`Client URL "${invalidClient as unknown as string}" is invalid.`);
			},
		);
	});

	describe('supportsSubscriptions', () => {
		it('should return true', () => {
			expect(wsProvider.supportsSubscriptions()).toBe(true);
		});
	});

	describe('request', () => {
		describe('success response', () => {
			it('should return expected response', async () => {
				const result = await wsProvider.request(jsonRpcPayload);

				expect(result).toEqual(jsonRpcResponse);
			});

			it('should emit message with response and "null" error', async () => {
				const messageSpy = jest.fn();
				wsProvider.on('message', messageSpy);

				await wsProvider.request(jsonRpcPayload);

				expect(messageSpy).toHaveBeenCalledWith(null, jsonRpcResponse);
			});
		});

		describe('error response', () => {
			it('should reject with response', async () => {
				// Set `error` attribute to reject from mock
				const payload = { ...jsonRpcPayload, error: 'my-error' };

				await expect(wsProvider.request(payload)).rejects.toEqual(payload);
			});

			it('should emit message with response as error', async () => {
				// Set `error` attribute to reject from mock
				const payload = { ...jsonRpcPayload, error: 'my-error' };

				const messageSpy = jest.fn();
				wsProvider.on('message', messageSpy);

				try {
					await wsProvider.request(payload);
				} catch {
					// Do nothing on error
				}

				expect(messageSpy).toHaveBeenCalledWith(payload, null);
			});
		});
	});
});
