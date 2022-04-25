import { fromUtf8 } from 'web3-common';
import {
	asciiToHex,
	fromAscii,
	fromDecimal,
	fromWei,
	hexToAscii,
	hexToString,
	stringToHex,
	toAscii,
	toDecimal,
	toHex,
	toWei,
} from '../../src/converters';

import {
	asciiToHexValidData,
	fromWeiInvalidData,
	fromWeiValidData,
	hexToAsciiValidData,
	hexToNumberInvalidData,
	hexToNumberValidData,
	hexToUtf8InvalidData,
	hexToUtf8ValidData,
	numberToHexInvalidData,
	numberToHexValidData,
	toHexValidData,
	toWeiInvalidData,
	toWeiValidData,
	utf8ToHexInvalidData,
	utf8ToHexValidData,
} from '../fixtures/converters';

describe('converters', () => {
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
		});
	});

	describe('fromWei', () => {
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
	});
});
