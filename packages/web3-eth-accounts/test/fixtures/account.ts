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

import {
	InvalidKdfError,
	InvalidPrivateKeyError,
	KeyDerivationError,
	PrivateKeyLengthError,
	InvalidPasswordError,
	IVLengthError,
	PBKDF2IterationsError,
} from 'web3-errors';
import { CipherOptions, KeyStore, Bytes } from 'web3-types';
import { hexToBytes } from 'web3-utils';
import { AccessListEIP2930TxData, FeeMarketEIP1559TxData, TxData } from '../../src/tx/types';
import { sign, signTransaction, encrypt } from '../../src/account';

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
	[new Uint8Array([]), new PrivateKeyLengthError()],
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
			r: '0x2ac888726c80494b80b63996455d109aef5db27e673dd92f277ac6e48dc300db',
			s: '0x3dfc7549744c2a33a03a2eaa0f2837f54c5951b80d5e05257d605bc695c2ae7f',
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
			r: '0xa8037a6116c176a25e6fc224947fde9e79a2deaa0dd8b67b366fbdfdbffc01f9',
			s: '0x53e41351267b20d4a89ebfe9c8f03c04de9b345add4a52f15bd026b63c8fb150',
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
			r: '0x05252412b097c5d080c994d1ea12abcee6f1cae23feb225517a0b691a66e1286',
			s: '0x6b3f54292f9cfef98f390670b4d010fc4af7fcd46e41d72870602c117b14921c',
			address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
			privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
			data: 'Some data!%$$%&@*',
			// signature done with personal_sign
			signatureOrV:
				'0x05252412b097c5d080c994d1ea12abcee6f1cae23feb225517a0b691a66e12866b3f54292f9cfef98f390670b4d010fc4af7fcd46e41d72870602c117b14921c1c',
		},
	],
	[
		'102',
		{
			r: '0x0442af06beec07a50981386c8ffb38eed2b51decd90980d8c30eda18f112339c',
			s: '0x080f6f5fb41313d623971020faa2354dd6b62518b758823c03e8b87d5ea4a649',
			address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
			privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
			data: '102',
			// signature done with personal_sign
			signatureOrV:
				'0x0442af06beec07a50981386c8ffb38eed2b51decd90980d8c30eda18f112339c080f6f5fb41313d623971020faa2354dd6b62518b758823c03e8b87d5ea4a6491b',
		},
	],
	[
		// testcase for recover(data, V, R, S)
		'some data',
		{
			signatureOrV: '0x1c',
			prefixedOrR: '0xb9be9700e1c7fd9c3e5e1b511de5c6f62680480a7f8c68962a74375cabe51c18',
			r: '0xb9be9700e1c7fd9c3e5e1b511de5c6f62680480a7f8c68962a74375cabe51c18',
			s: '0x6fcbbcf5b1bc357d3e56bef2ef8a1b3ad7e48564dd886d7636eb1c18e1e41f1b',
			address: '0x54BF9ed7F22b64a5D69Beea57cFCd378763bcdc5',
			privateKey: '0x03a0021a87dc354855f900fd15c063bcc9c155c33b8f2321ec294e0933ef29d2',
			signature:
				'0xb9be9700e1c7fd9c3e5e1b511de5c6f62680480a7f8c68962a74375cabe51c186fcbbcf5b1bc357d3e56bef2ef8a1b3ad7e48564dd886d7636eb1c18e1e41f1b1c',
		},
	],
];

export const signatureRecoverWithoutPrefixData: [string, any][] = [
	[
		'Some long text with integers 1233 and special characters and unicode \u1234 as well.',
		{
			prefixedOrR: true,
			r: '0x66ff35193d5763bbb86428b87cd10451704fa1d00a8831e75cc0eca16701521d',
			s: '0x5ec294b63778e854929a53825191222415bf93871d091a137f61d92f2f3d37bb',
			address: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
			privateKey: '0xcb89ec4b01771c6c8272f4c0aafba2f8ee0b101afb22273b786939a8af7c1912',
			data: 'Some long text with integers 1233 and special characters and unicode \u1234 as well.',
			// signature done with personal_sign
			signatureOrV:
				'0x66ff35193d5763bbb86428b87cd10451704fa1d00a8831e75cc0eca16701521d5ec294b63778e854929a53825191222415bf93871d091a137f61d92f2f3d37bb1b',
		},
	],
	[
		'Some data',
		{
			prefixedOrR: true,
			r: '0xbbae52f4cd6776e66e01673228474866cead8ccc9530e0ae06b42d0f5917865f',
			s: '0x170e7a9e792288955e884c9b2da7d2c69b69d3b29e24372d1dec1164a7deaec0',
			address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
			privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
			data: 'Some data',
			// signature done with personal_sign
			signatureOrV:
				'0xbbae52f4cd6776e66e01673228474866cead8ccc9530e0ae06b42d0f5917865f170e7a9e792288955e884c9b2da7d2c69b69d3b29e24372d1dec1164a7deaec01c',
		},
	],
	[
		'Some data!%$$%&@*',
		{
			prefixedOrR: true,
			r: '0x91b3ccd107995becaca361e9f282723176181bb9250e8ebb8a5119f5e0b91978',
			s: '0x5e67773c632e036712befe130577d2954b91f7c5fb4999bc94d80d471dfd468b',
			address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
			privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
			data: 'Some data!%$$%&@*',
			// signature done with personal_sign
			signatureOrV:
				'0x91b3ccd107995becaca361e9f282723176181bb9250e8ebb8a5119f5e0b919785e67773c632e036712befe130577d2954b91f7c5fb4999bc94d80d471dfd468b1c',
		},
	],
	[
		'102',
		{
			prefixedOrR: true,
			r: '0xecbd18fc2919bef2a9371536df0fbabdb09fda9823b15c5ce816ab71d7b5e359',
			s: '0x3860327ffde34fe72ae5d6abdcdc91e984f936ea478cfb8b1547383d6e4d6a98',
			address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
			privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
			data: '102',
			// signature done with personal_sign
			signatureOrV:
				'0xecbd18fc2919bef2a9371536df0fbabdb09fda9823b15c5ce816ab71d7b5e3593860327ffde34fe72ae5d6abdcdc91e984f936ea478cfb8b1547383d6e4d6a981b',
		},
	],
	[
		// testcase for recover(data, V, R, S)
		'some data',
		{
			signatureOrV: '0x1b',
			prefixedOrR: '0x48f828a3ed107ce28551a3264d75b18df806d6960c273396dc022baadd0cf26e',
			r: '0x48f828a3ed107ce28551a3264d75b18df806d6960c273396dc022baadd0cf26e',
			s: '0x373e1b6709512c2dab9dff4066c6b40d32bd747bdb84469023952bc82123e8cc',
			address: '0x54BF9ed7F22b64a5D69Beea57cFCd378763bcdc5',
			privateKey: '0x03a0021a87dc354855f900fd15c063bcc9c155c33b8f2321ec294e0933ef29d2',
			signature:
				'0x48f828a3ed107ce28551a3264d75b18df806d6960c273396dc022baadd0cf26e373e1b6709512c2dab9dff4066c6b40d32bd747bdb84469023952bc82123e8cc1b',
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
	[new Uint8Array([]), new PrivateKeyLengthError()],
];

export const validPrivateKeyToPublicKeyData: [
	Bytes,
	boolean,
	string, // private key, isCompressed, public key
][] = [
	[
		'0x1e046a882bb38236b646c9f135cf90ad90a140810f439875f2a6dd8e50fa261f', // test string to uncompressed publickey
		false,
		'0x42beb65f179720abaa3ec9a70a539629cbbc5ec65bb57e7fc78977796837e537662dd17042e6449dc843c281067a4d6d8d1a1775a13c41901670d5de7ee6503a',
	],
	[
		'0x1e046a882bb38236b646c9f135cf90ad90a140810f439875f2a6dd8e50fa261f', // test string to compressed publickey
		true,
		'0x42beb65f179720abaa3ec9a70a539629cbbc5ec65bb57e7fc78977796837e537',
	],
	[
		hexToBytes('0xd933beabed94a9f23917576596b2bc64ffeacfe5ded09a99c0feee8369bd295d'), // test uint8array to uncompressed publickey
		false,
		'0x7891db4ed2d26584b0fa87329c40b398c940c08e7dbeb8e3dad83f34dba284c933fb14b1edd8893fa89af3823fd827ee59044033ca068803030afc294de5f390',
	],
	[
		hexToBytes('0xd933beabed94a9f23917576596b2bc64ffeacfe5ded09a99c0feee8369bd295d'), // test uint8array to compressed publickey
		true,
		'0x7891db4ed2d26584b0fa87329c40b398c940c08e7dbeb8e3dad83f34dba284c9',
	],
];

export const validEncryptData: [[any, string | Uint8Array, CipherOptions], KeyStore][] = [
	[
		[
			'0x67f476289210e3bef3c1c75e4de993ff0a00663df00def84e73aa7411eac18a6',
			'123',
			{
				n: 8192,
				iv: hexToBytes('0xbfb43120ae00e9de110f8325143a2709'),
				salt: hexToBytes(
					'210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd',
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
				iv: hexToBytes('0xbfb43120ae00e9de110f8325143a27'),
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

export const validRecover: [string, string][] = [
	[
		'I hereby confirm that I am the sole beneficial owner of the assets involved in the business relationship with Fiat24. \nI hereby undertake to inform Fiat24 proactively of any changes to the information contained herein.',
		'0xec4f73260ac14882e65995a09359896a0ae8f16bd0d28b0d9171655b4e85271e07cda040be059fdcbf52709e3c993eb50a89ce33f41617dc090dc80a583e3c4f00',
	], // v < 27
	[
		'test',
		'0xefb42c22baa0143b322e93b24b0903a0ef47a64b716fbb77debbea55a93dec3e4417aff7dce845723240916c6e34cf17c674828b3addfb0afad966334df5b6311b',
	], // v >= 27
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
				iv: hexToBytes('0xbfb43120ae00e9de110f8325143a2709'),
				salt: hexToBytes(
					'210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd',
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
						salt: '210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd00',
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

export const validHashMessageWithoutPrefixData: [string, string][] = [
	['🤗', '0x4bf650e97ac50e9e4b4c51deb9e01455c1a9b2f35143bc0a43f1ea5bc9e51856'],
	[
		'Some long text with integers 1233 and special characters and unicode \u1234 as well.',
		'0x6965440cc2890e0f118738d6300a21afb2de316c578dad144aa55c9ea45c0fa7',
	],
	['non utf8 string', '0x52000fc43fe3aa422eecafff3e0d82205a1409850c4bd2871dfde932de1fec13'],
	['', '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'],
];
