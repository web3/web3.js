import { Iban } from '../../src/index';
import {
	validIbanToAddressData,
	validFromBbanData,
	invalidIbanToAddressData,
	validCreateIndirectData,
	isValidData,
	validIsDirectData,
	validIsIndirectData,
	validClientData,
	validChecksumData,
	validInstitutionData,
} from '../fixtures/iban';

describe('iban', () => {
	describe('create', () => {
		describe('valid cases', () => {
			it.each(validIbanToAddressData)('%s', () => {
				const iban = new Iban('XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS');
				expect(typeof iban).toBe('object');
			});
		});
	});

	describe('toAddress', () => {
		describe('valid cases', () => {
			it.each(validIbanToAddressData)('%s', (input, output) => {
				const iban = new Iban(input);
				expect(iban.toAddress()).toBe(output);
			});
		});
		describe('invalid cases', () => {
			it.each(invalidIbanToAddressData)('%s', (input, output) => {
				const iban = new Iban(input);
				expect(() => iban.toAddress()).toThrow(output);
			});
		});
	});

	describe('toAddress static method', () => {
		describe('valid cases', () => {
			it.each(validIbanToAddressData)('%s', (input, output) => {
				expect(Iban.toAddress(input)).toBe(output);
			});
		});
		describe('invalid cases', () => {
			it.each(invalidIbanToAddressData)('%s', (input, output) => {
				expect(() => Iban.toAddress(input)).toThrow(output);
			});
		});
	});

	describe('toIban', () => {
		describe('valid cases', () => {
			it.each(validIbanToAddressData)('%s', (output, input) => {
				expect(Iban.toIban(input)).toBe(output);
			});
		});
	});

	describe('fromAddress', () => {
		describe('valid cases', () => {
			it.each(validIbanToAddressData)('%s', (output, input) => {
				expect(Iban.fromAddress(input).toString()).toBe(output);
			});
		});
	});

	describe('fromBban', () => {
		describe('valid cases', () => {
			it.each(validFromBbanData)('%s', (input, output) => {
				expect(Iban.fromBban(input).toString()).toBe(output);
			});
		});
	});

	describe('createIndirect', () => {
		describe('valid cases', () => {
			it.each(validCreateIndirectData)('%s', (input, output) => {
				expect(Iban.createIndirect(input).toString()).toBe(output);
			});
		});
	});

	describe('isValid', () => {
		describe('valid cases', () => {
			it.each(isValidData)('%s', (input, output) => {
				const iban = new Iban(input);
				expect(iban.isValid()).toBe(output);
			});
		});
	});

	describe('isValid static', () => {
		describe('valid cases', () => {
			it.each(isValidData)('%s', (input, output) => {
				expect(Iban.isValid(input)).toBe(output);
			});
		});
	});

	describe('isDirect', () => {
		describe('valid cases', () => {
			it.each(validIsDirectData)('%s', (input, output) => {
				expect(Iban.isValid(input)).toBe(output);
			});
		});
	});

	describe('isIndirect', () => {
		describe('valid cases', () => {
			it.each(validIsIndirectData)('%s', (input, output) => {
				expect(Iban.isIndirect(input)).toBe(output);
			});
		});
	});

	describe('client', () => {
		describe('valid cases', () => {
			it.each(validClientData)('%s', (input, output) => {
				const iban = new Iban(input);
				expect(iban.client()).toBe(output);
			});
		});
	});

	describe('institution', () => {
		describe('valid cases', () => {
			it.each(validInstitutionData)('%s', (input, output) => {
				const iban = new Iban(input);
				expect(iban.institution()).toBe(output);
			});
		});
	});

	describe('checksum', () => {
		describe('valid cases', () => {
			it.each(validChecksumData)('%s', (input, output) => {
				const iban = new Iban(input);
				expect(iban.checksum()).toBe(output);
			});
		});
	});
});
