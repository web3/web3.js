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
	DEFAULT_RETURN_FORMAT,
	FMT_BYTES,
	FMT_NUMBER,
	EthExecutionAPI,
	HexStringBytes,
} from 'web3-types';
import { ethRpcMethods } from 'web3-rpc-methods';
import { getUserOperationReceipt } from '../../../src/rpc_method_wrappers';
import { userOperationReceiptSchema } from '../../../src/schemas';
import { mockRpcResponse } from './fixtures/get_user_operation_receippt';

jest.mock('web3-rpc-methods');

describe('getUserOperationReceipt', () => {
	let web3Context: Web3Context<EthExecutionAPI>;
	let hash: HexStringBytes;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
		hash = '0x123456789abcdef0123456789abcdef012345678';
	});

	it('should call ethRpcMethods.getUserOperationReceipt with expected parameters', async () => {
		await getUserOperationReceipt(web3Context, hash, DEFAULT_RETURN_FORMAT);
		expect(ethRpcMethods.getUserOperationReceipt).toHaveBeenCalledWith(
			web3Context.requestManager,
			hash,
		);
	});

	it('should format mockRpcResponse using provided return format', async () => {
		const expectedReturnFormat = { number: FMT_NUMBER.STR, bytes: FMT_BYTES.UINT8ARRAY };
		const expectedFormattedResult = format(
			userOperationReceiptSchema,
			mockRpcResponse,
			expectedReturnFormat,
		);
		(ethRpcMethods.getUserOperationReceipt as jest.Mock).mockResolvedValueOnce(mockRpcResponse);

		const result = await getUserOperationReceipt(web3Context, hash, expectedReturnFormat);
		expect(result).toEqual(expectedFormattedResult);
	});
});
