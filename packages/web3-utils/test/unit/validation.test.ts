/* eslint-disable jest/no-conditional-expect */

import { InvalidBlockError } from '../../src/errors';
import { compareBlockNumbers } from '../../src/validation';
import {
	compareBlockNumbersInvalidData,
	compareBlockNumbersValidData,
} from '../fixtures/validation';

describe('validation', () => {
	describe('compareBlockNumbers', () => {
		it.each([...compareBlockNumbersValidData, ...compareBlockNumbersInvalidData])(
			'%s',
			(input, output) => {
				if (output instanceof InvalidBlockError) {
					expect(() => compareBlockNumbers(input[0], input[1])).toThrow(output);
				} else {
					expect(compareBlockNumbers(input[0], input[1])).toEqual(output);
				}
			},
		);
	});
});
