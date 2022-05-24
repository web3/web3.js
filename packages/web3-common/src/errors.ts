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

import { ERR_INVALID_RESPONSE, ERR_RESPONSE, Web3Error } from 'web3-errors';
import { isResponseWithError } from './json_rpc';
import { JsonRpcResponse } from './types';

const buildErrorMessage = (response: JsonRpcResponse<unknown, unknown>): string =>
	isResponseWithError(response) ? response.error.message : '';

export class ResponseError<ErrorType = unknown> extends Web3Error {
	public code = ERR_RESPONSE;
	public data?: ErrorType | ErrorType[];

	public constructor(response: JsonRpcResponse<unknown, ErrorType>, message?: string) {
		super(
			message ??
				`Returned error: ${
					Array.isArray(response)
						? response.map(r => buildErrorMessage(r)).join(',')
						: buildErrorMessage(response)
				}`,
		);

		if (!message) {
			this.data = Array.isArray(response)
				? response.map(r => r.error?.data as ErrorType)
				: response?.error?.data;
		}
	}

	public toJSON() {
		return { ...super.toJSON(), data: this.data };
	}
}

export class InvalidResponseError<ErrorType = unknown> extends ResponseError<ErrorType> {
	public constructor(result: JsonRpcResponse<unknown, ErrorType>) {
		super(result);
		if (!this.message || this.message === '') {
			this.message = `Invalid JSON RPC response: ${JSON.stringify(result)}`;
		}
		this.code = ERR_INVALID_RESPONSE;
	}
}
