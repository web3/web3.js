import { Web3Context } from 'web3-core';
import { DEFAULT_RETURN_FORMAT, format } from 'web3-common';

import {
	getTransactionByHash,
} from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { getTransaction } from '../../../src/rpc_method_wrappers';
import { testData } from './fixtures/get_transaction';
import { formatTransaction } from '../../../src';

jest.mock('../../../src/rpc_methods');

describe('getTransaction', () => {
	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it.each(testData)(
		`should call rpcMethods.getTransaction with expected parameters\nTitle: %s\nInput parameters: %s\n`,
		async (_, inputParameters, __) => {
			const [inputTransactionHash] = inputParameters;
			const inputTransactionHashFormatted = format({ eth: 'bytes32' }, inputTransactionHash, DEFAULT_RETURN_FORMAT);

			await getTransaction(web3Context, ...inputParameters);
			expect(getTransactionByHash).toHaveBeenCalledWith(web3Context.requestManager, inputTransactionHashFormatted);
		},
	);

	it.each(testData)(
		`should format return value using provided return format\nTitle: %s\nInput parameters: %s\nMock Rpc Response: %s\n`,
		async (_, inputParameters, mockRpcResponse) => {
			const [__, returnFormat] = inputParameters;
			const expectedFormattedResult = formatTransaction(mockRpcResponse, returnFormat);
			(getTransactionByHash as jest.Mock).mockResolvedValueOnce(mockRpcResponse);

			const result = await getTransaction(web3Context, ...inputParameters);
			expect(result).toStrictEqual(expectedFormattedResult);
		},
	);
});
