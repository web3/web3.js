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
import { RLP } from '../../../src';
import { hexToBytes, bytesToHex, utf8ToBytes, concatBytes } from '../../../src/rlp/utils';

import { bytesToUtf8 } from '../../fixtures/utils';

describe('invalid RLPs', () => {
	const errCases = [
		// prettier-ignore
		{input: Uint8Array.from([239, 191, 189, 239, 191, 189, 239, 191, 189, 239, 191, 189, 239, 191, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 239, 191, 189, 29, 239, 191, 189, 77, 239, 191, 189, 239, 191, 189, 239, 191, 189, 93, 122, 239, 191, 189, 239, 191, 189, 239, 191, 189, 103, 239, 191, 189, 239, 191, 189, 239, 191, 189, 26, 239, 191, 189, 18, 69, 27, 239, 191, 189, 239, 191, 189, 116, 19, 239, 191, 189, 239, 191, 189, 66, 239, 191, 189, 64, 212, 147, 71, 239, 191, 189, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 239, 191, 189, 11, 222, 155, 122, 54, 42, 194, 169, 239, 191, 189, 70, 239, 191, 189, 72, 239, 191, 189, 239, 191, 189, 54, 53, 239, 191, 189, 100, 73, 239, 191, 189, 55, 239, 191, 189, 239, 191, 189, 59, 1, 239, 191, 189, 109, 239, 191, 189, 239, 191, 189, 93, 239, 191, 189, 208, 128, 239, 191, 189, 239, 191, 189, 0, 239, 191, 189, 239, 191, 189, 239, 191, 189, 15, 66, 64, 239, 191, 189, 239, 191, 189, 239, 191, 189, 239, 191, 189, 4, 239, 191, 189, 79, 103, 239, 191, 189, 85, 239, 191, 189, 239, 191, 189, 239, 191, 189, 74, 239, 191, 189, 239, 191, 189, 239, 191, 189, 239, 191, 189, 54, 239, 191, 189, 239, 191, 189, 239, 191, 189, 239, 191, 189, 239, 191, 189, 83, 239, 191, 189, 14, 239, 191, 189, 239, 191, 189, 239, 191, 189, 4, 63, 239, 191, 189, 63, 239, 191, 189, 41, 239, 191, 189, 239, 191, 189, 239, 191, 189, 67, 28, 239, 191, 189, 239, 191, 189, 11, 239, 191, 189, 31, 239, 191, 189, 239, 191, 189, 104, 96, 100, 239, 191, 189, 239, 191, 189, 12, 239, 191, 189, 239, 191, 189, 206, 152, 239, 191, 189, 239, 191, 189, 31, 112, 111, 239, 191, 189, 239, 191, 189, 65, 239, 191, 189, 41, 239, 191, 189, 239, 191, 189, 53, 84, 11, 239, 191, 189, 239, 191, 189, 12, 102, 24, 12, 42, 105, 109, 239, 191, 189, 58, 239, 191, 189, 4, 239, 191, 189, 104, 82, 9, 239, 191, 189, 6, 66, 91, 43, 38, 102, 117, 239, 191, 189, 105, 239, 191, 189, 239, 191, 189, 239, 191, 189, 89, 127, 239, 191, 189, 114])},
		{
			input: hexToBytes('efdebd'),
			msg: 'invalid RLP (safeSlice): end slice of Uint8Array out-of-bounds',
		},
		{
			input: hexToBytes('efb83600'),
			msg: 'invalid RLP (safeSlice): end slice of Uint8Array out-of-bounds',
		},
		{
			input: hexToBytes(
				'efdebdaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			),
			msg: 'invalid RLP (safeSlice): end slice of Uint8Array out-of-bounds',
		},
	];

	it.each(errCases)(`should not crash on an invalid rlp`, ({ input, msg }) => {
		expect(() => RLP.decode(input)).toThrow(msg);
	});
});

describe('RLP encoding (string)', () => {
	it('should return itself if single byte and less than 0x7f', () => {
		const encodedSelf = RLP.encode('a');
		expect(bytesToUtf8(encodedSelf)).toBe('a');
	});

	it('length of string 0-55 should return (0x80+len(data)) plus data', () => {
		const encodedDog = RLP.encode('dog');
		expect(encodedDog).toHaveLength(4);
		expect(encodedDog[0]).toBe(131);
		expect(encodedDog[1]).toBe(100);
		expect(encodedDog[2]).toBe(111);
		expect(encodedDog[3]).toBe(103);
	});

	it('length of string >55 should return 0xb7+len(len(data)) plus len(data) plus data', () => {
		const encodedLongString = RLP.encode(
			'zoo255zoo255zzzzzzzzzzzzssssssssssssssssssssssssssssssssssssssssssssss',
		);
		expect(encodedLongString).toHaveLength(72);
		expect(encodedLongString[0]).toBe(184);
		expect(encodedLongString[1]).toBe(70);
		expect(encodedLongString[2]).toBe(122);
		expect(encodedLongString[3]).toBe(111);
		expect(encodedLongString[12]).toBe(53);
	});
});

describe('RLP encoding (list)', () => {
	it('length of list 0-55 should return (0xc0+len(data)) plus data', () => {
		const encodedArrayOfStrings = RLP.encode(['dog', 'god', 'cat']);
		expect(encodedArrayOfStrings).toHaveLength(13);
		expect(encodedArrayOfStrings[0]).toBe(204);
		expect(encodedArrayOfStrings[1]).toBe(131);
		expect(encodedArrayOfStrings[11]).toBe(97);
		expect(encodedArrayOfStrings[12]).toBe(116);
	});

	it('length of list >55 should return 0xf7+len(len(data)) plus len(data) plus data', () => {
		const data = [
			'dog',
			'god',
			'cat',
			'zoo255zoo255zzzzzzzzzzzzssssssssssssssssssssssssssssssssssssssssssssss',
		];
		const encodedArrayOfStrings = RLP.encode(data);
		const str = bytesToUtf8(encodedArrayOfStrings);
		for (const innerStr of data) {
			expect(str).toContain(innerStr);
		}
		// Verified with Geth's RLPDump
		const expected = hexToBytes(
			'f85483646f6783676f6483636174b8467a6f6f3235357a6f6f3235357a7a7a7a7a7a7a7a7a7a7a7a73737373737373737373737373737373737373737373737373737373737373737373737373737373737373737373',
		);
		expect(encodedArrayOfStrings).toEqual(expected);
	});
});

describe('RLP encoding (BigInt)', () => {
	it('should encode a BigInt value', () => {
		const encoded = RLP.encode(BigInt(3));
		expect(encoded[0]).toBe(3);
	});

	it('length of bigint = 1, less than 0x7f, similar to string', () => {
		const encodedNumber = RLP.encode(BigInt(15));
		expect(encodedNumber).toHaveLength(1);
		expect(encodedNumber[0]).toBe(15);
	});

	it('length of bigint > 55, similar to string', () => {
		const encodedNumber = RLP.encode(BigInt(1024));
		expect(encodedNumber).toHaveLength(3);
		expect(encodedNumber[0]).toBe(130);
		expect(encodedNumber[1]).toBe(4);
		expect(encodedNumber[2]).toBe(0);
	});

	it('should handle zero', () => {
		expect(bytesToHex(RLP.encode(BigInt(0)))).toBe('80');
	});
});

describe('RLP encoding (integer)', () => {
	it('length of int = 1, less than 0x7f, similar to string', () => {
		const encodedNumber = RLP.encode(15);
		expect(encodedNumber).toHaveLength(1);
		expect(encodedNumber[0]).toBe(15);
	});

	it('length of int > 55, similar to string', () => {
		const encodedNumber = RLP.encode(1024);
		expect(encodedNumber).toHaveLength(3);
		expect(encodedNumber[0]).toBe(130);
		expect(encodedNumber[1]).toBe(4);
		expect(encodedNumber[2]).toBe(0);
	});

	it('should handle zero', () => {
		expect(bytesToHex(RLP.encode(BigInt(0)))).toBe('80');
	});
});

describe('RLP decoding (string)', () => {
	it('first byte < 0x7f, return byte itself', () => {
		const decodedStr = RLP.decode(Uint8Array.from([97])) as Uint8Array;
		expect(decodedStr).toHaveLength(1);
		expect(bytesToUtf8(decodedStr)).toBe('a');
	});

	it('first byte < 0xb7, data is everything except first byte', () => {
		const decodedStr = RLP.decode(Uint8Array.from([131, 100, 111, 103])) as Uint8Array;
		expect(decodedStr).toHaveLength(3);
		expect(bytesToUtf8(decodedStr)).toBe('dog');
	});

	it('array', () => {
		// prettier-ignore
		const decodedBufferArray = RLP.decode(Uint8Array.from([204, 131, 100, 111, 103, 131, 103, 111, 100, 131, 99, 97, 116]))
		expect(decodedBufferArray).toHaveLength(3);
		expect(decodedBufferArray).toEqual([
			utf8ToBytes('dog'),
			utf8ToBytes('god'),
			utf8ToBytes('cat'),
		]);
	});
});

describe('RLP decoding (int)', () => {
	it('first byte < 0x7f, return itself', () => {
		const decodedSmallNum = RLP.decode(Uint8Array.from([15]));
		expect(decodedSmallNum).toHaveLength(1);
		expect(decodedSmallNum[0]).toBe(15);
	});

	it('first byte < 0xb7, data is everything except first byte', () => {
		const decodedNum = RLP.decode(Uint8Array.from([130, 4, 0])) as Uint8Array;
		expect(decodedNum).toHaveLength(2);
		expect(bytesToHex(decodedNum)).toBe('0400');
	});
});

describe('RLP decoding (BigInt)', () => {
	it('first byte < 0x7f, return itself', () => {
		const decodedSmallNum = bytesToHex(RLP.decode(BigInt(15)) as Uint8Array);
		expect(decodedSmallNum).toHaveLength(2);
		expect(decodedSmallNum).toBe('0f');
	});

	it('first byte < 0xb7, data is everything except first byte', () => {
		const decodedNum = bytesToHex(RLP.decode(BigInt(0x820400)) as Uint8Array);
		expect(decodedNum).toHaveLength(4);
		expect(decodedNum).toBe('0400');
	});
});

describe('strings over 55 bytes long', () => {
	const testString =
		'This function takes in data, converts it to bytes, and adds a length for recursion';
	const test = utf8ToBytes(testString);
	let encoded: Uint8Array;

	it('should encode it', () => {
		encoded = RLP.encode(test);
		expect(encoded[0]).toBe(184);
		expect(encoded[1]).toBe(82);
	});

	it('should decode', () => {
		const decoded = RLP.decode(encoded) as Uint8Array;
		expect(bytesToUtf8(decoded)).toBe(testString);
	});
});

describe('list over 55 bytes long', () => {
	// prettier-ignore
	const testString = ['This', 'function', 'takes', 'in', 'a', 'data', 'convert', 'it', 'to', 'bytes', 'if', 'not', 'and', 'a', 'length', 'for', 'recursion', 'a1', 'a2', 'a3', 'ia4', 'a5', 'a6', 'a7', 'a8', 'ba9']

	it('should encode it', () => {
		expect(RLP.encode(testString)).toBeDefined();
	});

	it('should decode', () => {
		const decodedArr = RLP.decode(RLP.encode(testString)) as Uint8Array[];
		const decoded: string[] = decodedArr.map(a => bytesToUtf8(a));
		expect(decoded).toEqual(testString);
	});
});

describe('nested lists:', () => {
	// prettier-ignore
	const nestedList = [    [],    [      []    ],    [      [],      [        []      ]    ]  ]
	const valueList = [
		[1, 2, 3],
		[
			Uint8Array.from([4, 5, 6]),
			Uint8Array.from([7, 8, 9]),
			[Uint8Array.from([0]), hexToBytes('abcd')],
		],
	];
	let encoded: Uint8Array;
	it('encode a nested list', () => {
		encoded = RLP.encode(nestedList);
		expect(encoded).toEqual(Uint8Array.from([0xc7, 0xc0, 0xc1, 0xc0, 0xc3, 0xc0, 0xc1, 0xc0]));
	});

	it('should decode a nested list', () => {
		const decoded = RLP.decode(encoded);
		expect(nestedList).toEqual(decoded);
	});

	it('should encode a list with values', () => {
		const valueEncoded = RLP.encode(valueList);
		// prettier-ignore
		expect(valueEncoded).toEqual(Uint8Array.from([0xd2, 0xc3, 0x01, 0x02, 0x03, 0xcd, 0x83, 0x04, 0x05, 0x06, 0x83, 0x07, 0x08, 0x09, 0xc4, 0x00, 0x82, 0xab, 0xcd]))
	});
});

describe('typed lists:', () => {
	const valueList = [
		[1, 2, 3],
		[
			Uint8Array.from([4, 5, 6]),
			Uint8Array.from([7, 8, 9]),
			[Uint8Array.from([0]), hexToBytes('abcd')],
		],
	];

	// equivalent to list of values above
	it('encode a nested list', () => {
		const valueEncoded = RLP.encode(valueList);
		// prettier-ignore
		expect(valueEncoded).toEqual(Uint8Array.from([0xd2, 0xc3, 0x01, 0x02, 0x03, 0xcd, 0x83, 0x04, 0x05, 0x06, 0x83, 0x07, 0x08, 0x09, 0xc4, 0x00, 0x82, 0xab, 0xcd]))
	});
});

describe('null values', () => {
	// eslint-disable-next-line no-null/no-null
	const nestedList = [null];
	let encoded;
	it('encode a null array', () => {
		encoded = RLP.encode(nestedList);
		expect(encoded).toEqual(Uint8Array.from([0xc1, 0x80]));
	});

	it('should decode a null value', () => {
		expect(Uint8Array.from([])).toEqual(RLP.decode(hexToBytes('80')));
	});
});

describe('zero values', () => {
	let encoded;
	it('encode a zero', () => {
		encoded = RLP.encode(Uint8Array.from([0]));
		expect(encoded).toEqual(Uint8Array.from([0]));
	});

	it('decode a zero', () => {
		const decode = RLP.decode(Uint8Array.from([0]));
		expect(decode).toEqual(Uint8Array.from([0]));
	});
});

describe('empty values', () => {
	let decoded;
	it('decode empty array', () => {
		decoded = RLP.decode(Uint8Array.from([]));
		expect(decoded).toEqual(Uint8Array.from([]));
	});
});

describe('bad values', () => {
	it('wrong encoded a zero', () => {
		const val = hexToBytes(
			'f9005f030182520894b94f5374fce5edbc8e2a8697c15331677e6ebf0b0a801ca098ff921201554726367d2be8c804a7ff89ccf285ebc57dff8ae4c44b9c19ac4aa08887321be575c8095f789dd4c743dfe42c1820f9231f98a962b210e3ac2452a3',
		);
		let result;
		try {
			result = RLP.decode(val);
		} catch (e) {
			// pass
		}
		expect(result).toBeUndefined();
	});

	it('invalid length', () => {
		const a = hexToBytes(
			'f86081000182520894b94f5374fce5edbc8e2a8697c15331677e6ebf0b0a801ca098ff921201554726367d2be8c804a7ff89ccf285ebc57dff8ae4c44b9c19ac4aa08887321be575c8095f789dd4c743dfe42c1820f9231f98a962b210e3ac2452a3',
		);

		let result;
		try {
			result = RLP.decode(a);
		} catch (e) {
			// pass
		}
		expect(result).toBeUndefined();
	});

	it('extra data at end', () => {
		const c =
			'f90260f901f9a02a3c692012a15502ba9c39f3aebb36694eed978c74b52e6c0cf210d301dbf325a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347948888f1f195afa192cfee860698584c030f4c9db1a0ef1552a40b7165c3cd773806b9e0c165b75356e0314bf0706f279c729f51e017a0b6c9fd1447d0b414a1f05957927746f58ef5a2ebde17db631d460eaf6a93b18da0bc37d79753ad738a6dac4921e57392f145d8887476de3f783dfa7edae9283e52b90100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008302000001832fefd8825208845509814280a00451dd53d9c09f3cfb627b51d9d80632ed801f6330ee584bffc26caac9b9249f88c7bffe5ebd94cc2ff861f85f800a82c35094095e7baea6a6c7c4c2dfeb977efac326af552d870a801ba098c3a099885a281885f487fd37550de16436e8c47874cd213531b10fe751617fa044b6b81011ce57bffcaf610bf728fb8a7237ad261ea2d937423d78eb9e137076c0ef';

		const a = hexToBytes(c);

		let result;
		try {
			result = RLP.decode(a);
		} catch (e) {
			// pass
		}
		expect(result).toBeUndefined();
	});

	it('list length longer than data', () => {
		const c =
			'f9ffffffc260f901f9a02a3c692012a15502ba9c39f3aebb36694eed978c74b52e6c0cf210d301dbf325a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347948888f1f195afa192cfee860698584c030f4c9db1a0ef1552a40b7165c3cd773806b9e0c165b75356e0314bf0706f279c729f51e017a0b6c9fd1447d0b414a1f05957927746f58ef5a2ebde17db631d460eaf6a93b18da0bc37d79753ad738a6dac4921e57392f145d8887476de3f783dfa7edae9283e52b90100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008302000001832fefd8825208845509814280a00451dd53d9c09f3cfb627b51d9d80632ed801f6330ee584bffc26caac9b9249f88c7bffe5ebd94cc2ff861f85f800a82c35094095e7baea6a6c7c4c2dfeb977efac326af552d870a801ba098c3a099885a281885f487fd37550de16436e8c47874cd213531b10fe751617fa044b6b81011ce57bffcaf610bf728fb8a7237ad261ea2d937423d78eb9e137076c0';

		const a = hexToBytes(c);

		let result;
		try {
			result = RLP.decode(a);
		} catch (e) {
			// pass
		}
		expect(result).toBeUndefined();
	});
});

describe('hex prefix', () => {
	it('should have the same value', () => {
		const a = RLP.encode('0x88f');
		const b = RLP.encode('88f');
		expect(bytesToHex(a)).not.toEqual(bytesToHex(b));
	});
});

describe('recursive typings', () => {
	it('should not throw compilation error', () => {
		type IsType<T, U> = Exclude<T, U> extends never
			? Exclude<U, T> extends never
				? true
				: false
			: false;
		const assertType = <T, U>(isTrue: IsType<T, U>) => {
			return isTrue;
		};
		// tslint:disable-next-line:no-dead-store
		const a = RLP.encode([[[[[0]]]]]);
		expect(assertType<typeof a, Uint8Array>(true)).toBe(true);
	});
});

describe('stream', () => {
	it('should handle stream decoding correctly', () => {
		const encodedNumber = RLP.encode(1);
		const str = 'This is a string';
		const longString =
			'This is a long string, so we can trigger the prefix when the array length is larger than 55.';
		const encodedString = RLP.encode(str);
		const encodedLongString = RLP.encode(longString);
		const encodedList = RLP.encode([1, 2, 3]);
		const bufferStream = concatBytes(
			encodedNumber,
			encodedString,
			encodedLongString,
			encodedList,
		);
		let decoded = RLP.decode(bufferStream, true);
		expect(bytesToHex(decoded.data as Uint8Array)).toBe('01');
		decoded = RLP.decode(decoded.remainder, true);
		expect(decoded.data).toEqual(utf8ToBytes(str));
		decoded = RLP.decode(decoded.remainder, true);
		expect(decoded.data).toEqual(utf8ToBytes(longString));
		decoded = RLP.decode(decoded.remainder, true);
		expect(decoded.data).toHaveLength(3);
		expect(decoded.data[0]).toEqual(Uint8Array.from([1]));
		expect(decoded.data[1]).toEqual(Uint8Array.from([2]));
		expect(decoded.data[2]).toEqual(Uint8Array.from([3]));
		expect(decoded.remainder).toHaveLength(0);
	});
});
