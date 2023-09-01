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
import { DEFAULT_RETURN_FORMAT, FMT_BYTES, FMT_NUMBER, EthExecutionAPI } from 'web3-types';
import { ethRpcMethods } from 'web3-rpc-methods';
import { supportedEntryPoints } from '../../../src/rpc_method_wrappers';

jest.mock('web3-rpc-methods');

describe('supportedEntryPoints', () => {
	let web3Context: Web3Context<EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it('should call ethRpcMethods.supportedEntryPoints with expected parameters', async () => {
		await supportedEntryPoints(web3Context, DEFAULT_RETURN_FORMAT);
		expect(ethRpcMethods.supportedEntryPoints).toHaveBeenCalledWith(web3Context.requestManager);
	});

	it('should format mockRpcResponse using provided return format', async () => {
		const mockRpcResponse = [
			'0xcd01C8aa8995A59eB7B2627E69b40e0524B5ecf8',
			'0x7A0A0d159218E6a2f407B99173A2b12A6DDfC2a6',
		];
		const expectedReturnFormat = { number: FMT_NUMBER.BIGINT, bytes: FMT_BYTES.HEX };
		const expectedFormattedResult = format(
			{
				type: 'array',
				items: {
					format: 'string',
				},
			},
			mockRpcResponse,
			expectedReturnFormat,
		);
		(ethRpcMethods.supportedEntryPoints as jest.Mock).mockResolvedValueOnce(mockRpcResponse);

		const result = await supportedEntryPoints(web3Context, expectedReturnFormat);
		expect(result).toStrictEqual(expectedFormattedResult);
	});
});
