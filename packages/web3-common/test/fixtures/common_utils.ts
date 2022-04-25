import { Bytes, HexString, Numbers } from '../../src/types';

export const hexToNumberValidData: [HexString, Numbers][] = [
	['0x1', 1],
	['0xff', 255],
	['0x100', 256],
	['0x36', 54],
	['0xc', 12],
	['0x300', 768],
	['-0x300', -768],
	['-0xff', -255],
	['0XFF0', 4080],
	['-0xa0', -160],
	['0x1fffffffffffff', 9007199254740991], // Number.MAX_SAFE_INTEGER
	['0x20000000000000', BigInt('9007199254740992')], // Number.MAX_SAFE_INTEGER + 1
	['-0x1fffffffffffff', -9007199254740991], // Number.MIN_SAFE_INTEGER
	['-0x20000000000000', BigInt('-9007199254740992')], // Number.MIN_SAFE_INTEGER - 1
];

export const hexToUtf8ValidData: [HexString, string][] = [
	['0x49206861766520313030c2a3', 'I have 100£'],
	['0x4920e188b464617461', 'I \u1234data'],
	['0x4920e299a52064617461', 'I ♥ data'],
	['0x4920002064617461', 'I \u0000 data'],
	['0x206e756c6c20737566666978', ' null suffix'],
	['0x6e756c6c20707265666978', 'null prefix'],
	['0x', ''],
];

export const hexToUtf8InvalidData: [any, string][] = [
	[
		'0x4920686176652031303g0c2a3',
		'value "0x4920686176652031303g0c2a3" at "/0" must pass "bytes" validation',
	],
	['afde', 'value "afde" at "/0" must pass "bytes" validation'],
	[null, 'value at "/0" must pass "bytes" validation'],
	[undefined, 'value at "/0" must pass "bytes" validation'],
	[{}, 'value "[object Object]" at "/0" must pass "bytes" validation'],
	[true, 'value "true" at "/0" must pass "bytes" validation'],
];

export const bytesToHexValidData: [Bytes, HexString][] = [
	[new Uint8Array([72]), '0x48'],
	[new Uint8Array([72, 12]), '0x480c'],
	[Buffer.from('0c12', 'hex'), '0x0c12'],
	['0x9c12', '0x9c12'],
	['0X12c6', '0x12c6'],
];

export const bytesToHexInvalidData: [any, string][] = [
	[[9.5, 12.9], 'value "9.5,12.9" at "/0" must pass "bytes" validation'],
	[[-72, 12], 'value "-72,12" at "/0" must pass "bytes" validation'],
	[[567, 10098], 'value "567,10098" at "/0" must pass "bytes" validation'],
	[[786, 12, 34, -2, 3], 'value "786,12,34,-2,3" at "/0" must pass "bytes" validation'],
	['0x0c1g', 'value "0x0c1g" at "/0" must pass "bytes" validation'],
	['0c1g', 'value "0c1g" at "/0" must pass "bytes" validation'],
	['data', 'value "data" at "/0" must pass "bytes" validation'],
	[12, 'value "12" at "/0" must pass "bytes" validation'],
	[['string'], 'value "string" at "/0" must pass "bytes" validation'],
	[null, 'value at "/0" must pass "bytes" validation'],
	[undefined, 'value at "/0" must pass "bytes" validation'],
	[{}, 'value "[object Object]" at "/0" must pass "bytes" validation'],
];

export const hexToBytesValidData: [HexString, Buffer][] = [
	['0x48', Buffer.from([72])],
	['0x3772', Buffer.from('3772', 'hex')],
	['0x480c', Buffer.from([72, 12])],
	['0x0c12', Buffer.from('0c12', 'hex')],
	['0x9c12', Buffer.from('9c12', 'hex')],
	['0X12c6', Buffer.from('12c6', 'hex')],
];

export const hexToBytesInvalidData: [any, string][] = [
	[[9.5, 12.9], 'value "9.5,12.9" at "/0" must pass "bytes" validation'],
	[[-72, 12], 'value "-72,12" at "/0" must pass "bytes" validation'],
	[[567, 10098], 'value "567,10098" at "/0" must pass "bytes" validation'],
	[[786, 12, 34, -2, 3], 'value "786,12,34,-2,3" at "/0" must pass "bytes" validation'],
	['0x0c1g', 'value "0x0c1g" at "/0" must pass "bytes" validation'],
	['0c1g', 'value "0c1g" at "/0" must pass "bytes" validation'],
	['data', 'value "data" at "/0" must pass "bytes" validation'],
	[12, 'value "12" at "/0" must pass "bytes" validation'],
	[['string'], 'value "string" at "/0" must pass "bytes" validation'],
	[null, 'value at "/0" must pass "bytes" validation'],
	[undefined, 'value at "/0" must pass "bytes" validation'],
	[{}, 'value "[object Object]" at "/0" must pass "bytes" validation'],
];

export const hexToNumberInvalidData: [HexString, string][] = [
	['1a', 'value "1a" at "/0" must pass "hex" validation'],
	['0xffdg', 'value "0xffdg" at "/0" must pass "hex" validation'],
	['xfff', 'value "xfff" at "/0" must pass "hex" validation'],
	['-123', 'value "-123" at "/0" must pass "hex" validation'],
	['-9x123', 'value "-9x123" at "/0" must pass "hex" validation'],
];

export const numberToHexValidData: [Numbers, HexString][] = [
	[1, '0x1'],
	[255, '0xff'],
	[256, '0x100'],
	[54, '0x36'],
	[BigInt(12), '0xc'],
	[12n, '0xc'],
	['768', '0x300'],
	['-768', '-0x300'],
	[-255, '-0xff'],
	['0xFF0', '0xff0'],
	['-0xa0', '-0xa0'],
	[0xff, '0xff'],
	[-0xff, '-0xff'],
];

export const numberToHexInvalidData: [any, string][] = [
	[12.2, 'value "12.2" at "/0" must pass "int" validation'],
	['0xag', 'value "0xag" at "/0" must pass "int" validation'],
	['122g', 'value "122g" at "/0" must pass "int" validation'],
	[null, 'value at "/0" must pass "int" validation'],
	[undefined, 'value at "/0" must pass "int" validation'],
	[{}, 'value "[object Object]" at "/0" must pass "int" validation'],
];

export const utf8ToHexValidData: [string, HexString][] = [
	['I have 100£', '0x49206861766520313030c2a3'],
	['I \u1234data', '0x4920e188b464617461'],
	['I ♥ data', '0x4920e299a52064617461'],
	['I \u0000 data', '0x4920002064617461'],
	['\u0000 null suffix', '0x206e756c6c20737566666978'],
	['null prefix\u0000', '0x6e756c6c20707265666978'],
	['\u0000', '0x'],
];

export const utf8ToHexInvalidData: [any, string][] = [
	[12, 'value "12" at "/0" must pass "string" validation'],
	[BigInt(12), 'value "12" at "/0" must pass "string" validation'],
	[12n, 'value "12" at "/0" must pass "string" validation'],
	[null, 'value at "/0" must pass "string" validation'],
	[undefined, 'value at "/0" must pass "string" validation'],
	[{}, 'value "[object Object]" at "/0" must pass "string" validation'],
	[true, 'value "true" at "/0" must pass "string" validation'],
	[false, 'value "false" at "/0" must pass "string" validation'],
];

export const toCheckSumValidData: [string, string][] = [
	['0x0089d53f703f7e0843953d48133f74ce247184c2', '0x0089d53F703f7E0843953D48133f74cE247184c2'],
	['0x5fbc2b6c19ee3dd5f9af96ff337ddc89e30ceaef', '0x5FBc2b6C19EE3DD5f9Af96ff337DDC89e30ceAef'],
	['0xa54D3c09E34aC96807c1CC397404bF2B98DC4eFb', '0xa54d3c09E34aC96807c1CC397404bF2B98DC4eFb'],
];

export const sha3Data: [string, string | null][] = [
	['test123', '0xf81b517a242b218999ec8eec0ea6e2ddbef2a367a14e93f4a32a39e260f686ad'],
	[
		'0x265385c7f4132228a0d54eb1a9e7460b91c0cc68:2382:image',
		'0x74e687805c0cfbf0065120987739a5b0ba9b3686a1a778a463bddddcd18cc432',
	],
	['1234', '0x387a8233c96e1fc0ad5e284353276177af2186e7afa85296f106336e376669f7'],
	['helloworld', '0xfa26db7ca85ead399216e7c6316bc50ed24393c3122b582735e7f3b0f91b93f0'],
];

export const sha3ValidData: [string, string | null][] = [
	...sha3Data,
	['', null],
	[
		'0x265385c7f4132228a0d54eb1a9e7460b91c0cc68',
		'0xb549c60e309fa734059e547a595c28b5ebada949c16229fbf2192650807694f5',
	],
	['0x80', '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'],
	[
		'0x265385c7f4132228a0d54eb1a9e7460b91c0cc68',
		'0xb549c60e309fa734059e547a595c28b5ebada949c16229fbf2192650807694f5',
	],
	['0x1234', '0x56570de287d73cd1cb6092bb8fdee6173974955fdef345ae579ee9f475ea7432'],
];

export const sha3RawValidData: [string, string | null][] = [
	...sha3Data,
	['', '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'],
];

export const mergeDeepData: {
	message: string;
	destination: Record<string, unknown>;
	sources: Record<string, unknown>[];
	output: Record<string, unknown>;
}[] = [
	{
		message: 'multiple sources',
		destination: {},
		sources: [
			{ a: undefined, b: true, c: Buffer.from('123') },
			{ a: 3, d: 'string', e: { nested: BigInt(4) } },
		],
		output: { a: 3, b: true, c: Buffer.from('123'), d: 'string', e: { nested: BigInt(4) } },
	},

	{
		message: 'array elements',
		destination: {},
		sources: [{ a: [1, 2] }, { a: [3, 4] }],
		output: { a: [3, 4] },
	},

	{
		message: 'array elements with null values',
		destination: {},
		sources: [{ a: [1, 2] }, { a: undefined }],
		output: { a: [1, 2] },
	},

	{
		message: 'nested array elements',
		destination: {},
		sources: [{ a: [[1, 2]] }, { a: [[3, 4]] }],
		output: { a: [[3, 4]] },
	},

	{
		message: 'items pre-exists in the destination',
		destination: { a: 4, b: false },
		sources: [
			{ a: undefined, b: true, c: Buffer.from('123') },
			{ a: undefined, d: 'string', e: { nested: 4 } },
		],
		output: { a: 4, b: true, c: Buffer.from('123'), d: 'string', e: { nested: 4 } },
	},

	{
		message: 'items with different types',
		destination: { a: 4, b: false },
		sources: [
			{ a: undefined, b: true, c: Buffer.from('123') },
			{ a: '4', b: 'true', d: 'string', e: { nested: 4 } },
		],
		output: { a: '4', b: 'true', c: Buffer.from('123'), d: 'string', e: { nested: 4 } },
	},
];
