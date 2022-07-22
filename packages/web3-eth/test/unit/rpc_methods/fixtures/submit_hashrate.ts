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
import { HexString32Bytes } from 'web3-types';

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - hashRate
 *     - id
 */
type TestData = [string, [HexString32Bytes, HexString32Bytes]];
export const testData: TestData[] = [
	[
		'hashRate = "0x0000000000000000000000000000000000000000000000000000000000500000", id = "0x59daa26581d0acd1fce254fb7e85952f4c09d0915afd33d3886cd914bc7d283c"',
		[
			'0x0000000000000000000000000000000000000000000000000000000000500000',
			'0x59daa26581d0acd1fce254fb7e85952f4c09d0915afd33d3886cd914bc7d283c',
		],
	],
];
