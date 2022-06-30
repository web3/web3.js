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

import { Contract } from '../../src';

describe('Contract', () => {
	describe('constructor', () => {
		it('should init with only the abi', () => {
			const contract = new Contract([]);

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should init with abi and address', () => {
			const contract = new Contract([], '0x00000000219ab540356cBB839Cbe05303d7705Fa');

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should init with abi and options', () => {
			const contract = new Contract([], { gas: '123' });

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should init with abi, options and context', () => {
			const contract = new Contract(
				[],
				{ gas: '123' },
				{ config: { defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa' } },
			);

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should init with abi, address and options', () => {
			const contract = new Contract([], '0x00000000219ab540356cBB839Cbe05303d7705Fa', {
				gas: '123',
			});

			expect(contract).toBeInstanceOf(Contract);
		});

		it('should init with abi, address, options and context', () => {
			const contract = new Contract(
				[],
				'0x00000000219ab540356cBB839Cbe05303d7705Fa',
				{ gas: '123' },
				{ config: { defaultAccount: '0x00000000219ab540356cBB839Cbe05303d7705Fa' } },
			);

			expect(contract).toBeInstanceOf(Contract);
		});
	});
});
