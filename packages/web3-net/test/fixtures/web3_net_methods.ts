import { ValidTypes } from 'web3-utils';

export const getIdValidData: [ValidTypes | undefined][] = [
	[undefined],
	[ValidTypes.HexString],
	[ValidTypes.NumberString],
	[ValidTypes.Number],
	[ValidTypes.BigInt],
];

export const getPeerCountValidData: [ValidTypes | undefined][] = [
	[undefined],
	[ValidTypes.HexString],
	[ValidTypes.NumberString],
	[ValidTypes.Number],
	[ValidTypes.BigInt],
];
