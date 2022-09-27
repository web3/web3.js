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

import { ENSRegistryAbi as Registry } from '../../src/abi/ens/ENSRegistry';
import ReverseRegistrar from '../../src/abi/reverse_registrar';
import * as ENSRegistry from '../fixtures/ens/ENSRegistry.json';
import * as ENSReverseRegistrar from '../fixtures/ens/reverse_registrar.json';

describe('ABI', () => {
	describe('Registry', () => {
		it('should have valid ABI', () => {
			expect(ENSRegistry.abi).toEqual(Registry);
		});
	});

	describe('ReverseRegistrar', () => {
		it('should have valid ABI', () => {
			expect(JSON.parse(ENSReverseRegistrar.result)).toEqual(ReverseRegistrar);
		});
	});
});
