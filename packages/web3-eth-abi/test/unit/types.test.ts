import { Address, Bytes, Numbers } from 'web3-utils';
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

		describe('address', () => {
			typecheck('should extend correct type', () =>
				expectTypeOf<MatchPrimitiveType<'address', []>>().toExtend<Address>(),
			);

			typecheck('should extend the correct type array', () =>
				expectTypeOf<MatchPrimitiveType<'address[]', []>>().toExtend<Address[]>(),
			);

			typecheck('should extend the correct type fixed array', () =>
				expectTypeOf<MatchPrimitiveType<'address[3]', []>>().toExtend<
					[Address, Address, Address]
				>(),
			);
		});

		describe('bytes', () => {
			typecheck('should extend correct type', () =>
				expectTypeOf<MatchPrimitiveType<'bytes', []>>().toExtend<Bytes>(),
			);

			typecheck('should extend correct type with size', () =>
				expectTypeOf<MatchPrimitiveType<'bytes20', []>>().toExtend<Bytes>(),
			);

			typecheck('should extend the correct type array', () =>
				expectTypeOf<MatchPrimitiveType<'bytes[]', []>>().toExtend<Bytes[]>(),
			);

			typecheck('should extend the correct type fixed array', () =>
				expectTypeOf<MatchPrimitiveType<'bytes[3]', []>>().toExtend<
					[Bytes, Bytes, Bytes]
				>(),
			);
		});

		describe('uint', () => {
			typecheck('should extend correct type', () =>
				expectTypeOf<MatchPrimitiveType<'uint', []>>().toExtend<Numbers>(),
			);

			typecheck('should extend correct type with size', () =>
				expectTypeOf<MatchPrimitiveType<'uint8', []>>().toExtend<Numbers>(),
			);

			typecheck('should extend correct type with size array', () =>
				expectTypeOf<MatchPrimitiveType<'uint8[]', []>>().toExtend<Numbers[]>(),
			);

			typecheck('should extend the correct type array', () =>
				expectTypeOf<MatchPrimitiveType<'uint[]', []>>().toExtend<Numbers[]>(),
			);

			typecheck('should extend the correct type fixed array', () =>
				expectTypeOf<MatchPrimitiveType<'uint[3]', []>>().toExtend<
					[Numbers, Numbers, Numbers]
				>(),
			);
		});

		describe('int', () => {
			typecheck('should extend correct type', () =>
				expectTypeOf<MatchPrimitiveType<'int', []>>().toExtend<Numbers>(),
			);

			typecheck('should extend correct type with size', () =>
				expectTypeOf<MatchPrimitiveType<'int8', []>>().toExtend<Numbers>(),
			);

			typecheck('should extend correct type with size array', () =>
				expectTypeOf<MatchPrimitiveType<'int8[]', []>>().toExtend<Numbers[]>(),
			);

			typecheck('should extend the correct type array', () =>
				expectTypeOf<MatchPrimitiveType<'int[]', []>>().toExtend<Numbers[]>(),
			);

			typecheck('should extend the correct type fixed array', () =>
				expectTypeOf<MatchPrimitiveType<'int[3]', []>>().toExtend<
					[Numbers, Numbers, Numbers]
				>(),
			);
		});

		describe('tuple', () => {
			typecheck('should extend correct type', () =>
				expectTypeOf<
					MatchPrimitiveType<'tuple', [{ type: 'uint'; name: 'a' }]>
				>().toExtend<{ a: Numbers }>(),
			);

			typecheck('should extend correct type with size array', () =>
				expectTypeOf<
					MatchPrimitiveType<'tuple[3]', [{ type: 'uint'; name: 'a' }]>
				>().toExtend<[{ a: Numbers }, { a: Numbers }, { a: Numbers }]>(),
			);

			typecheck('should extend the correct type array', () =>
				expectTypeOf<
					MatchPrimitiveType<'tuple[]', [{ type: 'uint'; name: 'a' }]>
				>().toExtend<{ a: Numbers }[]>(),
			);
		});
	});
});
