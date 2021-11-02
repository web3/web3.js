import {
	isHex,
	isHexStrict,
	checkAddressCheckSum,
	isAddress,
	compareBlockNumbers,
	validateHexStringInput,
} from '../../src/validation';
import {
	checkAddressCheckSumValidData,
	isAddressValidData,
	isHexData,
	isHexStrictData,
	compareBlockNumbersValidData,
	compareBlockNumbersInvalidData,
	validateHexStringInputInvalidData,
} from '../fixtures/validation';

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
	describe('validateHexString', () => {
		describe('invalid cases', () => {
			it.each(validateHexStringInputInvalidData)('%s', (input, output) => {
				expect(() => validateHexStringInput(input)).toThrow(output);
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
	describe('isAddress', () => {
		describe('valid cases', () => {
			it.each(isAddressValidData)('%s', (input, output) => {
				expect(isAddress(input)).toEqual(output);
			});
		});
	});
	describe('compareBlockNumbers', () => {
		describe('valid cases', () => {
			it.each(compareBlockNumbersValidData)('%s', (input, output) => {
				expect(compareBlockNumbers(input[0], input[1])).toEqual(output);
			});
		});
		describe('invalid cases', () => {
			it.each(compareBlockNumbersInvalidData)('%s', (input, output) => {
				expect(() => compareBlockNumbers(input[0], input[1])).toThrow(output);
			});
		});
	});
});
