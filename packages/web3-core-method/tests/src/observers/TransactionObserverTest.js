import {Observable, Observer} from 'rxjs';
import {NewHeadsSubscription} from 'web3-core-subscriptions';
import TransactionObserver from '../../../src/observers/TransactionObserver';
import GetTransactionReceiptMethod from '../../../src/methods/transaction/GetTransactionReceiptMethod';
import GetBlockByNumberMethod from '../../../src/methods/block/GetBlockByNumberMethod';

// Mocks
jest.mock('Observable');
jest.mock('Observer');
jest.mock('NewHeadsSubscription');
jest.mock('../../../src/observers/TransactionObserver');
jest.mock('../../../src/methods/transaction/GetTransactionReceiptMethod');
jest.mock('../../../src/methods/block/GetBlockByNumberMethod');

/**
 * TransactionObserver test
 */
describe('TransactionObserverTest', () => {
    let transactionObserver,
        providerMock,
        getTransactionReceiptMethodMock,
        getBlockByNumberMethodMethod,
        newHeadsSubscriptionMock,
        observerMock,
        observableMock;

    beforeEach(() => {
        new TransactionObserver();
        transactionObserver = TransactionObserver.mock.instances[0];

        providerMock = {};

        new GetTransactionReceiptMethod();
        getTransactionReceiptMethodMock = GetTransactionReceiptMethod.mock.instances[0];

        new GetBlockByNumberMethod();
        getBlockByNumberMethodMethod = GetBlockByNumberMethod.mock.instances[0];

        new NewHeadsSubscription();
        newHeadsSubscriptionMock = NewHeadsSubscription.mock.instances[0];

        observerMock = {};
        observableMock = {};
        observableMock.subscribe = jest.mock((next, error, complete) => {
            next();
            error();
            complete();
        });

        Observable.create = jest.fn((observableFunction) => {
            observableFunction(observerMock);

            return observableMock;
        });

        transactionObserver = new TransactionObserver(
            providerMock,
            2,
            1,
            getTransactionReceiptMethodMock,
            getBlockByNumberMethodMethod,
            newHeadsSubscriptionMock
        );
    });

    it('constructor check', () => {
        expect(transactionObserver.provider).toEqual(providerMock);

        expect(transactionObserver.timeout).toEqual(2);

        expect(transactionObserver.blockConfirmations).toEqual(1);

        expect(transactionObserver.getTransactionReceiptMethod).toEqual(getTransactionReceiptMethodMock);

        expect(transactionObserver.getBlockByNumberMethod).toEqual(getBlockByNumberMethodMethod);

        expect(transactionObserver.newHeadsSubscription).toEqual(newHeadsSubscriptionMock);

        expect(transactionObserver.blockNumbers).toEqual([]);

        expect(transactionObserver.lastBlock).toEqual(false);

        expect(transactionObserver.confirmations).toEqual(0);

        expect(transactionObserver.confirmationChecks).toEqual(0);

        expect(transactionObserver.interval).toEqual(false);
    });

    it('calls observe with a socket provider and confirms with a transaction receipt', () => {


        transactionObserver.observe('transactionHash').subscribe((transactionConfirmation) =>, );
    });
});
