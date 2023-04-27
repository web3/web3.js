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
import { Bytes } from 'web3-types';
import { hexToBytes } from 'web3-utils';
import { Chain, Common, Hardfork, toUint8Array } from '../../../src/common';
import { Address } from '../../../src/tx/address';

import {
	AccessListEIP2930Transaction,
	FeeMarketEIP1559Transaction,
	Transaction,
	TransactionFactory,
} from '../../../src';

import type {
	AccessListEIP2930ValuesArray,
	FeeMarketEIP1559ValuesArray,
	TxValuesArray,
} from '../../../src';
import type { BigIntLike, PrefixedHexString } from '../../../src/common/types';

type AddressLike = Address | Uint8Array | PrefixedHexString;
// @returns: Array with subtypes of the AddressLike type for a given address
function generateAddressLikeValues(address: string): AddressLike[] {
	return [address, toUint8Array(address), new Address(toUint8Array(address))];
}

// @returns: Array with subtypes of the BigIntLike type for a given number
function generateBigIntLikeValues(value: number): BigIntLike[] {
	return [value, BigInt(value), `0x${value.toString(16)}`, toUint8Array(value)];
}

// @returns: Array with subtypes of the BufferLike type for a given string
function generateBufferLikeValues(value: string): Bytes[] {
	return [value, toUint8Array(value)];
}

interface GenerateCombinationsArgs {
	options: { [x: string]: any };
	optionIndex?: number;
	results?: { [x: string]: any }[];
	current?: { [x: string]: any };
}

function generateCombinations({
	options,
	optionIndex = 0,
	results = [],
	current = {},
}: GenerateCombinationsArgs) {
	const allKeys = Object.keys(options);
	const optionKey = allKeys[optionIndex];
	const values = options[optionKey];
	// eslint-disable-next-line @typescript-eslint/prefer-for-of
	for (let i = 0; i < values.length; i += 1) {
		// eslint-disable-next-line no-param-reassign
		current[optionKey] = values[i];

		if (optionIndex + 1 < allKeys.length) {
			generateCombinations({ options, optionIndex: optionIndex + 1, results, current });
		} else {
			// Clone the object
			const res = { ...current };
			results.push(res);
		}
	}

	return results;
}

// Deterministic pseudorandom number generator
function mulberry32(seed: number) {
	// eslint-disable-next-line no-param-reassign, no-multi-assign
	let t = (seed += 0x6d2b79f5);
	// eslint-disable-next-line no-bitwise
	t = Math.imul(t ^ (t >>> 15), t | 1);
	// eslint-disable-next-line no-bitwise
	t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
	// eslint-disable-next-line no-bitwise
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function getRandomSubarray<TArrayItem>(array: TArrayItem[], size: number) {
	const shuffled = array.slice(0);
	let seed = 1559;
	let index: number;
	let { length } = array;
	let temp: TArrayItem;
	while (length > 0) {
		index = Math.floor((length + 1) * mulberry32(seed));
		temp = shuffled[index];
		shuffled[index] = shuffled[length];
		shuffled[length] = temp;
		seed += 1;
		length -= 1;
	}
	return shuffled.slice(0, size);
}

const baseTxValues = {
	data: generateBufferLikeValues('0x65'),
	gasLimit: generateBigIntLikeValues(100000),
	nonce: generateBigIntLikeValues(0),
	to: generateAddressLikeValues('0x0000000000000000000000000000000000000000'),
	r: generateBigIntLikeValues(100),
	s: generateBigIntLikeValues(100),
	value: generateBigIntLikeValues(10),
};

const legacyTxValues = {
	gasPrice: generateBigIntLikeValues(100),
};

const accessListEip2930TxValues = {
	chainId: generateBigIntLikeValues(4),
};

const eip1559TxValues = {
	maxFeePerGas: generateBigIntLikeValues(100),
	maxPriorityFeePerGas: generateBigIntLikeValues(50),
};

describe('[Transaction Input Values]', () => {
	it('Legacy Transaction Values', () => {
		const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Homestead });
		const options = { ...baseTxValues, ...legacyTxValues, type: '0' };
		const legacyTxData = generateCombinations({
			options,
		});
		const randomSample = getRandomSubarray(legacyTxData, 100);
		for (const txData of randomSample) {
			const tx = Transaction.fromTxData(txData, { common });
			expect(() => tx.hash()).toThrow();
		}
	});

	it('EIP-1559 Transaction Values', () => {
		const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London });
		const options = {
			...baseTxValues,
			...accessListEip2930TxValues,
			...eip1559TxValues,
			type: '2',
		};
		const eip1559TxData = generateCombinations({
			options,
		});
		const randomSample = getRandomSubarray(eip1559TxData, 100);

		for (const txData of randomSample) {
			const tx = Transaction.fromTxData(txData, { common });
			expect(() => tx.hash()).toThrow();
		}
	});
});

test('[Invalid Array Input values]', () => {
	const txTypes = [0x0, 0x1, 0x2];
	for (const signed of [false, true]) {
		for (const txType of txTypes) {
			let tx = TransactionFactory.fromTxData({ type: txType });
			if (signed) {
				tx = tx.sign(hexToBytes('42'.repeat(32)));
			}
			const rawValues = tx.raw();
			for (let x = 0; x < rawValues.length; x += 1) {
				// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
				rawValues[x] = <any>[1, 2, 3];
				// eslint-disable-next-line default-case
				switch (txType) {
					case 0:
						// eslint-disable-next-line jest/no-conditional-expect
						expect(() =>
							Transaction.fromValuesArray(rawValues as TxValuesArray),
						).toThrow();
						break;
					case 1:
						// eslint-disable-next-line jest/no-conditional-expect
						expect(() =>
							AccessListEIP2930Transaction.fromValuesArray(
								rawValues as AccessListEIP2930ValuesArray,
							),
						).toThrow();
						break;
					case 2:
						// eslint-disable-next-line jest/no-conditional-expect
						expect(() =>
							FeeMarketEIP1559Transaction.fromValuesArray(
								rawValues as FeeMarketEIP1559ValuesArray,
							),
						).toThrow();
						break;
				}
			}
		}
	}
});

test('[Invalid Access Lists]', () => {
	const txTypes = [0x1, 0x2];
	const invalidAccessLists = [
		[[]], // does not have an address and does not have slots
		[[[], []]], // the address is an array
		[['0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae']], // there is no storage slot array
		[
			[
				'0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
				['0x0000000000000000000000000000000000000000000000000000000000000003', []],
			],
		], // one of the slots is an array
		[
			[
				'0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
				['0x0000000000000000000000000000000000000000000000000000000000000003'],
				'0xab',
			],
		], // extra field
		[
			'0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
			['0x0000000000000000000000000000000000000000000000000000000000000003'],
		], // account/slot needs to be encoded in a deeper array layer
	];
	for (const signed of [false, true]) {
		for (const txType of txTypes) {
			for (const invalidAccessListItem of invalidAccessLists) {
				let tx: any;
				try {
					tx = TransactionFactory.fromTxData({
						type: txType,
						// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
						accessList: <any>invalidAccessListItem,
					});
					if (signed) {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-call
						tx = tx.sign(hexToBytes('42'.repeat(32)));
					}
				} catch (e: any) {
					tx = TransactionFactory.fromTxData({ type: txType });
					if (signed) {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-call
						tx = tx.sign(hexToBytes('42'.repeat(32)));
					}
				}
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				const rawValues = tx!.raw();

				if (txType === 1 && rawValues[7].length === 0) {
					rawValues[7] = invalidAccessListItem;
				} else if (txType === 2 && rawValues[8].length === 0) {
					rawValues[8] = invalidAccessListItem;
				}

				// eslint-disable-next-line default-case
				switch (txType) {
					case 1:
						// eslint-disable-next-line jest/no-conditional-expect
						expect(() =>
							AccessListEIP2930Transaction.fromValuesArray(
								rawValues as AccessListEIP2930ValuesArray,
							),
						).toThrow();
						break;
					case 2:
						// eslint-disable-next-line jest/no-conditional-expect
						expect(() =>
							FeeMarketEIP1559Transaction.fromValuesArray(
								rawValues as FeeMarketEIP1559ValuesArray,
							),
						).toThrow();
						break;
				}
			}
		}
	}
});
