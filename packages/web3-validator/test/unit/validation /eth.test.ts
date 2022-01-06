import { isValidEthType } from '../../../src/validation/eth';
import { invalidEthTypeData, validEthTypeData } from '../../fixtures/validation';

describe('validation', () => {
	describe('eth', () => {
		describe('isValidEthType', () => {
			describe('valid cases', () => {
				it.each(validEthTypeData)('%s', input => {
					expect(isValidEthType(input)).toBeTruthy();
				});
			});

			describe('invalid cases', () => {
				it.each(invalidEthTypeData)('%s', input => {
					expect(isValidEthType(input)).toBeFalsy();
				});
			});
		});
	});
});
