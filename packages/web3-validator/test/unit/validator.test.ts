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

import { Validator } from '../../src/validator';
import formats from '../../src/formats';

const formatNames = [
	'address',
	'bloom',
	'blockNumber',
	'blockTag',
	'blockNumberOrTag',
	'bool',
	'bytes',
	'filter',
	'hex',
	'uint',
	'int',
	'number',
	'string',
];

describe('instance of validator', () => {
	let validator: Validator;
	beforeAll(() => {
		validator = Validator.factory();
	});
	it('instance', () => {
		expect(validator).toBeDefined();
		expect(validator.validate).toBeDefined();
		expect(validator.addSchema).toBeDefined();
		expect(validator.getOrCreateValidator).toBeDefined();
		expect(validator.getSchema).toBeDefined();
	});
	it('add/get schema', () => {
		const schema = {
			type: 'array',
			items: {
				format: 'uint',
			},
		};
		validator.addSchema('k', schema);
		expect(typeof validator.getSchema('k')).toBe('function');
	});
	it('convertErrors', () => {
		const schema = {
			type: 'array',
			items: {
				format: 'uint',
			},
		};
		// @ts-expect-error-next-line
		expect(validator.convertErrors(undefined, schema, [])).toBeUndefined();
	});
	it('getObjectValueByPath', () => {
		// @ts-expect-error-next-line
		expect(validator.getObjectValueByPath({}, '$')).toBe('');
	});
	it('untilde', () => {
		// @ts-expect-error-next-line
		expect(validator.untilde('~1')).toBe('/');
		// @ts-expect-error-next-line
		expect(validator.untilde('~0')).toBe('~');
		// @ts-expect-error-next-line
		expect(validator.untilde('123')).toBe('123');
	});
	it('formats exists', () => {
		for (const f of formatNames) {
			expect(typeof formats[f]).toBe('function');
		}
		for (let i = 3; i <= 8; i += 1) {
			const bitSize = 2 ** i;
			expect(typeof formats[`int${bitSize}`]).toBe('function');
			expect(typeof formats[`uint${bitSize}`]).toBe('function');
		}
		for (let size = 1; size <= 32; size += 1) {
			expect(typeof formats[`bytes${size}`]).toBe('function');
		}
	});
	it('formats call', () => {
		expect(formats.address('0x7ab80aeb6bb488b7f6c41c58e83ef248eb39c882')).toBe(true);
		expect(formats.address('0x7ab80aeb6bb488b7f6c41c58e83ef248eb39c88')).toBe(false);

		expect(formats.bloom(`0x${'0'.repeat(512)}`)).toBe(true);
		expect(formats.bloom(`0x${'0'.repeat(511)}`)).toBe(false);

		expect(formats.blockNumber(1)).toBe(true);
		expect(formats.blockNumber(-1)).toBe(false);

		expect(formats.uint(1)).toBe(true);
		expect(formats.uint(-1)).toBe(false);

		expect(formats.int(1)).toBe(true);
		expect(formats.int(1.1)).toBe(false);

		expect(formats.number(1)).toBe(true);
		expect(formats.number([])).toBe(false);

		expect(formats.string('1')).toBe(true);
		expect(formats.string(1)).toBe(false);

		expect(formats.hex('0x1')).toBe(true);
		expect(formats.hex('1')).toBe(false);

		expect(formats.blockTag('latest')).toBe(true);
		expect(formats.blockTag('latest2')).toBe(false);

		expect(formats.blockNumberOrTag(1)).toBe(true);
		expect(formats.blockNumberOrTag('latest')).toBe(true);
		expect(formats.blockNumberOrTag(-1)).toBe(false);
		expect(formats.blockNumberOrTag('latest2')).toBe(false);

		expect(formats.bool(true)).toBe(true);
		expect(formats.bool(false)).toBe(true);
		expect(formats.bool('')).toBe(false);
		expect(formats.bool([])).toBe(false);

		expect(formats.bytes([1, 2])).toBe(true);
		expect(formats.bytes(-1)).toBe(false);

		expect(formats.filter({ fromBlock: 'latest' })).toBe(true);
		expect(formats.filter({ fromBlock2: 'latest' })).toBe(false);

		for (let i = 3; i <= 8; i += 1) {
			const bitSize = 2 ** i;
			expect(formats[`int${bitSize}`](1)).toBe(true);
			expect(formats[`int${bitSize}`](1.1)).toBe(false);
			expect(formats[`uint${bitSize}`](1)).toBe(true);
			expect(formats[`uint${bitSize}`](-1)).toBe(false);
		}
		for (let size = 1; size <= 32; size += 1) {
			const value = `0x${'aa'.repeat(size)}`;
			expect(formats[`bytes${size}`](value)).toBe(true);
			expect(formats[`bytes${size}`](-1)).toBe(false);
		}
	});
});
