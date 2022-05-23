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

import { isHexStrict } from '../../src/validation';
import { randomHex } from '../../src/random';
import { randomHexData } from '../fixtures/random';

describe('random library tests', () => {
	describe('randomHex', () => {
		describe('valid cases', () => {
			it.each(randomHexData)('%s', input => {
				const hexResult = randomHex(input);
				// eslint-disable-next-line deprecation/deprecation
				expect(isHexStrict(hexResult)).toBe(true);
				expect(hexResult.length === input * 2 + 2).toBe(true); // bytes + 2 because of hex prefix '0x'
			});
		});
	});
});
