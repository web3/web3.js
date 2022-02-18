import Web3Eth from '../../src/index';
import * as rpcMethodWrappers from '../../src/rpc_method_wrappers';

jest.mock('../../src/rpc_method_wrappers');

describe('web3_eth_methods_no_parameters', () => {
	let web3Eth: Web3Eth;

	beforeAll(() => {
		web3Eth = new Web3Eth('http://127.0.0.1:8545');
	});

	describe('should call RPC method with only request manager parameter', () => {
		it('getProtocolVersion', async () => {
			await web3Eth.getProtocolVersion();
			expect(rpcMethodWrappers.getProtocolVersion).toHaveBeenCalledWith(web3Eth);
		});

		it('isSyncing', async () => {
			await web3Eth.isSyncing();
			expect(rpcMethodWrappers.isSyncing).toHaveBeenCalledWith(web3Eth);
		});

		it('getCoinbase', async () => {
			await web3Eth.getCoinbase();
			expect(rpcMethodWrappers.getCoinbase).toHaveBeenCalledWith(web3Eth);
		});

		it('isMining', async () => {
			await web3Eth.isMining();
			expect(rpcMethodWrappers.isMining).toHaveBeenCalledWith(web3Eth);
		});

		it('getAccounts', async () => {
			await web3Eth.getAccounts();
			expect(rpcMethodWrappers.getAccounts).toHaveBeenCalledWith(web3Eth);
		});

		it('getWork', async () => {
			await web3Eth.getWork();
			expect(rpcMethodWrappers.getWork).toHaveBeenCalledWith(web3Eth);
		});
	});
});
