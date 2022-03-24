import { InvalidTransactionCall, InvalidTransactionWithSender } from '../../src/errors';
import { InvalidTransactionWithSenderData, InvalidTransactionCallData } from '../fixtures/errors';

describe('errors', () => {
	it.each(InvalidTransactionWithSenderData)('%s', (input, output) => {
		expect(() => {
			throw new InvalidTransactionWithSender(input);
		}).toThrow(output);
	});

	it.each(InvalidTransactionCallData)('%s', (input, output) => {
		expect(() => {
			throw new InvalidTransactionCall(input);
		}).toThrow(output);
	});
});
