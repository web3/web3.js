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
import { HexString32Bytes, HexString8Bytes } from 'web3-types';

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - nonce
 *     - hash
 *     - digest
 */
type TestData = [string, [HexString8Bytes, HexString32Bytes, HexString32Bytes]];
export const testData: TestData[] = [
	[
		'nonce = "0x0000000000000001", hash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", digest = "0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000"',
		[
			'0x0000000000000001',
			'0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
			'0xD1FE5700000000000000000000000000D1FE5700000000000000000000000000',
		],
	],
];
