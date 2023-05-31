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

import { Eip838ExecutionError } from 'web3-errors';
import { AbiErrorFragment } from 'web3-types';

import { encodeErrorSignature } from './api/errors_api.js';
import { decodeParameters } from './api/parameters_api.js';
import { jsonInterfaceMethodToString } from './utils.js';

export const decodeContractErrorData = (
	errorsAbi: AbiErrorFragment[],
	error: Eip838ExecutionError,
) => {
	if (error?.data) {
		let errorName: string | undefined;
		let errorSignature: string | undefined;
		let errorArgs: { [K in string]: unknown } | undefined;
		try {
			const errorSha = error.data.slice(0, 10);
			const errorAbi = errorsAbi.find(abi => encodeErrorSignature(abi).startsWith(errorSha));

			if (errorAbi?.inputs) {
				errorName = errorAbi.name;
				errorSignature = jsonInterfaceMethodToString(errorAbi);
				// decode abi.inputs according to EIP-838
				errorArgs = decodeParameters([...errorAbi.inputs], error.data.substring(10));
			}
		} catch (err) {
			console.error(err);
		}
		if (errorName) {
			error.setDecodedProperties(errorName, errorSignature, errorArgs);
		}
	}
};
