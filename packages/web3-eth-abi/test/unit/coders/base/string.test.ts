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
import { decodeString, encodeString } from '../../../../src/coders/base/string';
import {
	invalidStringEncoderData,
	validStringDecoderData,
	validStringEncoderData,
} from '../../../fixtures/coders/base/string';

describe('abi - coder - base - string', () => {
	describe('encode', () => {
		it.each(validStringEncoderData)(
			'string type with value %s to result in %s',
			(value, expected) => {
				const result = encodeString({ type: 'string', name: '' }, value);
				expect(Buffer.from(result.encoded).toString('hex')).toEqual(expected);
				expect(result.dynamic).toBeTruthy();
			},
		);
		it.each(invalidStringEncoderData)('string type with value %s to error', value => {
			expect(() => encodeString({ type: 'string', name: '' }, value)).toThrow(AbiError);
		});
	});

	describe('decode', () => {
		it.each(validStringDecoderData)(
			'string type with value %s to result in %s',
			(value, expected, remaining) => {
				const result = decodeString({ type: 'string', name: '' }, hexToBytes(value));
				expect(result.result).toEqual(expected);
				expect(result.encoded).toEqual(hexToBytes(remaining));
			},
		);
	});
});
