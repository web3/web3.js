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

import { InvalidBytesError } from 'web3-errors';
import { validator, utils } from 'web3-validator';

import {
	asciiToHex,
	bytesToHex,
	fromAscii,
	fromDecimal,
	fromUtf8,
	fromWei,
	hexToAscii,
	hexToBytes,
	hexToNumber,
	hexToNumberString,
	hexToString,
	hexToUtf8,
	numberToHex,
	stringToHex,
	toAscii,
	toDecimal,
	toHex,
	toNumber,
	toUtf8,
	toWei,
	utf8ToHex,
	toChecksumAddress,
	bytesToUint8Array,
	toBigInt,
	toBool,
} from '../../src/converters';

import {
	asciiToHexValidData,
	bytesToHexInvalidData,
	bytesToHexValidData,
	fromWeiInvalidData,
	fromWeiValidData,
	hexToAsciiValidData,
	hexToBytesInvalidData,
	hexToBytesValidData,
	hexToNumberInvalidData,
	hexToNumberValidData,
	hexToUtf8InvalidData,
	hexToUtf8ValidData,
	toUtf8ValidData,
	numberToHexInvalidData,
	numberToHexValidData,
	toHexValidData,
	toHexInvalidData,
	toWeiInvalidData,
	toWeiValidData,
	toWeiValidDataWarnings,
	utf8ToHexInvalidData,
	utf8ToHexValidData,
	toCheckSumValidData,
	bytesToUint8ArrayInvalidData,
	bytesToUint8ArrayValidData,
	toBigIntValidData,
	toBigIntInvalidData,
	toCheckSumInvalidData,
	numberToHexstrictValidData,
	toBoolValidData,
	toBoolInvalidData,
} from '../fixtures/converters';

describe('converters', () => {
	describe('bytesToHex', () => {
		describe('valid cases', () => {
			it.each(bytesToHexValidData)('%s', (input, output) => {
				expect(bytesToHex(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(bytesToHexInvalidData)('%s', (input, output) => {
				expect(() => bytesToHex(input)).toThrow(output);
			});
		});
	});

	describe('hexToBytes', () => {
		describe('valid cases', () => {
			it.each(hexToBytesValidData)('%s', (input, output) => {
				expect(hexToBytes(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(hexToBytesInvalidData)('%s', (input, output) => {
				expect(() => hexToBytes(input)).toThrow(output);
			});
		});
	});

	describe('numberToHex', () => {
		describe('valid cases', () => {
			it.each(numberToHexValidData)('%s', (input, output) => {
				expect(numberToHex(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(numberToHexInvalidData)('%s', (input, output) => {
				expect(() => numberToHex(input)).toThrow(output);
			});
		});

		describe('valid hexstrict cases', () => {
			it.each(numberToHexstrictValidData)('%s', (input, output) => {
				expect(numberToHex(input, true)).toEqual(output);
			});
		});
	});

	describe('fromDecimal', () => {
		describe('valid cases', () => {
			it.each(numberToHexValidData)('%s', (input, output) => {
				expect(fromDecimal(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(numberToHexInvalidData)('%s', (input, output) => {
				expect(() => fromDecimal(input)).toThrow(output);
			});
		});
	});

	describe('hexToNumber', () => {
		describe('valid cases', () => {
			it.each(hexToNumberValidData)('%s', (input, output) => {
				expect(hexToNumber(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(hexToNumberInvalidData)('%s', (input, output) => {
				expect(() => hexToNumber(input)).toThrow(output);
			});
		});
	});

	describe('toDecimal', () => {
		describe('valid cases', () => {
			it.each(hexToNumberValidData)('%s', (input, output) => {
				expect(toDecimal(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(hexToNumberInvalidData)('%s', (input, output) => {
				expect(() => toDecimal(input)).toThrow(output);
			});
		});
	});

	describe('hexToNumberString', () => {
		it.each(hexToNumberValidData)('%s', (input, output) => {
			expect(hexToNumberString(input)).toEqual(output.toString());
		});
	});

	describe('utf8ToHex', () => {
		describe('valid cases', () => {
			it.each(utf8ToHexValidData)('%s', (input, output) => {
				expect(utf8ToHex(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(utf8ToHexInvalidData)('%s', (input, output) => {
				expect(() => utf8ToHex(input)).toThrow(output);
			});
		});
	});

	describe('fromUtf8', () => {
		describe('valid cases', () => {
			it.each(utf8ToHexValidData)('%s', (input, output) => {
				expect(fromUtf8(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(utf8ToHexInvalidData)('%s', (input, output) => {
				expect(() => fromUtf8(input)).toThrow(output);
			});
		});
	});

	describe('stringToHex', () => {
		describe('valid cases', () => {
			it.each(utf8ToHexValidData)('%s', (input, output) => {
				expect(stringToHex(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(utf8ToHexInvalidData)('%s', (input, output) => {
				expect(() => stringToHex(input)).toThrow(output);
			});
		});
	});

	describe('hexToUtf8', () => {
		describe('valid cases', () => {
			it.each(hexToUtf8ValidData)('%s', (input, output) => {
				expect(hexToUtf8(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(hexToUtf8InvalidData)('%s', (input, output) => {
				expect(() => hexToUtf8(input)).toThrow(output);
			});
		});
	});

	describe('toUtf8', () => {
		describe('valid cases', () => {
			it.each(toUtf8ValidData)('%s', (input, output) => {
				expect(toUtf8(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(hexToUtf8InvalidData)('%s', (input, output) => {
				expect(() => toUtf8(input)).toThrow(output);
			});
		});
	});

	describe('hexToString', () => {
		describe('valid cases', () => {
			it.each(hexToUtf8ValidData)('%s', (input, output) => {
				expect(hexToString(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(hexToUtf8InvalidData)('%s', (input, output) => {
				expect(() => hexToString(input)).toThrow(output);
			});
		});
	});

	describe('asciiToHex', () => {
		describe('valid cases', () => {
			it.each(asciiToHexValidData)('%s', (input, output) => {
				expect(asciiToHex(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(utf8ToHexInvalidData)('%s', (input, output) => {
				expect(() => asciiToHex(input)).toThrow(output);
			});
		});
	});

	describe('fromAscii', () => {
		describe('valid cases', () => {
			it.each(asciiToHexValidData)('%s', (input, output) => {
				expect(fromAscii(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(utf8ToHexInvalidData)('%s', (input, output) => {
				expect(() => fromAscii(input)).toThrow(output);
			});
		});
	});

	describe('hexToAscii', () => {
		describe('valid cases', () => {
			it.each(hexToAsciiValidData)('%s', (input, output) => {
				expect(hexToAscii(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(hexToUtf8InvalidData)('%s', (input, output) => {
				expect(() => hexToAscii(input)).toThrow(output);
			});
		});
	});

	describe('toAscii', () => {
		describe('valid cases', () => {
			it.each(hexToAsciiValidData)('%s', (input, output) => {
				expect(toAscii(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(hexToUtf8InvalidData)('%s', (input, output) => {
				expect(() => toAscii(input)).toThrow(output);
			});
		});
	});

	describe('toHex', () => {
		describe('return value', () => {
			it.each(toHexValidData)('%s', (input, output) => {
				expect(toHex(input)).toEqual(output[0]);
			});
		});

		describe('return type', () => {
			it.each(toHexValidData)('%s', (input, output) => {
				expect(toHex(input, true)).toEqual(output[1]);
			});

			it('an interesting case that needs investigation', () => {
				// TODO: This case is to be investigated further
				expect(
					toHex(
						'101611154195520776335741463917853444671577865378275924493376429267637792638729',
						true,
					),
				).toBe('uint');
			});
		});

		describe('invalid cases', () => {
			it.each(toHexInvalidData)('%s', (input, output) => {
				expect(() => toHex(input)).toThrow(output);
			});
		});
	});

	describe('toNumber', () => {
		it.each([...hexToNumberValidData, [123, 123], ['123', 123]])('%s', (input, output) => {
			expect(toNumber(input)).toEqual(output);
		});
	});

	describe('fromWei', () => {
		beforeEach(() => {
			jest.spyOn(console, 'warn').mockImplementation(() => {
				// do nothing
			});
		});
		afterAll(() => {
			jest.restoreAllMocks();
		});
		describe('valid cases', () => {
			it.each(fromWeiValidData)('%s', (input, output) => {
				expect(fromWei(input[0], input[1])).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(fromWeiInvalidData)('%s', (input, output) => {
				expect(() => fromWei(input[0], input[1])).toThrow(output);
			});
		});
	});

	describe('toWei', () => {
		describe('valid cases', () => {
			it.each(toWeiValidData)('%s', (input, output) => {
				expect(toWei(output, input[1])).toEqual(input[0].toString());
			});
		});

		describe('invalid cases', () => {
			it.each(toWeiInvalidData)('%s', (input, output) => {
				expect(() => toWei(input[0], input[1])).toThrow(output);
			});
		});
		describe('test console warnings', () => {
			beforeEach(() => {
				jest.spyOn(console, 'warn').mockImplementation(() => {
					// do nothing
				});
			});
			afterAll(() => {
				jest.restoreAllMocks();
			});
			it.each(toWeiValidDataWarnings)('%s', (input, output) => {
				toWei(input[0], input[1]);
				expect(console.warn).toHaveBeenCalledWith(output);
			});
		});
	});
	describe('toChecksumAddress', () => {
		describe('valid cases', () => {
			it.each(toCheckSumValidData)('%s', (input, output) => {
				expect(toChecksumAddress(input)).toEqual(output);
			});
		});
		describe('invalid cases', () => {
			it.each(toCheckSumInvalidData)('%s', (input, output) => {
				expect(() => toChecksumAddress(input)).toThrow(output);
			});
		});
		it('should return an empty string if hash is nullish', () => {
			const address = '0xc1912fee45d61c87cc5ea59dae31190fffff232d';

			// mock utils.uint8ArrayToHexString to return an empty string
			jest.mock('web3-validator');
			jest.spyOn(utils, 'uint8ArrayToHexString').mockReturnValue(
				undefined as unknown as string,
			);

			const result = toChecksumAddress(address);
			expect(result).toBe('');

			jest.mock('web3-validator').restoreAllMocks();
		});

		it('should return an empty string if hash is equal to "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"', () => {
			const address = '0xc1912fee45d61c87cc5ea59dae31190fffff232d';

			// mock utils.uint8ArrayToHexString to return '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
			jest.mock('web3-validator');
			const hash = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470';
			jest.spyOn(utils, 'uint8ArrayToHexString').mockReturnValue(hash);
			const result = toChecksumAddress(address);
			expect(result).toBe('');

			jest.mock('web3-validator').restoreAllMocks();
		});
	});
	describe('bytesToUint8Array', () => {
		describe('bytesToUint8Array', () => {
			describe('valid cases', () => {
				it.each(bytesToUint8ArrayValidData)('%s', (input, output) => {
					expect(bytesToUint8Array(input)).toEqual(output);
				});
			});

			describe('invalid cases', () => {
				it.each(bytesToUint8ArrayInvalidData)('%s', (input, output) => {
					expect(() => bytesToUint8Array(input)).toThrow(output);
				});

				it('should throw InvalidBytesError for invalid input even if it passed the validator', () => {
					const invalidData = 8;
					// the package 'web3-validator' contains `validator`.
					// Mock mock the `validator.validate(...)` to not throw an error, but return `false` instead.
					jest.mock('web3-validator');

					jest.spyOn(validator, 'validate').mockReturnValue(undefined);

					expect(() => bytesToUint8Array(invalidData as any)).toThrow(InvalidBytesError);
					jest.mock('web3-validator').restoreAllMocks();
				});
			});
		});
	});
	describe('toBigInt', () => {
		describe('valid cases', () => {
			it.each(toBigIntValidData)('%s', (input, output) => {
				expect(toBigInt(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(toBigIntInvalidData)('%s', (input, output) => {
				expect(() => toBigInt(input)).toThrow(output);
			});
		});
	});

	describe('toBool', () => {
		describe('valid cases', () => {
			it.each(toBoolValidData)('%s', (input, output) => {
				expect(toBool(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(toBoolInvalidData)('%s', (input, output) => {
				expect(() => toBool(input)).toThrow(output);
			});
		});
	});
});
