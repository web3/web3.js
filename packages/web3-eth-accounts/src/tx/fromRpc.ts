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
import { setLengthLeft, toBuffer, toType, TypeOutput } from 'web3-utils';
import type { TxData } from './types';

export const normalizeTxParams = (_txParams: any): TxData => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const txParams = { ..._txParams };

	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
	txParams.gasLimit = toType(txParams.gasLimit ?? txParams.gas, TypeOutput.BigInt);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
	txParams.data = txParams.data === undefined ? txParams.input : txParams.data;

	// check and convert gasPrice and value params
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
	txParams.gasPrice = txParams.gasPrice !== undefined ? BigInt(txParams.gasPrice) : undefined;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
	txParams.value = txParams.value !== undefined ? BigInt(txParams.value) : undefined;

	// strict byte length checking
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	txParams.to =
		// eslint-disable-next-line no-null/no-null, @typescript-eslint/no-unsafe-member-access
		txParams.to !== null && txParams.to !== undefined
			? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
			  setLengthLeft(toBuffer(txParams.to), 20)
			: // eslint-disable-next-line no-null/no-null
			  null;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,  @typescript-eslint/no-unsafe-argument
	txParams.v = toType(txParams.v, TypeOutput.BigInt);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return txParams;
};
