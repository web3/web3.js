import { Web3Context } from 'web3-core';
import { DEFAULT_RETURN_FORMAT, format } from 'web3-common';

import { getHashRate as rpcMethodsGetHashRate } from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { getHashRate } from '../../../src/rpc_method_wrappers';
import { returnFormats } from './fixtures/return_formats';

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

	it.each(returnFormats)(
		`should format return value using provided return format: %s`,
		async returnFormat => {
			const expectedFormattedResult = format({ eth: 'uint' }, '0x38a', returnFormat);
			(rpcMethodsGetHashRate as jest.Mock).mockResolvedValueOnce(expectedFormattedResult);

			const result = await getHashRate(web3Context, returnFormat);
			expect(result).toBe(expectedFormattedResult);
		},
	);
});
