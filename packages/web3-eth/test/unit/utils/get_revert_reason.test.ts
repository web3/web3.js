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
import { DEFAULT_RETURN_FORMAT } from 'web3-types';

import * as RpcMethodWrappers from '../../../src/rpc_method_wrappers';
import * as GetRevertReason from '../../../src/utils/get_revert_reason';
import { SimpleRevertAbi } from '../../fixtures/simple_revert';

describe('getRevertReason', () => {
	const web3Context = new Web3Context();

	it('should use the call rpc wrapper', async () => {
		const callSpy = jest.spyOn(RpcMethodWrappers, 'call').mockImplementation();

		const transaction = {
			from: '0x4fec0a51024b13030d26e70904b066c6d41157a5',
			to: '0x36361143b7e2c676f8ccd67743a89d26437f0529',
			data: '0x819f48fe',
			gasPrice: '0x15ab8f14',
			maxPriorityFeePerGas: undefined,
			maxFeePerGas: undefined,
		};

		await GetRevertReason.getRevertReason(web3Context, transaction);

		expect(callSpy).toHaveBeenCalledWith(
			web3Context,
			transaction,
			web3Context.defaultBlock,
			DEFAULT_RETURN_FORMAT,
		);
	});

	it('should return undefined', async () => {
		jest.spyOn(RpcMethodWrappers, 'call').mockResolvedValueOnce(
			'0x000000000000000000000000000000000000000000000000000000000000000a',
		);

		const transaction = {
			from: '0x4fec0a51024b13030d26e70904b066c6d41157a5',
			to: '0x36361143b7e2c676f8ccd67743a89d26437f0529',
			data: '0x819f48fe',
			gasPrice: '0x15ab8f14',
			maxPriorityFeePerGas: undefined,
			maxFeePerGas: undefined,
		};

		const result = await GetRevertReason.getRevertReason(web3Context, transaction);

		expect(result).toBeUndefined();
	});

	it('should call parseTransactionError without contractAbi', async () => {
		const expectedError = {
			jsonrpc: '2.0',
			id: 1,
			error: {
				code: -32000,
				message:
					'err: insufficient funds for gas * price + value: address 0x0000000000000000000000000000000000000000 have 66 want 9983799287684 (supplied gas 26827)',
			},
		};
		const parseTransactionErrorSpy = jest
			.spyOn(GetRevertReason, 'parseTransactionError')
			.mockImplementation();
		jest.spyOn(RpcMethodWrappers, 'call').mockRejectedValueOnce(expectedError);

		const transaction = {
			from: '0x4fec0a51024b13030d26e70904b066c6d41157a5',
			to: '0x36361143b7e2c676f8ccd67743a89d26437f0529',
			data: '0x819f48fe',
			gasPrice: '0x15ab8f14',
			maxPriorityFeePerGas: undefined,
			maxFeePerGas: undefined,
		};

		await GetRevertReason.getRevertReason(web3Context, transaction);

		expect(parseTransactionErrorSpy).toHaveBeenCalledWith(expectedError, undefined);
	});

	it('should call parseTransactionError with contractAbi', async () => {
		const expectedError = {
			jsonrpc: '2.0',
			id: 1,
			error: {
				code: -32000,
				message:
					'err: insufficient funds for gas * price + value: address 0x0000000000000000000000000000000000000000 have 66 want 9983799287684 (supplied gas 26827)',
			},
		};
		const parseTransactionErrorSpy = jest
			.spyOn(GetRevertReason, 'parseTransactionError')
			.mockImplementation();
		jest.spyOn(RpcMethodWrappers, 'call').mockRejectedValueOnce(expectedError);

		const transaction = {
			from: '0x4fec0a51024b13030d26e70904b066c6d41157a5',
			to: '0x36361143b7e2c676f8ccd67743a89d26437f0529',
			data: '0x819f48fe',
			gasPrice: '0x15ab8f14',
			maxPriorityFeePerGas: undefined,
			maxFeePerGas: undefined,
		};

		await GetRevertReason.getRevertReason(web3Context, transaction, SimpleRevertAbi);

		expect(parseTransactionErrorSpy).toHaveBeenCalledWith(expectedError, SimpleRevertAbi);
	});
});
