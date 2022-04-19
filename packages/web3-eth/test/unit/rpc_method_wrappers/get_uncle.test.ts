import { Web3Context } from 'web3-core';
import { DEFAULT_RETURN_FORMAT, FMT_BYTES, FMT_NUMBER, format } from 'web3-common';
import { isBytes } from 'web3-validator';
import { Bytes } from 'web3-utils';

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
