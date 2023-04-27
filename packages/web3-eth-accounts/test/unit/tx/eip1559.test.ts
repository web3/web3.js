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
import { RLP } from '@ethereumjs/rlp';
import { hexToBytes } from 'web3-utils';
import { Chain, Common, Hardfork } from '../../../src/common';

import { FeeMarketEIP1559Transaction } from '../../../src';

import testdata from '../../fixtures/json/eip1559.json';

const common = new Common({
	chain: 5,
	hardfork: Hardfork.London,
});
// @ts-expect-error set private property
common._chainParams.chainId = 4;
const TWO_POW256 = BigInt('0x10000000000000000000000000000000000000000000000000000000000000000');

const validAddress = hexToBytes('01'.repeat(20));
const validSlot = hexToBytes('01'.repeat(32));
const chainId = BigInt(4);

describe('[FeeMarketEIP1559Transaction]', () => {
	it('cannot input decimal or negative values %s', () => {
		const values = [
			'maxFeePerGas',
			'maxPriorityFeePerGas',
			'chainId',
			'nonce',
			'gasLimit',
			'value',
			'v',
			'r',
			's',
		];
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
					FeeMarketEIP1559Transaction.fromTxData(txData);
				}).toThrow();
			}
		}
	});

	it('getUpfrontCost()', () => {
		const tx = FeeMarketEIP1559Transaction.fromTxData(
			{
				maxFeePerGas: 10,
				maxPriorityFeePerGas: 8,
				gasLimit: 100,
				value: 6,
			},
			{ common },
		);
		expect(tx.getUpfrontCost()).toEqual(BigInt(806));
		let baseFee = BigInt(0);
		expect(tx.getUpfrontCost(baseFee)).toEqual(BigInt(806));
		baseFee = BigInt(4);
		expect(tx.getUpfrontCost(baseFee)).toEqual(BigInt(1006));
	});

	it('sign()', () => {
		// eslint-disable-next-line @typescript-eslint/prefer-for-of
		for (let index = 0; index < testdata.length; index += 1) {
			const data = testdata[index];
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			const pkey = hexToBytes(data.privateKey.slice(2));
			const txn = FeeMarketEIP1559Transaction.fromTxData(data, { common });
			const signed = txn.sign(pkey);
			const rlpSerialized = RLP.encode(Uint8Array.from(signed.serialize()));
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			expect(rlpSerialized).toEqual(hexToBytes(data.signedTransactionRLP.slice(2)));
		}
	});

	it('hash()', () => {
		const data = testdata[0];
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const pkey = hexToBytes(data.privateKey.slice(2));
		let txn = FeeMarketEIP1559Transaction.fromTxData(data, { common });
		let signed = txn.sign(pkey);
		const expectedHash = hexToBytes(
			'0x2e564c87eb4b40e7f469b2eec5aa5d18b0b46a24e8bf0919439cfb0e8fcae446',
		);
		expect(signed.hash()).toEqual(expectedHash);
		txn = FeeMarketEIP1559Transaction.fromTxData(data, { common, freeze: false });
		signed = txn.sign(pkey);
		expect(signed.hash()).toEqual(expectedHash);
	});

	it('freeze property propagates from unsigned tx to signed tx', () => {
		const data = testdata[0];
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const pkey = hexToBytes(data.privateKey.slice(2));
		const txn = FeeMarketEIP1559Transaction.fromTxData(data, { common, freeze: false });
		expect(Object.isFrozen(txn)).toBe(false);
		const signedTxn = txn.sign(pkey);
		expect(Object.isFrozen(signedTxn)).toBe(false);
	});

	it('common propagates from the common of tx, not the common in TxOptions', () => {
		const data = testdata[0];
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const pkey = hexToBytes(data.privateKey.slice(2));
		const txn = FeeMarketEIP1559Transaction.fromTxData(data, { common, freeze: false });
		const newCommon = new Common({
			chain: Chain.Goerli,
			hardfork: Hardfork.London,
			eips: [2537],
		});
		expect(Object.isFrozen(newCommon)).not.toEqual(common);
		Object.defineProperty(txn, 'common', {
			get() {
				return newCommon;
			},
		});
		const signedTxn = txn.sign(pkey);
		expect(signedTxn.common.eips()).toContain(2537);
	});

	it('unsigned tx -> getMessageToSign()', () => {
		const unsignedTx = FeeMarketEIP1559Transaction.fromTxData(
			{
				data: hexToBytes('010200'),
				to: validAddress,
				accessList: [[validAddress, [validSlot]]],
				chainId,
			},
			{ common },
		);
		const expectedHash = hexToBytes(
			'0xfa81814f7dd57bad435657a05eabdba2815f41e3f15ddd6139027e7db56b0dea',
		);
		expect(unsignedTx.getMessageToSign(true)).toEqual(expectedHash);

		const expectedSerialization = hexToBytes(
			'0x02f85904808080809401010101010101010101010101010101010101018083010200f838f7940101010101010101010101010101010101010101e1a00101010101010101010101010101010101010101010101010101010101010101',
		);
		expect(unsignedTx.getMessageToSign(false)).toEqual(expectedSerialization);
	});

	it('toJSON()', () => {
		const data = testdata[0];
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const pkey = hexToBytes(data.privateKey.slice(2));
		const txn = FeeMarketEIP1559Transaction.fromTxData(data, { common });
		const signed = txn.sign(pkey);

		const json = signed.toJSON();
		const expectedJSON = {
			chainId: '0x4',
			nonce: '0x333',
			maxPriorityFeePerGas: '0x1284d',
			maxFeePerGas: '0x1d97c',
			gasLimit: '0x8ae0',
			to: '0x000000000000000000000000000000000000aaaa',
			value: '0x2933bc9',
			data: '0x',
			accessList: [],
			v: '0x0',
			r: '0xf924cb68412c8f1cfd74d9b581c71eeaf94fff6abdde3e5b02ca6b2931dcf47',
			s: '0x7dd1c50027c3e31f8b565e25ce68a5072110f61fce5eee81b195dd51273c2f83',
		};
		expect(json).toEqual(expectedJSON);
	});

	it('Fee validation', () => {
		expect(() => {
			FeeMarketEIP1559Transaction.fromTxData(
				{
					maxFeePerGas: TWO_POW256 - BigInt(1),
					maxPriorityFeePerGas: 100,
					gasLimit: 1,
					value: 6,
				},
				{ common },
			);
		}).not.toThrow();
		expect(() => {
			FeeMarketEIP1559Transaction.fromTxData(
				{
					maxFeePerGas: TWO_POW256 - BigInt(1),
					maxPriorityFeePerGas: 100,
					gasLimit: 100,
					value: 6,
				},
				{ common },
			);
		}).toThrow();
		expect(() => {
			FeeMarketEIP1559Transaction.fromTxData(
				{
					maxFeePerGas: 1,
					maxPriorityFeePerGas: 2,
					gasLimit: 100,
					value: 6,
				},
				{ common },
			);
		}).toThrow();
	});
});
