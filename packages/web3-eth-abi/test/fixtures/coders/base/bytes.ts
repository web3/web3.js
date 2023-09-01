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

import { AbiParameter } from 'web3-types';

export const validBytesEncoderData: [AbiParameter, string, string][] = [
	[
		{ type: 'bytes5', name: '' },
		'0x0000001010',
		'0000001010000000000000000000000000000000000000000000000000000000',
	],
	[
		{ type: 'bytes', name: '' },
		'0x0000001010',
		'00000000000000000000000000000000000000000000000000000000000000050000001010000000000000000000000000000000000000000000000000000000',
	],
	[
		{ type: 'bytes', name: '' },
		'0x3a1bd524db9d52a12c4c60bb3f08e4ed34f380964a6882d46097f6fe4eff98af80552fddf116d4afb1a2676508d68eb62f13e23e1e696c2a800d384470c628c748cee4ad2260d26584cd6a06c4a0cccca37b',
		'00000000000000000000000000000000000000000000000000000000000000523a1bd524db9d52a12c4c60bb3f08e4ed34f380964a6882d46097f6fe4eff98af80552fddf116d4afb1a2676508d68eb62f13e23e1e696c2a800d384470c628c748cee4ad2260d26584cd6a06c4a0cccca37b0000000000000000000000000000',
	],
];

export const invalidBytesEncoderData: [AbiParameter, string][] = [
	[{ type: 'bytes', name: '' }, 'blem'],
	[{ type: 'bytes', name: '' }, '--123'],
	[{ type: 'bytes1', name: '' }, '0x0000001010'],
];

export const validBytesDecoderData: [AbiParameter, string, string, string][] = [
	[
		{ type: 'bytes5', name: '' },
		'0x0000001010000000000000000000000000000000000000000000000000000000',
		'0x0000001010',
		'0X',
	],
	[
		{ type: 'bytes5', name: '' },
		'0x0000001010000000000000000000000000000000000000000000000000000000',
		'0x0000001010',
		'0X',
	],
	[
		{ type: 'bytes', name: '' },
		'0x00000000000000000000000000000000000000000000000000000000000000050000001010000000000000000000000000000000000000000000000000000000',
		'0x0000001010',
		'0x',
	],
	[
		{ type: 'bytes2', name: '' },
		'0x01020000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002',
		'0x0102',
		'0x0000000000000000000000000000000000000000000000000000000000000002',
	],
];

export const invalidBytesDecoderData: [AbiParameter, string][] = [
	[{ type: 'bytes32', name: '' }, '0x0000001010'],
];
