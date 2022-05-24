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

import { mergeDeep } from '../../src/objects';
import { mergeDeepData } from '../fixtures/objects';

describe('objects', () => {
	describe('mergeDeep', () => {
		it.each(mergeDeepData)('$message', ({ destination, sources, output }) => {
			mergeDeep(destination, ...sources);

			expect(destination).toEqual(output);
		});

		it('should not mutate the sources', () => {
			const before = { a: undefined, b: true, c: Buffer.from('123') };
			const result = mergeDeep({}, before, {
				a: 3,
				d: 'string',
				e: { nested: BigInt(4) },
			}) as any;

			expect(before.a).toBeUndefined();
			expect(result.b).toBe(true);
			expect(result.c).toEqual(Buffer.from('123'));
		});

		it('should not overwrite if undefined', () => {
			const result = mergeDeep(
				{},
				{ a: undefined, b: true, c: Buffer.from('123'), f: 99 },
				{ a: 3, d: 'string', e: { nested: BigInt(4) }, f: undefined },
			) as any;

			expect(result.a).toBe(3);
			expect(result.b).toBe(true);
			expect(result.c).toEqual(Buffer.from('123'));
			expect(result.d).toBe('string');
			expect(result.e).toEqual({ nested: BigInt(4) });
			expect(result.f).toBe(99);
		});

		it('should not merge array values', () => {
			const result = mergeDeep({}, { a: [1, 2] }, { a: [3, 4], b: [4, 5] }) as any;

			expect(result.a).toStrictEqual([3, 4]);
			expect(result.b).toStrictEqual([4, 5]);
		});

		it('should not merge typed array values', () => {
			const result = mergeDeep(
				{},
				{ a: new Uint8Array([1, 2]) },
				{ a: new Uint8Array([3, 4]), b: new Uint8Array([4, 5]) },
			) as any;

			expect(result.a).toStrictEqual(new Uint8Array([3, 4]));
			expect(result.b).toStrictEqual(new Uint8Array([4, 5]));
		});

		it('should duplicate array values', () => {
			const data = { a: new Uint8Array([1, 2]) };
			const result = mergeDeep({}, data) as any;

			// Mutate source object
			data.a[0] = 3;

			expect(result.a).toStrictEqual(new Uint8Array([1, 2]));
		});
	});
});
