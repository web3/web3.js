import { Web3RequestManager } from 'web3-core';

import { getId, getPeerCount, isListening } from '../../src/rpc_methods';
import { Web3NetAPI } from '../../src/web3_net_api';

describe('rpc_methods', () => {
	const requestManagerSendSpy = jest.fn();

	let requestManager: Web3RequestManager<Web3NetAPI>;

	beforeAll(() => {
		requestManager = new Web3RequestManager<Web3NetAPI>();
		requestManager.setProvider('http://127.0.0.1:8545');
		requestManager.send = requestManagerSendSpy;
	});

	describe('should make call with expected parameters', () => {
		it('getId', async () => {
			await getId(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'net_version',
				params: [],
			});
		});

		it('getPeerCount', async () => {
			await getPeerCount(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'net_peerCount',
				params: [],
			});
		});

		it('isListening', async () => {
			await isListening(requestManager);

			expect(requestManagerSendSpy).toHaveBeenCalledWith({
				method: 'net_listening',
				params: [],
			});
		});
	});
});
