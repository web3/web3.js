import {
	asciiToHex,
	bytesToHex,
	fromWei,
	hexToAscii,
	hexToBytes,
	hexToNumber,
	hexToNumberString,
	hexToUtf8,
	numberToHex,
	toHex,
	toNumber,
	toWei,
	utf8ToHex,
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
	numberToHexInvalidData,
	numberToHexValidData,
	toHexValidData,
	toWeiInvalidData,
	utf8ToHexInvalidData,
	utf8ToHexValidData,
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

	describe('toHex', () => {
		describe('return value', () => {
			it.each(toHexValidData)('%s', (input, output) => {
				// eslint-disable-next-line @typescript-eslint/no-magic-numbers
				expect(toHex(input)).toEqual(output[0]);
			});
		});

		describe('return type', () => {
			it.each(toHexValidData)('%s', (input, output) => {
				// eslint-disable-next-line @typescript-eslint/no-magic-numbers
				expect(toHex(input, true)).toEqual(output[1]);
			});
		});
	});

	describe('toNumber', () => {
		// eslint-disable-next-line @typescript-eslint/no-magic-numbers
		it.each([...hexToNumberValidData, [123, 123], ['123', 123]])('%s', (input, output) => {
			expect(toNumber(input)).toEqual(output);
		});
	});

	describe('fromWei', () => {
		describe('valid cases', () => {
			it.each(fromWeiValidData)('%s', (input, output) => {
				// eslint-disable-next-line @typescript-eslint/no-magic-numbers
				expect(fromWei(input[0], input[1])).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(fromWeiInvalidData)('%s', (input, output) => {
				// eslint-disable-next-line @typescript-eslint/no-magic-numbers
				expect(() => fromWei(input[0], input[1])).toThrow(output);
			});
		});
	});

	describe('toWei', () => {
		describe('valid cases', () => {
			it.each(fromWeiValidData)('%s', (input, output) => {
				// eslint-disable-next-line @typescript-eslint/no-magic-numbers
				expect(toWei(output, input[1])).toEqual(input[0].toString());
			});
		});

		describe('invalid cases', () => {
			it.each(toWeiInvalidData)('%s', (input, output) => {
				// eslint-disable-next-line @typescript-eslint/no-magic-numbers
				expect(() => toWei(input[0], input[1])).toThrow(output);
			});
		});
	});
});
