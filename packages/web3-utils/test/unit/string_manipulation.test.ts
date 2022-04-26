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

import {
	fromTwosComplement,
	leftPad,
	padLeft,
	padRight,
	rightPad,
	toTwosComplement,
} from '../../src/string_manipulation';

import {
	padLeftData,
	padInvalidData,
	padRightData,
	toTwosComplementData,
	toTwosComplementInvalidData,
	fromTwosComplementData,
	fromTwosComplementInvalidData,
} from '../fixtures/string_manipulation';

describe('string manipulation tests', () => {
	describe('padLeft', () => {
		describe('valid cases', () => {
			it.each(padLeftData)('%s', (input, output) => {
				expect(padLeft(input[0], input[1], input[2])).toEqual(output);
			});
		});
		describe('invalid cases', () => {
			it.each(padInvalidData)('%s', (input, output) => {
				expect(() => padLeft(input[0], input[1], input[2])).toThrow(output);
			});
		});
	});

	describe('padRight', () => {
		describe('valid cases', () => {
			it.each(padRightData)('%s', (input, output) => {
				expect(padRight(input[0], input[1], input[2])).toEqual(output);
			});
		});
		describe('invalid cases', () => {
			it.each(padInvalidData)('%s', (input, output) => {
				expect(() => padRight(input[0], input[1], input[2])).toThrow(output);
			});
		});
	});

	describe('leftPad', () => {
		describe('valid cases', () => {
			it.each(padLeftData)('%s', (input, output) => {
				expect(leftPad(input[0], input[1], input[2])).toEqual(output);
			});
		});
		describe('invalid cases', () => {
			it.each(padInvalidData)('%s', (input, output) => {
				expect(() => leftPad(input[0], input[1], input[2])).toThrow(output);
			});
		});
	});

	describe('rightPad', () => {
		describe('valid cases', () => {
			it.each(padRightData)('%s', (input, output) => {
				expect(rightPad(input[0], input[1], input[2])).toEqual(output);
			});
		});
		describe('invalid cases', () => {
			it.each(padInvalidData)('%s', (input, output) => {
				expect(() => rightPad(input[0], input[1], input[2])).toThrow(output);
			});
		});
	});

	describe('toTwosComplement', () => {
		describe('valid cases', () => {
			it.each(toTwosComplementData)('%s', (input, output) => {
				expect(toTwosComplement(input[0], input[1])).toEqual(output);
			});
		});
		describe('invalid cases', () => {
			it.each(toTwosComplementInvalidData)('%s', (input, output) => {
				expect(() => toTwosComplement(input[0], input[1])).toThrow(output);
			});
		});
	});

	describe('fromTwosComplement', () => {
		describe('valid cases', () => {
			it.each(fromTwosComplementData)('%s', (input, output) => {
				expect(fromTwosComplement(input[0], input[1])).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(fromTwosComplementInvalidData)('%s', (input, output) => {
				expect(() => fromTwosComplement(input[0], input[1])).toThrow(output);
			});
		});
	});
});
