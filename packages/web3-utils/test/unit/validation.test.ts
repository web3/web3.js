import { isHex, isHexStrict, checkAddressCheckSum } from '../../src/validation';
import { checkAddressCheckSumValidData, isHexData, isHexStrictData } from '../fixtures/validation';

describe('validation', () => {
	describe('isHex', () => {
		describe('valid cases', () => {
			it.each(isHexData)('%s', (input, output) => {
				expect(isHex(input)).toEqual(output);
			});
		});
	});

	describe('isHexStrict', () => {
		describe('valid cases', () => {
			it.each(isHexStrictData)('%s', (input, output) => {
				expect(isHexStrict(input)).toEqual(output);
			});
		});
	});
	describe('checkAddressCheckSum', () => {
		describe('valid cases', () => {
			it.each(checkAddressCheckSumValidData)('%s', (input, output) => {
				expect(checkAddressCheckSum(input)).toEqual(output);
			});
		});
	});
});
