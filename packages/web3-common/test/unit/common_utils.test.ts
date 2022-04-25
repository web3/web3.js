import {
	bytesToHex,
	hexToBytes,
	hexToNumber,
	hexToNumberString,
	hexToUtf8,
	mergeDeep,
	numberToHex,
	sha3,
	sha3Raw,
	toChecksumAddress,
	toNumber,
	toUtf8,
	utf8ToHex,
} from '../../src/common_utils';
import {
	bytesToHexInvalidData,
	bytesToHexValidData,
	hexToBytesInvalidData,
	hexToBytesValidData,
	hexToNumberInvalidData,
	hexToNumberValidData,
	hexToUtf8InvalidData,
	hexToUtf8ValidData,
	mergeDeepData,
	numberToHexInvalidData,
	numberToHexValidData,
	sha3RawValidData,
	sha3ValidData,
	toCheckSumValidData,
	utf8ToHexInvalidData,
	utf8ToHexValidData,
} from '../fixtures/common_utils';

describe('common utils', () => {
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

	describe('toNumber', () => {
		it.each([...hexToNumberValidData, [123, 123], ['123', 123]])('%s', (input, output) => {
			expect(toNumber(input)).toEqual(output);
		});

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
	});

	describe('toUtf8', () => {
		describe('valid cases', () => {
			it.each(hexToUtf8ValidData)('%s', (input, output) => {
				expect(toUtf8(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(hexToUtf8InvalidData)('%s', (input, output) => {
				expect(() => toUtf8(input)).toThrow(output);
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

	describe('toChecksumAddress', () => {
		describe('valid cases', () => {
			it.each(toCheckSumValidData)('%s', (input, output) => {
				expect(toChecksumAddress(input)).toEqual(output);
			});
		});
		describe('invalid cases', () => {
			it.todo('should throw error for invalid cases');
		});
	});

	describe('sha3', () => {
		describe('valid cases', () => {
			it.each(sha3ValidData)('%s', (input, output) => {
				expect(sha3(input)).toEqual(output);
			});
		});
	});

	describe('sha3Raw', () => {
		describe('valid cases', () => {
			it.each(sha3RawValidData)('%s', (input, output) => {
				expect(sha3Raw(input)).toEqual(output);
			});
		});
	});

	describe('mergeDeep', () => {
		it.each(mergeDeepData)('$message', ({ destination, sources, output }) => {
			mergeDeep(destination, ...sources);

			expect(destination).toEqual(output);
		});

		it('should not mutate the sources', () => {
			const before = { a: undefined, b: true, c: Buffer.from('123') };
			const result = mergeDeep({}, before, {
				a: 3,
				d: 'string',
				e: { nested: BigInt(4) },
			}) as any;

			expect(before.a).toBeUndefined();
			expect(result.b).toBe(true);
			expect(result.c).toEqual(Buffer.from('123'));
		});

		it('should not overwrite if undefined', () => {
			const result = mergeDeep(
				{},
				{ a: undefined, b: true, c: Buffer.from('123'), f: 99 },
				{ a: 3, d: 'string', e: { nested: BigInt(4) }, f: undefined },
			) as any;

			expect(result.a).toBe(3);
			expect(result.b).toBe(true);
			expect(result.c).toEqual(Buffer.from('123'));
			expect(result.d).toBe('string');
			expect(result.e).toEqual({ nested: BigInt(4) });
			expect(result.f).toBe(99);
		});
	});
});
