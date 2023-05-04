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
import {
	ETH_DATA_FORMAT,
	DEFAULT_RETURN_FORMAT,
	FMT_NUMBER,
	FMT_BYTES,
	Bytes,
	Web3EthExecutionAPI,
} from 'web3-types';
import { isBytes, isNullish } from 'web3-validator';
import { ethRpcMethods } from 'web3-rpc-methods';

import { getTransactionFromBlock } from '../../../src/rpc_method_wrappers';
import { mockRpcResponse, testData } from './fixtures/get_transaction_from_block';
import { formatTransaction, transactionInfoSchema } from '../../../src';

jest.mock('web3-rpc-methods');

describe('getTransactionFromBlock', () => {
	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it.each(testData)(
		`should call rpcMethods.getTransactionFromBlock with expected parameters\nTitle: %s\nInput parameters: %s\n`,
		async (_, inputParameters) => {
			const [inputBlock, inputTransactionIndex] = inputParameters;
			const inputBlockIsBytes = isBytes(inputBlock as Bytes);
			const inputTransactionIndexFormatted = format(
				{ format: 'uint' },
				inputTransactionIndex,
				ETH_DATA_FORMAT,
			);

			let inputBlockFormatted;

			if (inputBlockIsBytes) {
				inputBlockFormatted = format({ format: 'bytes32' }, inputBlock, ETH_DATA_FORMAT);
			} else if (isNullish(inputBlock)) {
				inputBlockFormatted = web3Context.defaultBlock;
			} else {
				inputBlockFormatted = format({ format: 'uint' }, inputBlock, ETH_DATA_FORMAT);
			}

			await getTransactionFromBlock(web3Context, ...inputParameters, DEFAULT_RETURN_FORMAT);
			expect(
				inputBlockIsBytes
					? ethRpcMethods.getTransactionByBlockHashAndIndex
					: ethRpcMethods.getTransactionByBlockNumberAndIndex,
			).toHaveBeenCalledWith(
				web3Context.requestManager,
				inputBlockFormatted,
				inputTransactionIndexFormatted,
			);
		},
	);

	it.each(testData)(
		`should format mockRpcResponse using provided return format\nTitle: %s\nInput parameters: %s\n`,
		async (_, inputParameters) => {
			const [inputBlock] = inputParameters;
			const expectedReturnFormat = { number: FMT_NUMBER.STR, bytes: FMT_BYTES.UINT8ARRAY };
			const expectedFormattedResult = formatTransaction(
				mockRpcResponse,
				expectedReturnFormat,
				{ transactionSchema: transactionInfoSchema },
			);
			const inputBlockIsBytes = isBytes(inputBlock as Bytes);
			(
				(inputBlockIsBytes
					? ethRpcMethods.getTransactionByBlockHashAndIndex
					: ethRpcMethods.getTransactionByBlockNumberAndIndex) as jest.Mock
			).mockResolvedValueOnce(mockRpcResponse);

			const result = await getTransactionFromBlock(
				web3Context,
				...inputParameters,
				expectedReturnFormat,
			);
			expect(result).toStrictEqual(expectedFormattedResult);
		},
	);
});
