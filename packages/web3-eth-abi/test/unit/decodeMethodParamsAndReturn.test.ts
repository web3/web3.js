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

import { AbiFunctionFragment } from 'web3-types';
import { decodeFunctionCall, decodeFunctionReturn } from '../../src';

describe('decodeFunctionCall and decodeFunctionReturn tests should pass', () => {
	it('decodeFunctionCall should decode single-value data of a method', async () => {
		const data =
			'0xa41368620000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000';

		const params = decodeFunctionCall(
			{
				inputs: [{ internalType: 'string', name: '_greeting', type: 'string' }],
				name: 'setGreeting',
				outputs: [
					{ internalType: 'bool', name: '', type: 'bool' },
					{ internalType: 'string', name: '', type: 'string' },
				],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			data,
		);

		expect(params).toMatchObject({
			__method__: 'setGreeting(string)',
			__length__: 1,
			'0': 'Hello',
			_greeting: 'Hello',
		});
	});

	it('decodeFunctionCall should decode data of a method without removing the method signature (if intended)', async () => {
		const data =
			'0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000';

		const params = decodeFunctionCall(
			{
				inputs: [{ internalType: 'string', name: '_greeting', type: 'string' }],
				name: 'setGreeting',
				outputs: [
					{ internalType: 'bool', name: '', type: 'bool' },
					{ internalType: 'string', name: '', type: 'string' },
				],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			data,
			false,
		);

		expect(params).toMatchObject({
			__method__: 'setGreeting(string)',
			__length__: 1,
			'0': 'Hello',
			_greeting: 'Hello',
		});
	});

	it('decodeFunctionCall should throw if no inputs at the ABI', async () => {
		const data =
			'0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000';

		expect(() =>
			decodeFunctionCall(
				{
					name: 'setGreeting',
					// no `inputs` provided!
					outputs: [
						{ internalType: 'bool', name: '', type: 'bool' },
						{ internalType: 'string', name: '', type: 'string' },
					],
					stateMutability: 'nonpayable',
					type: 'function',
				},
				data,
				false,
			),
		).toThrow('No inputs found in the ABI');
	});

	it('decodeFunctionCall should decode multi-value data of a method', async () => {
		const data =
			'0xa413686200000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000548656c6c6f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010416e6f74686572204772656574696e6700000000000000000000000000000000';

		const params = decodeFunctionCall(
			{
				inputs: [
					{ internalType: 'string', name: '_greeting', type: 'string' },
					{ internalType: 'string', name: '_second_greeting', type: 'string' },
				],
				name: 'setGreeting',
				outputs: [
					{ internalType: 'bool', name: '', type: 'bool' },
					{ internalType: 'string', name: '', type: 'string' },
				],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			data,
		);

		expect(params).toEqual({
			'0': 'Hello',
			'1': 'Another Greeting',
			__length__: 2,
			__method__: 'setGreeting(string,string)',
			_greeting: 'Hello',
			_second_greeting: 'Another Greeting',
		});
	});

	it('decodeFunctionReturn should decode single-value data of a method', async () => {
		const data =
			'0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000';

		const decodedResult = decodeFunctionReturn(
			{
				inputs: [{ internalType: 'string', name: '_greeting', type: 'string' }],
				name: 'setGreeting',
				outputs: [{ internalType: 'string', name: '', type: 'string' }],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			data,
		);

		expect(decodedResult).toBe('Hello');
	});

	it('decodeFunctionReturn should decode multi-value data of a method', async () => {
		const data =
			'0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000548656c6c6f000000000000000000000000000000000000000000000000000000';

		const decodedResult = decodeFunctionReturn(
			{
				inputs: [{ internalType: 'string', name: '_greeting', type: 'string' }],
				name: 'setGreeting',
				outputs: [
					{ internalType: 'string', name: '', type: 'string' },
					{ internalType: 'bool', name: '', type: 'bool' },
				],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			data,
		);

		expect(decodedResult).toEqual({ '0': 'Hello', '1': true, __length__: 2 });
	});

	it('decodeFunctionReturn should decode nothing if it is called on a constructor', async () => {
		const data = 'anything passed should be returned as-is';

		const decodedResult = decodeFunctionReturn(
			{
				inputs: [{ internalType: 'string', name: '_greeting', type: 'string' }],
				stateMutability: 'nonpayable',
				type: 'constructor',
			} as unknown as AbiFunctionFragment,
			data,
		);

		expect(decodedResult).toEqual(data);
	});

	it('decodeFunctionReturn should return `null` if no values passed', async () => {
		const data = '';

		const decodedResult = decodeFunctionReturn(
			{
				inputs: [{ internalType: 'string', name: '_greeting', type: 'string' }],
				name: 'setGreeting',
				outputs: [
					{ internalType: 'string', name: '', type: 'string' },
					{ internalType: 'bool', name: '', type: 'bool' },
				],
				stateMutability: 'nonpayable',
				type: 'function',
			},
			data,
		);

		expect(decodedResult).toBeNull();
	});

	it('decodeFunctionReturn should return `null` if no function output provided', async () => {
		const data = '0x000000';

		const decodedResult = decodeFunctionReturn(
			{
				inputs: [{ internalType: 'string', name: '_greeting', type: 'string' }],
				name: 'setGreeting',
				stateMutability: 'nonpayable',
				type: 'function',
			},
			data,
		);

		expect(decodedResult).toBeNull();
	});
});
