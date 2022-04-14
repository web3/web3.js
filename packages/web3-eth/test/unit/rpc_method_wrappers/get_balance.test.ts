import { Web3Context } from 'web3-core';
import { DEFAULT_RETURN_FORMAT, FMT_BYTES, FMT_NUMBER, format } from 'web3-common';

import { getBalance as rpcMethodsGetBalance } from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { getBalance } from '../../../src/rpc_method_wrappers';
import { mockRpcResponse, testData } from './fixtures/get_balance';

jest.mock('../../../src/rpc_methods');

describe('getBalance', () => {
	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it.each(testData)(
		`should call rpcMethods.getBalance with expected parameters\nTitle: %s\nInput parameters: %s\n`,
		async (_, inputParameters) => {
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

			await getBalance(web3Context, ...inputParameters, DEFAULT_RETURN_FORMAT);
			expect(rpcMethodsGetBalance).toHaveBeenCalledWith(
				web3Context.requestManager,
				inputAddress,
				inputBlockNumberFormatted,
			);
		},
	);

	it.each(testData)(
		`should format mockRpcResponse using provided return format\nTitle: %s\nInput parameters: %s\n`,
		async (_, inputParameters) => {
			const expectedReturnFormat = { number: FMT_NUMBER.STR, bytes: FMT_BYTES.BUFFER };
			const expectedFormattedResult = format(
				{ eth: 'uint' },
				mockRpcResponse,
				expectedReturnFormat,
			);
			(rpcMethodsGetBalance as jest.Mock).mockResolvedValueOnce(mockRpcResponse);

			const result = await getBalance(web3Context, ...inputParameters, expectedReturnFormat);
			expect(result).toBe(expectedFormattedResult);
		},
	);
});
