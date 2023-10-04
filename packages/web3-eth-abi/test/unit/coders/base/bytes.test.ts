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
import { hexToBytes } from 'web3-utils';
import { decodeBytes, encodeBytes } from '../../../../src/coders/base/bytes';
import {
	invalidBytesDecoderData,
	invalidBytesEncoderData,
	validBytesDecoderData,
	validBytesEncoderData,
} from '../../../fixtures/coders/base/bytes';

describe('abi - coder - base - bytes', () => {
	describe('encode', () => {
		it.each(validBytesEncoderData)(
			'bytes%j type with value %s to result in %s',
			(type, value, expected) => {
				const result = encodeBytes(type, value);
				expect(Buffer.from(result.encoded).toString('hex')).toEqual(expected);
				const [, size] = type.type.split('bytes');
				if (size) {
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result.dynamic).toBeFalsy();
				} else {
					// eslint-disable-next-line jest/no-conditional-expect
					expect(result.dynamic).toBeTruthy();
				}
			},
		);

		it.each(invalidBytesEncoderData)('bytes%j type value %s to throw', (type, value) => {
			expect(() => encodeBytes(type, value)).toThrow(AbiError);
		});
	});

	describe('decode', () => {
		it.each(validBytesDecoderData)(
			'bytes%j type with value %s to result in %s',
			(type, value, expected, remaining) => {
				const result = decodeBytes(type, hexToBytes(value));
				expect(result.result).toEqual(expected);
				expect(result.encoded).toEqual(hexToBytes(remaining));
			},
		);

		it.each(invalidBytesDecoderData)(
			'decode bytes %j type with value %s to throw',
			(type, value) => {
				expect(() => decodeBytes(type, hexToBytes(value))).toThrow(AbiError);
			},
		);
	});
});
