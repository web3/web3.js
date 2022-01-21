import { Iban } from '../../src/iban';
import { validIbanToAddress, validFromBban, invalidIbanToAddress } from '../fixtures/iban';

describe('iban', () => {
	describe('create', () => {
		describe('valid cases', () => {
			it.each(validIbanToAddress)('%s', () => {
				const iban = new Iban('XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS');
				expect(typeof iban).toBe('object');
			});
		});
	});

	describe('toAddress', () => {
		describe('valid cases', () => {
			it.each(validIbanToAddress)('%s', (input, output) => {
				const iban = new Iban(input);
				expect(iban.toAddress()).toBe(output);
			});
		});
		describe('invalid cases', () => {
			it.each(invalidIbanToAddress)('%s', (input, output) => {
				const iban = new Iban(input);
				expect(() => iban.toAddress()).toThrow(output);
			});
		});
	});

	describe('toAddress static method', () => {
		describe('valid cases', () => {
			it.each(validIbanToAddress)('%s', (input, output) => {
				expect(Iban.toAddress(input)).toBe(output);
			});
		});
		describe('invalid cases', () => {
			it.each(invalidIbanToAddress)('%s', (input, output) => {
				expect(() => Iban.toAddress(input)).toThrow(output);
			});
		});
	});

	describe('toIban', () => {
		describe('valid cases', () => {
			it.each(validIbanToAddress)('%s', (output, input) => {
				expect(Iban.toIban(input)).toBe(output);
			});
		});
	});

	describe('fromAddress', () => {
		describe('valid cases', () => {
			it.each(validIbanToAddress)('%s', (output, input) => {
				expect(Iban.fromAddress(input).toString()).toBe(output);
			});
		});
	});

	describe('fromBban', () => {
		describe('valid cases', () => {
			it.each(validFromBban)('%s', (input, output) => {
				expect(Iban.fromBban(input).toString()).toBe(output);
			});
		});
	});
});
