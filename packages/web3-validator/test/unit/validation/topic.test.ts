import { isFilterObject } from '../../../src/validation/filter';
import { invalidFilterObjectData, validFilterObjectData } from '../../fixtures/validation';

describe('validation', () => {
	describe('filter', () => {
		describe('isFilterObject', () => {
			describe('valid cases', () => {
				it.each(validFilterObjectData)('%s', input => {
					expect(isFilterObject(input)).toBeTruthy();
				});
			});

			describe('invalid cases', () => {
				it.each(invalidFilterObjectData)('%s', input => {
					expect(isFilterObject(input)).toBeFalsy();
				});
			});
		});
	});
});
