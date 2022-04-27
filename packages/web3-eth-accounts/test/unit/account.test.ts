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

import { Web3ValidatorError } from 'web3-validator';
import { isHexStrict, Address, utf8ToHex } from 'web3-utils';
import {
	create,
	privateKeyToAccount,
	signTransaction,
	recoverTransaction,
	hashMessage,
	sign,
	recover,
	encrypt,
	decrypt,
} from '../../src/account';
import {
	signatureRecoverData,
	transactionsTestData,
	validPrivateKeytoAccountData,
	invalidPrivateKeytoAccountData,
	validEncryptData,
	validDecryptData,
	invalidDecryptData,
	invalidKeyStore,
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
				expect(JSON.stringify(privateKeyToAccount(input))).toEqual(JSON.stringify(output));
			});
		});

		describe('invalid cases', () => {
			it.each(invalidPrivateKeytoAccountData)('%s', (input, output) => {
				expect(() => privateKeyToAccount(input)).toThrow(output);
			});
		});
	});

	describe('Signing and Recovery of Transaction', () => {
		it.each(transactionsTestData)('sign transaction', txData => {
			const account = create();

			const signedResult = signTransaction(txData, account.privateKey);
			expect(signedResult).toBeDefined();
			expect(signedResult.messageHash).toBeDefined();
			expect(signedResult.rawTransaction).toBeDefined();
			expect(signedResult.transactionHash).toBeDefined();
			expect(signedResult.r).toBeDefined();
			expect(signedResult.s).toBeDefined();
			expect(signedResult.v).toBeDefined();
		});

		it.each(transactionsTestData)('Recover transaction', txData => {
			const account = create();
			const txObj = { ...txData, from: account.address };
			const signedResult = signTransaction(txObj, account.privateKey);
			expect(signedResult).toBeDefined();

			const address: Address = recoverTransaction(signedResult.rawTransaction);
			expect(address).toBeDefined();
			expect(address).toEqual(account.address);
		});
	});

	describe('Hash Message', () => {
		it('should hash data correctly using an emoji character', () => {
			const message = '🤗';
			const dataHash = '0x716ce69c5d2d629c168bc02e24a961456bdc5a362d366119305aea73978a0332';

			const hashedMessage = hashMessage(message);
			expect(hashedMessage).toEqual(dataHash);

			const hashedMessageHex = hashMessage(utf8ToHex(message));
			expect(hashedMessageHex).toEqual(dataHash);
		});
	});

	describe('Sign Message', () => {
		it.each(signatureRecoverData)('sign test %s', (data, testObj) => {
			const result = sign(data, testObj.privateKey);
			expect(result.signature).toEqual(testObj.signature);
		});

		it.each(signatureRecoverData)('recover test %s', (data, testObj) => {
			const address = recover(data, testObj.signature);
			expect(address).toEqual(testObj.address);
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
				const result = await decrypt(keystore, input[1]);

				expect(JSON.stringify(result)).toEqual(
					JSON.stringify(privateKeyToAccount(input[3].slice(2))),
				);

				const keystoreString = JSON.stringify(keystore);

				const stringResult = await decrypt(keystoreString, input[1], true);

				expect(JSON.stringify(stringResult)).toEqual(
					JSON.stringify(privateKeyToAccount(input[3].slice(2))),
				);
			});
		});

		describe('invalid cases', () => {
			it.each(invalidDecryptData)('%s', async (input, output) => {
				const result = decrypt(input[0], input[1]);

				await expect(result).rejects.toThrow(output);
			});
		});

		describe('invalid keystore, fails validation', () => {
			it.each(invalidKeyStore)('%s', async input => {
				const result = decrypt(input[0], input[1]);

				await expect(result).rejects.toThrow(Web3ValidatorError);
			});
		});
	});
});
