import { Numbers } from '../../src/types';

export const isHexData: [any, boolean][] = [
	['0x48', true],
	['0x123c', true],
	['45', true],
	['', true],
	['0', true],
	[1, true],
	[BigInt(12), true],
	[12n, true],
	['-1000', false],
	[-255n, true],
	['I have 100£', false],
	['\u0000', false],
	[true, false],
	[false, false],
];

export const isHexStrictData: [any, boolean][] = [
	['0x48', true],
	['0x123c', true],
	['45', false],
	['', false],
	['0', false],
	[1, false],
	[BigInt(12), false],
	[12n, false],
	['-1000', false],
	[-255n, false],
	['I have 100£', false],
	['\u0000', false],
	[true, false],
	[false, false],
];

export const checkAddressCheckSumValidData: [any, boolean][] = [
	['0xc1912fee45d61c87cc5ea59dae31190fffff232d', false],
	['0xd1220a0cf47c7b9be7a2e6ba89f429762e7b9adb', false],
	['0XD1220A0CF47C7B9BE7A2E6BA89F429762E7B9ADB', false],
	['1234', false],
	['0xa1b2', false],
	['0xc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d', true],
	['0x52908400098527886E0F7030069857D2E4169EE7', true],
	['0x8617E340B3D01FA5F11F306F4090FD50E238070D', true],
	['0x27b1fdb04752bbc536007a920d24acb045561c26', true],
	['0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed', true],
	['0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359', true],
	['0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB', true],
	['0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb', true],
];

export const isAddressValidData: [any, boolean][] = [
	['0xc6d9d2cd449a754c494264e1809c50e34d64562b', true],
	['c6d9d2cd449a754c494264e1809c50e34d64562b', true],
	['0xE247A45c287191d435A8a5D72A7C8dc030451E9F', true],
	['0xE247a45c287191d435A8a5D72A7C8dc030451E9F', false],
	['0xe247a45c287191d435a8a5d72a7c8dc030451e9f', true],
	['0xE247A45C287191D435A8A5D72A7C8DC030451E9F', true],
	['0XE247A45C287191D435A8A5D72A7C8DC030451E9F', true],
	['0123', false],
	['0x12', false],
	[123, false],
];

export const isBloomValidData: [any, boolean][] = [];

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

export const compareBlockNumbersInvalidData: [[Numbers, Numbers], string][] = [
	[['pending', 'unknown'], 'Invalid value given "unknown". Error: invalid string given.'],
	[['', 'pending'], 'Invalid value given "". Error: invalid string given'],
];
