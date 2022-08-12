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

import { Web3Error as ErrorInterface } from 'web3-types';

export abstract class Web3Error extends Error implements ErrorInterface {
	public readonly name: string;
	public abstract readonly code: number;
	public stack: string | undefined;

	public constructor(msg?: string) {
		super(msg);
		this.name = this.constructor.name;

		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(new.target.constructor);
		} else {
			this.stack = new Error().stack;
		}
	}

	public static convertToString(value: unknown, unquotValue = false) {
		// Using "null" value intentionally for validation
		// eslint-disable-next-line no-null/no-null
		if (value === null || value === undefined) return 'undefined';

		const result = JSON.stringify(
			value,
			(_, v) => (typeof v === 'bigint' ? v.toString() : v) as unknown,
		);

		return unquotValue && ['bigint', 'string'].includes(typeof value)
			? result.replace(/['\\"]+/g, '')
			: result;
	}

	public toJSON() {
		return { name: this.name, code: this.code, message: this.message };
	}
}

export abstract class InvalidValueError extends Web3Error {
	public readonly name: string;

	public constructor(value: unknown, msg: string) {
		super(`Invalid value given "${Web3Error.convertToString(value, true)}". Error: ${msg}.`);
		this.name = this.constructor.name;
	}
}
