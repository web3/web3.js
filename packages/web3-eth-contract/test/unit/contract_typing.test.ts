/* eslint-disable jest/expect-expect */

import { expectTypeOf, typecheck } from '@humeris/espresso-shot';
import { Contract } from '../../src/contract';
import { erc20Abi, Erc20Interface } from '../fixtures/erc20';
import { erc721Abi, Erc721Interface } from '../fixtures/erc721';

describe('contract typing', () => {
	describe('erc20', () => {
		const contract = new Contract(erc20Abi);

		typecheck('should contain all methods', () =>
			expectTypeOf<keyof typeof contract.methods>().toBe<keyof Erc20Interface['methods']>(),
		);

		typecheck('should have interface compliance methods', () =>
			expectTypeOf(contract.methods).toExtend<Erc20Interface['methods']>(),
		);

		typecheck('should have all events', () =>
			expectTypeOf(contract.events).toExtend<Erc20Interface['events']>(),
		);

		typecheck('should have interface compliance events', () =>
			expectTypeOf(contract.events).toExtend<Erc20Interface['events']>(),
		);
	});

	describe('erc721', () => {
		const contract = new Contract(erc721Abi);

		typecheck('should contain all methods', () =>
			expectTypeOf<keyof typeof contract.methods>().toBe<keyof Erc721Interface['methods']>(),
		);

		typecheck('should have interface compliance methods', () =>
			expectTypeOf(contract.methods).toExtend<Erc721Interface['methods']>(),
		);

		typecheck('should have all events', () =>
			expectTypeOf(contract.events).toExtend<Erc721Interface['events']>(),
		);

		typecheck('should have interface compliance events', () =>
			expectTypeOf(contract.events).toExtend<Erc721Interface['events']>(),
		);
	});
});
