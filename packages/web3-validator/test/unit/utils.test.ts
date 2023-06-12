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

import { InvalidNumberError, InvalidBytesError } from 'web3-errors';
import { ValidInputTypes } from '../../src/types';
import {
	ethAbiToJsonSchema,
	transformJsonDataToAbiFormat,
	codePointToInt,
	hexToNumber,
	numberToHex,
	padLeft,
	hexToUint8Array,
	uint8ArrayToHexString,
} from '../../src/utils';
import { abiToJsonSchemaCases } from '../fixtures/abi_to_json_schema';
import {
	validCodePoints,
	invalidCodePoints,
	validHexStrictDataWithNumber,
	invalidHexData,
	invalidHexStrictStringData,
	validHexStrictData,
	validStringNumbersWithHex,
	invalidStringNumbers,
	padLeftData,
	validHexStrictDataWithUint8Array,
} from '../fixtures/validation';

describe('utils', () => {
	describe('uint8Array', () => {
		it.each(validHexStrictDataWithUint8Array)('uint8Array to hex', (res, input) => {
			expect(uint8ArrayToHexString(input)).toEqual(res.toLowerCase());
		});
		describe('hex to uint8Array', () => {
			it.each(validHexStrictDataWithUint8Array)('valid hex string data', (input, res) => {
				expect(hexToUint8Array(input)).toEqual(res);
			});

			it.each(invalidHexStrictStringData)('invalidHexData', (input: string) => {
				expect(() => {
					hexToUint8Array(input);
				}).toThrow(new InvalidBytesError(`hex string has odd length: ${input}`));
			});
		});
	});
	describe('ethAbiToJsonSchema', () => {
		describe('full schema', () => {
			it.each(abiToJsonSchemaCases)('$title', ({ abi, json }) => {
				expect(ethAbiToJsonSchema(abi.fullSchema)).toEqual(json.fullSchema);
			});
		});

		describe('short schema', () => {
			it.each(abiToJsonSchemaCases)('$title', ({ abi, json }) => {
				expect(ethAbiToJsonSchema(abi.shortSchema)).toEqual(json.shortSchema);
			});
		});
	});

	describe('transformJsonDataToAbiFormat', () => {
		describe('full schema', () => {
			it.each(abiToJsonSchemaCases)('$title', ({ abi, json }) => {
				expect(transformJsonDataToAbiFormat(abi.fullSchema, json.data)).toEqual(abi.data);
			});
		});
	});

	describe('codePointToInt', () => {
		it.each(validCodePoints)('valid code points', (input, res) => {
			expect(codePointToInt(input)).toEqual(res);
		});

		it.each(invalidCodePoints)('valid code points', (input: number) => {
			expect(() => {
				codePointToInt(input);
			}).toThrow(new Error(`Invalid code point: ${input}`));
		});
	});

	describe('hexToNumber', () => {
		it.each(validHexStrictDataWithNumber)('valid hex string data', (input, res) => {
			expect(hexToNumber(input)).toEqual(res);
		});

		it.each(invalidHexData)('invalidHexData', (input: string) => {
			expect(() => {
				hexToNumber(input);
			}).toThrow(new Error('Invalid hex string'));
		});
	});
	describe('numberToHex', () => {
		it.each(validHexStrictDataWithNumber.map(tuple => [tuple[1], tuple[0]]))(
			'valid numbers and bigints',
			(input, res) => {
				expect(numberToHex(input)).toEqual(res.toLowerCase());
			},
		);

		it.each(validHexStrictData)('valid hex strings', input => {
			expect(numberToHex(input)).toEqual(
				// if input is '' then numberToHex would return "0x0"
				(input === '' ? '0x0' : (input as string)).toLowerCase(),
			);
		});

		it.each(validStringNumbersWithHex)('valid string numbers', (input, res) => {
			expect(numberToHex(input)).toEqual(res.toLowerCase());
		});

		it.each(invalidStringNumbers)('invalid string number', (input: ValidInputTypes) => {
			expect(() => {
				numberToHex(input);
			}).toThrow(new InvalidNumberError(input));
		});
	});

	describe('padLeft', () => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		it.each(padLeftData.data)('valid numbers and bigints', (input, res) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			expect(padLeft(input, padLeftData.padDigits)).toBe(res);
		});
	});
});
