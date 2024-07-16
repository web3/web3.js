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

import { Eip838ExecutionError } from 'web3-errors';
import { decodeContractErrorData } from '../../src/decode_contract_error_data';

import { validDecodeContractErrorData, invalidDecodeContractErrorData } from '../fixtures/data';

describe('decodeContractErrorData', () => {
	describe('valid data', () => {
		it.each(validDecodeContractErrorData)(
			'%#: should pass for valid values: %j',
			({ input: [abi, errorData], output }) => {
				const err = new Eip838ExecutionError(errorData);

				decodeContractErrorData(abi, err);

				expect(err.errorName).toEqual(output.errorName);
				expect(err.errorSignature).toEqual(output.errorSignature);
				expect(err.errorArgs?.message).toEqual(output.errorArgs?.message);

				// This ensures they are equal if one was provided
				// It also skips if both are not provided
				if (err.errorArgs?.code || output.errorArgs?.code) {
					// eslint-disable-next-line jest/no-conditional-expect
					expect(Number(err.errorArgs?.code)).toEqual(output.errorArgs?.code);
				}
				expect(err.cause?.code).toEqual(output.cause?.code);
			},
		);
	});

	describe('invalid data', () => {
		it.each(invalidDecodeContractErrorData)(
			'%#: should throw for invalid values: %j',
			({ input: [abi, errorData] }) => {
				// mock console.error
				const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => 'error');
				const err = new Eip838ExecutionError(errorData);
				decodeContractErrorData(abi, err);
				expect(consoleSpy).toHaveBeenCalled();
			},
		);
	});
});
