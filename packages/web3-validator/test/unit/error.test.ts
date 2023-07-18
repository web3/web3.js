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
import { Web3ValidationErrorObject } from 'web3-types';

import { Web3ValidatorError } from '../../src/errors';
import {
	fullErrors,
	errorsWithInstanceNoParamsNoMessage,
	unspecifiedErrors,
} from '../fixtures/errors';

describe('Web3ValidationError', () => {
	it.each(fullErrors)('errors with message', (error: Web3ValidationErrorObject) => {
		const validationError = new Web3ValidatorError([error]);

		expect(validationError).toBeInstanceOf(Web3ValidatorError);
		expect(validationError.message).toBe(`Web3 validator found 1 error[s]:\n${error.message}`);
	});

	it.each(errorsWithInstanceNoParamsNoMessage)(
		'errors with only instance',
		(error: Web3ValidationErrorObject) => {
			const validationError = new Web3ValidatorError([error]);

			expect(validationError).toBeInstanceOf(Web3ValidatorError);
			expect(validationError.message).toBe(
				`Web3 validator found 1 error[s]:\nunspecified error`,
			);
		},
	);

	it.each(unspecifiedErrors)('unspecified errors', (error: Web3ValidationErrorObject) => {
		const validationError = new Web3ValidatorError([error]);

		expect(validationError).toBeInstanceOf(Web3ValidatorError);
		expect(validationError.message).toBe(`Web3 validator found 1 error[s]:\nunspecified error`);
	});
});
