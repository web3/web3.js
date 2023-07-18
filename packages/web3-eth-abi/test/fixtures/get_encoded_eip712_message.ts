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
import { Eip712TypedData } from 'web3-types';

/**
 * string is the test title
 * Eip712TypedData is the entire EIP-712 typed data object
 * boolean is whether the EIP-712 encoded data is keccak256 hashed
 * string is the encoded data expected to be returned by getEncodedEip712Data
 */
export const testData: [string, Eip712TypedData, boolean | undefined, string][] = [
	[
		'should get encoded message without hashing, hash = undefined',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				Person: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'wallet',
						type: 'address',
					},
				],
				Mail: [
					{
						name: 'from',
						type: 'Person',
					},
					{
						name: 'to',
						type: 'Person',
					},
					{
						name: 'contents',
						type: 'string',
					},
				],
			},
			primaryType: 'Mail',
			domain: {
				name: 'Ether Mail',
				version: '1',
				chainId: 1,
				verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				from: {
					name: 'Cow',
					wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
				},
				to: {
					name: 'Bob',
					wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
				},
				contents: 'Hello, Bob!',
			},
		},
		undefined,
		'0x1901f2cee375fa42b42143804025fc449deafd50cc031ca257e0b194a650a912090fc52c0ee5d84264471806290a3f2c4cecfc5490626bf912d01f240d7a274b371e',
	],
	[
		'should get encoded message without hashing, hash = false',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				Person: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'wallet',
						type: 'address',
					},
				],
				Mail: [
					{
						name: 'from',
						type: 'Person',
					},
					{
						name: 'to',
						type: 'Person',
					},
					{
						name: 'contents',
						type: 'string',
					},
				],
			},
			primaryType: 'Mail',
			domain: {
				name: 'Ether Mail',
				version: '1',
				chainId: 1,
				verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				from: {
					name: 'Cow',
					wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
				},
				to: {
					name: 'Bob',
					wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
				},
				contents: 'Hello, Bob!',
			},
		},
		false,
		'0x1901f2cee375fa42b42143804025fc449deafd50cc031ca257e0b194a650a912090fc52c0ee5d84264471806290a3f2c4cecfc5490626bf912d01f240d7a274b371e',
	],
	[
		'should get the hashed encoded message, hash = true',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				Person: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'wallet',
						type: 'address',
					},
				],
				Mail: [
					{
						name: 'from',
						type: 'Person',
					},
					{
						name: 'to',
						type: 'Person',
					},
					{
						name: 'contents',
						type: 'string',
					},
				],
			},
			primaryType: 'Mail',
			domain: {
				name: 'Ether Mail',
				version: '1',
				chainId: 1,
				verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				from: {
					name: 'Cow',
					wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
				},
				to: {
					name: 'Bob',
					wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
				},
				contents: 'Hello, Bob!',
			},
		},
		true,
		'0xbe609aee343fb3c4b28e1df9e632fca64fcfaede20f02e86244efddf30957bd2',
	],
	[
		'should get encoded message with array types',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				ArrayData: [
					{
						name: 'array1',
						type: 'string[]',
					},
					{
						name: 'array2',
						type: 'address[]',
					},
					{
						name: 'array3',
						type: 'uint256[]',
					},
				],
			},
			primaryType: 'ArrayData',
			domain: {
				name: 'Array Data',
				version: '1',
				chainId: 1,
				verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				array1: ['string', 'string2', 'string3'],
				array2: [
					'0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
					'0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
					'0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
				],
				array3: [123456, 654321, 42],
			},
		},
		false,
		'0x1901928e4773f1f7243172cd0dd213906be49eb9d275e09c8bd0575921c51ba00058596a0bafab67b5b49cfe99456c50dd5b6294b1383e4f17c6e5c3c14afee96ac3',
	],
	[
		'should get encoded message with array types',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				ArrayData: [
					{
						name: 'array1',
						type: 'string[]',
					},
					{
						name: 'array2',
						type: 'address[]',
					},
					{
						name: 'array3',
						type: 'uint256[]',
					},
				],
			},
			primaryType: 'ArrayData',
			domain: {
				name: 'Array Data',
				version: '1',
				chainId: 1,
				verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				array1: ['string', 'string2', 'string3'],
				array2: [
					'0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
					'0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
					'0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
				],
				array3: [123456, 654321, 42],
			},
		},
		true,
		'0x3e4d581a408c8c2fa8775017c26e0127df030593d83a8202e6c19b3380bde3da',
	],
	[
		'should get encoded message with fixed array',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				ArrayData: [
					{
						name: 'array1',
						type: 'string[]',
					},
					{
						name: 'array2',
						type: 'address[3]',
					},
					{
						name: 'array3',
						type: 'uint256[]',
					},
				],
			},
			primaryType: 'ArrayData',
			domain: {
				name: 'Array Data',
				version: '1',
				chainId: 1,
				verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				array1: ['string', 'string2', 'string3'],
				array2: [
					'0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
					'0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
					'0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
				],
				array3: [123456, 654321, 42],
			},
		},
		false,
		'0x1901928e4773f1f7243172cd0dd213906be49eb9d275e09c8bd0575921c51ba00058b068b45d685c16bc9ef637106b4fd3a4fb9aa259f53218491a3d9eb65b1b574c',
	],
	[
		'should get encoded message with fixed array',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				ArrayData: [
					{
						name: 'array1',
						type: 'string[]',
					},
					{
						name: 'array2',
						type: 'address[3]',
					},
					{
						name: 'array3',
						type: 'uint256[]',
					},
				],
			},
			primaryType: 'ArrayData',
			domain: {
				name: 'Array Data',
				version: '1',
				chainId: 1,
				verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				array1: ['string', 'string2', 'string3'],
				array2: [
					'0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
					'0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
					'0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
				],
				array3: [123456, 654321, 42],
			},
		},
		true,
		'0x133d00e67f2390ce846a631aeb6718a674a3923f5320b79b6d3e2f5bf146319e',
	],
	[
		'should get encoded message with bytes32',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				ArrayData: [
					{
						name: 'bytes32',
						type: 'bytes32',
					},
				],
			},
			primaryType: 'ArrayData',
			domain: {
				name: 'Array Data',
				version: '1',
				chainId: 1,
				verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				bytes32: '0x133d00e67f2390ce846a631aeb6718a674a3923f5320b79b6d3e2f5bf146319e',
			},
		},
		false,
		'0x1901928e4773f1f7243172cd0dd213906be49eb9d275e09c8bd0575921c51ba000587c9d26380d51aac5dc2ff6f794d1c043ea4259bb42068f70f79d2e4849133ac3',
	],
	[
		'should get encoded message with bytes32',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				ArrayData: [
					{
						name: 'bytes32',
						type: 'bytes',
					},
				],
			},
			primaryType: 'ArrayData',
			domain: {
				name: 'Array Data',
				version: '1',
				chainId: 1,
				verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				bytes32: '0x133d00e67f2390ce846a631aeb6718a674a3923f5320b79b6d3e2f5bf146319e',
			},
		},
		false,
		'0x1901928e4773f1f7243172cd0dd213906be49eb9d275e09c8bd0575921c51ba00058353ed034fd1df0cd409a19133f4a89f5e99ddc735ad3fbb767d0bb72c97ef175',
	],
	[
		'should get encoded message with bytes32',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				ArrayData: [
					{
						name: 'bytes32',
						type: 'bytes32',
					},
				],
			},
			primaryType: 'ArrayData',
			domain: {
				name: 'Array Data',
				version: '1',
				chainId: 1,
				verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				bytes32: '0x133d00e67f2390ce846a631aeb6718a674a3923f5320b79b6d3e2f5bf146319e',
			},
		},
		true,
		'0xa6cd048c02ef3cb70feee1bd9795decbbc8b431b976dfc86e3b09e55e0d2a3f3',
	],
];

/**
 * string is the test title
 * Eip712TypedData is the entire EIP-712 typed data object
 * boolean is whether the EIP-712 encoded data is keccak256 hashed
 * string is the encoded data expected to be returned by getEncodedEip712Data
 */
export const erroneousTestData: [string, Eip712TypedData, boolean | undefined, Error][] = [
	[
		'should throw error: Cannot encode data: value is not of array type',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				ArrayData: [
					{
						name: 'array1',
						type: 'string[]',
					},
					{
						name: 'array2',
						type: 'address[]',
					},
					{
						name: 'array3',
						type: 'uint256[]',
					},
				],
			},
			primaryType: 'ArrayData',
			domain: {
				name: 'Array Data',
				version: '1',
				chainId: 1,
				verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				array1: ['string', 'string2', 'string3'],
				array2: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
				array3: [123456, 654321, 42],
			},
		},
		false,
		new Error('Cannot encode data: value is not of array type'),
	],
	[
		'should throw error: Cannot encode data: expected length of 3, but got 1',
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				ArrayData: [
					{
						name: 'array1',
						type: 'string[]',
					},
					{
						name: 'array2',
						type: 'address[3]',
					},
					{
						name: 'array3',
						type: 'uint256[]',
					},
				],
			},
			primaryType: 'ArrayData',
			domain: {
				name: 'Array Data',
				version: '1',
				chainId: 1,
				verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				array1: ['string', 'string2', 'string3'],
				array2: ['0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'],
				array3: [123456, 654321, 42],
			},
		},
		false,
		new Error('Cannot encode data: expected length of 3, but got 1'),
	],
	[
		"should throw error: Cannot encode data: missing data for 'array3'",
		{
			types: {
				EIP712Domain: [
					{
						name: 'name',
						type: 'string',
					},
					{
						name: 'version',
						type: 'string',
					},
					{
						name: 'chainId',
						type: 'uint256',
					},
					{
						name: 'verifyingContract',
						type: 'address',
					},
				],
				ArrayData: [
					{
						name: 'array1',
						type: 'string[]',
					},
					{
						name: 'array2',
						type: 'address[]',
					},
					{
						name: 'array3',
						type: 'uint256[]',
					},
				],
			},
			primaryType: 'ArrayData',
			domain: {
				name: 'Array Data',
				version: '1',
				chainId: 1,
				verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
			},
			message: {
				array1: ['string', 'string2', 'string3'],
				array2: ['0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'],
				array3: undefined,
			},
		},
		false,
		new Error("Cannot encode data: missing data for 'array3'"),
	],
];
