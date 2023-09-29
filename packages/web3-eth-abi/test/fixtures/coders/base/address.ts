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

export const validAddressEncoderData: [string, string][] = [
	[
		'00000000219ab540356cbb839cbe05303d7705fa',
		'00000000000000000000000000000000219ab540356cbb839cbe05303d7705fa',
	],
	[
		'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cC2',
		'000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
	],
];

export const invalidAddressEncoderData: [unknown][] = [
	['blem'],
	['--123'],
	['2'],
	['-1'],
	['0x01'],
	['0x00'],
	[123],
];

export const validAddressDecoderData: { bytes: string; result: string; remaining: string }[] = [
	{
		bytes: '0x000000000000000000000000e6004226bc1f1ba37e5c2c4689693b94b863cd58',
		result: '0xe6004226BC1F1ba37E5C2c4689693b94B863cd58',
		remaining: '0x',
	},
	{
		bytes: '0x000000000000000000000000e6004226bc1f1ba37e5c2c4689693b94b863cd580000000000000000000000000000000000000000000000000000000000000001',
		result: '0xe6004226BC1F1ba37E5C2c4689693b94B863cd58',
		remaining: '0x0000000000000000000000000000000000000000000000000000000000000001',
	},
];

export const invalidAddressDecoderData: [string][] = [
	['0x00000000000000000000e6004226bc1f1ba37e5c2c4689693b94b863cd58'],
];
