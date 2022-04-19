// import {
// 	EthExecutionAPI,
// 	Web3APIPayload,
// 	JsonRpcResponse,
// 	JsonRpcResponseWithResult,
// } from 'web3-common';
import WebSocketProvider from '../../src/index';
// import { accounts, clientUrl } from '../fixtures/config';

describe('WebSocketProvider - implemented methods', () => {
	let webSocketProvider: WebSocketProvider;
	// let jsonRpcPayload: Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;

	beforeAll(() => {
		// jsonRpcPayload = {
		// 	jsonrpc: '2.0',
		// 	id: 42,
		// 	method: 'eth_getBalance',
		// 	params: [accounts[0].address, 'latest'],
		// } as Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;
	});

	describe('httpProvider.request', () => {
		it('should return expected response', async () => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			webSocketProvider = new WebSocketProvider('ws://localhost:8545');

			webSocketProvider.on('open', res => {
				console.warn('connected', res);
			});
			webSocketProvider.on('ping', res => {
				console.warn('connected', res);
			});
			expect(webSocketProvider).toBeInstanceOf(WebSocketProvider);
			// const response: JsonRpcResponse = await httpProvider.request(jsonRpcPayload);
			// expect(
			// 	String(hexToNumber(String((response as JsonRpcResponseWithResult).result))),
			// ).toEqual(toWei(accounts[0].balance, 'ether'));
		});
	});
});
