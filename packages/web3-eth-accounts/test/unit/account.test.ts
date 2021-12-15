import { isHexStrict, Address, utf8ToHex } from 'web3-utils';
import {
	create,
	privateKeyToAccount,
	signTransaction,
	recoverTransaction,
	hashMessage,
	sign,
	recover,
} from '../../src/account';
import {
	validPrivateKeytoAccountData,
	invalidPrivateKeytoAccountData,
	signatureRecoverData,
	transactionsTestData,
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
});
