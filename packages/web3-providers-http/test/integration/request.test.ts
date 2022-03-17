import {
	EthExecutionAPI,
	Web3APIPayload,
	JsonRpcResponse,
	JsonRpcResponseWithResult,
} from 'web3-common';
import { toWei } from 'web3-utils';
import HttpProvider from '../../src/index';

// Ganache starts with two accounts:

// Account 1
// privateKey: 0x4c3758228f536f7a210f8936182fb5b728046970b8e3215d0b5cb4c4faae8a4e
// address: 0xdc6bad79dab7ea733098f66f6c6f9dd008da3258
// balance: 100ETH

// Account 2
// privateKey: 0xe9c4ce1b5cbae03712ad5b3a407fecc93ca187fd823ab42e323b836e6b3682a6
// address: 0x9507ed8b9704ed73c269e95710edfec4ceee5d91
// balance: 100ETH

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
				String(parseInt(String((response as JsonRpcResponseWithResult).result), 16)),
			).toStrictEqual(toWei('100', 'ether'));
		});
	});
});
