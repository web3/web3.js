import { isBoolean } from '../../../src/validation/boolean';
import { invalidBooleanData, validBooleanData } from '../../fixtures/validation';

describe('validation', () => {
	describe('boolean', () => {
		describe('isBoolean', () => {
			describe('valid cases', () => {
				it.each(validBooleanData)('%s', input => {
					expect(isBoolean(input)).toBeTruthy();
				});
			});

			describe('invalid cases', () => {
				it.each(invalidBooleanData)('%s', input => {
					expect(isBoolean(input)).toBeFalsy();
				});
			});
		});
	});
});
