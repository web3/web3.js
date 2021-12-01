import { create, fromPrivate } from '../../src/account';
import { validFromPrivateData } from '../fixtures/account';

describe('accounts', () => {
	describe('create', () => {
		describe('valid cases', () => {
			it.each(['', ''])('%s', () => {
				expect(create()).toBeInstanceOf('string');
			});
		});
	});

	describe('fromPrivate', () => {
		describe('valid cases', () => {
			it.each(validFromPrivateData)('%s', (input, output) => {
				expect(fromPrivate(input)).toEqual(output);
			});
		});
	});
});
