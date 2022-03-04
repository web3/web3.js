import { ValidReturnTypes, ValidTypes } from 'web3-utils';

export const getIdValidData: [
	ValidTypes | undefined,
	ValidReturnTypes[ValidTypes],
	ValidReturnTypes[ValidTypes],
][] = [
	[undefined, '3', '0x3'],
	[ValidTypes.HexString, '3', '0x3'],
	[ValidTypes.NumberString, '3', '3'],
	[ValidTypes.Number, '3', 3],
	[ValidTypes.BigInt, '3', BigInt('3')],
];

export const getPeerCountValidData: [
	ValidTypes | undefined,
	ValidReturnTypes[ValidTypes],
	ValidReturnTypes[ValidTypes],
][] = [
	[undefined, '0x2', '0x2'],
	[ValidTypes.HexString, '0x2', '0x2'],
	[ValidTypes.NumberString, '0x2', '2'],
	[ValidTypes.Number, '0x2', 2],
	[ValidTypes.BigInt, '0x2', BigInt('0x2')],
];
