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

import { Web3ValidationErrorObject } from './types';

const errorFormatter = (error: Web3ValidationErrorObject): string => {
	if (error.message && error.instancePath && error.params && error.params.value != null) {
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		return `value "${(error.params as { value: unknown }).value}" at "${error.instancePath}" ${
			error.message
		}`;
	}

	if (error.message && error.instancePath) {
		return `value at "${error.instancePath}" ${error.message}`;
	}

	if (error.instancePath) {
		return `value at "${error.instancePath}" caused unspecified error`;
	}

	if (error.message) {
		return error.message;
	}

	return 'unspecified error';
};

export class Web3ValidatorError extends Error {
	public readonly name: string;
	public readonly errors: Web3ValidationErrorObject[];

	public constructor(errors: Web3ValidationErrorObject[]) {
		super();
		this.name = this.constructor.name;
		this.errors = errors;

		this.message = `Web3 validator found ${
			this.errors.length
		} error[s]:\n${this._compileErrors().join('\n')}`;

		Error.captureStackTrace(this, Web3ValidatorError);
	}

	public toJSON() {
		return { name: this.name, message: this.message };
	}

	private _compileErrors(): string[] {
		const errorMsgs = this.errors.map(errorFormatter);
		return errorMsgs;
	}
}
