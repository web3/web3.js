import { Web3Error } from '../../src/errors';
import { ConvertValueToString } from '../fixtures/errors';

describe('Errors', () => {
	describe('value toString', () => {
		it.each(ConvertValueToString)('%s', (input, output) => {
			expect(Web3Error.convertToString(input, true)).toEqual(output);
		});
	});
});
