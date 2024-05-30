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

import { FMT_NUMBER, FMT_BYTES } from 'web3-types';
import { hexToBytes } from '../../src/converters';

export const isDataFormatValid: [any, boolean][] = [
	[{ number: 'number', bytes: 'number' }, true],
	[{}, false],
];

export const convertScalarValueValid: [[any, any, any], any][] = [
	[[new Uint8Array(hexToBytes('FF')), 'bytes', { bytes: FMT_BYTES.HEX }], '0xff'],
	[
		[
			'0xe84375b25f38de0e68f7f4884b7342e0814747143c790f48088d22e802cf7a3',
			'bytes32',
			{ bytes: FMT_BYTES.HEX },
		],
		'0x0e84375b25f38de0e68f7f4884b7342e0814747143c790f48088d22e802cf7a3',
	],
	[[100, 'int', { number: FMT_NUMBER.NUMBER, bytes: FMT_BYTES.HEX }], 100],
	[[100, 'int', { number: 'unknown', bytes: FMT_BYTES.HEX }], 100],
	[[100, 'uint', { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX }], '0x64'],
	[[64, 'uint8', { number: FMT_NUMBER.STR }], '64'],
	[
		[new Uint8Array(hexToBytes('FF')), 'bytes', { bytes: FMT_BYTES.UINT8ARRAY }],
		new Uint8Array(new Uint8Array(hexToBytes('FF'))),
	],
	[
		[new Uint8Array(hexToBytes('FF')), 'bytes32', { bytes: FMT_BYTES.HEX }],
		'0x00000000000000000000000000000000000000000000000000000000000000ff',
	],
	[
		[new Uint8Array(hexToBytes('FF')), 'unknown', { bytes: FMT_BYTES.HEX }],
		new Uint8Array(hexToBytes('FF')),
	],
	[
		[new Uint8Array(hexToBytes('FF')), 'bytes32', { bytes: FMT_BYTES.UINT8ARRAY }],
		new Uint8Array(
			hexToBytes('0x00000000000000000000000000000000000000000000000000000000000000ff'),
		),
	],
	[[255, 'bytes32', { bytes: 'invalidFormat' }], 255], // return original value when erroring
];
