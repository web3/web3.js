import { DataFormat, FMT_BYTES, FMT_NUMBER } from 'web3-common';

export const getIdValidData: [DataFormat, any, any][] = [
	[{ number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX }, '3', '0x3'],
	[{ number: FMT_NUMBER.STR, bytes: FMT_BYTES.HEX }, '3', '3'],
	[{ number: FMT_NUMBER.NUMBER, bytes: FMT_BYTES.HEX }, '3', 3],
	[{ number: FMT_NUMBER.BIGINT, bytes: FMT_BYTES.HEX }, '3', BigInt('3')],
];

export const getPeerCountValidData: [DataFormat, any, any][] = [
	[{ number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX }, '0x2', '0x2'],
	[{ number: FMT_NUMBER.STR, bytes: FMT_BYTES.HEX }, '0x2', '2'],
	[{ number: FMT_NUMBER.NUMBER, bytes: FMT_BYTES.HEX }, '0x2', 2],
	[{ number: FMT_NUMBER.BIGINT, bytes: FMT_BYTES.HEX }, '0x2', BigInt('2')],
];
