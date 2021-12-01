import { create, privateKeyToAccount } from '../../src/account';
import { validPrivateKeytoAccountData } from '../fixtures/account';

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
			it.each(validPrivateKeytoAccountData)('%s', (input, output) => {
				expect(privateKeyToAccount(input)).toEqual(output);
			});
		});
	});
});
