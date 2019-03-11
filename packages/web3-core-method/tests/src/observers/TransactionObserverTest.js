import TransactionObserver from '../../../src/observers/TransactionObserver';

// Mocks
jest.mock('');

/**
 * TransactionObserver test
 */
describe('TransactionObserverTest', () => {
    let transactionObserver,
        providerMock,
        getTransactionReceiptMethodMock,
        getBlockByHashMethodMock,
        newHeadsSubscriptionMock;

    beforeEach(() => {
        transactionObserver = new TransactionObserver(
            providerMock,
            2,
            1,
            getTransactionReceiptMethodMock,
            getBlockByHashMethodMock,
            newHeadsSubscriptionMock
        );
    });

    it('constructor check', () => {
        expect(transactionObserver.provider).toEqual(providerMock);

        expect(transactionObserver.timeout).toEqual(2);

        expect(transactionObserver.blockConfirmations).toEqual(1);

        expect(transactionObserver.getTransactionReceiptMethod).toEqual(getTransactionReceiptMethodMock);

        expect(transactionObserver.getBlockByHashMethod).toEqual(getBlockByHashMethodMock);

        expect(transactionObserver.newHeadsSubscription).toEqual(newHeadsSubscriptionMock);
    });

    it('', () => {});
});
