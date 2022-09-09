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
	ERR_PROVIDER_CONNECTION_NOT_CLOSEABLE,
	ERR_PROVIDER_CONNECTION_NOT_WAITABLE,
	ERR_WAIT_FOR_OPEN_CONNECTION_TIMEOUT,
} from '../error_codes';
import { Web3Error } from '../web3_error_base';

export class WaitForOpenConnectionTimeoutError extends Web3Error {
	public code = ERR_WAIT_FOR_OPEN_CONNECTION_TIMEOUT;
	public constructor() {
		super('Maximum number of attempts exceeded');
	}
}

export class ProviderConnectionNotWaitableError extends Web3Error {
	public code = ERR_PROVIDER_CONNECTION_NOT_WAITABLE;
	public constructor() {
		super('Cannot wait on open connection for provider');
	}
}

export class ProviderConnectionNotCloseableError extends Web3Error {
	public code = ERR_PROVIDER_CONNECTION_NOT_CLOSEABLE;
	public constructor() {
		super('Cannot close open connection for provider');
	}
}
