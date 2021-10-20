/* eslint-disable @typescript-eslint/no-magic-numbers */

export const sha3ValidData: [string, string | null][] = [
	['test123', '0xf81b517a242b218999ec8eec0ea6e2ddbef2a367a14e93f4a32a39e260f686ad'],
	['', null],
	[
		'0x265385c7f4132228a0d54eb1a9e7460b91c0cc68',
		'0xb549c60e309fa734059e547a595c28b5ebada949c16229fbf2192650807694f5',
	],
	[
		'0x265385c7f4132228a0d54eb1a9e7460b91c0cc68:2382:image',
		'0x74e687805c0cfbf0065120987739a5b0ba9b3686a1a778a463bddddcd18cc432',
	],
	['1234', '0x387a8233c96e1fc0ad5e284353276177af2186e7afa85296f106336e376669f7'],
	['0x80', '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'],
];

export const sha3InvalidData: [any, string][] = [
	[1, 'Invalid value given "1". Error: not a valid string.'],
	[BigInt(1010), 'Invalid value given "1010". Error: not a valid string.'],
	[undefined, 'Invalid value given "undefined". Error: not a valid string.'],
];

export const sha3EthersValidData: [string, any][] = [
	['test123', Buffer.from('test123', 'utf-8')],
	['0x265385c7f4132228a0d54eb1a9e7460b91c0cc68', '0x265385c7f4132228a0d54eb1a9e7460b91c0cc68'],
	[
		'0x265385c7f4132228a0d54eb1a9e7460b91c0cc68:2382:image',
		Buffer.from('0x265385c7f4132228a0d54eb1a9e7460b91c0cc68:2382:image', 'utf-8'),
	],
	['1234', Buffer.from('1234', 'utf-8')],
	['0x80', '0x80'],
];

export const sha3RawValidData: [string, string | null][] = [
	['test123', '0xf81b517a242b218999ec8eec0ea6e2ddbef2a367a14e93f4a32a39e260f686ad'],
	[
		'0x265385c7f4132228a0d54eb1a9e7460b91c0cc68',
		'0xb549c60e309fa734059e547a595c28b5ebada949c16229fbf2192650807694f5',
	],
	[
		'0x265385c7f4132228a0d54eb1a9e7460b91c0cc68:2382:image',
		'0x74e687805c0cfbf0065120987739a5b0ba9b3686a1a778a463bddddcd18cc432',
	],
	['1234', '0x387a8233c96e1fc0ad5e284353276177af2186e7afa85296f106336e376669f7'],
	['0x80', '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'],
];

export const sha3RawEthersValidData: [string, any][] = [
	...sha3EthersValidData,
	[
		'', // testing null hash
		Buffer.from(''),
	],
];

export const soliditySha3ValidData: [Record<string, unknown>[], string][] = [
	[
		[{ type: 'string', value: '31323334' }],
		'0xf15f8da2ad27e486d632dc37d24912f634398918d6f9913a0a0ff84e388be62b',
	], // 1.x test cases
	[
		[
			{ type: 'string', value: 'helloworld' },
			{ type: 'string', value: '01' },
		],
		'0xfb0a9d38c4dc568cbd105866540986fabf3c08c1bfb78299ce21aa0e5c0c586b',
	],
	[
		[
			{ type: 'string', value: 'hell' },
			{ type: 'string', value: 'oworld' },
			{ type: 'uint16', value: 0x3031 },
		],
		'0xfb0a9d38c4dc568cbd105866540986fabf3c08c1bfb78299ce21aa0e5c0c586b',
	],
	[
		[{ type: 'uint96', value: '32309054545061485574011236401' }],
		'0xfb0a9d38c4dc568cbd105866540986fabf3c08c1bfb78299ce21aa0e5c0c586b',
	],
	[
		[{ type: 'uint256', value: '234' }],
		'0x61c831beab28d67d1bb40b5ae1a11e2757fa842f031a2d0bc94a7867bc5d26c2',
	],
	[
		[{ t: 'int', v: BigInt('234') }],
		'0x61c831beab28d67d1bb40b5ae1a11e2757fa842f031a2d0bc94a7867bc5d26c2',
	],
	[
		[{ type: 'uint', value: '234' }],
		'0x61c831beab28d67d1bb40b5ae1a11e2757fa842f031a2d0bc94a7867bc5d26c2',
	],
	[
		[{ type: 'bytes', value: '0x407D73d8a49eeb85D32Cf465507dd71d507100c1' }],
		'0x4e8ebbefa452077428f93c9520d3edd60594ff452a29ac7d2ccc11d47f3ab95b',
	],
	[
		[
			{ type: 'int16', value: -1 },
			{ type: 'uint48', value: 12 },
		],
		'0x81da7abb5c9c7515f57dab2fc946f01217ab52f3bd8958bc36bd55894451a93c',
	],
	[
		[{ type: 'string', value: 'Hello!%' }],
		'0x661136a4267dba9ccdf6bfddb7c00e714de936674c4bdb065a531cf1cb15c7fc',
	],
	[
		[{ type: 'address', value: '0x407D73d8a49eeb85D32Cf465507dd71d507100c1' }],
		'0x4e8ebbefa452077428f93c9520d3edd60594ff452a29ac7d2ccc11d47f3ab95b',
	],
	[
		[{ t: 'bytes32', v: '0x407D73d8a49eeb85D32Cf465507dd71d507100c1' }],
		'0x3c69a194aaf415ba5d6afca734660d0a3d45acdc05d54cd1ca89a8988e7625b4',
	],
	[
		[
			{ t: 'string', v: 'Hello!%' },
			{ t: 'int8', v: -23 },
			{ t: 'address', v: '0x85F43D8a49eeB85d32Cf465507DD71d507100C1d' },
		],
		'0xa13b31627c1ed7aaded5aecec71baf02fe123797fffd45e662eac8e06fbe4955',
	],
];

export const soliditySha3EthersValidData: [string, any][] = [
	[
		'', // testing null hash
		Buffer.from(''),
	],
];

export const soliditySha3InvalidData: [any, string][] = [
	[1, 'Invalid value given "1". Error: invalid type, type not supported.'],
	[BigInt(1010), 'Invalid value given "1010". Error: invalid type, type not supported.'],
	[undefined, 'Invalid value given "undefined". Error: invalid type, type not supported.'],
];
