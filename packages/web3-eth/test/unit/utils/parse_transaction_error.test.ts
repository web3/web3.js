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
import { ContractExecutionError, InvalidResponseError } from 'web3-errors';

import { parseTransactionError } from '../../../src/utils/get_revert_reason';
import { SimpleRevertAbi } from '../../fixtures/simple_revert';

describe('parseTransactionError', () => {
	it('should return object of type RevertReason', () => {
		const error = new ContractExecutionError({
			code: 3,
			message: 'execution reverted: This is a send revert',
			data: '0x08c379a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000155468697320697320612073656e64207265766572740000000000000000000000',
		});

		const result = parseTransactionError(error);
		expect(result).toStrictEqual({
			reason: 'execution reverted: This is a send revert',
			signature: '0x08c379a0',
			data: '000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000155468697320697320612073656e64207265766572740000000000000000000000',
		});
	});

	it('should return object of type RevertReasonWithCustomError', () => {
		const error = new ContractExecutionError({
			code: 3,
			message: 'execution reverted',
			data: '0xc85bda60000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001c5468697320697320616e206572726f72207769746820706172616d7300000000',
		});

		const result = parseTransactionError(error, SimpleRevertAbi);
		expect(result).toStrictEqual({
			reason: 'execution reverted',
			signature: '0xc85bda60',
			data: '000000000000000000000000000000000000000000000000000000000000002a0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001c5468697320697320616e206572726f72207769746820706172616d7300000000',
			customErrorName: 'ErrorWithParams',
			customErrorDecodedSignature: 'ErrorWithParams(uint256,string)',
			customErrorArguments: {
				'0': BigInt(42),
				'1': 'This is an error with params',
				__length__: 2,
				code: BigInt(42),
				message: 'This is an error with params',
			},
		});
	});

	it('should return object of type string', () => {
		const error = new InvalidResponseError({
			jsonrpc: '2.0',
			id: '3f839900-afdd-4553-bca7-b4e2b835c687',
			error: { code: -32000, message: 'intrinsic gas too low' },
		});

		const result = parseTransactionError(error);
		expect(result).toBe('intrinsic gas too low');
	});

	it('should throw an error', () => {
		const error = new InvalidResponseError([
			{
				jsonrpc: '2.0',
				id: '3f839900-afdd-4553-bca7-b4e2b835c687',
				error: { code: -32000, message: 'intrinsic gas too low' },
			},
			{
				jsonrpc: '2.0',
				id: '3f839900-afdd-4553-bca7-b4e2b835c687',
				error: { code: -32000, message: 'intrinsic gas too low' },
			},
		]);

		expect(() => parseTransactionError(error)).toThrow(error);
	});
});
