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

import { uint8ArrayConcat, uint8ArrayEquals } from '../../src/uint8array';
import { uint8ArrayConcatData, uint8ArrayEqualsValidData } from '../fixtures/uint8array';

describe('uint8Array utils', () => {
	describe('uint8ArrayConcat', () => {
		it.each(uint8ArrayConcatData)('%s', (input, output) => {
			expect(uint8ArrayConcat(...input)).toEqual(output);
		});
		describe('uint8ArrayConcat', () => {
			describe('cases', () => {
				it.each(uint8ArrayEqualsValidData)('%s', (input, output) => {
					expect(uint8ArrayEquals(input[0], input[1])).toEqual(output);
				});
			});
		});
	});
});
