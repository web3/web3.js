import { Web3Context } from 'web3-core';
import { DEFAULT_RETURN_FORMAT, FMT_BYTES, FMT_NUMBER, format } from 'web3-common';
import { isBytes } from 'web3-validator';
import { Bytes } from 'web3-utils';

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
				inputBlockFormatted = format({ eth: 'bytes32' }, inputBlock, DEFAULT_RETURN_FORMAT);
			} else if (inputBlock === undefined) {
				inputBlockFormatted = web3Context.defaultBlock;
			} else {
				inputBlockFormatted = format({ eth: 'uint' }, inputBlock, DEFAULT_RETURN_FORMAT);
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
