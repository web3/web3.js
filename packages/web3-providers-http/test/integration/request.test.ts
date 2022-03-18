import {
	EthExecutionAPI,
	Web3APIPayload,
	JsonRpcResponse,
	JsonRpcResponseWithResult,
} from 'web3-common';
import { toWei } from 'web3-utils';
import HttpProvider from '../../src/index';
import accounts from '../fixtures/accounts';

describe('HttpProvider - implemented methods', () => {
	const account = accounts[0];
	const jsonRpcPayload = {
		jsonrpc: '2.0',
		id: 42,
		method: 'eth_getBalance',
		params: [account.address, 'latest'],
	} as Web3APIPayload<EthExecutionAPI, 'eth_getBalance'>;

	let httpProvider: HttpProvider;

	beforeAll(() => {
		httpProvider = new HttpProvider('http://localhost:8545');
	});

	describe('httpProvider.request', () => {
		it('should return expected response', async () => {
			const response: JsonRpcResponse = await httpProvider.request(jsonRpcPayload);
			expect(
				String(parseInt(String((response as JsonRpcResponseWithResult).result), 16)),
			).toStrictEqual(toWei(account.balance, 'ether'));
		});
	});
});
