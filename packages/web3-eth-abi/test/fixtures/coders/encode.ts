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
import { AbiInput } from 'web3-types';

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
export const validEncodeData: ReadonlyArray<{
	abiInput: ReadonlyArray<AbiInput>;
	params: unknown[];
	result: string;
}> = [
	{
		abiInput: ['uint256'],
		params: ['2345675643'],
		result: '0x000000000000000000000000000000000000000000000000000000008bd02b7b',
	},
	// {abiInput: ["uint256"], params: [], result: ""},
	// {abiInput: ["uint256"], params: [], result: ""},
	// {abiInput: ["uint256"], params: [], result: ""},
	// {abiInput: ["uint256"], params: [], result: ""},
	// {abiInput: ["uint256"], params: [], result: ""},
	// {abiInput: ["uint256"], params: [], result: ""},
	// {abiInput: ["uint256"], params: [], result: ""},
	// {abiInput: ["uint256"], params: [], result: ""},
];

export const invalidEncodeData: [string][] = [
	['blem'],
	['--123'],
	['2'],
	['-1'],
	['0x01'],
	['0x00'],
];
