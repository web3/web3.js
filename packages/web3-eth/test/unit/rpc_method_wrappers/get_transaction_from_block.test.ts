import { Web3Context } from 'web3-core';
import { DEFAULT_RETURN_FORMAT, FMT_BYTES, FMT_NUMBER, format } from 'web3-common';
import { isBytes } from 'web3-validator';
import { Bytes } from 'web3-utils';

import {
	getTransactionByBlockHashAndIndex,
	getTransactionByBlockNumberAndIndex,
} from '../../../src/rpc_methods';
import { Web3EthExecutionAPI } from '../../../src/web3_eth_execution_api';
import { getTransactionFromBlock } from '../../../src/rpc_method_wrappers';
import { mockRpcResponse, testData } from './fixtures/get_transaction_from_block';
import { formatTransaction } from '../../../src';

jest.mock('../../../src/rpc_methods');

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
				{ eth: 'uint' },
				inputTransactionIndex,
				DEFAULT_RETURN_FORMAT,
			);

			let inputBlockFormatted;

			if (inputBlockIsBytes) {
				inputBlockFormatted = format({ eth: 'bytes32' }, inputBlock, DEFAULT_RETURN_FORMAT);
			} else if (inputBlock === undefined) {
				inputBlockFormatted = web3Context.defaultBlock;
			} else {
				inputBlockFormatted = format({ eth: 'uint' }, inputBlock, DEFAULT_RETURN_FORMAT);
			}

			await getTransactionFromBlock(web3Context, ...inputParameters, DEFAULT_RETURN_FORMAT);
			expect(
				inputBlockIsBytes
					? getTransactionByBlockHashAndIndex
					: getTransactionByBlockNumberAndIndex,
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
			const expectedReturnFormat = { number: FMT_NUMBER.STR, bytes: FMT_BYTES.BUFFER };
			const expectedFormattedResult = formatTransaction(
				mockRpcResponse,
				expectedReturnFormat,
			);
			const inputBlockIsBytes = isBytes(inputBlock as Bytes);
			(
				(inputBlockIsBytes
					? getTransactionByBlockHashAndIndex
					: getTransactionByBlockNumberAndIndex) as jest.Mock
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
