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

/* eslint-disable max-classes-per-file */

import {
	ERR_ABI_ENCODING,
	ERR_FORMATTERS,
	ERR_METHOD_NOT_IMPLEMENTED,
	ERR_OPERATION_ABORT,
	ERR_OPERATION_TIMEOUT,
	ERR_PARAM,
} from '../error_codes';
import { Web3Error } from '../web3_error_base';

export class InvalidNumberOfParamsError extends Web3Error {
	public code = ERR_PARAM;

	public constructor(public got: number, public expected: number, public method: string) {
		super(`Invalid number of parameters for "${method}". Got "${got}" expected "${expected}"!`);
	}

	public toJSON() {
		return {
			...super.toJSON(),
			got: this.got,
			expected: this.expected,
			method: this.method,
		};
	}
}

export class FormatterError extends Web3Error {
	public code = ERR_FORMATTERS;
}

export class MethodNotImplementedError extends Web3Error {
	public code = ERR_METHOD_NOT_IMPLEMENTED;

	public constructor() {
		super("The method you're trying to call is not implemented.");
	}
}

export class OperationTimeoutError extends Web3Error {
	public code = ERR_OPERATION_TIMEOUT;
}

export class OperationAbortError extends Web3Error {
	public code = ERR_OPERATION_ABORT;
}

export class AbiError extends Web3Error {
	public code = ERR_ABI_ENCODING;
}
