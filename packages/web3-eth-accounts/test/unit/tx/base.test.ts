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
import { bytesToUint8Array, hexToBytes, uint8ArrayEquals } from 'web3-utils';
import {
	AccessListEIP2930Transaction,
	Capability,
	FeeMarketEIP1559Transaction,
	Transaction,
} from '../../../src';
import { Chain, Common, Hardfork, toUint8Array, uint8ArrayToBigInt } from '../../../src/common';
import { MAX_INTEGER, MAX_UINT64, SECP256K1_ORDER } from '../../../src/tx/constants';

import type { BaseTransaction } from '../../../src/tx/baseTransaction';
import eip1559Fixtures from '../../fixtures/json/eip1559txs.json';
import eip2930Fixtures from '../../fixtures/json/eip2930txs.json';

import legacyFixtures from '../../fixtures/json/txs.json';

const privateToPublic = function (privateKey: Uint8Array): Uint8Array {
	return secp256k1.getPublicKey(privateKey, false).slice(1);
};
const common = new Common({
	chain: 5,
	hardfork: Hardfork.London,
});
// @ts-expect-error set private property
common._chainParams.chainId = 4;
describe('[BaseTransaction]', () => {
	// EIP-2930 is not enabled in Common by default (2021-03-06)
	// eslint-disable-next-line @typescript-eslint/no-shadow
	const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London });

	const legacyTxs: BaseTransaction<Transaction>[] = [];
	for (const tx of legacyFixtures.slice(0, 4)) {
		legacyTxs.push(Transaction.fromTxData(tx.data, { common }));
	}

	const eip2930Txs: BaseTransaction<AccessListEIP2930Transaction>[] = [];
	for (const tx of eip2930Fixtures) {
		eip2930Txs.push(AccessListEIP2930Transaction.fromTxData(tx.data, { common }));
	}

	const eip1559Txs: BaseTransaction<FeeMarketEIP1559Transaction>[] = [];
	for (const tx of eip1559Fixtures) {
		eip1559Txs.push(FeeMarketEIP1559Transaction.fromTxData(tx.data, { common }));
	}

	const zero = new Uint8Array(0);
	const txTypes = [
		{
			class: Transaction,
			name: 'Transaction',
			type: 0,
			values: Array(6).fill(zero),
			txs: legacyTxs,
			fixtures: legacyFixtures,
			activeCapabilities: [],
			notActiveCapabilities: [
				Capability.EIP1559FeeMarket,
				Capability.EIP2718TypedTransaction,
				Capability.EIP2930AccessLists,
				9999,
			],
		},
		{
			class: AccessListEIP2930Transaction,
			name: 'AccessListEIP2930Transaction',
			type: 1,
			values: [new Uint8Array([1])].concat(Array(7).fill(zero)),
			txs: eip2930Txs,
			fixtures: eip2930Fixtures,
			activeCapabilities: [Capability.EIP2718TypedTransaction, Capability.EIP2930AccessLists],
			notActiveCapabilities: [Capability.EIP1559FeeMarket, 9999],
		},
		{
			class: FeeMarketEIP1559Transaction,
			name: 'FeeMarketEIP1559Transaction',
			type: 2,
			values: [new Uint8Array([1])].concat(Array(8).fill(zero)),
			txs: eip1559Txs,
			fixtures: eip1559Fixtures,
			activeCapabilities: [
				Capability.EIP1559FeeMarket,
				Capability.EIP2718TypedTransaction,
				Capability.EIP2930AccessLists,
			],
			notActiveCapabilities: [9999],
		},
	];

	it('Initialization', () => {
		for (const txType of txTypes) {
			let tx = txType.class.fromTxData({}, { common });
			expect(tx.common.hardfork()).toBe('london');
			expect(Object.isFrozen(tx)).toBe(true);

			const initCommon = new Common({
				chain: Chain.Mainnet,
				hardfork: Hardfork.London,
			});
			tx = txType.class.fromTxData({}, { common: initCommon });
			expect(tx.common.hardfork()).toBe('london');

			initCommon.setHardfork(Hardfork.Byzantium);
			expect(tx.common.hardfork()).toBe('london');

			tx = txType.class.fromTxData({}, { common, freeze: false });
			expect(!Object.isFrozen(tx)).toBe(true);

			// Perform the same test as above, but now using a different construction method. This also implies that passing on the
			// options object works as expected.
			tx = txType.class.fromTxData({}, { common, freeze: false });
			const rlpData = tx.serialize();

			tx = txType.class.fromSerializedTx(rlpData, { common });
			expect(tx.type).toEqual(txType.type);

			expect(Object.isFrozen(tx)).toBe(true);

			tx = txType.class.fromSerializedTx(rlpData, { common, freeze: false });
			expect(!Object.isFrozen(tx)).toBe(true);

			tx = txType.class.fromValuesArray(txType.values as any, { common });
			expect(Object.isFrozen(tx)).toBe(true);

			tx = txType.class.fromValuesArray(txType.values as any, { common, freeze: false });
			expect(!Object.isFrozen(tx)).toBe(true);
		}
	});

	it('fromValuesArray()', () => {
		let rlpData: any = legacyTxs[0].raw();
		rlpData[0] = toUint8Array('0x00');
		expect(() => {
			Transaction.fromValuesArray(rlpData);
		}).toThrow('nonce cannot have leading zeroes');
		rlpData[0] = toUint8Array('0x');
		rlpData[6] = toUint8Array('0x00');
		expect(() => {
			Transaction.fromValuesArray(rlpData);
		}).toThrow('v cannot have leading zeroes');
		rlpData = eip2930Txs[0].raw();
		rlpData[3] = toUint8Array('0x0');
		expect(() => {
			AccessListEIP2930Transaction.fromValuesArray(rlpData);
		}).toThrow('gasLimit cannot have leading zeroes');
		rlpData = eip1559Txs[0].raw();
		rlpData[2] = toUint8Array('0x0');
		expect(() => {
			FeeMarketEIP1559Transaction.fromValuesArray(rlpData);
		}).toThrow('maxPriorityFeePerGas cannot have leading zeroes');
	});

	it('serialize()', () => {
		for (const txType of txTypes) {
			for (const tx of txType.txs) {
				expect(txType.class.fromSerializedTx(tx.serialize(), { common })).toBeTruthy();
				expect(txType.class.fromSerializedTx(tx.serialize(), { common })).toBeTruthy();
			}
		}
	});

	it('supports()', () => {
		for (const txType of txTypes) {
			for (const tx of txType.txs) {
				for (const activeCapability of txType.activeCapabilities) {
					expect(tx.supports(activeCapability)).toBe(true);
				}
				for (const notActiveCapability of txType.notActiveCapabilities) {
					expect(tx.supports(notActiveCapability)).toBe(false);
				}
			}
		}
	});

	it('raw()', () => {
		for (const txType of txTypes) {
			for (const tx of txType.txs) {
				expect(txType.class.fromValuesArray(tx.raw() as any, { common })).toBeTruthy();
			}
		}
	});

	it('verifySignature()', () => {
		for (const txType of txTypes) {
			for (const tx of txType.txs) {
				expect(tx.verifySignature()).toBe(true);
			}
		}
	});

	it('verifySignature() -> invalid', () => {
		for (const txType of txTypes) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			for (const txFixture of txType.fixtures.slice(0, 4)) {
				// set `s` to a single zero
				txFixture.data.s = '0x0';
				// @ts-expect-error set data
				const tx = txType.class.fromTxData(txFixture.data, { common });
				expect(tx.verifySignature()).toBe(false);
				expect(tx.validate(true)).toContain('Invalid Signature');
				expect(tx.validate()).toBe(false);
			}
		}
	});

	it('sign()', () => {
		for (const txType of txTypes) {
			for (const [i, tx] of txType.txs.entries()) {
				const { privateKey } = txType.fixtures[i];
				if (privateKey !== undefined) {
					// eslint-disable-next-line jest/no-conditional-expect
					expect(tx.sign(hexToBytes(privateKey))).toBeTruthy();
				}

				expect(() => tx.sign(new Uint8Array(bytesToUint8Array('invalid')))).toThrow();
			}
		}
	});

	it('isSigned() -> returns correct values', () => {
		for (const txType of txTypes) {
			const txs = [
				...txType.txs,
				// add unsigned variants
				...txType.txs.map(tx =>
					txType.class.fromTxData({
						...tx,
						v: undefined,
						r: undefined,
						s: undefined,
					}),
				),
			];
			for (const tx of txs) {
				expect(tx.isSigned()).toEqual(
					tx.v !== undefined && tx.r !== undefined && tx.s !== undefined,
				);
			}
		}
	});

	it('getSenderAddress()', () => {
		for (const txType of txTypes) {
			for (const [i, tx] of txType.txs.entries()) {
				const { privateKey, sendersAddress } = txType.fixtures[i];
				if (privateKey === undefined) {
					continue;
				}
				const signedTx = tx.sign(hexToBytes(privateKey));
				expect(signedTx.getSenderAddress().toString()).toBe(`0x${sendersAddress}`);
			}
		}
	});

	it('getSenderPublicKey()', () => {
		for (const txType of txTypes) {
			for (const [i, tx] of txType.txs.entries()) {
				const { privateKey } = txType.fixtures[i];
				if (privateKey === undefined) {
					continue;
				}
				const signedTx = tx.sign(hexToBytes(privateKey));
				const txPubKey = signedTx.getSenderPublicKey();
				const pubKeyFromPriv = privateToPublic(hexToBytes(privateKey));
				expect(uint8ArrayEquals(txPubKey, pubKeyFromPriv)).toBe(true);
			}
		}
	});

	it('getSenderPublicKey() -> should throw if s-value is greater than secp256k1n/2', () => {
		// EIP-2: All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
		// Reasoning: https://ethereum.stackexchange.com/a/55728
		for (const txType of txTypes) {
			for (const [i, tx] of txType.txs.entries()) {
				const { privateKey } = txType.fixtures[i];
				if (privateKey === undefined) {
					continue;
				}
				let signedTx = tx.sign(hexToBytes(privateKey));
				signedTx = JSON.parse(JSON.stringify(signedTx)); // deep clone
				(signedTx as any).s = SECP256K1_ORDER + BigInt(1);
				expect(() => {
					signedTx.getSenderPublicKey();
				}).toThrow();
			}
		}
	});

	it('verifySignature()->valid', () => {
		for (const txType of txTypes) {
			for (const [i, tx] of txType.txs.entries()) {
				const { privateKey } = txType.fixtures[i];
				if (privateKey === undefined) {
					continue;
				}
				const signedTx = tx.sign(hexToBytes(privateKey));
				expect(signedTx.verifySignature()).toBeTruthy();
			}
		}
	});

	it('initialization with defaults', () => {
		const uInt8ArrayZero = toUint8Array('0x');
		const tx = Transaction.fromTxData({
			nonce: '',
			gasLimit: '',
			gasPrice: '',
			to: '',
			value: '',
			data: '',
			v: '',
			r: '',
			s: '',
		});
		expect(tx.v).toBeUndefined();
		expect(tx.r).toBeUndefined();
		expect(tx.s).toBeUndefined();
		expect(tx.to).toBeUndefined();
		expect(tx.value).toBe(uint8ArrayToBigInt(uInt8ArrayZero));
		expect(tx.data).toEqual(uInt8ArrayZero);
		expect(tx.gasPrice).toBe(uint8ArrayToBigInt(uInt8ArrayZero));
		expect(tx.gasLimit).toBe(uint8ArrayToBigInt(uInt8ArrayZero));
		expect(tx.nonce).toBe(uint8ArrayToBigInt(uInt8ArrayZero));
	});

	it('_validateCannotExceedMaxInteger()', () => {
		const tx = FeeMarketEIP1559Transaction.fromTxData(eip1559Txs[0]);
		expect(() => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			(tx as any)._validateCannotExceedMaxInteger({ a: MAX_INTEGER }, 256, true);
		}).toThrow('equal or exceed MAX_INTEGER');

		expect(() => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			(tx as any)._validateCannotExceedMaxInteger({ a: MAX_INTEGER + BigInt(1) }, 256, false);
		}).toThrow('exceed MAX_INTEGER');

		expect(() => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			(tx as any)._validateCannotExceedMaxInteger({ a: BigInt(0) }, 100, false);
		}).toThrow('unimplemented bits value');

		expect(() => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			(tx as any)._validateCannotExceedMaxInteger({ a: MAX_UINT64 + BigInt(1) }, 64, false);
		}).toThrow('2^64');

		expect(() => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			(tx as any)._validateCannotExceedMaxInteger({ a: MAX_UINT64 }, 64, true);
		}).toThrow('2^64');
	});
});
