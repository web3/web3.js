import { expectTypeOf, typecheck } from '@humeris/espresso-shot';
import { MatchPrimitiveType } from '../../src/types';

describe('types', () => {
	describe('primitive types', () => {
		describe('bool', () => {
			typecheck('should extend the boolean type', () => {
				const b: MatchPrimitiveType<'bool', []> = true;

				return expectTypeOf(b).toExtend<boolean>();
			});

			typecheck('should extend the boolean type array', () => {
				const b: MatchPrimitiveType<'bool[]', []> = [true];

				return expectTypeOf(b).toExtend<boolean[]>();
			});

			typecheck('should extend the boolean type fixed array', () => {
				const b: MatchPrimitiveType<'bool[3]', []> = [true, true, true];

				return expectTypeOf(b).toExtend<[boolean, boolean, boolean]>();
			});
		});

		describe('string', () => {
			typecheck('should extend the string type', () => {
				const b: MatchPrimitiveType<'string', []> = 'a';

				return expectTypeOf(b).toExtend<string>();
			});

			typecheck('should extend the string type array', () => {
				const b: MatchPrimitiveType<'string[]', []> = ['a'];

				return expectTypeOf(b).toExtend<string[]>();
			});

			typecheck('should extend the string type fixed array', () => {
				const b: MatchPrimitiveType<'string[3]', []> = ['a', 'a', 'a'];

				return expectTypeOf(b).toExtend<[string, string, string]>();
			});
		});
	});
});
