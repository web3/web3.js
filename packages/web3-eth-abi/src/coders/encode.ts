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
import { AbiInput, AbiParameter } from 'web3-types';
import { toHex } from 'web3-utils';
import { utils } from 'web3-validator';
import { encodeTuple } from './base/index.js';
import { toAbiParams } from './utils.js';

/**
 * @param params - The params to infer the ABI from
 * @returns The inferred ABI
 * @throws If the params cannot be inferred
 * @example
 * ```
 * inferParamsAbi([1, 'hello', '0x1234', ])
 * ```
 * > [{ type: 'uint256' }, { type: 'string' }, { type: 'bytes' }]
 * ```
 */
function inferParamsAbi(params: unknown[]): AbiParameter[] {
	const abi: AbiParameter[] = [];
	params.forEach(param => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		abi.push({ type: toHex(param as any, true) } as AbiParameter);
	});
	return abi;
}

export function encodeParameters(
	abi: ReadonlyArray<AbiInput> | undefined,
	params: unknown[],
): string {
	if (abi && abi?.length !== params.length) {
		throw new AbiError('Invalid number of values received for given ABI', {
			expected: abi?.length,
			received: params.length,
		});
	}

	let abiParams;
	if (abi !== undefined) {
		abiParams = toAbiParams(abi);
	} else {
		abiParams = inferParamsAbi(params);
	}

	return utils.uint8ArrayToHexString(
		encodeTuple({ type: 'tuple', name: '', components: abiParams }, params).encoded,
	);
}
