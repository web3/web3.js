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

import { Web3ValidatorError } from '../../src/errors';
import {
	fullErrors,
	fullErrorsWithInstance,
	errorsWithInstanceNoParams,
	errorsWithInstanceNoParamsNoMessage,
	unspecifiedErrors,
} from '../fixtures/errors';
import { Web3ValidationErrorObject } from '../../src/types';

describe('Web3ValidationError', () => {
	it.each(fullErrors)('errors with message', (error: Web3ValidationErrorObject) => {
		const validationError = new Web3ValidatorError([error]);

		expect(validationError).toBeInstanceOf(Web3ValidatorError);
		expect(validationError.message).toBe(`Web3 validator found 1 error[s]:\n${error.message}`);
	});

	it.each(fullErrorsWithInstance)(
		'errors with message, instance and params',
		(error: Web3ValidationErrorObject) => {
			const validationError = new Web3ValidatorError([error]);

			expect(validationError).toBeInstanceOf(Web3ValidatorError);
			expect(validationError.message).toBe(
				`Web3 validator found 1 error[s]:\nvalue "${
					(error.params as { value: unknown }).value
				}" at "${error.instancePath}" ${error.message}`,
			);
		},
	);

	it.each(errorsWithInstanceNoParams)(
		'errors with only message and instance',
		(error: Web3ValidationErrorObject) => {
			const validationError = new Web3ValidatorError([error]);

			expect(validationError).toBeInstanceOf(Web3ValidatorError);
			expect(validationError.message).toBe(
				`Web3 validator found 1 error[s]:\nvalue at "${error.instancePath}" ${error.message}`,
			);
		},
	);

	it.each(errorsWithInstanceNoParamsNoMessage)(
		'errors with only instance',
		(error: Web3ValidationErrorObject) => {
			const validationError = new Web3ValidatorError([error]);

			expect(validationError).toBeInstanceOf(Web3ValidatorError);
			expect(validationError.message).toBe(
				`Web3 validator found 1 error[s]:\nvalue at "${error.instancePath}" caused unspecified error`,
			);
		},
	);

	it.each(unspecifiedErrors)('unspecified errors', (error: Web3ValidationErrorObject) => {
		const validationError = new Web3ValidatorError([error]);

		expect(validationError).toBeInstanceOf(Web3ValidatorError);
		expect(validationError.message).toBe(`Web3 validator found 1 error[s]:\nunspecified error`);
	});
});
