import { isValidEthBaseType } from '../../../src/validation/eth';

import { invalidEthTypeData, validEthTypeData } from '../../fixtures/validation';

describe('validation', () => {
	describe('eth', () => {
		describe('isValidEthType', () => {
			describe('valid cases', () => {
				it.each(validEthTypeData)('%s', input => {
					expect(isValidEthBaseType(input)).toBeTruthy();
				});
			});

			describe('invalid cases', () => {
				it.each(invalidEthTypeData)('%s', input => {
					expect(isValidEthBaseType(input)).toBeFalsy();
				});
			});
		});
	});
});
