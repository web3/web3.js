import { Web3Context } from 'web3-core';
import { DEFAULT_RETURN_FORMAT, FMT_BYTES, FMT_NUMBER, format } from 'web3-common';

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
