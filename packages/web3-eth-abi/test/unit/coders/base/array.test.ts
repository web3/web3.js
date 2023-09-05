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

import { AbiError } from 'web3-errors';
import { bytesToHex, hexToBytes } from 'web3-utils';
import { decodeArray, encodeArray } from '../../../../src/coders/base';
import { extractArrayType } from '../../../../src/coders/utils';
import {
	invalidArrayDecoderData,
	invalidArrayEncoderData,
	validArrayDecoderData,
	validArrayEncoderData,
} from '../../../fixtures/coders/base/array';

describe('abi - coder - base - array', () => {
	describe('extractArrayType', () => {
		it('should work for dynamic array', () => {
			expect(extractArrayType({ type: 'uint256[]', name: '' })).toEqual({
				param: { type: 'uint256', name: '' },
				size: -1,
			});
		});
		it('should work for 2d array', () => {
			expect(extractArrayType({ type: 'uint256[][]', name: '' })).toEqual({
				param: { type: 'uint256[]', name: '' },
				size: -1,
			});
		});
		it('should work for fixed size array', () => {
			expect(extractArrayType({ type: 'uint256[2]', name: '' })).toEqual({
				param: { type: 'uint256', name: '' },
				size: 2,
			});
			expect(extractArrayType({ type: 'uint256[0]', name: '' })).toEqual({
				param: { type: 'uint256', name: '' },
				size: 0,
			});
		});
		it('should fail for invalid array size', () => {
			expect(() => extractArrayType({ type: 'uint256[2q]', name: '' })).toThrow();
		});
	});

	describe('encode', () => {
		it.each(validArrayEncoderData)('value %s to result in %s', value => {
			const result = encodeArray({ type: value.type, name: '' }, value.values);
			expect(bytesToHex(result.encoded)).toEqual(value.result);
			expect(result.dynamic).toEqual(value.dynamic);
		});

		it.each(invalidArrayEncoderData)('value %s to throw', value => {
			expect(() => encodeArray({ type: value.type, name: '' }, value.values)).toThrow(
				AbiError,
			);
		});
	});

	describe('decode', () => {
		it.each(validArrayDecoderData)('value to result', value => {
			const result = decodeArray({ type: value.type, name: '' }, hexToBytes(value.bytes));
			expect(result.result).toEqual(value.result);
			expect(bytesToHex(result.encoded)).toEqual(value.remaining);
		});

		it.each(invalidArrayDecoderData)('value to throw', value => {
			expect(() =>
				decodeArray({ type: value.type, name: '' }, hexToBytes(value.bytes)),
			).toThrow(AbiError);
		});
	});
});
