/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
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
