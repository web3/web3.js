import { Web3Net } from '../../src';
import * as rpcMethods from '../../src/rpc_methods';
import { getId, isListening, getPeerCount } from '../../src/rpc_method_wrappers';

jest.mock('../../src/rpc_methods');

describe('rpc_method_wrappers', () => {
	let web3Net: Web3Net;

	beforeAll(() => {
		web3Net = new Web3Net('http://127.0.0.1:8545');
	});

	describe('should call RPC method', () => {
		it('getId', async () => {
			await getId(web3Net);
			expect(rpcMethods.getId).toHaveBeenCalledWith(web3Net.requestManager);
		});

		it('isListening', async () => {
			await isListening(web3Net);
			expect(rpcMethods.isListening).toHaveBeenCalledWith(web3Net.requestManager);
		});

		it('getPeerCount', async () => {
			await getPeerCount(web3Net);
			expect(rpcMethods.getPeerCount).toHaveBeenCalledWith(web3Net.requestManager);
		});
	});
});
