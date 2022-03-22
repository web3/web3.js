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

import { ValidReturnTypes, ValidTypes } from 'web3-utils';

export const getIdValidData: [
	ValidTypes | undefined,
	ValidReturnTypes[ValidTypes],
	ValidReturnTypes[ValidTypes],
][] = [
	[undefined, '3', '0x3'],
	[ValidTypes.HexString, '3', '0x3'],
	[ValidTypes.NumberString, '3', '3'],
	[ValidTypes.Number, '3', 3],
	[ValidTypes.BigInt, '3', BigInt('3')],
];

export const getPeerCountValidData: [
	ValidTypes | undefined,
	ValidReturnTypes[ValidTypes],
	ValidReturnTypes[ValidTypes],
][] = [
	[undefined, '0x2', '0x2'],
	[ValidTypes.HexString, '0x2', '0x2'],
	[ValidTypes.NumberString, '0x2', '2'],
	[ValidTypes.Number, '0x2', 2],
	[ValidTypes.BigInt, '0x2', BigInt('0x2')],
];
