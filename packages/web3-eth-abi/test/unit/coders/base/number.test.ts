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
import { decodeNumber, encodeNumber } from '../../../../src/coders/base/number';
import {
	invalidNumberDecoderData,
	invalidNumberEncoderData,
	validNumberDecoderData,
	validNumberEncoderData,
} from '../../../fixtures/coders/base/number';

describe('abi - coder - base - number', () => {
	describe('encode', () => {
		it.each(validNumberEncoderData)(
			'%j type with value %s to be %s',
			(type, value, expected) => {
				const result = encodeNumber(type, value);
				expect(Buffer.from(result.encoded).toString('hex')).toEqual(expected);
			},
		);

		it.each(invalidNumberEncoderData)('%j type with value %s to throw', (type, value) => {
			expect(() => encodeNumber(type, value)).toThrow(AbiError);
		});
	});

	describe('decode', () => {
		it.each(validNumberDecoderData)(
			'%j type with bytes %s',
			(param, bytes, result, remaining) => {
				const resultNumber = decodeNumber(param, hexToBytes(bytes));
				expect(typeof resultNumber.result).toEqual(typeof result);
				expect(resultNumber.result.toString()).toEqual(result.toString());
				expect(resultNumber.encoded).toEqual(hexToBytes(remaining));
			},
		);

		it.each(invalidNumberDecoderData)('%j type with bytes %s to throw', (type, value) => {
			expect(() => decodeNumber(type, hexToBytes(value))).toThrow(AbiError);
		});
	});
});
