import { Web3Net } from '../../src';
import * as rpcMethodWrappers from '../../src/rpc_method_wrappers';
import { getDataFormat } from '../fixtures/web3_net_methods';

jest.mock('../../src/rpc_method_wrappers');

describe('web3_eth_methods', () => {
	let web3Net: Web3Net;

	beforeAll(() => {
		web3Net = new Web3Net('http://127.0.0.1:8545');
	});

	describe('should call RPC method', () => {
		describe('getId', () => {
			it.each(getDataFormat)('returnType: %s', async returnType => {
				await web3Net.getId(returnType);
				expect(rpcMethodWrappers.getId).toHaveBeenCalledWith(web3Net, returnType);
			});
		});

		describe('getPeerCount', () => {
			it.each(getDataFormat)('returnType: %s', async returnType => {
				await web3Net.getPeerCount(returnType);
				expect(rpcMethodWrappers.getPeerCount).toHaveBeenCalledWith(web3Net, returnType);
			});
		});

		it('isListening', async () => {
			await web3Net.isListening();
			expect(rpcMethodWrappers.isListening).toHaveBeenCalledWith(web3Net);
		});
	});
});
