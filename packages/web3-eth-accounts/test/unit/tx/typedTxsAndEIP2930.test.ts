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
import { Point } from 'ethereum-cryptography/secp256k1';
import { Chain, Common, Hardfork } from '../../../src/common';
import {
	bufferToBigInt,
	bufferToHex,
	AccessListEIP2930Transaction,
	FeeMarketEIP1559Transaction,
} from '../../../src';
import { Address } from '../../../src/tx/address';
import { MAX_INTEGER, MAX_UINT64, SECP256K1_ORDER_DIV_2 } from '../../../src/tx/constants';

import type { AccessList, AccessListBufferItem } from '../../../src';

const privateToPublic = function (privateKey: Buffer): Buffer {
	return Buffer.from(Point.fromPrivateKey(privateKey).toRawBytes(false).slice(1));
};
const pKey = Buffer.from('4646464646464646464646464646464646464646464646464646464646464646', 'hex');
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

const validAddress = Buffer.from('01'.repeat(20), 'hex');
const validSlot = Buffer.from('01'.repeat(32), 'hex');
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
				txType.class.fromSerializedTx(Buffer.from([99]), {});
			}).toThrow('wrong tx type');

			expect(() => {
				// Correct tx type + RLP-encoded 5
				const serialized = Buffer.concat([Buffer.from([txType.type]), Buffer.from([5])]);
				txType.class.fromSerializedTx(serialized, {});
			}).toThrow('must be array');

			expect(() => {
				const serialized = Buffer.concat([
					Buffer.from([txType.type]),
					Buffer.from('c0', 'hex'),
				]);
				txType.class.fromSerializedTx(serialized, {});
			}).toThrow('values (for unsigned tx)');
		}
	});

	it('Access Lists -> success cases', () => {
		for (const txType of txTypes) {
			const access: AccessList = [
				{
					address: bufferToHex(validAddress),
					storageKeys: [bufferToHex(validSlot)],
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

			const BufferArray = txn.accessList;
			const JSON = txn.AccessListJSON;

			expect(BufferArray[0][0].equals(validAddress)).toBeTruthy();
			expect(BufferArray[0][1][0].equals(validSlot)).toBeTruthy();

			expect(JSON).toEqual(access);

			// also verify that we can always get the json access list, even if we don't provide one.

			const txnRaw = txType.class.fromTxData(
				{
					accessList: BufferArray,
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
					Buffer.from('01'.repeat(21), 'hex'), // Address of 21 bytes instead of 20
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
						Buffer.from('01'.repeat(31), 'hex'), // Slot of 31 bytes instead of 32
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
					data: Buffer.from('010200', 'hex'),
					to: validAddress,
					accessList: [[validAddress, [validSlot]]],
					chainId,
				},
				{ common },
			);
			let signed = tx.sign(pKey);
			const signedAddress = signed.getSenderAddress();
			expect(signedAddress.buf.equals(address)).toBeTruthy();
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

		const _validAddress = Buffer.from('01'.repeat(20), 'hex');
		const _validSlot = Buffer.from('01'.repeat(32), 'hex');
		const _chainId = BigInt(1);
		expect(() => {
			AccessListEIP2930Transaction.fromTxData(
				{
					data: Buffer.from('010200', 'hex'),
					to: _validAddress,
					accessList: [[_validAddress, [_validSlot]]],
					chainId: _chainId,
					gasLimit: MAX_UINT64,
					gasPrice: MAX_INTEGER,
				},
				{ common },
			);
		}).toThrow('gasLimit * gasPrice cannot exceed MAX_INTEGER');

		const buffer = Buffer.from([]);
		const _address = Buffer.from([]);
		const storageKeys = [Buffer.from([]), Buffer.from([])];
		const aclBuf: AccessListBufferItem = [_address, storageKeys];
		expect(() => {
			AccessListEIP2930Transaction.fromValuesArray(
				[buffer, buffer, buffer, buffer, buffer, buffer, buffer, [aclBuf], buffer],
				{},
			);
		}).toThrow();
	});

	it('should return right upfront cost', () => {
		let tx = AccessListEIP2930Transaction.fromTxData(
			{
				data: Buffer.from('010200', 'hex'),
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
				data: Buffer.from('010200', 'hex'),
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
				data: Buffer.from('010200', 'hex'),
				to: validAddress,
				accessList: [[validAddress, [validSlot]]],
				chainId,
			},
			{ common },
		);
		const expectedHash = Buffer.from(
			'78528e2724aa359c58c13e43a7c467eb721ce8d410c2a12ee62943a3aaefb60b',
			'hex',
		);
		expect(unsignedTx.getMessageToSign(true)).toEqual(expectedHash);

		const expectedSerialization = Buffer.from(
			'01f858018080809401010101010101010101010101010101010101018083010200f838f7940101010101010101010101010101010101010101e1a00101010101010101010101010101010101010101010101010101010101010101',
			'hex',
		);
		expect(unsignedTx.getMessageToSign(false)).toEqual(expectedSerialization);
	});

	// Data from
	// https://github.com/INFURA/go-ethlibs/blob/75b2a52a39d353ed8206cffaf68d09bd1b154aae/eth/transaction_signing_test.go#L87

	it('should sign transaction correctly and return expected JSON', () => {
		const _address = Buffer.from('0000000000000000000000000000000000001337', 'hex');
		const slot1 = Buffer.from(
			'0000000000000000000000000000000000000000000000000000000000000000',
			'hex',
		);
		const txData = {
			data: Buffer.from('', 'hex'),
			gasLimit: 0x62d4,
			gasPrice: 0x3b9aca00,
			nonce: 0x00,
			to: new Address(Buffer.from('df0a88b2b68c673713a8ec826003676f272e3573', 'hex')),
			value: 0x01,
			chainId: bufferToBigInt(Buffer.from('796f6c6f763378', 'hex')),
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

		const expectedUnsignedRaw = Buffer.from(
			'01f86587796f6c6f76337880843b9aca008262d494df0a88b2b68c673713a8ec826003676f272e35730180f838f7940000000000000000000000000000000000001337e1a00000000000000000000000000000000000000000000000000000000000000000808080',
			'hex',
		);
		const pkey = Buffer.from(
			'fad9c8855b740a0b7ed4c221dbad0f33a83a49cad6b3fe8d5817ac83d38b6a19',
			'hex',
		);
		const expectedSigned = Buffer.from(
			'01f8a587796f6c6f76337880843b9aca008262d494df0a88b2b68c673713a8ec826003676f272e35730180f838f7940000000000000000000000000000000000001337e1a0000000000000000000000000000000000000000000000000000000000000000080a0294ac94077b35057971e6b4b06dfdf55a6fbed819133a6c1d31e187f1bca938da00be950468ba1c25a5cb50e9f6d8aa13c8cd21f24ba909402775b262ac76d374d',
			'hex',
		);
		const expectedHash = Buffer.from(
			'bbd570a3c6acc9bb7da0d5c0322fe4ea2a300db80226f7df4fef39b2d6649eec',
			'hex',
		);
		const v = BigInt(0);
		const r = bufferToBigInt(
			Buffer.from('294ac94077b35057971e6b4b06dfdf55a6fbed819133a6c1d31e187f1bca938d', 'hex'),
		);
		const s = bufferToBigInt(
			Buffer.from('0be950468ba1c25a5cb50e9f6d8aa13c8cd21f24ba909402775b262ac76d374d', 'hex'),
		);

		const unsignedTx = AccessListEIP2930Transaction.fromTxData(txData, { common: usedCommon });

		const serializedMessageRaw = unsignedTx.serialize();

		expect(expectedUnsignedRaw.equals(serializedMessageRaw)).toBeTruthy();

		const signed = unsignedTx.sign(pkey);

		expect(v === signed.v!).toBeTruthy();
		expect(r === signed.r!).toBeTruthy();
		expect(s === signed.s!).toBeTruthy();
		expect(expectedSigned.equals(signed.serialize())).toBeTruthy();
		expect(expectedHash.equals(signed.hash())).toBeTruthy();

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
