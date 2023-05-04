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
import { Chain, Common, Hardfork } from '../../../src/common';
import { Address } from '../../../src/tx/address';
import { TransactionFactory } from '../../../src';

const common = new Common({
	chain: Chain.Mainnet,
	hardfork: Hardfork.Merge,
	eips: [3860],
});

const maxInitCodeSize = common.param('vm', 'maxInitCodeSize');
const txTypes = [0, 1, 2];
const addressZero = Address.zero();

describe('[EIP3860 tests]', () => {
	it('Should instantiate create txs with MAX_INITCODE_SIZE', () => {
		const data = new Uint8Array(Number(maxInitCodeSize));
		for (const txType of txTypes) {
			expect(TransactionFactory.fromTxData({ data, type: txType }, { common })).toBeTruthy();
		}
	});

	it('Should instantiate txs with MAX_INITCODE_SIZE data', () => {
		const data = new Uint8Array(Number(maxInitCodeSize));
		for (const txType of txTypes) {
			expect(
				TransactionFactory.fromTxData({ data, type: txType, to: addressZero }, { common }),
			).toBeTruthy();
		}
	});

	it('Should not instantiate create txs with MAX_INITCODE_SIZE+1 data', () => {
		const data = new Uint8Array(Number(maxInitCodeSize) + 1);
		for (const txType of txTypes) {
			expect(() =>
				TransactionFactory.fromTxData({ data, type: txType }, { common }),
			).toThrow();
		}
	});

	it('Should instantiate txs with MAX_INITCODE_SIZE+1 data', () => {
		const data = new Uint8Array(Number(maxInitCodeSize) + 1);
		for (const txType of txTypes) {
			expect(
				TransactionFactory.fromTxData({ data, type: txType, to: addressZero }, { common }),
			).toBeTruthy();
		}
	});

	it('Should allow txs with MAX_INITCODE_SIZE+1 data if allowUnlimitedInitCodeSize is active', () => {
		const data = new Uint8Array(Number(maxInitCodeSize) + 1);
		for (const txType of txTypes) {
			expect(
				TransactionFactory.fromTxData(
					{ data, type: txType },
					{ common, allowUnlimitedInitCodeSize: true },
				),
			).toBeTruthy();
		}
	});

	it('Should charge initcode analysis gas is allowUnlimitedInitCodeSize is active', () => {
		const data = new Uint8Array(Number(maxInitCodeSize));
		for (const txType of txTypes) {
			const eip3860ActiveTx = TransactionFactory.fromTxData(
				{ data, type: txType },
				{ common, allowUnlimitedInitCodeSize: true },
			);
			const eip3860DeactivedTx = TransactionFactory.fromTxData(
				{ data, type: txType },
				{ common, allowUnlimitedInitCodeSize: false },
			);
			expect(eip3860ActiveTx.getDataFee() === eip3860DeactivedTx.getDataFee()).toBeTruthy();
		}
	});
});
