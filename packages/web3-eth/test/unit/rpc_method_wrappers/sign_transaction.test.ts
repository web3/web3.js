import { Web3Context } from 'web3-core';
import { DEFAULT_RETURN_FORMAT, FMT_BYTES, FMT_NUMBER, format } from 'web3-common';

import { signTransaction as rpcMethodsSignTransaction } from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { signTransaction } from '../../../src/rpc_method_wrappers';
import { mockRpcResponse, testData } from './fixtures/sign_transaction';
import { formatTransaction } from '../../../src';

jest.mock('../../../src/rpc_methods');

describe('signTransaction', () => {
	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it.each(testData)(
		`should call rpcMethods.signTransaction with expected parameters\nTitle: %s\nInput parameters: %s\n`,
		async (_, inputParameters) => {
			const [inputTransaction] = inputParameters;
			const inputTransactionFormatted = formatTransaction(
				inputTransaction,
				DEFAULT_RETURN_FORMAT,
			);

			await signTransaction(web3Context, ...inputParameters, DEFAULT_RETURN_FORMAT);
			expect(rpcMethodsSignTransaction).toHaveBeenCalledWith(
				web3Context.requestManager,
				inputTransactionFormatted,
			);
		},
	);

	it.each(testData)(
		`should format mockRpcResponse using provided return format\nTitle: %s\nInput parameters: %s\n`,
		async (_, inputParameters) => {
			const [inputTransaction] = inputParameters;
			const expectedReturnFormat = { number: FMT_NUMBER.STR, bytes: FMT_BYTES.BUFFER };
			const expectedFormattedResult = {
				raw: format({ eth: 'bytes' }, mockRpcResponse.raw, expectedReturnFormat),
				tx: formatTransaction(inputTransaction, expectedReturnFormat),
			};
			(rpcMethodsSignTransaction as jest.Mock).mockResolvedValueOnce(mockRpcResponse.raw);

			const result = await signTransaction(
				web3Context,
				...inputParameters,
				expectedReturnFormat,
			);
			expect(result).toStrictEqual(expectedFormattedResult);
		},
	);
});
