import { Web3Context } from 'web3-core';
import { DEFAULT_RETURN_FORMAT, FMT_BYTES, FMT_NUMBER } from 'web3-common';

import { getPendingTransactions as rpcMethodsGetPendingTransactions } from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { getPendingTransactions } from '../../../src/rpc_method_wrappers';
import { formatTransaction } from '../../../src';
import { mockRpcResponse } from './fixtures/get_pending_transactions';

jest.mock('../../../src/rpc_methods');

describe('getPendingTransactions', () => {
	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it('should call rpcMethods.getPendingTransactions with expected parameters', async () => {
		(rpcMethodsGetPendingTransactions as jest.Mock).mockResolvedValueOnce(mockRpcResponse);
		await getPendingTransactions(web3Context, DEFAULT_RETURN_FORMAT);
		expect(rpcMethodsGetPendingTransactions).toHaveBeenCalledWith(web3Context.requestManager);
	});

	it('should format return value using provided return format', async () => {
		const expectedReturnFormat = { number: FMT_NUMBER.STR, bytes: FMT_BYTES.BUFFER };
		const expectedFormattedResult = mockRpcResponse.map(transaction =>
			formatTransaction(transaction, expectedReturnFormat),
		);
		(rpcMethodsGetPendingTransactions as jest.Mock).mockResolvedValueOnce(mockRpcResponse);

		const result = await getPendingTransactions(web3Context, expectedReturnFormat);
		expect(result).toStrictEqual(expectedFormattedResult);
	});
});
