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
import { decodeAddress, encodeAddress } from '../../../../src/coders/base/address';
import {
	invalidAddressDecoderData,
	invalidAddressEncoderData,
	validAddressDecoderData,
	validAddressEncoderData,
} from '../../../fixtures/coders/base/address';

describe('abi - coder - base - address', () => {
	describe('encode', () => {
		it.each(validAddressEncoderData)('value %s to result in %s', (value, expected) => {
			const result = encodeAddress({ type: 'address', name: '' }, value);
			expect(Buffer.from(result.encoded).toString('hex')).toEqual(expected);
		});

		it.each(invalidAddressEncoderData)('value %s to throw', value => {
			expect(() => encodeAddress({ type: 'address', name: '' }, value)).toThrow(AbiError);
		});
	});

	describe('decode', () => {
		it.each(validAddressDecoderData)(
			'value %s to result in %s',
			({ bytes, result, remaining }) => {
				const addressResult = decodeAddress(
					{ type: 'address', name: '' },
					hexToBytes(bytes),
				);
				expect(addressResult.result).toEqual(result);
				expect(bytesToHex(addressResult.encoded)).toEqual(remaining);
			},
		);

		it.each(invalidAddressDecoderData)('value %s to throw', bytes => {
			expect(() => decodeAddress({ type: 'address', name: '' }, hexToBytes(bytes))).toThrow(
				AbiError,
			);
		});
	});
});
