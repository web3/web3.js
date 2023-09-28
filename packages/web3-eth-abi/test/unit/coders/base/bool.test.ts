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
import { decodeBool, encodeBoolean } from '../../../../src/coders/base/bool';
import {
	invalidBoolDecoderData,
	invalidBoolEncoderData,
	validBoolDecoderData,
	validBoolEncoderData,
} from '../../../fixtures/coders/base/bool';

describe('abi - coder - base - bool', () => {
	describe('encode', () => {
		it.each(validBoolEncoderData)('value %s to result in %s', (value, expected) => {
			const result = encodeBoolean({ type: 'boolean', name: '' }, value);
			expect(Buffer.from(result.encoded).toString('hex')).toEqual(expected);
		});

		it.each(invalidBoolEncoderData)('value %s to throw', value => {
			expect(() => encodeBoolean({ type: 'boolean', name: '' }, value)).toThrow(AbiError);
		});
	});

	describe('decode', () => {
		it.each(validBoolDecoderData)(
			'value %s to result in %s',
			({ bytes, result, remaining }) => {
				const boolResult = decodeBool({ type: 'boolean', name: '' }, hexToBytes(bytes));
				expect(boolResult.result).toEqual(result);
				expect(bytesToHex(boolResult.encoded)).toEqual(remaining);
			},
		);

		it.each(invalidBoolDecoderData)('value %s to throw', value => {
			expect(() => decodeBool({ type: 'boolean', name: '' }, hexToBytes(value))).toThrow(
				AbiError,
			);
		});
	});
});
