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

import { TransactionFactory } from '../../../src/tx/transactionFactory';
import { BaseTransaction } from '../../../src/tx/baseTransaction';
import { TxData, TxOptions } from '../../../src/tx';

describe('Register new TX', () => {
	it('validateCannotExceedMaxInteger()', () => {
		const TYPE = 20;
		// @ts-expect-error not implement all methods
		class SomeNewTxType extends BaseTransaction<any> {
			public constructor(txData: TxData, opts: TxOptions = {}) {
				super({ ...txData, type: TYPE }, opts);
			}
			public static fromTxData() {
				return 'new fromTxData';
			}
			public static fromSerializedTx() {
				return 'new fromSerializedData';
			}
		}
		TransactionFactory.registerTransactionType(TYPE, SomeNewTxType);
		const txData = {
			from: '0x',
			to: '0x',
			value: '0x1',
			type: TYPE,
		};
		expect(TransactionFactory.fromTxData(txData)).toBe('new fromTxData');
		expect(TransactionFactory.fromSerializedData(new Uint8Array([TYPE, 10]))).toBe(
			'new fromSerializedData',
		);
	});
});
