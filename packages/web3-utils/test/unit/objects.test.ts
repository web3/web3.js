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
	});
});
