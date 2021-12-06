import { isHexStrict } from 'web3-utils';
import { create, privateKeyToAccount } from '../../src/account';
import { validPrivateKeytoAccountData, invalidPrivateKeytoAccountData } from '../fixtures/account';

describe('accounts', () => {
	describe('create', () => {
		describe('valid cases', () => {
			it('%s', () => {
				const account = create();
				expect(typeof account.privateKey).toBe('string');
				expect(typeof account.address).toBe('string');
				expect(isHexStrict(account.address)).toBe(true);
				expect(typeof account.encrypt).toBe('function');
				expect(typeof account.sign).toBe('function');
				expect(typeof account.signTransaction).toBe('function');
			});
		});
	});

	describe('privateKeyToAccount', () => {
		describe('valid cases', () => {
			it.each(validPrivateKeytoAccountData)('%s', (input, output) => {
				expect(privateKeyToAccount(input)).toEqual(output);
			});
		});
		describe('invalid cases', () => {
			it.each(invalidPrivateKeytoAccountData)('%s', (input, output) => {
				expect(() => privateKeyToAccount(input)).toThrow(output);
			});
		});
	});
});
