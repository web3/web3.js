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

export const sha3RawEthersValidData: [string, any][] = [
	...sha3EthersValidData,
	[
		'', // testing null hash
		Buffer.from(''),
	],
];
