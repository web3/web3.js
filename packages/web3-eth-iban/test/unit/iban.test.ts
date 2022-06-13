/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Web3Iban } from '../../src/web3_iban';
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
				const iban = new Web3Iban('XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS');
				expect(typeof iban).toBe('object');
			});
		});
	});

	describe('toAddress', () => {
		describe('valid cases', () => {
			it.each(validIbanToAddressData)('%s', (input, output) => {
				const iban = new Web3Iban(input);
				expect(iban.toAddress()).toBe(output);
			});
		});
		describe('invalid cases', () => {
			it.each(invalidIbanToAddressData)('%s', (input, output) => {
				const iban = new Web3Iban(input);
				expect(() => iban.toAddress()).toThrow(output);
			});
		});
	});

	describe('toAddress static method', () => {
		describe('valid cases', () => {
			it.each(validIbanToAddressData)('%s', (input, output) => {
				expect(Web3Iban.toAddress(input)).toBe(output);
			});
		});
		describe('invalid cases', () => {
			it.each(invalidIbanToAddressData)('%s', (input, output) => {
				expect(() => Web3Iban.toAddress(input)).toThrow(output);
			});
		});
	});

	describe('toIban', () => {
		describe('valid cases', () => {
			it.each(validIbanToAddressData)('%s', (output, input) => {
				expect(Web3Iban.toIban(input)).toBe(output);
			});
		});
	});

	describe('fromAddress', () => {
		describe('valid cases', () => {
			it.each(validIbanToAddressData)('%s', (output, input) => {
				expect(Web3Iban.fromAddress(input).toString()).toBe(output);
			});
		});
	});

	describe('fromBban', () => {
		describe('valid cases', () => {
			it.each(validFromBbanData)('%s', (input, output) => {
				expect(Web3Iban.fromBban(input).toString()).toBe(output);
			});
		});
	});

	describe('createIndirect', () => {
		describe('valid cases', () => {
			it.each(validCreateIndirectData)('%s', (input, output) => {
				expect(Web3Iban.createIndirect(input).toString()).toBe(output);
			});
		});
	});

	describe('isValid', () => {
		describe('valid cases', () => {
			it.each(isValidData)('%s', (input, output) => {
				const iban = new Web3Iban(input);
				expect(iban.isValid()).toBe(output);
			});
		});
	});

	describe('isValid static', () => {
		describe('valid cases', () => {
			it.each(isValidData)('%s', (input, output) => {
				expect(Web3Iban.isValid(input)).toBe(output);
			});
		});
	});

	describe('isDirect', () => {
		describe('valid cases', () => {
			it.each(validIsDirectData)('%s', (input, output) => {
				expect(Web3Iban.isValid(input)).toBe(output);
			});
		});
	});

	describe('isIndirect', () => {
		describe('valid cases', () => {
			it.each(validIsIndirectData)('%s', (input, output) => {
				expect(Web3Iban.isIndirect(input)).toBe(output);
			});
		});
	});

	describe('client', () => {
		describe('valid cases', () => {
			it.each(validClientData)('%s', (input, output) => {
				const iban = new Web3Iban(input);
				expect(iban.client()).toBe(output);
			});
		});
	});

	describe('institution', () => {
		describe('valid cases', () => {
			it.each(validInstitutionData)('%s', (input, output) => {
				const iban = new Web3Iban(input);
				expect(iban.institution()).toBe(output);
			});
		});
	});

	describe('checksum', () => {
		describe('valid cases', () => {
			it.each(validChecksumData)('%s', (input, output) => {
				const iban = new Web3Iban(input);
				expect(iban.checksum()).toBe(output);
			});
		});
	});
});
