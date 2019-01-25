import Accounts from '../../__mocks__/Accounts';
import TransactionSigner from '../../../src/signers/TransactionSigner';

/**
 * TransactionSigner test
 */
describe('TransactionSignerTest', () => {
    let transactionSigner, accountsMock;

    beforeEach(() => {
        accountsMock = new Accounts();
        accountsMock.signTransaction = jest.fn();

        transactionSigner = new TransactionSigner(accountsMock);
    });

    it('calls sign and throws error', () => {
        transactionSigner.sign({from: 0}, accountsMock).catch((error) => {
            expect(error.message).toEqual('Wallet or privateKey in wallet is not set!');
        });
    });

    it('calls sign and returns signed transaction', async () => {
        accountsMock.wallet[0] = {privateKey: '0x0'};
        const transaction = {
            from: 0
        };

        accountsMock.signTransaction.mockReturnValueOnce(Promise.resolve('0x0'));

        const returnValue = await transactionSigner.sign(transaction, accountsMock);

        expect(returnValue).toEqual('0x0');

        expect(transaction.from).toEqual(undefined);

        expect(accountsMock.signTransaction).toHaveBeenCalledWith(transaction, '0x0');
    });

    it('calls sign and signing with accounts throws an error', async () => {
        accountsMock.wallet[0] = {privateKey: '0x0'};
        const transaction = {
            from: 0
        };

        accountsMock.signTransaction.mockReturnValueOnce(Promise.reject(new Error()));

        try {
            await transactionSigner.sign(transaction, accountsMock);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });
});
