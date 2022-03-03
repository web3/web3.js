import { Web3Net } from '../../src';
import { getIdValidData, getPeerCountValidData } from '../fixtures/rpc_method_wrappers';
import * as rpcMethods from '../../src/rpc_methods';
import { getId, getPeerCount, isListening } from '../../src/rpc_method_wrappers';

jest.mock('../../src/rpc_methods');

describe('rpc_method_wrappers', () => {
	let web3Net: Web3Net;

	beforeAll(() => {
		web3Net = new Web3Net('http://127.0.0.1:8545');
	});

	describe('should call RPC method', () => {
		describe('getId', () => {
			it.each(getIdValidData)(
				'returnType: %s mockRpcResponse: %s output: %s',
				async (returnType, mockRpcResponse, output) => {
					(rpcMethods.getId as jest.Mock).mockResolvedValueOnce(mockRpcResponse);

					expect(await getId(web3Net, returnType)).toBe(output);
					expect(rpcMethods.getId).toHaveBeenCalledWith(web3Net.requestManager);
				},
			);
		});

		describe('getPeerCount', () => {
			it.each(getPeerCountValidData)(
				'returnType: %s mockRpcResponse: %s output: %s',
				async (returnType, mockRpcResponse, output) => {
					(rpcMethods.getPeerCount as jest.Mock).mockResolvedValueOnce(mockRpcResponse);

					expect(await getPeerCount(web3Net, returnType)).toBe(output);
					expect(rpcMethods.getPeerCount).toHaveBeenCalledWith(web3Net.requestManager);
				},
			);
		});

		it('isListening', async () => {
			await isListening(web3Net);
			expect(rpcMethods.isListening).toHaveBeenCalledWith(web3Net.requestManager);
		});
	});
});
