import { Web3Context } from 'web3-core';
import { DEFAULT_RETURN_FORMAT, FMT_BYTES, FMT_NUMBER, format } from 'web3-common';

import { getTransactionReceipt as rpcMethodsGetTransactionReceipt } from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { getTransactionReceipt } from '../../../src/rpc_method_wrappers';
import { mockRpcResponse, testData } from './fixtures/get_transaction_receipt';
import { receiptInfoSchema } from '../../../src/schemas';

jest.mock('../../../src/rpc_methods');

describe('getTransactionReceipt', () => {
	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it.each(testData)(
		`should call rpcMethods.getTransaction with expected parameters\nTitle: %s\nInput parameters: %s\n`,
		async (_, inputParameters) => {
			const [inputTransactionHash] = inputParameters;
			const inputTransactionHashFormatted = format(
				{ eth: 'bytes32' },
				inputTransactionHash,
				DEFAULT_RETURN_FORMAT,
			);

			await getTransactionReceipt(web3Context, ...inputParameters, DEFAULT_RETURN_FORMAT);
			expect(rpcMethodsGetTransactionReceipt).toHaveBeenCalledWith(
				web3Context.requestManager,
				inputTransactionHashFormatted,
			);
		},
	);

	it.each(testData)(
		`should format mockRpcResponse using provided return format\nTitle: %s\nInput parameters: %s\n`,
		async (_, inputParameters) => {
			const expectedReturnFormat = { number: FMT_NUMBER.STR, bytes: FMT_BYTES.BUFFER };
			const expectedFormattedResult = format(
				receiptInfoSchema,
				mockRpcResponse,
				expectedReturnFormat,
			);
			(rpcMethodsGetTransactionReceipt as jest.Mock).mockResolvedValueOnce(mockRpcResponse);

			const result = await getTransactionReceipt(
				web3Context,
				...inputParameters,
				expectedReturnFormat,
			);
			expect(result).toStrictEqual(expectedFormattedResult);
		},
	);
});
