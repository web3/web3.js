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

import {
	getUncleByBlockHashAndIndex,
	getUncleByBlockNumberAndIndex,
} from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { getUncle } from '../../../src/rpc_method_wrappers';
import { mockRpcResponse, testData } from './fixtures/get_uncle';
import { blockSchema } from '../../../src/schemas';

jest.mock('../../../src/rpc_methods');

describe('getUncle', () => {
	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it.each(testData)(
		`should call rpcMethods.getUncle with expected parameters\nTitle: %s\nInput parameters: %s\n`,
		async (_, inputParameters) => {
			const [inputBlock, inputUncleIndex] = inputParameters;
			const inputBlockIsBytes = isBytes(inputBlock as Bytes);
			const inputUncleIndexFormatted = format(
				{ eth: 'uint' },
				inputUncleIndex,
				ETH_DATA_FORMAT,
			);

			let inputBlockFormatted;

			if (inputBlockIsBytes) {
				inputBlockFormatted = format({ eth: 'bytes32' }, inputBlock, ETH_DATA_FORMAT);
			} else if (isNullish(inputBlock)) {
				inputBlockFormatted = web3Context.defaultBlock;
			} else {
				inputBlockFormatted = format({ eth: 'uint' }, inputBlock, ETH_DATA_FORMAT);
			}

			await getUncle(web3Context, ...inputParameters, DEFAULT_RETURN_FORMAT);
			expect(
				inputBlockIsBytes ? getUncleByBlockHashAndIndex : getUncleByBlockNumberAndIndex,
			).toHaveBeenCalledWith(
				web3Context.requestManager,
				inputBlockFormatted,
				inputUncleIndexFormatted,
			);
		},
	);

	it.each(testData)(
		`should format mockRpcResponse using provided return format\nTitle: %s\nInput parameters: %s\nMock Rpc Response: %s\n`,
		async (_, inputParameters) => {
			const [inputBlock] = inputParameters;
			const expectedReturnFormat = { number: FMT_NUMBER.STR, bytes: FMT_BYTES.BUFFER };
			const expectedFormattedResult = format(
				blockSchema,
				mockRpcResponse,
				expectedReturnFormat,
			);
			const inputBlockIsBytes = isBytes(inputBlock as Bytes);
			(
				(inputBlockIsBytes
					? getUncleByBlockHashAndIndex
					: getUncleByBlockNumberAndIndex) as jest.Mock
			).mockResolvedValueOnce(mockRpcResponse);

			const result = await getUncle(web3Context, ...inputParameters, expectedReturnFormat);
			expect(result).toStrictEqual(expectedFormattedResult);
		},
	);
});
