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
import { AbiError } from 'web3-errors';
import { AbiInput } from 'web3-types';
import { utils } from 'web3-validator';
import { encodeTuple } from './base/index.js';
import { toAbiParams } from './utils.js';

export function encodeParameters(abi: ReadonlyArray<AbiInput>, params: unknown[]): string {
	if (abi.length !== params.length) {
		throw new AbiError('Invalid number of values received for given ABI', {
			expected: abi.length,
			received: params.length,
		});
	}
	const abiParams = toAbiParams(abi);
	return utils.uint8ArrayToHexString(
		encodeTuple({ type: 'tuple', name: '', components: abiParams }, params).encoded,
	);
}
