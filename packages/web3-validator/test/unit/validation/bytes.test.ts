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

import { isBuffer, isBytes } from '../../../src/validation/bytes';
import {
	invalidBytesData,
	invalidBytesDataWithAbiType,
	invalidBytesDataWithSize,
	validBytesData,
	validBytesDataWithAbiType,
	validBytesDataWithSize,
} from '../../fixtures/validation';

describe('validation', () => {
	describe('bytes', () => {
		describe('isBuffer', () => {
			it('should return true for the Buffer value', () => {
				expect(isBuffer(Buffer.from('abc0', 'hex'))).toBeTruthy();
			});

			it('should return false for the no-buffer value', () => {
				expect(isBuffer('0x12')).toBeFalsy();
			});
		});

		describe('isBytes', () => {
			describe('raw bytes', () => {
				describe('valid cases', () => {
					it.each(validBytesData)('%s', input => {
						expect(isBytes(input)).toBeTruthy();
					});
				});

				describe('invalid cases', () => {
					it.each(invalidBytesData)('%s', input => {
						expect(isBytes(input)).toBeFalsy();
					});
				});
			});

			describe('bytes with size', () => {
				describe('valid cases', () => {
					it.each(validBytesDataWithSize)('%s', (input, size) => {
						expect(isBytes(input, { size })).toBeTruthy();
					});
				});

				describe('invalid cases', () => {
					it.each(invalidBytesDataWithSize)('%s', (input, size) => {
						expect(isBytes(input, { size })).toBeFalsy();
					});
				});
			});

			describe('bytes with abiType', () => {
				describe('valid cases', () => {
					it.each(validBytesDataWithAbiType)('%s', (input, abiType) => {
						expect(isBytes(input, { abiType })).toBeTruthy();
					});
				});

				describe('invalid cases', () => {
					it.each(invalidBytesDataWithAbiType)('%s', (input, abiType) => {
						expect(isBytes(input, { abiType })).toBeFalsy();
					});
				});
			});
		});
	});
});
