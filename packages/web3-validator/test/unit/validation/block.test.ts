import { isBlockNumber, isBlockNumberOrTag, isBlockTag } from '../../../src/validation/block';
import {
	invalidBlockNumberData,
	invalidBlockTagData,
	validBlockNumberData,
	validBlockTagData,
} from '../../fixtures/validation';

describe('validation', () => {
	describe('block', () => {
		describe('isBlockNumber', () => {
			describe('valid cases', () => {
				it.each(validBlockNumberData)('%s', input => {
					expect(isBlockNumber(input)).toBeTruthy();
				});
			});

			describe('invalid cases', () => {
				it.each(invalidBlockNumberData)('%s', input => {
					expect(isBlockNumber(input)).toBeFalsy();
				});
			});
		});

		describe('isBlockTag', () => {
			describe('valid cases', () => {
				it.each(validBlockTagData)('%s', input => {
					expect(isBlockTag(input)).toBeTruthy();
				});
			});

			describe('invalid cases', () => {
				it.each(invalidBlockTagData)('%s', input => {
					expect(isBlockTag(input)).toBeFalsy();
				});
			});
		});
		describe('isBlockNumberOrTag', () => {
			describe('valid cases', () => {
				it.each([...validBlockTagData, ...validBlockNumberData])('%s', input => {
					expect(isBlockNumberOrTag(input)).toBeTruthy();
				});
			});

			describe('invalid cases', () => {
				it.each([...invalidBlockTagData, ...invalidBlockNumberData])('%s', input => {
					expect(isBlockNumberOrTag(input)).toBeFalsy();
				});
			});
		});
	});
});
