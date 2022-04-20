import { Web3Context } from 'web3-core';
import { DEFAULT_RETURN_FORMAT, FMT_BYTES, FMT_NUMBER, format } from 'web3-common';

import { getHashRate as rpcMethodsGetHashRate } from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { getHashRate } from '../../../src/rpc_method_wrappers';

jest.mock('../../../src/rpc_methods');

describe('getHashRate', () => {
	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it('should call rpcMethods.getHashRate with expected parameters', async () => {
		await getHashRate(web3Context, DEFAULT_RETURN_FORMAT);
		expect(rpcMethodsGetHashRate).toHaveBeenCalledWith(web3Context.requestManager);
	});

	it('should format return value using provided return format', async () => {
		const mockRpcResponse = '0x38a';
		const expectedReturnFormat = { number: FMT_NUMBER.STR, bytes: FMT_BYTES.BUFFER };
		const expectedFormattedResult = format(
			{ eth: 'uint' },
			mockRpcResponse,
			expectedReturnFormat,
		);
		(rpcMethodsGetHashRate as jest.Mock).mockResolvedValueOnce(mockRpcResponse);

		const result = await getHashRate(web3Context, expectedReturnFormat);
		expect(result).toBe(expectedFormattedResult);
	});
});
