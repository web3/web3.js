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

import { getBlock } from '../../../src/rpc_method_wrappers';
import { mockRpcResponse, mockRpcResponseHydrated, testData, noTransactionBlock } from './fixtures/get_block';
import { blockSchema } from '../../../src/schemas';

jest.mock('web3-rpc-methods');

describe('getBlock', () => {
	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it.each(testData)(
		`should call rpcMethods.getBlock with expected parameters\nTitle: %s\nInput parameters: %s\n`,
		async (_, inputParameters) => {
			const [inputBlock, hydrated] = inputParameters;
			const inputBlockIsBytes = isBytes(inputBlock as Bytes);

			let inputBlockFormatted;

			if (inputBlockIsBytes) {
				inputBlockFormatted = format({ format: 'bytes32' }, inputBlock, ETH_DATA_FORMAT);
			} else if (isNullish(inputBlock)) {
				inputBlockFormatted = web3Context.defaultBlock;
			} else {
				inputBlockFormatted = format({ format: 'uint' }, inputBlock, ETH_DATA_FORMAT);
			}
			await getBlock(web3Context, ...inputParameters, DEFAULT_RETURN_FORMAT);
			expect(
				inputBlockIsBytes ? ethRpcMethods.getBlockByHash : ethRpcMethods.getBlockByNumber,
			).toHaveBeenCalledWith(web3Context.requestManager, inputBlockFormatted, hydrated);
		},
	);

	it.each(testData)(
		`should format expectedMockRpcResponse using provided return format\nTitle: %s\nInput parameters: %s\n`,
		async (_, inputParameters) => {
			const [inputBlock, hydrated] = inputParameters;
			const expectedReturnFormat = { number: FMT_NUMBER.STR, bytes: FMT_BYTES.UINT8ARRAY };
			const expectedMockRpcResponse = hydrated ? mockRpcResponseHydrated : mockRpcResponse;
			const expectedFormattedResult = format(
				blockSchema,
				expectedMockRpcResponse,
				expectedReturnFormat,
			);
			const inputBlockIsBytes = isBytes(inputBlock as Bytes);
			(
				(inputBlockIsBytes
					? ethRpcMethods.getBlockByHash
					: ethRpcMethods.getBlockByNumber) as jest.Mock
			).mockResolvedValueOnce(expectedMockRpcResponse);

			const result = await getBlock(web3Context, ...inputParameters, expectedReturnFormat);
			expect(result).toStrictEqual(expectedFormattedResult);
		},
	);

	it.each(testData)(
		`should format the block to include transactions as an empty array if no transactions are present\nTitle: %s\nInput parameters: %s\n`,
		async (_, inputParameters) => {
			const [inputBlock] = inputParameters;
			const expectedReturnFormat = { number: FMT_NUMBER.STR, bytes: FMT_BYTES.UINT8ARRAY };
			const expectedMockRpcResponse = noTransactionBlock;
			// TODO: Fix format to default have a default in oneOf if no schema is matched
			const formattedResult = format(
				blockSchema,
				expectedMockRpcResponse,
				expectedReturnFormat,
			);
			const expectedFormattedResult  = {...formattedResult,
				transactions: []
			};
			const inputBlockIsBytes = isBytes(inputBlock as Bytes);
			(
				(inputBlockIsBytes
					? ethRpcMethods.getBlockByHash
					: ethRpcMethods.getBlockByNumber) as jest.Mock
			).mockResolvedValueOnce(expectedMockRpcResponse);

			const result = await getBlock(web3Context, ...inputParameters, expectedReturnFormat);
			expect(result).toStrictEqual(expectedFormattedResult);
		},
	);
});
