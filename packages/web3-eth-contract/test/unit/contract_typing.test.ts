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
			expectTypeOf<keyof typeof contract.events>().toBe<keyof Erc20Interface['events']>(),
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

		// TODO: It's not matching types for `safeTransferFrom` because of overloaded method
		// typecheck('should have interface compliance methods', () =>
		// 	expectTypeOf(contract.methods).toExtend<Erc721Interface['methods']>(),
		// );

		typecheck('should have all events', () =>
			expectTypeOf<keyof typeof contract.events>().toBe<keyof Erc721Interface['events']>(),
		);

		typecheck('should have interface compliance events', () =>
			expectTypeOf(contract.events).toExtend<Erc721Interface['events']>(),
		);
	});
});
