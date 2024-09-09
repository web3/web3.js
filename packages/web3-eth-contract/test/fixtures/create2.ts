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

import { Address, HexString } from 'web3-types';

export interface Create2TestData {
	address: Address;
	salt: HexString;
	init_code: HexString;
	result: Address;
}

export const create2TestData: Create2TestData[] = [
	{
		address: '0x0000000000000000000000000000000000000000',
		salt: '0x0000000000000000000000000000000000000000000000000000000000000000',
		init_code: '0x00',
		result: '0x4D1A2e2bB4F88F0250f26Ffff098B0b30B26BF38',
	},
	{
		address: '0xdeadbeef00000000000000000000000000000000',
		salt: '0x0000000000000000000000000000000000000000000000000000000000000000',
		init_code: '0x00',
		result: '0xB928f69Bb1D91Cd65274e3c79d8986362984fDA3',
	},
	{
		address: '0xdeadbeef00000000000000000000000000000000',
		salt: '0x000000000000000000000000feed000000000000000000000000000000000000',
		init_code: '0x00',
		result: '0xD04116cDd17beBE565EB2422F2497E06cC1C9833',
	},
	{
		address: '0x0000000000000000000000000000000000000000',
		salt: '0x0000000000000000000000000000000000000000000000000000000000000000',
		init_code: '0xdeadbeef',
		result: '0x70f2b2914A2a4b783FaEFb75f459A580616Fcb5e',
	},
	{
		address: '0x00000000000000000000000000000000deadbeef',
		salt: '0x00000000000000000000000000000000000000000000000000000000cafebabe',
		init_code: '0xdeadbeef',
		result: '0x60f3f640a8508fC6a86d45DF051962668E1e8AC7',
	},
	{
		address: '0x00000000000000000000000000000000deadbeef',
		salt: '0x00000000000000000000000000000000000000000000000000000000cafebabe',
		init_code:
			'0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
		result: '0x1d8bfDC5D46DC4f61D6b6115972536eBE6A8854C',
	},
	{
		address: '0x0000000000000000000000000000000000000000',
		salt: '0x0000000000000000000000000000000000000000000000000000000000000000',
		init_code: '0x',
		result: '0xE33C0C7F7df4809055C3ebA6c09CFe4BaF1BD9e0',
	},
];
