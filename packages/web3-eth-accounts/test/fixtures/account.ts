import { AccessListEIP2930TxData, FeeMarketEIP1559TxData, TxData } from '@ethereumjs/tx';
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
	['', 'Private key must be 32 bytes.'],
	[Buffer.from([]), 'Private key must be 32 bytes.'],
	[undefined, 'Not a valid string or buffer.'],
	[null, 'Not a valid string or buffer.'],
];

export const signatureRecoverData: [string, any][] = [
	[
		'Some data',
		{
			address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
			privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
			data: 'Some data',
			// signature done with personal_sign
			signature:
				'0xa8037a6116c176a25e6fc224947fde9e79a2deaa0dd8b67b366fbdfdbffc01f953e41351267b20d4a89ebfe9c8f03c04de9b345add4a52f15bd026b63c8fb1501b',
		},
	],
	[
		'Some data!%$$%&@*',
		{
			address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
			privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
			data: 'Some data!%$$%&@*',
			// signature done with personal_sign
			signature:
				'0x05252412b097c5d080c994d1ea12abcee6f1cae23feb225517a0b691a66e12866b3f54292f9cfef98f390670b4d010fc4af7fcd46e41d72870602c117b14921c1c',
		},
	],
];

export const transactionsTestData: [TxData | AccessListEIP2930TxData | FeeMarketEIP1559TxData][] = [
	[
		// 'TxLegacy'
		{
			to: '0x118C2E5F57FD62C2B5b46a5ae9216F4FF4011a07',
			value: '0x186A0',
			gasLimit: '0x520812',
			gasPrice: '0x09184e72a000',
			data: '',
			chainId: 1,
			nonce: 0,
		},
	],
	[
		// 'Tx1559'
		{
			to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
			maxPriorityFeePerGas: '0x3B9ACA00',
			maxFeePerGas: '0xB2D05E00',
			gasLimit: '0x6A4012',
			value: '0x186A0',
			data: '',
			chainId: 1,
			nonce: 0,
		},
	],
	[
		// 'Tx2930'
		{
			chainId: 1,
			nonce: 0,
			gasPrice: '0x09184e72a000',
			gasLimit: '0x2710321',
			to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
			value: '0x186A0',
			data: '',
			accessList: [
				{
					address: '0x0000000000000000000000000000000000000101',
					storageKeys: [
						'0x0000000000000000000000000000000000000000000000000000000000000000',
						'0x00000000000000000000000000000000000000000000000000000000000060a7',
					],
				},
			],
		},
	],
];
