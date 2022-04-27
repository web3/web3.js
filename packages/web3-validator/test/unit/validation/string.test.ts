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

import { isString, isHex, isHexStrict } from '../../../src/validation/string';
import {
	invalidHexData,
	invalidHexStrictData,
	validHexStrictData,
	validHexData,
} from '../../fixtures/validation';

describe('validation', () => {
	describe('string', () => {
		describe('isString', () => {
			it('should return true for a string value', () => {
				expect(isString('string')).toBeTruthy();
			});

			it.each([12, true, BigInt(12)])(
				'should return false for a non-string value: %s',
				value => {
					expect(isString(value)).toBeFalsy();
				},
			);
		});

		describe('isHexStrict', () => {
			describe('valid cases', () => {
				it.each(validHexStrictData)('%s', input => {
					expect(isHexStrict(input)).toBeTruthy();
				});
			});

			describe('invalid cases', () => {
				it.each(invalidHexStrictData)('%s', input => {
					expect(isHexStrict(input)).toBeFalsy();
				});
			});
		});

		describe('isHex', () => {
			describe('valid cases', () => {
				it.each(validHexData)('%s', input => {
					expect(isHex(input)).toBeTruthy();
				});
			});

			describe('invalid cases', () => {
				it.each(invalidHexData)('%s', input => {
					expect(isHex(input)).toBeFalsy();
				});
			});
		});
	});
});
