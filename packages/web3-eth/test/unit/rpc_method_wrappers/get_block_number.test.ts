import { Web3Context } from 'web3-core';
import { DEFAULT_RETURN_FORMAT, FMT_BYTES, FMT_NUMBER, format } from 'web3-common';

import { getBlockNumber as rpcMethodsGetBlockNumber } from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { getBlockNumber } from '../../../src/rpc_method_wrappers';

jest.mock('../../../src/rpc_methods');

describe('getBlockNumber', () => {
	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it('should call rpcMethods.getBlockNumber with expected parameters', async () => {
		await getBlockNumber(web3Context, DEFAULT_RETURN_FORMAT);
		expect(rpcMethodsGetBlockNumber).toHaveBeenCalledWith(web3Context.requestManager);
	});

	it('should format mockRpcResponse using provided return format', async () => {
		const mockRpcResponse = '0x4b7';
		const expectedReturnFormat = { number: FMT_NUMBER.STR, bytes: FMT_BYTES.BUFFER };
		const expectedFormattedResult = format(
			{ eth: 'uint' },
			mockRpcResponse,
			expectedReturnFormat,
		);
		(rpcMethodsGetBlockNumber as jest.Mock).mockResolvedValueOnce(mockRpcResponse);

		const result = await getBlockNumber(web3Context, expectedReturnFormat);
		expect(result).toBe(expectedFormattedResult);
	});
});
