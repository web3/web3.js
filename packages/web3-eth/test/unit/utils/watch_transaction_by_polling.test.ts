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
import { format } from 'web3-utils';
import { DEFAULT_RETURN_FORMAT, Web3EthExecutionAPI } from 'web3-types';
import { ethRpcMethods } from 'web3-rpc-methods';
import * as rpcMethodWrappers from '../../../src/rpc_method_wrappers';
import * as WaitForTransactionReceipt from '../../../src/utils/wait_for_transaction_receipt';

import * as WatchTransactionByPolling from '../../../src/utils/watch_transaction_by_polling';
import {
	expectedTransactionReceipt,
	expectedTransactionHash,
	testData,
} from '../rpc_method_wrappers/fixtures/send_signed_transaction';
import { transactionReceiptSchema } from '../../../src/schemas';
import { sleep } from '../../shared_fixtures/utils';

jest.mock('web3-rpc-methods');
jest.mock('../../../src/utils/wait_for_transaction_receipt');

const mockBlockData = {
	hash: '0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae',
};

const testMessage =
	'Title: %s\ninputSignedTransaction: %s\nexpectedTransactionHash: %s\nexpectedTransactionReceipt: %s\n';
describe('watchTransactionByPolling', () => {
	describe('should call getBlockByNumber', () => {
		let web3Context: Web3Context<Web3EthExecutionAPI>;

		beforeAll(() => {
			web3Context = new Web3Context(
				// dummy provider that does not supports subscription
				{
					request: jest.fn(),
				},
			);

			jest.spyOn(ethRpcMethods, 'getBlockByNumber').mockResolvedValue(mockBlockData as any);
		});

		it.each(testData)(
			`watchTransactionByPolling logic\n ${testMessage}`,
			async (_, inputTransaction) => {
				const formattedTransactionReceipt = format(
					transactionReceiptSchema,
					expectedTransactionReceipt,
					DEFAULT_RETURN_FORMAT,
				);

				(
					WaitForTransactionReceipt.waitForTransactionReceipt as jest.Mock
				).mockResolvedValueOnce(expectedTransactionReceipt);

				(ethRpcMethods.sendRawTransaction as jest.Mock).mockResolvedValueOnce(
					expectedTransactionHash,
				);

				const promiEvent = rpcMethodWrappers.sendSignedTransaction(
					web3Context,
					inputTransaction,
					DEFAULT_RETURN_FORMAT,
				);
				await promiEvent;
				WatchTransactionByPolling.watchTransactionByPolling({
					web3Context,
					transactionReceipt: formattedTransactionReceipt,
					transactionPromiEvent: promiEvent,
					returnFormat: DEFAULT_RETURN_FORMAT,
				});

				await sleep(1000);
				expect(ethRpcMethods.getBlockByNumber).toHaveBeenCalled();

				// to clear the interval inside the polling function:
				web3Context.transactionConfirmationBlocks = 0;
			},
		);
	});
});
