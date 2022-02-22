import Web3Net from '../../src/index';
import * as rpcMethodWrappers from '../../src/rpc_method_wrappers';

jest.mock('../../src/rpc_method_wrappers');

describe('web3_eth_methods_no_parameters', () => {
	let web3Net: Web3Net;

	beforeAll(() => {
		web3Net = new Web3Net('http://127.0.0.1:8545');
	});

	describe('should call RPC method', () => {
		it('getId', async () => {
			await web3Net.getId();
			expect(rpcMethodWrappers.getId).toHaveBeenCalledWith(web3Net);
		});

		it('getPeerCount', async () => {
			await web3Net.getPeerCount();
			expect(rpcMethodWrappers.getPeerCount).toHaveBeenCalledWith(web3Net);
		});

		it('isListening', async () => {
			await web3Net.isListening();
			expect(rpcMethodWrappers.isListening).toHaveBeenCalledWith(web3Net);
		});
	});
});
