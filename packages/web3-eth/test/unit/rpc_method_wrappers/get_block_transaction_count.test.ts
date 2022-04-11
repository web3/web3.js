import { Web3Context } from 'web3-core';
import { DEFAULT_RETURN_FORMAT, format } from 'web3-common';
import { isBytes } from 'web3-validator';
import { Bytes } from 'web3-utils';

import {
	getBlockTransactionCountByHash,
	getBlockTransactionCountByNumber,
} from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { getBlockTransactionCount } from '../../../src/rpc_method_wrappers';
import { testData } from './fixtures/get_block_transaction_count';
import { blockSchema } from '../../../src/schemas';

jest.mock('../../../src/rpc_methods');

describe('getBlockTransactionCount', () => {
	let web3Context: Web3Context<Web3EthExecutionAPI>;

	beforeAll(() => {
		web3Context = new Web3Context('http://127.0.0.1:8545');
	});

	it.each(testData)(
		`should call rpcMethods.getBlock with expected parameters\nTitle: %s\nInput parameters: %s\n`,
		async (_, inputParameters, __) => {
			const [inputBlock] = inputParameters;
			const inputBlockIsBytes = isBytes(inputBlock as Bytes);

			let inputBlockFormatted;

			if (inputBlockIsBytes) {
				inputBlockFormatted = format({ eth: 'bytes32' }, inputBlock, DEFAULT_RETURN_FORMAT);
			} else if (inputBlock === undefined) {
				inputBlockFormatted = web3Context.defaultBlock;
			} else {
				inputBlockFormatted = format({ eth: 'uint' }, inputBlock, DEFAULT_RETURN_FORMAT);
			}

			await getBlockTransactionCount(web3Context, ...inputParameters);
			expect(
				inputBlockIsBytes
					? getBlockTransactionCountByHash
					: getBlockTransactionCountByNumber,
			).toHaveBeenCalledWith(web3Context.requestManager, inputBlockFormatted);
		},
	);

	it.each(testData)(
		`should format return value using provided return format\nTitle: %s\nInput parameters: %s\nMock Rpc Response: %s\n`,
		async (_, inputParameters, mockRpcResponse) => {
			const [inputBlock, returnFormat] = inputParameters;
			const expectedFormattedResult = format(blockSchema, mockRpcResponse, returnFormat);
			const inputBlockIsBytes = isBytes(inputBlock as Bytes);
			(
				(inputBlockIsBytes
					? getBlockTransactionCountByHash
					: getBlockTransactionCountByNumber) as jest.Mock
			).mockResolvedValueOnce(mockRpcResponse);

			const result = await getBlockTransactionCount(web3Context, ...inputParameters);
			expect(result).toStrictEqual(expectedFormattedResult);
		},
	);
});
