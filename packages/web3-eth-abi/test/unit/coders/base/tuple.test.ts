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

import { hexToBytes } from 'web3-utils';
import { decodeTuple, encodeTuple } from '../../../../src/coders/base/tuple';
import { validDecoderData, validEncoderData } from '../../../fixtures/coders/base/tuple';

describe('abi - coder - base - tuple', () => {
	describe('encode', () => {
		it.each(validEncoderData)('tuple type with value %s to result in %s', value => {
			const result = encodeTuple(
				{ type: 'tuple', name: '', components: value.components },
				value.values,
			);
			expect(Buffer.from(result.encoded).toString('hex')).toEqual(value.result);
			expect(result.dynamic).toEqual(value.dynamic);
		});
	});

	describe('decode', () => {
		it.each(validDecoderData)('tuple type with value %s to result in %s', value => {
			const result = decodeTuple(
				{ type: 'tuple', name: '', components: value.components },
				hexToBytes(value.bytes),
			);
			expect(result.result).toEqual(value.result);
			expect(result.encoded).toEqual(hexToBytes(value.remaining));
		});
	});
});
