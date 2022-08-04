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
import { Transaction } from 'web3-types';

const transaction: Transaction = {
	type: '0x0',
	nonce: '0x0',
	gasPrice: '0x3b9aca01',
	gasLimit: '0x5208',
	value: '0x1',
	input: '0x',
	v: '0xa95',
	r: '0xddb601f46a2232d9863f96bf8dabc8fd29d96c880d99f6c763465446f75a71e5',
	s: '0x28e3bd580f589a75a3d8d6cf85283692bb52830baba879f153266fda0182882c',
	to: '0x0000000000000000000000000000000000000000',
};

export const mockRpcResponse = {
	raw: '0xf86580843b9aca018252089400000000000000000000000000000000000000000180820a95a0ddb601f46a2232d9863f96bf8dabc8fd29d96c880d99f6c763465446f75a71e5a028e3bd580f589a75a3d8d6cf85283692bb52830baba879f153266fda0182882c',
	tx: transaction,
};

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - transaction
 */
type TestData = [string, [Transaction]];
export const testData: TestData[] = [[JSON.stringify(transaction), [transaction]]];
