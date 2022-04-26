import {
	EthExecutionAPI,
	Web3APIPayload,
	JsonRpcResponse,
	JsonRpcResponseWithResult,
} from 'web3-common';
import HttpProvider from '../../src/index';
// eslint-disable-next-line
import { accounts, clientUrl } from '../../../../.github/test.config';

describe('HttpProvider - implemented methods', () => {
	let httpProvider: HttpProvider;
	let jsonRpcPayload: Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;

	beforeAll(async () => {
		httpProvider = new HttpProvider(clientUrl);
		jsonRpcPayload = {
			jsonrpc: '2.0',
			id: 42,
			method: 'eth_getBalance',
			params: [accounts[0].address, 'latest'],
		} as Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;
	});

	describe('httpProvider.request', () => {
		it('should return expected response', async () => {
			const response: JsonRpcResponse = await httpProvider.request(jsonRpcPayload);
			expect(Number((response as JsonRpcResponseWithResult).id)).toBeGreaterThan(0);
		});
	});
});
