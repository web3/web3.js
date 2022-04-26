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

export const mergeDeepData: {
	message: string;
	destination: Record<string, unknown>;
	sources: Record<string, unknown>[];
	output: Record<string, unknown>;
}[] = [
	{
		message: 'multiple sources',
		destination: {},
		sources: [
			{ a: undefined, b: true, c: Buffer.from('123') },
			{ a: 3, d: 'string', e: { nested: BigInt(4) } },
		],
		output: { a: 3, b: true, c: Buffer.from('123'), d: 'string', e: { nested: BigInt(4) } },
	},

	{
		message: 'array elements',
		destination: {},
		sources: [{ a: [1, 2] }, { a: [3, 4] }],
		output: { a: [3, 4] },
	},

	{
		message: 'array elements with null values',
		destination: {},
		sources: [{ a: [1, 2] }, { a: undefined }],
		output: { a: [1, 2] },
	},

	{
		message: 'nested array elements',
		destination: {},
		sources: [{ a: [[1, 2]] }, { a: [[3, 4]] }],
		output: { a: [[3, 4]] },
	},

	{
		message: 'items pre-exists in the destination',
		destination: { a: 4, b: false },
		sources: [
			{ a: undefined, b: true, c: Buffer.from('123') },
			{ a: undefined, d: 'string', e: { nested: 4 } },
		],
		output: { a: 4, b: true, c: Buffer.from('123'), d: 'string', e: { nested: 4 } },
	},

	{
		message: 'items with different types',
		destination: { a: 4, b: false },
		sources: [
			{ a: undefined, b: true, c: Buffer.from('123') },
			{ a: '4', b: 'true', d: 'string', e: { nested: 4 } },
		],
		output: { a: '4', b: 'true', c: Buffer.from('123'), d: 'string', e: { nested: 4 } },
	},
];
