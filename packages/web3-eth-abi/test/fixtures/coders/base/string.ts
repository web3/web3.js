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

export const validStringEncoderData: [unknown, string][] = [
	[
		'marin',
		'00000000000000000000000000000000000000000000000000000000000000056d6172696e000000000000000000000000000000000000000000000000000000',
	],
	[
		'extraaaaaaaaaalooooooooooooooooooonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnngggggggggggggggggggggggstrrrrrrrrrrrrrrrrrrrrrrrriiiiiiiiiiiinnnnnnnnng',
		'000000000000000000000000000000000000000000000000000000000000008a65787472616161616161616161616c6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e676767676767676767676767676767676767676767676773747272727272727272727272727272727272727272727272726969696969696969696969696e6e6e6e6e6e6e6e6e6700000000000000000000000000000000000000000000',
	],
	[
		'šč|€-!',
		'000000000000000000000000000000000000000000000000000000000000000ac5a1c48d7ce282ac2d2100000000000000000000000000000000000000000000',
	],
];

export const invalidStringEncoderData: [unknown][] = [[123]];

export const validStringDecoderData: [string, string, string][] = [
	[
		'0x00000000000000000000000000000000000000000000000000000000000000056d6172696e000000000000000000000000000000000000000000000000000000',
		'marin',
		'0x',
	],
	[
		'0x000000000000000000000000000000000000000000000000000000000000008a65787472616161616161616161616c6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f6f6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e676767676767676767676767676767676767676767676773747272727272727272727272727272727272727272727272726969696969696969696969696e6e6e6e6e6e6e6e6e6700000000000000000000000000000000000000000000',
		'extraaaaaaaaaalooooooooooooooooooonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnngggggggggggggggggggggggstrrrrrrrrrrrrrrrrrrrrrrrriiiiiiiiiiiinnnnnnnnng',
		'0x',
	],
	[
		'0x000000000000000000000000000000000000000000000000000000000000000ac5a1c48d7ce282ac2d2100000000000000000000000000000000000000000000',
		'šč|€-!',
		'0x',
	],
];
