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
import { Address, Bytes } from 'web3-types';

export const mockRpcResponse = '0x736f796c656e7420677265656e2069732070656f706c65';

const address = '0x407d73d8a49eeb85d32cf465507dd71d507100c1';

/**
 * Array consists of:
 * - Test title
 * - Input parameters:
 *     - message
 *     - address
 */
type TestData = [string, [Bytes, Address]];
export const testData: TestData[] = [
	[
		'message = "0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8"',
		['0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8', address],
	],
	[
		'message = Buffer("0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8", "hex")',
		[Buffer.from('0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8', 'hex'), address],
	],
	[
		'message = Uint8Array("d5677cf67b5aa051bb40496e68ad359eb97cfbf8")',
		[
			new Uint8Array([
				213, 103, 124, 246, 123, 90, 160, 81, 187, 64, 73, 110, 104, 173, 53, 158, 185, 124,
				251, 248,
			]),
			address,
		],
	],
];
