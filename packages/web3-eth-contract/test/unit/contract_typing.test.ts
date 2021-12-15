/* eslint-disable jest/expect-expect */

import { expectTypeOf, typecheck } from '@humeris/espresso-shot';
import { Contract } from '../../src/contract';
import { erc20Abi, Erc20Interface } from '../fixtures/erc20';

describe('contract typing', () => {
	describe('erc20', () => {
		it('should have valid type interface', () => {
			const contract = new Contract(erc20Abi);

			typecheck(
				'should extend correct interface',
				() => [
					// Contract contains all methods
					expectTypeOf<keyof typeof contract.methods>().toBe<
						keyof Erc20Interface['methods']
					>(),

					// Contract methods compliance with interface
					expectTypeOf(contract.methods).toExtend<Erc20Interface['methods']>(),

					// Contract contains all events
					expectTypeOf<keyof typeof contract.events>().toBe<
						keyof Erc20Interface['events']
					>(),

					// Contract events compliance with interface
					expectTypeOf(contract.events).toExtend<Erc20Interface['events']>(),
				],
				{ runInTest: false },
			);
		});
	});
});
