import { Web3Context } from 'web3-core';
import { DEFAULT_RETURN_FORMAT, FMT_BYTES, FMT_NUMBER, format } from 'web3-common';

import { getGasPrice as rpcMethodsGetGasPrice } from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { getGasPrice } from '../../../src/rpc_method_wrappers';

jest.mock('../../../src/rpc_methods');

describe('getGasPrice', () => {
	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it('should call rpcMethods.getGasPrice with expected parameters', async () => {
		await getGasPrice(web3Context, DEFAULT_RETURN_FORMAT);
		expect(rpcMethodsGetGasPrice).toHaveBeenCalledWith(web3Context.requestManager);
	});

	it('should format mockRpcResponse using provided return format', async () => {
		const mockRpcResponse = '0x1dfd14000';
		const expectedReturnFormat = { number: FMT_NUMBER.STR, bytes: FMT_BYTES.BUFFER };
		const expectedFormattedResult = format(
			{ eth: 'uint' },
			mockRpcResponse,
			expectedReturnFormat,
		);
		(rpcMethodsGetGasPrice as jest.Mock).mockResolvedValueOnce(mockRpcResponse);

		const result = await getGasPrice(web3Context, expectedReturnFormat);
		expect(result).toBe(expectedFormattedResult);
	});
});
