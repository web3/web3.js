import { Web3RequestManager } from 'web3-core';

import { getBalance } from '../../src/rpc_methods';

describe('rpc_methods_no_params', () => {
	const requestManagerSendSpy = jest.fn();

	let requestManager: Web3RequestManager;

	beforeAll(() => {
		requestManager = new Web3RequestManager();
		requestManager.setProvider('http://127.0.0.1:8545');
		requestManager.send = requestManagerSendSpy;
	});

	describe('should make call with expected parameters', () => {
		it('getBalance', async () => {
			const params: [string, string] = ['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x1'];

			await getBalance(requestManager, ...params);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'eth_getBalance',
				params,
			});
		});
	});
});
