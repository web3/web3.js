import { isHexStrict } from 'web3-utils';
import { create, privateKeyToAccount, encrypt, decrypt } from '../../src/account';
import {
	validPrivateKeytoAccountData,
	invalidPrivateKeytoAccountData,
	validEncryptData,
	validDecryptData,
	invalidDecryptData,
	invalidEncryptData,
} from '../fixtures/account';

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

	describe('encrypt', () => {
		describe('valid cases', () => {
			it.each(validEncryptData)('%s', async (input, output) => {
				const result = await encrypt(input[0], input[1], input[2]).catch(err => {
					throw err;
				});
				expect(result.version).toBe(output.version);
				expect(result.address).toBe(output.address);
				expect(result.crypto.ciphertext).toBe(output.crypto.ciphertext);
				expect(result.crypto.cipherparams).toEqual(output.crypto.cipherparams);
				expect(result.crypto.cipher).toEqual(output.crypto.cipher);
				expect(result.crypto.kdf).toBe(output.crypto.kdf);
				expect(result.crypto.kdfparams).toEqual(output.crypto.kdfparams);
				expect(typeof result.version).toBe('number');
				expect(typeof result.id).toBe('string');
				expect(typeof result.crypto.mac).toBe('string');
			});
		});

		describe('invalid cases', () => {
			it.each(invalidEncryptData)('%s', async (input, output) => {
				const result = encrypt(input[0], input[1], input[2]);
				await expect(result).rejects.toThrow(output);
			});
		});
	});
	describe('decrypt', () => {
		describe('valid cases', () => {
			it.each(validDecryptData)('%s', async input => {
				const keystore = await encrypt(input[0], input[1], input[2]).catch(err => {
					throw err;
				});

				// make sure decrypt does not throw invalid password error
				const result = await decrypt(keystore, input[1]).catch(err => {
					throw err;
				});
				expect(result).toEqual(privateKeyToAccount(input[3].slice(2)));

				const keystoreString = JSON.stringify(keystore);

				const stringResult = await decrypt(keystoreString, input[1], true).catch(err => {
					throw err;
				});
				expect(stringResult).toEqual(privateKeyToAccount(input[3].slice(2)));
			});
		});
		describe('invalid cases', () => {
			it.each(invalidDecryptData)('%s', async (input, output) => {
				const result = decrypt(input[0], input[1]);

				await expect(result).rejects.toThrow(output);
			});
		});
	});
});
