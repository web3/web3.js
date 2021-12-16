import {
	HighValueIntegerInByteArrayError,
	InvalidAddressError,
	InvalidBlockError,
	InvalidBlockNumberOrTagError,
	InvalidBloomError,
	InvalidBooleanError,
	InvalidBytesError,
	InvalidFilterError,
	InvalidHexStringError,
	InvalidIntegerError,
	InvalidIntegerInByteArrayError,
	InvalidNumberError,
	InvalidStringError,
	NegativeIntegersInByteArrayError,
} from '../../src/errors';
import { Numbers, Uint, HexString32Bytes, Filter, HexString8Bytes } from '../../src/types';

export const isHexStrictValidData: [Uint, true][] = [
	['0x48', true],
	['0x123c', true],
	['0x0dec0518fa672a70027b04c286582e543ab17319fbdd384fa7bc8f3d5a542c0b', true],
	['0xd115bffabbdd893a6f7cea402e7338643ced44a6', true],
	['0x2C941171bD2A7aEda7c2767c438DfF36EAaFdaFc', true],
	['0x1', true],
	['0xcd', true],
	['-0xcd', true],
	['-0x0dec0518fa672a70027b04c286582e543ab17319fbdd384fa7bc8f3d5a542c0b', true],
];

export const isHexInvalidData: [any, false][] = [
	['Heeäööä👅D34ɝɣ24Єͽ', false],
	['-1000', false],
	['0xH', false],
	['I have 100£', false],
	['\u0000', false],
	[true, false],
	[false, false],
	['0x407d73d8a49eeb85d32cf465507dd71d507100cG', false], // Invalid hex character "G"
	[{}, false],
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	[() => {}, false],
	[undefined, false],
];

export const isHexStrictInvalidData: [any, false][] = [
	...isHexInvalidData,
	['45', false],
	['', false],
	['0', false],
	[1, false],
	[BigInt(12), false],
	[12n, false],
	[-255n, false],
	[-42, false],
	[4.2, false],
];

export const isHexValidData: [Numbers, true][] = [
	...isHexStrictValidData,
	['45', true],
	['', true],
	['0', true],
	[1, true],
	[BigInt(12), true],
	[12n, true],
	[-255n, true],
];

// Converts false from invalid data sets to expected thrown error
export const validateHexStringInputInvalidData = () => {
	const invalidData: [any, InvalidHexStringError][] = [];
	isHexStrictInvalidData.forEach(data =>
		invalidData.push([data[0], new InvalidHexStringError(data[0])]),
	);
	return invalidData;
};

// TODO validateBytesInputValidData
export const validateBytesInputInvalidData: [
	any,
	(
		| NegativeIntegersInByteArrayError
		| HighValueIntegerInByteArrayError
		| InvalidIntegerInByteArrayError
		| InvalidHexStringError
		| InvalidBytesError
	),
][] = [
	['0xT1', new InvalidHexStringError('0xT1')],
	['1234', new InvalidHexStringError('1234')],
	['hello', new InvalidHexStringError('hello')],
	[[1, 2, -3, 4, 5], new NegativeIntegersInByteArrayError([1, 2, -3, 4, 5])],
	[[2, 3, 266], new HighValueIntegerInByteArrayError([2, 3, 266])],
	[['world'], new InvalidIntegerInByteArrayError(['world'])],
	['-0x12', new InvalidBytesError('-0x12')],
];

// TODO validateNumbersInputValidData
export const validateNumbersInputInvalidData: [any, InvalidIntegerError | InvalidNumberError][] = [
	[[['hello'], { onlyIntegers: true }], new InvalidIntegerError('hello')],
	[[['world'], { onlyIntegers: false }], new InvalidNumberError('world')],
	[[4 / 0, { onlyIntegers: true }], new InvalidIntegerError(4 / 0)],
	[[4.4, { onlyIntegers: true }], new InvalidIntegerError(4.4)],
	[['word', { onlyIntegers: true }], new InvalidIntegerError('word')],
];

// TODO validateStringInputValidData
export const validateStringInputInvalidData: [any, InvalidStringError][] = [
	[123, new InvalidStringError(123)],
	[{}, new InvalidStringError({})],
	[null, new InvalidStringError(null)],
	[undefined, new InvalidStringError(undefined)],
];

export const checkAddressCheckSumValidData: [any, true][] = [
	['0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d', true],
	['0x52908400098527886E0F7030069857D2E4169EE7', true],
	['0x8617E340B3D01FA5F11F306F4090FD50E238070D', true],
	['0x27b1fdb04752bbc536007a920d24acb045561c26', true],
	['0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed', true],
	['0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359', true],
	['0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB', true],
	['0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb', true],
];

export const checkAddressCheckSumInvalidData: [any, false][] = [
	['0xc1912fee45d61c87cc5ea59dae31190fffff232d', false],
	['0xd1220a0cf47c7b9be7a2e6ba89f429762e7b9adb', false],
	['0XD1220A0CF47C7B9BE7A2E6BA89F429762E7B9ADB', false],
	['1234', false],
	['0xa1b2', false],
];

export const isAddressValidData: [any, true][] = [
	['0xc6d9d2cd449a754c494264e1809c50e34d64562b', true],
	['c6d9d2cd449a754c494264e1809c50e34d64562b', true],
	['0xE247A45c287191d435A8a5D72A7C8dc030451E9F', true],
	['0xe247a45c287191d435a8a5d72a7c8dc030451e9f', true],
	['0xE247A45C287191D435A8A5D72A7C8DC030451E9F', true],
	['0XE247A45C287191D435A8A5D72A7C8DC030451E9F', true],
];

export const isAddressInvalidData: [any, false][] = [
	...isHexStrictInvalidData,
	['0x1', false],
	['0xE247a45c287191d435A8a5D72A7C8dc030451E9F', false], // Invalid checksum
	['-0x407d73d8a49eeb85d32cf465507dd71d507100c1', false],
];

export const validateAddressInvalidData: [any, InvalidAddressError][] = [
	['0x1', new InvalidAddressError('0x1')],
	[
		'0xE247a45c287191d435A8a5D72A7C8dc030451E9F',
		new InvalidAddressError('0xE247a45c287191d435A8a5D72A7C8dc030451E9F'),
	], // Invalid checksum
	[
		'-0x407d73d8a49eeb85d32cf465507dd71d507100c1',
		new InvalidAddressError('-0x407d73d8a49eeb85d32cf465507dd71d507100c1'),
	],
];

export const compareBlockNumbersValidData: [[Numbers, Numbers], number][] = [
	[[1, 1], 0],
	[[1, 2], -1],
	[[2, 1], 1],
	[[BigInt(1), BigInt(1)], 0],
	[[BigInt(1), BigInt(2)], -1],
	[[BigInt(2), 1n], 1],
	[[1, BigInt(1)], 0],
	[[1, BigInt(2)], -1],
	[[2, BigInt(1)], 1],
	[['genesis', 'earliest'], 0],
	[['genesis', 0], 0],
	[['earliest', 0], 0],
	[['pending', 'pending'], 0],
	[['latest', 'latest'], 0],
	[['earliest', 2], -1],
	[['earliest', 2n], -1],
	[['earliest', 'pending'], -1],
	[['genesis', 2], -1],
	[['genesis', 'latest'], -1],
	[['genesis', 'pending'], -1],
	[[BigInt('9007199254740992'), BigInt('9007199254740991')], 1],
	[[13532346, 13532300], 1],
	[['pending', 'latest'], 1],
	[['latest', 0], 1],
	[['latest', 1n], 1],
	[['pending', 0], 1],
	[['pending', BigInt(1)], 1],
];

export const compareBlockNumbersInvalidData: [[Numbers, Numbers], InvalidBlockError][] = [
	[['pending', 'unknown'], new InvalidBlockError('unknown')],
	[['', 'pending'], new InvalidBlockError('')],
];

export const isBloomValidData: [any, true][] = [
	[
		'0x00000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000008000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000010000000000000000000000000000000000010000000000402000000000000000000000020000010000000000000000000000000000000000000000000000000000000000000',
		true,
	],
	[
		'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
		true,
	],
];

export const isBloomInvalidData: [any, false][] = [
	['0x1100', false],
	['0x1212', false],
	['test', false],
	[100, false],
];

export const isInBloomValidData: [any, true][] = [
	[
		[
			'0x00000000200000000010000080000000000002000000000000000000000000000000000000020200000000000000000000800001000000000000000000200000000000000000000000000008000000800000000000000000000000000000000000000000020000000000000000000800000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000080000000000000000000000100000000000000000000000002000000000001000080000000000000000000000000000000000020200010000000000000000000000000000000000000100000000000000000000000',
			'0x98afe7a8d28bbc88dcf41f8e06d97c74958a47dc',
		],
		true,
	],
	[
		[
			'0x00000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000008000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000010000000000000000000000000000000000010000000000402000000000000000000000020000010000000000000000000000000000000000000000000000000000000000000',
			'0x6b175474e89094c44da98b954eedeac495271d0f',
		],
		true,
	],
	[
		[
			'0x01000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000800000000000000000000000000010018000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000010000000000000000000002000000000080000000000000000000000000000000000000000001000000100000000000000000000000000000000000000000000400000000000000002000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000',
			'0xf411903cbc70a74d22900a5de66a2dda66507255',
		],
		true,
	],
];

export const isInBloomInvalidData: [any, false | InvalidHexStringError | InvalidBloomError][] = [
	[
		[
			'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
			'0x98afe7a8d28bbc88dcf41f8e06d97c74958a47dc',
		],
		false,
	],
	[
		[
			'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
			'0x6254B927ecC25DDd233aAECD5296D746B1C006B4',
		],
		false,
	],
	[['0x1100', '0x6254B927ecC25DDd233aAECD5296D746B1C006B4'], new InvalidBloomError('0x1100')],
	[['0x1212', '0x6254B927ecC25DDd233aAECD5296D746B1C006B4'], new InvalidBloomError('0x1212')],
	[['test', '0x6254B927ecC25DDd233aAECD5296D746B1C006B4'], new InvalidBloomError('test')],
	[
		[
			'0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
			'0xhello',
		],
		new InvalidHexStringError('0xhello'),
	],
];

export const isUserEthereumAddressInBloomValidData: [any, true][] = [
	[
		[
			'0x00000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000002000000000000000000000000000000100000000000000082000000000080000000000000000000000000000000000000000000000002000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
			'0xdfd5293d8e347dfe59e90efd55b2956a1343963d',
		],
		true,
	],
];

export const isUserEthereumAddressInBloomInvalidData: [
	any,
	false | InvalidBloomError | InvalidAddressError,
][] = [
	[
		[
			'0x00000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000002000000000000000000000000000000100000000000000082000000000080000000000000000000000000000000000000000000000002000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
			'0xea674fdde714fd979de3edf0f56aa9716b898ec8',
		],
		false,
	],
	[
		[
			'0x00000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000002000000000000000000000000000000100000000000000082000000000080000000000000000000000000000000000000000000000002000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
			'0xH1',
		],
		new InvalidAddressError('0xH1'),
	],
];

export const isTopicValidData: [any, true][] = [
	['0x0ce781a18c10c8289803c7c4cfd532d797113c4b41c9701ffad7d0a632ac555b', true],
];

export const isTopicInBloomValidData: [any, true][] = [
	[
		[
			'0x00000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000002000000000000000000000000000001000000000000000000000000000000',
			'0x0ce781a18c10c8289803c7c4cfd532d797113c4b41c9701ffad7d0a632ac555b',
		],
		true,
	],
];

export const isBigIntValidData: [any, true][] = [
	[90071992547409911n, true],
	[BigInt(42), true],
	[BigInt('1337'), true],
];

export const isBigIntInvalidData: [any, false][] = [
	[3, false],
	['3', false],
	['3n', false],
];

// Uses same data defined in isHexStrictValidData minus negative hex strings
export const isBlockNumberValidData: [Uint, true][] = [
	['0x48', true],
	['0x123c', true],
	['0x0dec0518fa672a70027b04c286582e543ab17319fbdd384fa7bc8f3d5a542c0b', true],
	['0xd115bffabbdd893a6f7cea402e7338643ced44a6', true],
	['0x2C941171bD2A7aEda7c2767c438DfF36EAaFdaFc', true],
	['0x1', true],
	['0xcd', true],
];

export const isBlockNumberInvalidData: [any, false][] = [
	...isHexStrictInvalidData,
	['-0xcd', false],
	['-0x0dec0518fa672a70027b04c286582e543ab17319fbdd384fa7bc8f3d5a542c0b', false],
];

export const isBlockTagValidData: [string, true][] = [
	['latest', true],
	['pending', true],
	['earliest', true],
];

export const isBlockTagInvalidData: [any, false][] = [
	...isHexStrictInvalidData,
	['EARLIEST', false],
	['LATEST', false],
	['PENDING', false],
	['UNKNOWN', false],
];

// Converts false from invalid data sets to expected thrown error
export const validateBlockNumberOrTagInvalidData = () => {
	const invalidData: [any, InvalidBlockNumberOrTagError][] = [];
	const previouslyDefinedData: [any, false][] = [
		...isBlockNumberInvalidData,
		...isBlockTagInvalidData,
	];
	previouslyDefinedData.forEach(data =>
		invalidData.push([data[0], new InvalidBlockNumberOrTagError(data[0])]),
	);
	return invalidData;
};

export const isHexString8BytesValidData: [HexString8Bytes | [HexString8Bytes, false], true][] = [
	['0x0000000000000001', true],
	['0x00000000000c0ffe', true],
	['0x0000123098409924', true],
	[['0000000000000001', false], true],
	[['00000000000c0ffe', false], true],
	[['0000123098409924', false], true],
];

// Converts false from invalid data sets to expected thrown error
export const validateHexString8BytesInvalidData = () => {
	const invalidData: [any, InvalidHexStringError][] = [];
	isHexStrictInvalidData.forEach(data =>
		invalidData.push([data[0], new InvalidHexStringError(data[0], 8)]),
	);
	return invalidData;
};

export const isHexString32BytesValidData: [HexString32Bytes | [HexString32Bytes, false], true][] = [
	['0x22f30f0608f88c510de0016370f1525b330e5839026bdff93f9ceef24d2275e6', true],
	['0x63a01bba0d4f0ad913a241aed52f5c55807be35f554536abd1e451d4e6515b29', true],
	['0x687f28d48c22e9619b36776cf692501b3fc4e2143841efe3c7f45e49ea46b7f0', true],
	[['22f30f0608f88c510de0016370f1525b330e5839026bdff93f9ceef24d2275e6', false], true],
	[['63a01bba0d4f0ad913a241aed52f5c55807be35f554536abd1e451d4e6515b29', false], true],
	[['687f28d48c22e9619b36776cf692501b3fc4e2143841efe3c7f45e49ea46b7f0', false], true],
];

// Converts false from invalid data sets to expected thrown error
export const validateHexString32BytesInvalidData = () => {
	const invalidData: [any, InvalidHexStringError][] = [];
	isHexStrictInvalidData.forEach(data =>
		invalidData.push([data[0], new InvalidHexStringError(data[0], 32)]),
	);
	return invalidData;
};

// Filter out [true, false] and [false, true] from isHexStrictInvalidData
export const isBooleanInvalidData = isHexStrictInvalidData.filter(
	data => typeof data[0] !== 'boolean',
);

export const validateBooleanInvalidData = () => {
	const invalidData: [any, InvalidBooleanError][] = [];
	isBooleanInvalidData.forEach(data =>
		invalidData.push([data[0], new InvalidBooleanError(data[0])]),
	);
	return invalidData;
};

export const isFilterObjectValidData: [Filter, true][] = [
	[
		{
			fromBlock: '0xc0ff3',
		},
		true,
	],
	[
		{
			toBlock: '0xc0ff3',
		},
		true,
	],
	[
		{
			address: '0x98afe7a8d28bbc88dcf41f8e06d97c74958a47dc',
		},
		true,
	],
	[
		{
			address: [
				'0x98afe7a8d28bbc88dcf41f8e06d97c74958a47dc',
				'0xdfd5293d8e347dfe59e90efd55b2956a1343963d',
			],
		},
		true,
	],
	[
		{
			topics: [
				'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
				null,
				[
					'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
					'0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
				],
			],
		},
		true,
	],
	[
		{
			fromBlock: '0xc0ff3',
			toBlock: '0xc0ff3',
			address: [
				'0x98afe7a8d28bbc88dcf41f8e06d97c74958a47dc',
				'0xdfd5293d8e347dfe59e90efd55b2956a1343963d',
			],
			topics: [
				'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
				null,
				[
					'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
					'0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
				],
			],
		},
		true,
	],
];

// Converts false from invalid data sets to expected thrown error
export const validateFilterObjectInvalidData = () => {
	const invalidData: [any, InvalidFilterError][] = [
		[
			{
				fromBlock: 42,
			},
			new InvalidFilterError({
				fromBlock: 42,
			}),
		],
		[
			{
				toBlock: -42,
			},
			new InvalidFilterError({
				toBlock: -42,
			}),
		],
		[
			{
				address: '0x98',
			},
			new InvalidFilterError({
				address: '0x98',
			}),
		],
		[
			{
				address: [
					'0x98afe7a8d28bbc88dcf41f8e06d97c74958a47dc',
					'0xdfd5293d8e347dfe59e90efd55b2956a1343963d',
					null,
				],
			},
			new InvalidFilterError({
				address: [
					'0x98afe7a8d28bbc88dcf41f8e06d97c74958a47dc',
					'0xdfd5293d8e347dfe59e90efd55b2956a1343963d',
					null,
				],
			}),
		],
		[
			{
				topics: [
					'0x00000000000000000000000',
					null,
					[
						'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
						'0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
					],
				],
			},
			new InvalidFilterError({
				topics: [
					'0x00000000000000000000000',
					null,
					[
						'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
						'0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
					],
				],
			}),
		],
		[
			{
				fromBlock: '0xc0ff3',
				toBlock: '0xc0ff3',
				address: [
					'0x98afe7a8d28bbc88dcf41f8e06d97c74958a47dc',
					'0xdfd5293d8e347dfe59e90efd55b2956a1343963d',
					42,
				],
				topics: [
					'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
					null,
					[
						'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
						'0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
					],
				],
			},
			new InvalidFilterError({
				fromBlock: '0xc0ff3',
				toBlock: '0xc0ff3',
				address: [
					'0x98afe7a8d28bbc88dcf41f8e06d97c74958a47dc',
					'0xdfd5293d8e347dfe59e90efd55b2956a1343963d',
					42,
				],
				topics: [
					'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
					null,
					[
						'0x000000000000000000000000a94f5374fce5edbc8e2a8697c15331677e6ebf0b',
						'0x0000000000000000000000000aff3454fce5edbc8cca8697c15331677e6ebccc',
					],
				],
			}),
		],
	];
	isHexStrictValidData.forEach(data =>
		invalidData.push([data[0], new InvalidFilterError(data[0])]),
	);
	return invalidData;
};
