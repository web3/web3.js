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
	[[100, 'int', { number: FMT_NUMBER.NUMBER, bytes: FMT_BYTES.HEX }], 100],
	[[100, 'uint', { number: FMT_NUMBER.HEX, bytes: FMT_BYTES.HEX }], '0x64'],
	[[64, 'uint8', { number: FMT_NUMBER.STR }], '64'],

	[[new Uint8Array(hexToBytes('FF')), 'bytes', { bytes: FMT_BYTES.HEX }], '0xff'],
	[
		[new Uint8Array(hexToBytes('FF')), 'bytes', { bytes: FMT_BYTES.UINT8ARRAY }],
		new Uint8Array(new Uint8Array(hexToBytes('FF'))),
	],
	[
		[new Uint8Array(hexToBytes('FF')), 'bytes', { bytes: FMT_BYTES }],
		new Uint8Array(hexToBytes('FF')),
	],
];
