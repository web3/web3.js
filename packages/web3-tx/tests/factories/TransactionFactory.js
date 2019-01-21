import TransactionFactory from '../../src/factories/TransactionFactory';
import Transaction from '../../src/Transaction';

// Mocks
jest.mock('../../src/Transaction');

/**
 * TransactionFactory test
 */
describe('TransactionFactoryTest', () => {
    const transaction = {
      from: "0x4f38f4229924bfa28d58eeda496cc85e8016bccc",
      to: "deploy",
      value: "42",
      gas: 3,
      gasPrice: 10000,
      data: "none",
      nonce: 0
    }
    let transactionFactory;

    beforeEach(() => {
        transactionFactory = new TransactionFactory();
    });

    it('calls createTransaction and returns Transaction object', () => {
        expect(transactionFactory.createTransaction(...transaction)).toBeInstanceOf(Transaction);
    });
});
