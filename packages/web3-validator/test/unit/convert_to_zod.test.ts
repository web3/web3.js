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

import { Web3Validator } from '../../src/web3_validator';

describe('convert-to-zod', () => {
	let validator: Web3Validator;

	beforeAll(() => {
		validator = new Web3Validator();
	});

	it('simple array', () => {
		expect(() =>
			validator.validateJSONSchema(
				{
					type: 'array',
					items: { type: 'string' },
				},
				['a', 'b', 'c'],
			),
		).not.toThrow();
	});

	it('simple object', () => {
		expect(() =>
			validator.validateJSONSchema(
				{
					type: 'object',
					properties: {
						a: { type: 'number' },
					},
				},
				{ a: 1 },
			),
		).not.toThrow();
	});
	it('incorrect type to object', () => {
		expect(() =>
			validator.validateJSONSchema(
				{
					type: 'object2',
					properties: {
						a: { type: 'number' },
					},
				},
				{ a: 1 },
			),
		).not.toThrow();
	});
	it('format with undefined value', () => {
		expect(() =>
			validator.validateJSONSchema(
				{
					required: ['a'],
					type: 'object',
					properties: {
						a: { format: 'uint' },
					},
				},
				{ a: undefined },
			),
		).toThrow();
	});
});
