import { isHex, isHexStrict } from '../../src/validation';
import { isHexData, isHexStrictData } from '../fixtures/validation';

describe('validation', () => {

    describe('isHex', () => {
		describe('valid cases', () => {
			it.each(isHexData)('%s', (input, output) => {
				expect(isHex(input)).toEqual(output);
			});
		});
	})

	describe('isHexStrict', () => {
		describe('valid cases', () => {
			it.each(isHexStrictData)('%s', (input, output) => {
				expect(isHexStrict(input)).toEqual(output);
			});
		});
	});
		// describe('invalid cases', () => {
		// 	it.each(isHexInvalidData)('%s', (input, output) => {
		// 		expect(() => isHex(input)).toThrow(output);
		// 	});
		// });

});