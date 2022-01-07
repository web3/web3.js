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
