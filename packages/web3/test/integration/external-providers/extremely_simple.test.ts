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

import Web3 from '../../../src/index';

describe('compatibility with extremely simple external provider', () => {
	it('should accept a simple instance that is compatible with EIP1193', () => {
		interface RequestArguments {
			readonly method: string;
			readonly params?: readonly unknown[] | object;
		}

		class Provider {
			// eslint-disable-next-line class-methods-use-this, @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
			public async request(_: RequestArguments): Promise<unknown> {
				return undefined as unknown;
			}
		}

		const testProvider = new Provider();
		const { provider } = new Web3(testProvider);
		expect(provider).toBeDefined();
	});
});
