import { sign, signTransaction, encrypt } from '../../src/account';
import { CipherOptions } from '../../src/types';

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
	['', 'Invalid value given "". Error: not a valid string or buffer.'],
	[Buffer.from([]), 'Invalid value given "". Error: Private key must be 32 bytes.'],
	[undefined, 'Invalid value given "undefined". Error: not a valid string or buffer.'],
	[null, 'Invalid value given "null". Error: not a valid string or buffer.'],
];


export const validEncryptData: [[any, string, CipherOptions], any][] = [
	[["0x67f476289210e3bef3c1c75e4de993ff0a00663df00def84e73aa7411eac18a6", "123", {iv: Buffer.from("bfb43120ae00e9de110f8325143a2709", 'hex'), salt: Buffer.from("210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd", "hex")}],{
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
			salt: '210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd'
		  },
		}
	  }],
	  [["0x67f476289210e3bef3c1c75e4de993ff0a00663df00def84e73aa7411eac18a6", "123", {iv: "bfb43120ae00e9de110f8325143a2709", salt: "210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd"}],{
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
			salt: '210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd'
		  },
		}
	  }]	
]

export const invalidEncryptData: [[any, string, CipherOptions], string][] = [
	// [["0x123456"]]
]
