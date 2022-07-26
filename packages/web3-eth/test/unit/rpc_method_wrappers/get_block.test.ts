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
import { DEFAULT_RETURN_FORMAT, ETH_DATA_FORMAT, FMT_BYTES, FMT_NUMBER, format } from 'web3-utils';
import { isBytes, isNullish } from 'web3-validator';
import { Bytes } from 'web3-types';

import { getBlockByHash, getBlockByNumber } from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { getBlock } from '../../../src/rpc_method_wrappers';
import { mockRpcResponse, mockRpcResponseHydrated, testData } from './fixtures/get_block';
import { blockSchema } from '../../../src/schemas';

jest.mock('../../../src/rpc_methods');

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
				inputBlockFormatted = format({ eth: 'bytes32' }, inputBlock, ETH_DATA_FORMAT);
			} else if (isNullish(inputBlock)) {
				inputBlockFormatted = web3Context.defaultBlock;
			} else {
				inputBlockFormatted = format({ eth: 'uint' }, inputBlock, ETH_DATA_FORMAT);
			}

			await getBlock(web3Context, ...inputParameters, DEFAULT_RETURN_FORMAT);
			expect(inputBlockIsBytes ? getBlockByHash : getBlockByNumber).toHaveBeenCalledWith(
				web3Context.requestManager,
				inputBlockFormatted,
				hydrated,
			);
		},
	);

	it.each(testData)(
		`should format expectedMockRpcResponse using provided return format\nTitle: %s\nInput parameters: %s\n`,
		async (_, inputParameters) => {
			const [inputBlock, hydrated] = inputParameters;
			const expectedReturnFormat = { number: FMT_NUMBER.STR, bytes: FMT_BYTES.BUFFER };
			const expectedMockRpcResponse = hydrated ? mockRpcResponseHydrated : mockRpcResponse;
			const expectedFormattedResult = format(
				blockSchema,
				expectedMockRpcResponse,
				expectedReturnFormat,
			);
			const inputBlockIsBytes = isBytes(inputBlock as Bytes);
			(
				(inputBlockIsBytes ? getBlockByHash : getBlockByNumber) as jest.Mock
			).mockResolvedValueOnce(expectedMockRpcResponse);

			const result = await getBlock(web3Context, ...inputParameters, expectedReturnFormat);
			expect(result).toStrictEqual(expectedFormattedResult);
		},
	);
});
