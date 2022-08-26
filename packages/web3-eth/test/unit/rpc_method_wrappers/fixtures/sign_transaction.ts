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
	HexStringBytes,
	SignedTransactionInfoAPI,
	Transaction,
	TransactionSignedAPI,
} from 'web3-types';
import { FMT_BYTES, FMT_NUMBER } from 'web3-utils';
import { decodeSignedTransaction } from '../../../../src/utils/decode_signed_transaction';

const rawLegacyTransaction: Transaction = {
	type: '0x0',
	nonce: '0x0',
	gasPrice: '0x3b9aca01',
	gasLimit: '0x5208',
	value: '0x1',
	input: '0x',
	to: '0x0000000000000000000000000000000000000000',
};
const signedLegacyTransaction: Transaction = {
	...rawLegacyTransaction,
	v: '0xa95',
	r: '0xddb601f46a2232d9863f96bf8dabc8fd29d96c880d99f6c763465446f75a71e5',
	s: '0x28e3bd580f589a75a3d8d6cf85283692bb52830baba879f153266fda0182882c',
};
const legacySignedTransactionInfo = {
	raw: '0xf86580843b9aca018252089400000000000000000000000000000000000000000180820a95a0ddb601f46a2232d9863f96bf8dabc8fd29d96c880d99f6c763465446f75a71e5a028e3bd580f589a75a3d8d6cf85283692bb52830baba879f153266fda0182882c',
	tx: signedLegacyTransaction as TransactionSignedAPI,
};

const rawType0x1Transaction: Transaction = {
	from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
	type: '0x1',
	nonce: '0x0',
	gasPrice: '0x3b9aca01',
	gasLimit: '0x5208',
	value: '0x1',
	input: '0x',
	to: '0x0000000000000000000000000000000000000000',
	accessList: [
		{
			address: '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
			storageKeys: [
				'0x0000000000000000000000000000000000000000000000000000000000000003',
				'0x0000000000000000000000000000000000000000000000000000000000000007',
			],
		},
		{
			address: '0xbb9bc244d798123fde783fcc1c72d3bb8c189413',
			storageKeys: [],
		},
	],
};
const signedType0x1Transaction: Transaction = {
	...rawType0x1Transaction,
	v: '0x0',
	r: '0xecfaaf5659c3d126d5cdf537bb29fa0a28c1fce7651b64cf3106e4a156549b3e',
	s: '0x75b26402a0c72d108cade9c641889ee21189129d5495964e3f42267db4aa837b',
};
const type0x1SignedTransactionInfo = {
	raw: '0x01f8da82053980843b9aca018252089400000000000000000000000000000000000000000180f872f85994de0b295669a9fd93d5f28d9ec85e40f4cb697baef842a00000000000000000000000000000000000000000000000000000000000000003a00000000000000000000000000000000000000000000000000000000000000007d694bb9bc244d798123fde783fcc1c72d3bb8c189413c080a0ecfaaf5659c3d126d5cdf537bb29fa0a28c1fce7651b64cf3106e4a156549b3ea075b26402a0c72d108cade9c641889ee21189129d5495964e3f42267db4aa837b',
	tx: signedType0x1Transaction as TransactionSignedAPI,
};

const rawType0x2Transaction: Transaction = {
	from: '0x6E599DA0bfF7A6598AC1224E4985430Bf16458a4',
	type: '0x2',
	nonce: '0x0',
	gasPrice: '0x3b9aca01',
	gasLimit: '0x5208',
	value: '0x1',
	input: '0x',
	to: '0x0000000000000000000000000000000000000000',
	accessList: [
		{
			address: '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
			storageKeys: [
				'0x0000000000000000000000000000000000000000000000000000000000000003',
				'0x0000000000000000000000000000000000000000000000000000000000000007',
			],
		},
		{
			address: '0xbb9bc244d798123fde783fcc1c72d3bb8c189413',
			storageKeys: [],
		},
	],
};
const signedType0x2Transaction: Transaction = {
	...rawType0x2Transaction,
	v: '0x0',
	r: '0xcee64249a5d244614de658ac37c2c2e9e3ba232814401d29d234c57a79ff24a7',
	s: '0x2cb0a134943392ebc71c3ff2b8d8d3defaa1d2f0cb5f65311119bcaeff546034',
};
const type0x2SignedTransactionInfo = {
	raw: '0x02f8db820539808252088252088252089400000000000000000000000000000000000000000180f872f85994de0b295669a9fd93d5f28d9ec85e40f4cb697baef842a00000000000000000000000000000000000000000000000000000000000000003a00000000000000000000000000000000000000000000000000000000000000007d694bb9bc244d798123fde783fcc1c72d3bb8c189413c080a0b2c321d81024278c17476072d576450a415179e355a247bab30f24052210f20ea066878fda7e04c5993c80cab324456a3c90ad0f8953fe2e64c91255f75ba2b540',
	tx: signedType0x2Transaction as TransactionSignedAPI,
};

export const returnFormat = { number: FMT_NUMBER.STR, bytes: FMT_BYTES.BUFFER };

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - transaction
 * 	   - SignedTransactionInfoAPI or HexStringBytes (i.e. SignedTransactionInfoAPI.raw)
 *     - Formatted SignedTransactionInfoAPI
 */
type TestData = [
	string,
	[Transaction, SignedTransactionInfoAPI | HexStringBytes, SignedTransactionInfoAPI],
];
export const testData: TestData[] = [
	[
		JSON.stringify(rawLegacyTransaction),
		[
			rawLegacyTransaction,
			legacySignedTransactionInfo,
			decodeSignedTransaction(legacySignedTransactionInfo.raw, returnFormat),
		],
	],
	[
		JSON.stringify(rawLegacyTransaction),
		[
			rawLegacyTransaction,
			legacySignedTransactionInfo.raw,
			decodeSignedTransaction(legacySignedTransactionInfo.raw, returnFormat),
		],
	],
	[
		JSON.stringify(rawType0x1Transaction),
		[
			rawType0x1Transaction,
			type0x1SignedTransactionInfo,
			decodeSignedTransaction(type0x1SignedTransactionInfo.raw, returnFormat),
		],
	],
	[
		JSON.stringify(rawType0x1Transaction),
		[
			rawType0x1Transaction,
			type0x1SignedTransactionInfo.raw,
			decodeSignedTransaction(type0x1SignedTransactionInfo.raw, returnFormat),
		],
	],
	[
		JSON.stringify(rawType0x2Transaction),
		[
			rawType0x2Transaction,
			type0x2SignedTransactionInfo,
			decodeSignedTransaction(type0x2SignedTransactionInfo.raw, returnFormat),
		],
	],
	[
		JSON.stringify(rawType0x2Transaction),
		[
			rawType0x2Transaction,
			type0x2SignedTransactionInfo.raw,
			decodeSignedTransaction(type0x2SignedTransactionInfo.raw, returnFormat),
		],
	],
];
