/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

import { AccessListEIP2930TxData, FeeMarketEIP1559TxData, TxData } from '@ethereumjs/tx';
import {
	InvalidKdfError,
	InvalidPrivateKeyError,
	KeyDerivationError,
	PrivateKeyLengthError,
	InvalidPasswordError,
	IVLengthError,
	PBKDF2IterationsError,
} from 'web3-errors';
import { sign, signTransaction, encrypt } from '../../src/account';
import { CipherOptions, KeyStore } from '../../src/types';

export const validPrivateKeyToAddressData: [string, string][] = [
	[
		'0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
		'0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01',
	],
	[
		'0x9e93921f9bca358a96aa66efcccbde12850473be95f63c1453e29656feafeb35',
		'0x118C2E5F57FD62C2B5b46a5ae9216F4FF4011a07',
	],
	[
		'0xf44e0436edb0afd26b09f7b9f1e7a280d2365fc530aebccf893f1158a449d20a',
		'0x8824eEA7A9FF8E051e63ACAc443460151CB6fd92',
	],
	[
		'0xf4a2b939592564feb35ab10a8e04f6f2fe0943579fb3c9c33505298978b74893',
		'0xd5e099c71B797516c10ED0F0d895f429C2781142',
	],
];

export const invalidPrivateKeyToAddressData: [
	any,
	PrivateKeyLengthError | InvalidPrivateKeyError,
][] = [
	['', new InvalidPrivateKeyError()],
	[Buffer.from([]), new PrivateKeyLengthError()],
];

export const validPrivateKeytoAccountData: [any, any][] = [
	[
		{
			address: '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
			ignoreLength: false,
		},
		{
			address: '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01',
			privateKey: '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
			sign,
			signTransaction,
			encrypt,
		},
	],
	[
		{ address: '0x9e93921f9bca358a96aa66efcccbde12850473be95f63c1453e29656feafeb35' },
		{
			address: '0x118C2E5F57FD62C2B5b46a5ae9216F4FF4011a07',
			privateKey: '0x9e93921f9bca358a96aa66efcccbde12850473be95f63c1453e29656feafeb35',
			sign,
			signTransaction,
			encrypt,
		},
	],
	[
		{
			address: '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709', // ignoreLength parameter set true
			ignoreLength: true,
		},
		{
			address: '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01',
			privateKey: '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
			sign,
			signTransaction,
			encrypt,
		},
	],
];

export const signatureRecoverData: [string, any][] = [
	[
		'Some long text with integers 1233 and special characters and unicode \u1234 as well.',
		{
			address: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
			privateKey: '0xcb89ec4b01771c6c8272f4c0aafba2f8ee0b101afb22273b786939a8af7c1912',
			data: 'Some long text with integers 1233 and special characters and unicode \u1234 as well.',
			// signature done with personal_sign
			signatureOrV:
				'0x2ac888726c80494b80b63996455d109aef5db27e673dd92f277ac6e48dc300db3dfc7549744c2a33a03a2eaa0f2837f54c5951b80d5e05257d605bc695c2ae7f1c',
		},
	],
	[
		'Some data',
		{
			address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
			privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
			data: 'Some data',
			// signature done with personal_sign
			signatureOrV:
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
			signatureOrV:
				'0x05252412b097c5d080c994d1ea12abcee6f1cae23feb225517a0b691a66e12866b3f54292f9cfef98f390670b4d010fc4af7fcd46e41d72870602c117b14921c1c',
		},
	],
	[
		// testcase for recover(data, V, R, S)
		'some data',
		{
			signatureOrV: '0x1c',
			prefixedOrR: '0xb9be9700e1c7fd9c3e5e1b511de5c6f62680480a7f8c68962a74375cabe51c18',
			s: '0x6fcbbcf5b1bc357d3e56bef2ef8a1b3ad7e48564dd886d7636eb1c18e1e41f1b',
			address: '0x54BF9ed7F22b64a5D69Beea57cFCd378763bcdc5',
			privateKey: '0x03a0021a87dc354855f900fd15c063bcc9c155c33b8f2321ec294e0933ef29d2',
			signature:
				'0xb9be9700e1c7fd9c3e5e1b511de5c6f62680480a7f8c68962a74375cabe51c186fcbbcf5b1bc357d3e56bef2ef8a1b3ad7e48564dd886d7636eb1c18e1e41f1b1c',
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

export const invalidPrivateKeytoAccountData: [
	any,
	PrivateKeyLengthError | InvalidPrivateKeyError,
][] = [
	['', new InvalidPrivateKeyError()],
	[Buffer.from([]), new PrivateKeyLengthError()],
];

export const validEncryptData: [[any, string | Buffer, CipherOptions], KeyStore][] = [
	[
		[
			'0x67f476289210e3bef3c1c75e4de993ff0a00663df00def84e73aa7411eac18a6',
			'123',
			{
				n: 8192,
				iv: Buffer.from('bfb43120ae00e9de110f8325143a2709', 'hex'),
				salt: Buffer.from(
					'210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd',
					'hex',
				),
			},
		],
		{
			version: 3,
			address: 'cda9a91875fc35c8ac1320e098e584495d66e47c',
			crypto: {
				ciphertext: 'cb3e13e3281ff3861a3f0257fad4c9a51b0eb046f9c7821825c46b210f040b8f',
				cipherparams: { iv: 'bfb43120ae00e9de110f8325143a2709' },
				cipher: 'aes-128-ctr',
				kdf: 'scrypt',
				kdfparams: {
					n: 8192,
					r: 8,
					p: 1,
					dklen: 32,
					salt: '210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd',
				},
				mac: '46eb4884e82dc43b5aa415faba53cc653b7038e9d61cc32fd643cf8c396189b7',
			},
			id: '1d82a61f-2bba-4ebc-a283-56d49d877eb7',
		},
	],
	[
		[
			'0x67f476289210e3bef3c1c75e4de993ff0a00663df00def84e73aa7411eac18a6',
			'123',
			{
				n: 8192,
				iv: 'bfb43120ae00e9de110f8325143a2709',
				salt: '210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd',
			},
		],
		{
			version: 3,
			address: 'cda9a91875fc35c8ac1320e098e584495d66e47c',
			crypto: {
				ciphertext: 'cb3e13e3281ff3861a3f0257fad4c9a51b0eb046f9c7821825c46b210f040b8f',
				cipherparams: { iv: 'bfb43120ae00e9de110f8325143a2709' },
				cipher: 'aes-128-ctr',
				kdf: 'scrypt',
				kdfparams: {
					n: 8192,
					r: 8,
					p: 1,
					dklen: 32,
					salt: '210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd',
				},
				mac: '46eb4884e82dc43b5aa415faba53cc653b7038e9d61cc32fd643cf8c396189b7',
			},
			id: '1d82a61f-2bba-4ebc-a283-56d49d877eb7',
		},
	],
	[
		[
			'0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
			'123',
			{
				iv: 'bfb43120ae00e9de110f8325143a2709',
				salt: '210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd',
				c: 262144,
				kdf: 'pbkdf2',
			},
		],
		{
			version: 3,
			id: 'e6a68d89-b03c-4e7d-82e0-079eebaa0da7',
			address: 'b8ce9ab6943e0eced004cde8e3bbed6568b2fa01',
			crypto: {
				ciphertext: '76512156a34105fa6473ad040c666ae7b917d14c06543accc0d2dc28e6073b12',
				cipherparams: { iv: 'bfb43120ae00e9de110f8325143a2709' },
				cipher: 'aes-128-ctr',
				kdf: 'pbkdf2',
				kdfparams: {
					dklen: 32,
					salt: '210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd',
					c: 262144,
					prf: 'hmac-sha256',
				},
				mac: '46eb4884e82dc43b5aa415faba53cc653b7038e9d61cc32fd643cf8c396189b7',
			},
		},
	],
];

export const invalidEncryptData: [
	[any, any, any],
	(
		| PrivateKeyLengthError
		| InvalidKdfError
		| InvalidPrivateKeyError
		| InvalidPasswordError
		| IVLengthError
		| PBKDF2IterationsError
	),
][] = [
	[
		['0x67f476289210e3bef3c1c75e4de993ff0a00663df00def84e73aa7411eac18a', '123', {}],
		new PrivateKeyLengthError(),
	],
	[
		[
			'0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
			'123',
			{
				iv: 'bfb43120ae00e9de110f8325143a2709',
				salt: '210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd',
				kdf: 'hkdf',
			},
		],
		new InvalidKdfError(),
	],
	[
		[undefined, '123', {}], // no private key provided
		new InvalidPrivateKeyError(),
	],
	[
		// no password provided
		['0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709', undefined, {}],
		new InvalidPasswordError(),
	],
	[
		// iv length is not 16 bytes
		[
			'0x67f476289210e3bef3c1c75e4de993ff0a00663df00def84e73aa7411eac18a6',
			'123',
			{
				n: 8192,
				iv: Buffer.from('bfb43120ae00e9de110f8325143a27', 'hex'),
				salt: undefined,
			},
		],
		new IVLengthError(),
	],
	[
		[
			// iterations is less than 1000, should error
			'0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
			'123',
			{
				iv: 'bfb43120ae00e9de110f8325143a2709',
				salt: '210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd',
				c: 100,
				kdf: 'pbkdf2',
			},
		],
		new PBKDF2IterationsError(),
	],
];

export const invalidKeyStore: [[any, string]][] = [
	[
		// invalid keystore error, missing id field
		[
			{
				// invalid kdf
				version: 3,
				address: 'cda9a91875fc35c8ac1320e098e584495d66e47c',
				crypto: {
					ciphertext: '222f49d9cb350b0b9a16472ecb389f8128bc9404233c34ba0484db12fb47534e',
					cipherparams: { iv: '8c36f74571c7aef9dd4901c9c1cc720a' },
					cipher: 'aes-128-ctr',
					kdf: 'hkdf',
					kdfparams: {
						dklen: 32,
						salt: 'ffd22eb8573fb1de0262cc133042e8fd9b193a46f20c09f25f39fae90a7a2896',
						n: 8192,
						r: 8,
						p: 1,
					},
					mac: '46162bad0ac2145ddd399bfb47b474959a2845faf69e69bd1b325ec8db3298cb',
				},
			},
			'123',
		],
	],
];

export const validDecryptData: [[string, string, CipherOptions, string]][] = [
	[
		[
			'0x67f476289210e3bef3c1c75e4de993ff0a00663df00def84e73aa7411eac18a6',
			'123',
			{
				iv: Buffer.from('bfb43120ae00e9de110f8325143a2709', 'hex'),
				salt: Buffer.from(
					'210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd',
					'hex',
				),
			},
			'0x67f476289210e3bef3c1c75e4de993ff0a00663df00def84e73aa7411eac18a6',
		],
	],
];

export const invalidDecryptData: [[any, string], InvalidKdfError | KeyDerivationError][] = [
	[
		[
			{
				// invalid kdf
				version: 3,
				id: '0e9f63f7-9e7c-4d87-bdf7-02ffe8ee6481',
				address: 'cda9a91875fc35c8ac1320e098e584495d66e47c',
				crypto: {
					ciphertext: '222f49d9cb350b0b9a16472ecb389f8128bc9404233c34ba0484db12fb47534e',
					cipherparams: { iv: '8c36f74571c7aef9dd4901c9c1cc720a' },
					cipher: 'aes-128-ctr',
					kdf: 'hkdf',
					kdfparams: {
						dklen: 32,
						salt: 'ffd22eb8573fb1de0262cc133042e8fd9b193a46f20c09f25f39fae90a7a2896',
						n: 8192,
						r: 8,
						p: 1,
					},
					mac: '46162bad0ac2145ddd399bfb47b474959a2845faf69e69bd1b325ec8db3298cb',
				},
			},
			'123',
		],
		new InvalidKdfError(),
	],
	[
		[
			{
				// wrong password
				version: 3,
				id: 'e6a68d89-b03c-4e7d-82e0-079eebaa0da7',
				address: 'b8ce9ab6943e0eced004cde8e3bbed6568b2fa01',
				crypto: {
					ciphertext: '76512156a34105fa6473ad040c666ae7b917d14c06543accc0d2dc28e6073b12',
					cipherparams: { iv: 'bfb43120ae00e9de110f8325143a2709' },
					cipher: 'aes-128-ctr',
					kdf: 'pbkdf2',
					kdfparams: {
						dklen: 32,
						salt: '210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd',
						c: 262144,
						prf: 'hmac-sha256',
					},
					mac: '46eb4884e82dc43b5aa415faba53cc653b7038e9d61cc32fd643cf8c396189b7',
				},
			},
			'12',
		],
		new KeyDerivationError(),
	],
];

export const validHashMessageData: [string, string][] = [
	['🤗', '0x716ce69c5d2d629c168bc02e24a961456bdc5a362d366119305aea73978a0332'],
	[
		'Some long text with integers 1233 and special characters and unicode \u1234 as well.',
		'0xff21294f27c6b1e416215feb0b0b904c552c874c4e11b2314dd3afc1714ed8a8',
	],
	['non utf8 string', '0x8862c6a425a83c082216090e4f0e03b64106189e93c29b11d0112e77b477cce2'],
	['', '0x5f35dce98ba4fba25530a026ed80b2cecdaa31091ba4958b99b52ea1d068adad'],
];
