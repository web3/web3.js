import { Web3Context } from 'web3-core';
import { DEFAULT_RETURN_FORMAT, format } from 'web3-common';

import { getTransactionCount as rpcMethodsGetTransactionCount } from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { getTransactionCount } from '../../../src/rpc_method_wrappers';
import { testData } from './fixtures/get_transaction_count';

jest.mock('../../../src/rpc_methods');

describe('getTransactionCount', () => {
	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it.each(testData)(
		`should call rpcMethods.getBalance with expected parameters\nTitle: %s\nInput parameters: %s\n`,
		async (_, inputParameters, __) => {
			const [inputAddress, inputBlockNumber] = inputParameters;

			let inputBlockNumberFormatted;

			if (inputBlockNumber === undefined) {
				inputBlockNumberFormatted = web3Context.defaultBlock;
			} else {
				inputBlockNumberFormatted = format(
					{ eth: 'uint' },
					inputBlockNumber,
					DEFAULT_RETURN_FORMAT,
				);
			}

			await getTransactionCount(web3Context, ...inputParameters);
			expect(rpcMethodsGetTransactionCount).toHaveBeenCalledWith(
				web3Context.requestManager,
				inputAddress,
				inputBlockNumberFormatted,
			);
		},
	);

	it.each(testData)(
		`should format return value using provided return format\nTitle: %s\nInput parameters: %s\n`,
		async (_, inputParameters, mockRpcResponse) => {
			const [__, ___, returnFormat] = inputParameters;
			const expectedFormattedResult = format({ eth: 'uint' }, mockRpcResponse, returnFormat);
			(rpcMethodsGetTransactionCount as jest.Mock).mockResolvedValueOnce(mockRpcResponse);

			const result = await getTransactionCount(web3Context, ...inputParameters);
			expect(result).toBe(expectedFormattedResult);
		},
	);
});
