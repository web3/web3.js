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
import { hexToBytes } from 'ethereum-cryptography/utils';
import {
	isString,
	isHex,
	isHexStrict,
	isHexString,
	isHexString8Bytes,
	isHexString32Bytes,
	isHexPrefixed,
	validateNoLeadingZeroes,
} from '../../../src/validation/string';
import {
	invalidHexData,
	invalidHexStrictData,
	validHexStrictData,
	validHexData,
	isHexStringData,
	isHexString8BytesData,
	isHexString32BytesData,
	isHexPrefixedData,
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
		describe('isHexString', () => {
			it.each(isHexStringData)('%s', data => {
				expect(isHexString(data.in[0], data.in[1])).toBe(data.out);
			});
		});
		describe('isHexString8Bytes', () => {
			it.each(isHexString8BytesData)('%s', data => {
				expect(isHexString8Bytes(data.in[0], data.in[1])).toBe(data.out);
			});
		});
		describe('isHexString32Bytes', () => {
			it.each(isHexString32BytesData)('%s', data => {
				expect(isHexString32Bytes(data.in[0], data.in[1])).toBe(data.out);
			});
		});
		describe('isHexPrefixed', () => {
			it.each(isHexPrefixedData)('%s', data => {
				expect(isHexPrefixed(data.in)).toBe(data.out);
			});
			it('should fails', () => {
				expect(() => {
					// @ts-expect-error no type validation
					isHexPrefixed(1);
				}).toThrow(`[isHexPrefixed] input must be type 'string', received type number`);
				expect(() => {
					// @ts-expect-error no type validation
					isHexPrefixed(false);
				}).toThrow(`[isHexPrefixed] input must be type 'string', received type boolean`);
				expect(() => {
					// @ts-expect-error no type validation
					isHexPrefixed(true);
				}).toThrow(`[isHexPrefixed] input must be type 'string', received type boolean`);
				expect(() => {
					// @ts-expect-error no type validation
					isHexPrefixed({});
				}).toThrow(`[isHexPrefixed] input must be type 'string', received type object`);
				expect(() => {
					// @ts-expect-error no type validation
					isHexPrefixed([]);
				}).toThrow(`[isHexPrefixed] input must be type 'string', received type object`);
			});
		});

		describe('validateNoLeadingZeroes', () => {
			it.each(isHexPrefixedData)('%s', data => {
				expect(isHexPrefixed(data.in)).toBe(data.out);
			});
			it('valid', () => {
				const noLeadingZeroes = {
					a: hexToBytes('0x1230'),
				};
				const noleadingZeroBytes = {
					a: hexToBytes('0x01'),
				};
				const emptyUint8Array = {
					a: hexToBytes('0x'),
				};
				const undefinedValue = {
					a: undefined,
				};

				expect(() => validateNoLeadingZeroes(noLeadingZeroes)).not.toThrow();
				expect(() => validateNoLeadingZeroes(emptyUint8Array)).not.toThrow();
				expect(() => validateNoLeadingZeroes(undefinedValue)).not.toThrow();
				expect(() => validateNoLeadingZeroes(noleadingZeroBytes)).not.toThrow();
			});
			it('fails', () => {
				const leadingZeroBytes = {
					a: hexToBytes('0x0010'),
				};
				const onlyZeroes = {
					a: hexToBytes('0x00'),
				};

				expect(() => validateNoLeadingZeroes(leadingZeroBytes)).toThrow();
				expect(() => validateNoLeadingZeroes(onlyZeroes)).toThrow();
			});
		});
	});
});
