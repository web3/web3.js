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
import { DEFAULT_RETURN_FORMAT, FMT_BYTES, FMT_NUMBER, format } from 'web3-utils';

import { getLogs as rpcMethodsGetLogs } from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { getLogs } from '../../../src/rpc_method_wrappers';
import { mockRpcResponse, testData } from './fixtures/get_logs';
import { logSchema } from '../../../src/schemas';

jest.mock('../../../src/rpc_methods');

describe('getLogs', () => {
	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it.each(testData)(
		`should call rpcMethods.getLogs with expected parameters\nTitle: %s\nInput parameters: %s\n`,
		async (_, inputParameters) => {
			(rpcMethodsGetLogs as jest.Mock).mockResolvedValueOnce(mockRpcResponse);
			await getLogs(web3Context, ...inputParameters, DEFAULT_RETURN_FORMAT);
			expect(rpcMethodsGetLogs).toHaveBeenCalledWith(
				web3Context.requestManager,
				...inputParameters,
			);
		},
	);

	it.each(testData)(
		`should format mockRpcResponse using provided return format\nTitle: %s\nInput parameters: %s\n`,
		async (_, inputParameters) => {
			const expectedReturnFormat = { number: FMT_NUMBER.STR, bytes: FMT_BYTES.BUFFER };
			const expectedFormattedResult = mockRpcResponse.map(res => {
				if (typeof res === 'string') {
					return res;
				}

				return format(logSchema, res, expectedReturnFormat);
			});
			(rpcMethodsGetLogs as jest.Mock).mockResolvedValueOnce(mockRpcResponse);

			const result = await getLogs(web3Context, ...inputParameters, expectedReturnFormat);
			expect(result).toStrictEqual(expectedFormattedResult);
		},
	);
});
