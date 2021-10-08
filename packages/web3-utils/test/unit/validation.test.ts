import { isHex } from '../../src/validation';
import { isHexData, isHexInvalidData } from '../fixtures/validation';

describe('validation', () => {

    describe('isHex', () => {
		describe('valid cases', () => {
			it.each(isHexData)('%s', (input, output) => {
				expect(isHex(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(isHexInvalidData)('%s', (input, output) => {
				expect(() => isHex(input)).toThrow(output);
			});
		});
	});
});