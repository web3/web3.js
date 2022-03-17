import {
	EthExecutionAPI,
	Web3APIPayload,
	JsonRpcResponse,
	JsonRpcResponseWithResult,
} from 'web3-common';
import { toWei } from 'web3-utils';
import HttpProvider from '../../src/index';

describe('HttpProvider - implemented methods', () => {
	const jsonRpcPayload = {
		jsonrpc: '2.0',
		id: 42,
		method: 'eth_getBalance',
		params: ['0xdc6bad79dab7ea733098f66f6c6f9dd008da3258', 'latest'],
	} as Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;

	let httpProvider: HttpProvider;

	beforeAll(() => {
		httpProvider = new HttpProvider('http://localhost:8545');
	});

	describe('httpProvider.request', () => {
		it('should return expected response', async () => {
			const response: JsonRpcResponse = await httpProvider.request(jsonRpcPayload);
			expect(
				String(parseInt(String((response as JsonRpcResponseWithResult).result), 10)),
			).toStrictEqual(toWei('100', 'ether'));
		});
	});
});
