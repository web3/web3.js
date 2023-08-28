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

import { AbiInput } from 'web3-types';
import { decodeParameters, encodeParameters } from '../../../src/api/parameters_api';
import {
	inValidDecodeParametersData,
	inValidEncodeParametersData,
	validDecodeParametersData,
	validEncodeParametersData,
	validEncodeDecodeParametersData,
	validEncodeDoesNotMutateData,
} from '../../fixtures/data';

describe('parameters_api', () => {
	describe('encodeParameters', () => {
		describe('valid data', () => {
			it.each(validEncodeParametersData)(
				'%#: should pass for valid values: %j',
				({ input: [abi, params], output }) => {
					const expected = encodeParameters(abi, params);
					expect(expected).toEqual(output);
				},
			);
		});

		describe('invalid data', () => {
			it.each(inValidEncodeParametersData)(
				'%#: should not pass for invalid values: %j',
				({ input: [abi, params] }) => {
					expect(() => encodeParameters(abi, params)).toThrow();
				},
			);
		});
	});

	describe('encodeParametersDoesNotMutate', () => {
		describe('valid data', () => {
			it.each(validEncodeDoesNotMutateData)(
				'%#: should pass for valid values: %j',
				({ input: [abi, params], output, expectedInput }) => {
					const expected = encodeParameters(abi, params);
					expect(JSON.parse(JSON.stringify(expected))).toEqual(output);
					// check that params has not been mutated
					expect(JSON.parse(JSON.stringify(params))).toEqual(
						JSON.parse(JSON.stringify(expectedInput)),
					);
				},
			);
		});
	});

	describe('decodeParameters', () => {
		describe('valid data', () => {
			it.each(validDecodeParametersData)(
				'%#: should pass for valid values: %j',
				({ input: [abi, bytes], outputResult }) => {
					// Output returns mix of array and object which can't be matched in
					// jest, so have to use stringify+parse to match
					// {
					//   '0': [ '34', '255' ],
					//   '1': [
					//     '42',
					//     '56',
					//     [ '45', '78', propertyOne: '45', propertyTwo: '78' ],
					//     propertyOne: '42',
					//     propertyTwo: '56',
					//     ChildStruct: [ '45', '78', propertyOne: '45', propertyTwo: '78' ]
					//   ],
					//   __length__: 2
					// }
					expect(JSON.parse(JSON.stringify(decodeParameters(abi, bytes)))).toEqual(
						outputResult,
					);
				},
			);
		});

		describe('invalid data', () => {
			it.each(inValidDecodeParametersData)(
				'%#: should not pass for invalid values: %j',
				({ input: [abi, bytes] }) => {
					expect(() => decodeParameters(abi, bytes)).toThrow();
				},
			);
		});
	});

	describe('encode and decode', () => {
		describe('input should be the same as returned value from encode and decode', () => {
			it.each(validEncodeDecodeParametersData)(
				'%#: should pass for valid values: %j',
				({ input: [abi, params], output, outputResult }) => {
					const rwAbi = abi as AbiInput[];
					const encodedBytes = encodeParameters(abi, params);
					expect(JSON.parse(JSON.stringify(encodedBytes))).toEqual(output);

					const decodedParams = decodeParameters(rwAbi, encodedBytes);
					expect(JSON.parse(JSON.stringify(decodedParams))).toEqual(outputResult);
				},
			);
		});
	});
});
