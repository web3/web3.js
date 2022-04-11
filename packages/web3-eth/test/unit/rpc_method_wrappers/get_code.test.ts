import { Web3Context } from 'web3-core';
import { DEFAULT_RETURN_FORMAT, format } from 'web3-common';

import { getCode as rpcMethodsGetCode } from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { getCode } from '../../../src/rpc_method_wrappers';
import { testData } from './fixtures/get_code';

jest.mock('../../../src/rpc_methods');

describe('getCode', () => {
	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it.each(testData)(
		`should call rpcMethods.getCode with expected parameters\nTitle: %s\nInput parameters: %s\n`,
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

			await getCode(web3Context, ...inputParameters);
			expect(rpcMethodsGetCode).toHaveBeenCalledWith(
				web3Context.requestManager,
				inputAddress,
				inputBlockNumberFormatted,
			);
		},
	);

	it.each(testData)(
		`should format return value using provided return format\nTitle: %s\nInput parameters: %s\nMock Rpc Response: %s\n`,
		async (_, inputParameters, mockRpcResponse) => {
			const [__, ___, returnFormat] = inputParameters;
			const expectedFormattedResult = format({ eth: 'bytes' }, mockRpcResponse, returnFormat);
			(rpcMethodsGetCode as jest.Mock).mockResolvedValueOnce(mockRpcResponse);

			const result = await getCode(web3Context, ...inputParameters);
			expect(result).toStrictEqual(expectedFormattedResult);
		},
	);
});
