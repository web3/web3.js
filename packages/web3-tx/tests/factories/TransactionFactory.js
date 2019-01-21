import TransactionFactory from '../../src/factories/TransactionFactory';
import Transaction from '../../src/Transaction';

// Mocks
jest.mock('../../src/Transaction');

/**
 * TransactionFactory test
 */
describe('TransactionFactoryTest', () => {
    let transactionFactory;

    beforeEach(() => {
        transactionFactory = new TransactionFactory();
    });

    it('calls createTransaction and returns Transaction object', () => {
        expect(transactionFactory.createTransaction()).toBeInstanceOf(Transaction);
    });
});
