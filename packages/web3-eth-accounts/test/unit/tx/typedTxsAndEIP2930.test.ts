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
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { bytesToHex, hexToBytes, uint8ArrayEquals, uint8ArrayConcat } from 'web3-utils';
import {
	AccessListEIP2930Transaction,
	AccessListUint8ArrayItem,
	FeeMarketEIP1559Transaction,
} from '../../../src';
import { Chain, Common, Hardfork, uint8ArrayToBigInt } from '../../../src/common';
import { Address } from '../../../src/tx/address';
import { MAX_INTEGER, MAX_UINT64, SECP256K1_ORDER_DIV_2 } from '../../../src/tx/constants';

import type { AccessList } from '../../../src';

const privateToPublic = (privateKey: Uint8Array): Uint8Array => {
	return secp256k1.getPublicKey(privateKey, false).slice(1);
};
const pKey = hexToBytes('4646464646464646464646464646464646464646464646464646464646464646');
const address = Address.publicToAddress(privateToPublic(pKey));

const common = new Common({
	chain: Chain.Mainnet,
	hardfork: Hardfork.London,
});

const txTypes = [
	{
		class: AccessListEIP2930Transaction,
		name: 'AccessListEIP2930Transaction',
		type: 1,
	},
	{
		class: FeeMarketEIP1559Transaction,
		name: 'FeeMarketEIP1559Transaction',
		type: 2,
	},
];

const validAddress = hexToBytes('01'.repeat(20));
const validSlot = hexToBytes('01'.repeat(32));
const chainId = BigInt(1);

describe('[AccessListEIP2930Transaction / FeeMarketEIP1559Transaction] -> EIP-2930 Compatibility', () => {
	it('Initialization / Getter -> fromTxData()', () => {
		for (const txType of txTypes) {
			let tx = txType.class.fromTxData({}, { common });
			expect(tx).toBeTruthy();

			tx = txType.class.fromTxData({
				chainId: 5,
			});
			expect(tx.common.chainId() === BigInt(5)).toBeTruthy();

			tx = txType.class.fromTxData({
				chainId: 99999,
			});
			expect(tx.common.chainId() === BigInt(99999)).toBeTruthy();

			const nonEIP2930Common = new Common({
				chain: Chain.Mainnet,
				hardfork: Hardfork.Istanbul,
			});
			expect(() => {
				txType.class.fromTxData({}, { common: nonEIP2930Common });
			}).toThrow();

			expect(() => {
				txType.class.fromTxData(
					{
						chainId: chainId + BigInt(1),
					},
					{ common },
				);
			}).toThrow();

			expect(() => {
				txType.class.fromTxData(
					{
						v: 2,
					},
					{ common },
				);
			}).toThrow();
		}
	});

	it('cannot input decimal values', () => {
		const values = ['chainId', 'nonce', 'gasPrice', 'gasLimit', 'value', 'v', 'r', 's'];
		const cases = [
			10.1,
			'10.1',
			'0xaa.1',
			-10.1,
			-1,
			BigInt(-10),
			'-100',
			'-10.1',
			'-0xaa',
			Infinity,
			-Infinity,
			NaN,
			{},
			true,
			false,
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			() => {},
			Number.MAX_SAFE_INTEGER + 1,
		];
		for (const value of values) {
			const txData: any = {};
			for (const testCase of cases) {
				if (
					value === 'chainId' &&
					((typeof testCase === 'number' && Number.isNaN(testCase)) || testCase === false)
				) {
					continue;
				}
				txData[value] = testCase;
				expect(() => {
					AccessListEIP2930Transaction.fromTxData(txData);
				}).toThrow();
			}
		}
	});

	it('Initialization / Getter -> fromSerializedTx()', () => {
		for (const txType of txTypes) {
			expect(() => {
				txType.class.fromSerializedTx(new Uint8Array([99]), {});
			}).toThrow('wrong tx type');

			expect(() => {
				// Correct tx type + RLP-encoded 5
				const serialized = uint8ArrayConcat(
					new Uint8Array([txType.type]),
					new Uint8Array([5]),
				);
				txType.class.fromSerializedTx(serialized, {});
			}).toThrow('must be array');

			expect(() => {
				const serialized = uint8ArrayConcat(
					new Uint8Array([txType.type]),
					hexToBytes('c0'),
				);
				txType.class.fromSerializedTx(serialized, {});
			}).toThrow('values (for unsigned tx)');
		}
	});

	it('Access Lists -> success cases', () => {
		for (const txType of txTypes) {
			const access: AccessList = [
				{
					address: bytesToHex(validAddress),
					storageKeys: [bytesToHex(validSlot)],
				},
			];
			const txn = txType.class.fromTxData(
				{
					accessList: access,
					chainId: 1,
				},
				{ common },
			);

			// Check if everything is converted

			const Uint8Array = txn.accessList;
			const JSON = txn.AccessListJSON;

			expect(uint8ArrayEquals(Uint8Array[0][0], validAddress)).toBeTruthy();
			expect(uint8ArrayEquals(Uint8Array[0][1][0], validSlot)).toBeTruthy();

			expect(JSON).toEqual(access);

			// also verify that we can always get the json access list, even if we don't provide one.

			const txnRaw = txType.class.fromTxData(
				{
					accessList: Uint8Array,
					chainId: 1,
				},
				{ common },
			);

			const JSONRaw = txnRaw.AccessListJSON;

			expect(JSONRaw).toEqual(access);
		}
	});

	it('Access Lists -> error cases', () => {
		for (const txType of txTypes) {
			let accessList: any[] = [
				[
					hexToBytes('01'.repeat(21)), // Address of 21 bytes instead of 20
					[],
				],
			];

			expect(() => {
				txType.class.fromTxData({ chainId, accessList }, { common });
			}).toThrow();

			accessList = [
				[
					validAddress,
					[
						hexToBytes('01'.repeat(31)), // Slot of 31 bytes instead of 32
					],
				],
			];

			expect(() => {
				txType.class.fromTxData({ chainId, accessList }, { common });
			}).toThrow();

			accessList = [[]]; // Address does not exist

			expect(() => {
				txType.class.fromTxData({ chainId, accessList }, { common });
			}).toThrow();

			accessList = [[validAddress]]; // Slots does not exist

			expect(() => {
				txType.class.fromTxData({ chainId, accessList }, { common });
			}).toThrow();

			accessList = [[validAddress, validSlot]]; // Slots is not an array

			expect(() => {
				txType.class.fromTxData({ chainId, accessList }, { common });
			}).toThrow();

			accessList = [[validAddress, [], []]]; // 3 items where 2 are expected

			expect(() => {
				txType.class.fromTxData({ chainId, accessList }, { common });
			}).toThrow();
		}
	});

	it('sign()', () => {
		for (const txType of txTypes) {
			let tx = txType.class.fromTxData(
				{
					data: hexToBytes('010200'),
					to: validAddress,
					accessList: [[validAddress, [validSlot]]],
					chainId,
				},
				{ common },
			);
			let signed = tx.sign(pKey);
			const signedAddress = signed.getSenderAddress();
			expect(uint8ArrayEquals(signedAddress.buf, address)).toBeTruthy();
			// expect(signedAddress).toEqual(Address.publicToAddress(Buffer.from(address)));
			signed.verifySignature(); // If this throws, test will not end.

			tx = txType.class.fromTxData({}, { common });
			signed = tx.sign(pKey);

			expect(tx.accessList).toEqual([]);
			expect(signed.accessList).toEqual([]);

			tx = txType.class.fromTxData({}, { common });

			expect(() => {
				tx.hash();
			}).toThrow();

			expect(() => {
				tx.getSenderPublicKey();
			}).toThrow();

			expect(() => {
				const high = SECP256K1_ORDER_DIV_2 + BigInt(1);
				const _tx = txType.class.fromTxData({ s: high, r: 1, v: 1 }, { common });
				const _signed = _tx.sign(pKey);
				_signed.getSenderPublicKey();
			}).toThrow();
		}
	});

	it('getDataFee()', () => {
		for (const txType of txTypes) {
			let tx = txType.class.fromTxData({}, { common });
			expect(tx.getDataFee()).toEqual(BigInt(0));

			tx = txType.class.fromTxData({}, { common, freeze: false });
			expect(tx.getDataFee()).toEqual(BigInt(0));

			const mutableCommon = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London });
			tx = txType.class.fromTxData({}, { common: mutableCommon });
			tx.common.setHardfork(Hardfork.Istanbul);
			expect(tx.getDataFee()).toEqual(BigInt(0));
		}
	});
});

describe('[AccessListEIP2930Transaction] -> Class Specific Tests', () => {
	it('Initialization', () => {
		const tx = AccessListEIP2930Transaction.fromTxData({}, { common });
		expect(AccessListEIP2930Transaction.fromTxData(tx, { common })).toBeTruthy();

		const _validAddress = hexToBytes('01'.repeat(20));
		const _validSlot = hexToBytes('01'.repeat(32));
		const _chainId = BigInt(1);
		expect(() => {
			AccessListEIP2930Transaction.fromTxData(
				{
					data: hexToBytes('010200'),
					to: _validAddress,
					accessList: [[_validAddress, [_validSlot]]],
					chainId: _chainId,
					gasLimit: MAX_UINT64,
					gasPrice: MAX_INTEGER,
				},
				{ common },
			);
		}).toThrow('gasLimit * gasPrice cannot exceed MAX_INTEGER');

		const uint8Array = new Uint8Array([]);
		const _address = new Uint8Array([]);
		const storageKeys = [new Uint8Array([]), new Uint8Array([])];
		const aclBuf: AccessListUint8ArrayItem = [_address, storageKeys];
		expect(() => {
			AccessListEIP2930Transaction.fromValuesArray(
				[
					uint8Array,
					uint8Array,
					uint8Array,
					uint8Array,
					uint8Array,
					uint8Array,
					uint8Array,
					[aclBuf],
					uint8Array,
				],
				{},
			);
		}).toThrow();
	});

	it('should return right upfront cost', () => {
		let tx = AccessListEIP2930Transaction.fromTxData(
			{
				data: hexToBytes('010200'),
				to: validAddress,
				accessList: [[validAddress, [validSlot]]],
				chainId,
			},
			{ common },
		);
		// Cost should be:
		// Base fee + 2*TxDataNonZero + TxDataZero + AccessListAddressCost + AccessListSlotCost
		const txDataZero = Number(common.param('gasPrices', 'txDataZero'));
		const txDataNonZero = Number(common.param('gasPrices', 'txDataNonZero'));
		const accessListStorageKeyCost = Number(
			common.param('gasPrices', 'accessListStorageKeyCost'),
		);
		const accessListAddressCost = Number(common.param('gasPrices', 'accessListAddressCost'));
		const baseFee = Number(common.param('gasPrices', 'tx'));
		const creationFee = Number(common.param('gasPrices', 'txCreation'));

		expect(
			tx.getBaseFee() ===
				BigInt(
					txDataNonZero * 2 +
						txDataZero +
						baseFee +
						accessListAddressCost +
						accessListStorageKeyCost,
				),
		).toBeTruthy();

		// In this Tx, `to` is `undefined`, so we should charge homestead creation gas.
		tx = AccessListEIP2930Transaction.fromTxData(
			{
				data: hexToBytes('010200'),
				accessList: [[validAddress, [validSlot]]],
				chainId,
			},
			{ common },
		);

		expect(
			tx.getBaseFee() ===
				BigInt(
					txDataNonZero * 2 +
						txDataZero +
						creationFee +
						baseFee +
						accessListAddressCost +
						accessListStorageKeyCost,
				),
		).toBeTruthy();

		// Explicitly check that even if we have duplicates in our list, we still charge for those
		tx = AccessListEIP2930Transaction.fromTxData(
			{
				to: validAddress,
				accessList: [
					[validAddress, [validSlot]],
					[validAddress, [validSlot, validSlot]],
				],
				chainId,
			},
			{ common },
		);

		expect(
			tx.getBaseFee() ===
				BigInt(baseFee + accessListAddressCost * 2 + accessListStorageKeyCost * 3),
		).toBeTruthy();
	});

	it('getUpfrontCost() -> should return upfront cost', () => {
		const tx = AccessListEIP2930Transaction.fromTxData(
			{
				gasPrice: 1000,
				gasLimit: 10000000,
				value: 42,
			},
			{ common },
		);
		expect(tx.getUpfrontCost()).toEqual(BigInt(10000000042));
	});

	it('unsigned tx -> getMessageToSign()', () => {
		const unsignedTx = AccessListEIP2930Transaction.fromTxData(
			{
				data: hexToBytes('010200'),
				to: validAddress,
				accessList: [[validAddress, [validSlot]]],
				chainId,
			},
			{ common },
		);
		const expectedHash = hexToBytes(
			'0x78528e2724aa359c58c13e43a7c467eb721ce8d410c2a12ee62943a3aaefb60b',
		);
		expect(unsignedTx.getMessageToSign(true)).toEqual(expectedHash);

		const expectedSerialization = hexToBytes(
			'0x01f858018080809401010101010101010101010101010101010101018083010200f838f7940101010101010101010101010101010101010101e1a00101010101010101010101010101010101010101010101010101010101010101',
		);
		expect(unsignedTx.getMessageToSign(false)).toEqual(expectedSerialization);
	});

	// Data from
	// https://github.com/INFURA/go-ethlibs/blob/75b2a52a39d353ed8206cffaf68d09bd1b154aae/eth/transaction_signing_test.go#L87

	it('should sign transaction correctly and return expected JSON', () => {
		const _address = hexToBytes('0000000000000000000000000000000000001337');
		const slot1 = hexToBytes(
			'0000000000000000000000000000000000000000000000000000000000000000',
		);
		const txData = {
			data: hexToBytes(''),
			gasLimit: 0x62d4,
			gasPrice: 0x3b9aca00,
			nonce: 0x00,
			to: new Address(hexToBytes('df0a88b2b68c673713a8ec826003676f272e3573')),
			value: 0x01,
			chainId: uint8ArrayToBigInt(hexToBytes('796f6c6f763378')),
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			accessList: <any>[[_address, [slot1]]],
		};

		const customChainParams = {
			name: 'custom',
			chainId: txData.chainId,
			eips: [2718, 2929, 2930],
		};
		const usedCommon = Common.custom(customChainParams, {
			baseChain: Chain.Mainnet,
			hardfork: Hardfork.Berlin,
		});
		usedCommon.setEIPs([2718, 2929, 2930]);

		const expectedUnsignedRaw = hexToBytes(
			'01f86587796f6c6f76337880843b9aca008262d494df0a88b2b68c673713a8ec826003676f272e35730180f838f7940000000000000000000000000000000000001337e1a00000000000000000000000000000000000000000000000000000000000000000808080',
		);
		const pkey = hexToBytes('fad9c8855b740a0b7ed4c221dbad0f33a83a49cad6b3fe8d5817ac83d38b6a19');
		const expectedSigned = hexToBytes(
			'01f8a587796f6c6f76337880843b9aca008262d494df0a88b2b68c673713a8ec826003676f272e35730180f838f7940000000000000000000000000000000000001337e1a0000000000000000000000000000000000000000000000000000000000000000080a0294ac94077b35057971e6b4b06dfdf55a6fbed819133a6c1d31e187f1bca938da00be950468ba1c25a5cb50e9f6d8aa13c8cd21f24ba909402775b262ac76d374d',
		);
		const expectedHash = hexToBytes(
			'bbd570a3c6acc9bb7da0d5c0322fe4ea2a300db80226f7df4fef39b2d6649eec',
		);
		const v = BigInt(0);
		const r = uint8ArrayToBigInt(
			hexToBytes('294ac94077b35057971e6b4b06dfdf55a6fbed819133a6c1d31e187f1bca938d'),
		);
		const s = uint8ArrayToBigInt(
			hexToBytes('0be950468ba1c25a5cb50e9f6d8aa13c8cd21f24ba909402775b262ac76d374d'),
		);

		const unsignedTx = AccessListEIP2930Transaction.fromTxData(txData, { common: usedCommon });

		const serializedMessageRaw = unsignedTx.serialize();

		expect(uint8ArrayEquals(expectedUnsignedRaw, serializedMessageRaw)).toBeTruthy();

		const signed = unsignedTx.sign(pkey);

		expect(v === signed.v!).toBeTruthy();
		expect(r === signed.r!).toBeTruthy();
		expect(s === signed.s!).toBeTruthy();
		expect(uint8ArrayEquals(expectedSigned, signed.serialize())).toBeTruthy();
		expect(uint8ArrayEquals(expectedHash, signed.hash())).toBeTruthy();

		const expectedJSON = {
			chainId: '0x796f6c6f763378',
			nonce: '0x0',
			gasPrice: '0x3b9aca00',
			gasLimit: '0x62d4',
			to: '0xdf0a88b2b68c673713a8ec826003676f272e3573',
			value: '0x1',
			data: '0x',
			accessList: [
				{
					address: '0x0000000000000000000000000000000000001337',
					storageKeys: [
						'0x0000000000000000000000000000000000000000000000000000000000000000',
					],
				},
			],
			v: '0x0',
			r: '0x294ac94077b35057971e6b4b06dfdf55a6fbed819133a6c1d31e187f1bca938d',
			s: '0xbe950468ba1c25a5cb50e9f6d8aa13c8cd21f24ba909402775b262ac76d374d',
		};

		expect(signed.toJSON()).toEqual(expectedJSON);
	});

	it('freeze property propagates from unsigned tx to signed tx', () => {
		const tx = AccessListEIP2930Transaction.fromTxData({}, { freeze: false });
		expect(Object.isFrozen(tx)).toBe(false);
		const signedTxn = tx.sign(pKey);
		expect(Object.isFrozen(signedTxn)).toBe(false);
	});

	it('common propagates from the common of tx, not the common in TxOptions', () => {
		const txn = AccessListEIP2930Transaction.fromTxData({}, { common, freeze: false });
		const newCommon = new Common({
			chain: Chain.Mainnet,
			hardfork: Hardfork.London,
			eips: [2537],
		});
		expect(newCommon).not.toEqual(common);
		Object.defineProperty(txn, 'common', {
			get() {
				return newCommon;
			},
		});
		const signedTxn = txn.sign(pKey);
		expect(signedTxn.common.eips().includes(2537)).toBeTruthy();
	});
});
