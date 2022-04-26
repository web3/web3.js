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

import { encodeFunctionCall, encodeFunctionSignature } from '../../../src/api/functions_api';
import {
	inValidFunctionsSignatures,
	validFunctionsSignatures,
	validFunctionsCall,
	inValidFunctionsCalls,
} from '../../fixtures/data';

describe('functions_api', () => {
	describe('encodeFunctionSignature', () => {
		describe('valid data', () => {
			it.each(validFunctionsSignatures)(
				'should pass for valid values: %s',
				({ input, output }) => {
					expect(encodeFunctionSignature(input)).toEqual(output);
				},
			);
		});

		describe('invalid data', () => {
			it.each(inValidFunctionsSignatures)(
				'should pass for valid values: %s',
				({ input, output }) => {
					expect(() => encodeFunctionSignature(input)).toThrow(output);
				},
			);
		});
	});

	describe('encodeFunctionCall', () => {
		describe('valid data', () => {
			it.each(validFunctionsCall)(
				'should pass for valid values: %s',
				({ input: { abi, params }, output }) => {
					expect(encodeFunctionCall(abi, params)).toEqual(output);
				},
			);
		});

		describe('invalid data', () => {
			it.each(inValidFunctionsCalls)(
				'should pass for valid values: %s',
				({ input, output }) => {
					expect(() => encodeFunctionCall(input, [])).toThrow(output);
				},
			);
		});
	});
});
