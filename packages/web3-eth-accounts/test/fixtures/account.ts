import { sign, signTransaction, encrypt } from '../../src/account';

export const validPrivateKeytoAccountData: [string, any][] = [
	[
		'0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
		{
			address: '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01',
			privateKey: '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
			sign,
			signTransaction,
			encrypt,
		},
	],
	[
		'0x9e93921f9bca358a96aa66efcccbde12850473be95f63c1453e29656feafeb35',
		{
			address: '0x118C2E5F57FD62C2B5b46a5ae9216F4FF4011a07',
			privateKey: '0x9e93921f9bca358a96aa66efcccbde12850473be95f63c1453e29656feafeb35',
			sign,
			signTransaction,
			encrypt,
		},
	],
];

export const invalidPrivateKeytoAccountData: [any, string][] = [
	['', 'Invalid value given "". Error: Private key must be 32 bytes.'],
	[Buffer.from([]), 'Invalid value given "". Error: Private key must be 32 bytes.'],
	[undefined, 'Invalid value given "undefined". Error: not a valid string or buffer.'],
	[null, 'Invalid value given "null". Error: not a valid string or buffer.'],
];
