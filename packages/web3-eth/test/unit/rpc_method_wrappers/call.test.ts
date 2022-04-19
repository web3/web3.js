import { Web3Context } from 'web3-core';
import { DEFAULT_RETURN_FORMAT, FMT_BYTES, FMT_NUMBER, format } from 'web3-common';

import { call as rpcMethodsCall } from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { call } from '../../../src/rpc_method_wrappers';
import { mockRpcResponse, testData } from './fixtures/call';
import { formatTransaction } from '../../../src';

jest.mock('../../../src/rpc_methods');

describe('call', () => {
	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it.each(testData)(
		`should call rpcMethods.call with expected parameters\nTitle: %s\nInput parameters: %s\n`,
		async (_, inputParameters) => {
			const [inputTransaction, inputBlockNumber] = inputParameters;
			const inputTransactionFormatted = formatTransaction(
				inputTransaction,
				DEFAULT_RETURN_FORMAT,
			);

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

			await call(web3Context, ...inputParameters, DEFAULT_RETURN_FORMAT);
			expect(rpcMethodsCall).toHaveBeenCalledWith(
				web3Context.requestManager,
				inputTransactionFormatted,
				inputBlockNumberFormatted,
			);
		},
	);

	it.each(testData)(
		`should format mockRpcResponse using provided return format\nTitle: %s\nInput parameters: %s\n`,
		async (_, inputParameters) => {
			const expectedReturnFormat = { number: FMT_NUMBER.STR, bytes: FMT_BYTES.BUFFER };
			const expectedFormattedResult = format(
				{ eth: 'bytes' },
				mockRpcResponse,
				expectedReturnFormat,
			);
			(rpcMethodsCall as jest.Mock).mockResolvedValueOnce(mockRpcResponse);

			const result = await call(web3Context, ...inputParameters, expectedReturnFormat);
			expect(result).toStrictEqual(expectedFormattedResult);
		},
	);
});
