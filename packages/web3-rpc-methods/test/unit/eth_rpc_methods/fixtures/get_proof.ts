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
import { Address, HexString32Bytes, Uint } from 'web3-types';

const address = '0x407d73d8a49eeb85d32cf465507dd71d507100c1';

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - address
 *     - storageKey
 *     - blockNumber
 */
type TestData = [string, [Address, HexString32Bytes[], Uint]];
export const testData: TestData[] = [
	[
		'address = "0x407d73d8a49eeb85d32cf465507dd71d507100c1", storageKeys = ["0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b"], blockNumber = "0x88"',
		[address, ['0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b'], '0x88'],
	],
];
