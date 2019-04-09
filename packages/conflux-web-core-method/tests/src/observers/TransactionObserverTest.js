import {NewHeadsSubscription} from 'conflux-web-core-subscriptions';
import GetTransactionReceiptMethod from '../../../src/methods/transaction/GetTransactionReceiptMethod';
import GetBlockByNumberMethod from '../../../src/methods/block/GetBlockByNumberMethod';
import TransactionObserver from '../../../src/observers/TransactionObserver';

// Mocks
jest.mock('conflux-web-core-subscriptions');
jest.mock('../../../src/methods/transaction/GetTransactionReceiptMethod');
jest.mock('../../../src/methods/block/GetBlockByNumberMethod');

/**
 * TransactionObserver test
 */
describe('TransactionObserverTest', () => {
    let transactionObserver,
        providerMock,
        getTransactionReceiptMethodMock,
        getBlockByNumberMethodMock,
        newHeadsSubscriptionMock;

    beforeEach(() => {
        providerMock = {supportsSubscriptions: jest.fn()};

        new GetTransactionReceiptMethod();
        getTransactionReceiptMethodMock = GetTransactionReceiptMethod.mock.instances[0];

        new GetBlockByNumberMethod();
        getBlockByNumberMethodMock = GetBlockByNumberMethod.mock.instances[0];

        new NewHeadsSubscription();
        newHeadsSubscriptionMock = NewHeadsSubscription.mock.instances[0];

        transactionObserver = new TransactionObserver(
            providerMock,
            2,
            1,
            getTransactionReceiptMethodMock,
            getBlockByNumberMethodMock,
            newHeadsSubscriptionMock
        );
    });

    it('constructor check', () => {
        expect(transactionObserver.provider).toEqual(providerMock);

        expect(transactionObserver.timeout).toEqual(2);

        expect(transactionObserver.blockConfirmations).toEqual(1);

        expect(transactionObserver.getTransactionReceiptMethod).toEqual(getTransactionReceiptMethodMock);

        expect(transactionObserver.getBlockByNumberMethod).toEqual(getBlockByNumberMethodMock);

        expect(transactionObserver.newHeadsSubscription).toEqual(newHeadsSubscriptionMock);

        expect(transactionObserver.blockNumbers).toEqual([]);

        expect(transactionObserver.lastBlock).toEqual(false);

        expect(transactionObserver.confirmations).toEqual(0);

        expect(transactionObserver.confirmationChecks).toEqual(0);

        expect(transactionObserver.interval).toEqual(false);
    });

    it('calls observe with a socket provider and returns a transaction receipt', (done) => {
        transactionObserver.blockConfirmations = 2;

        providerMock.supportsSubscriptions.mockReturnValueOnce(true);

        const blockHeadOne = {
            number: 0
        };

        const blockHeadTwo = {
            number: 1
        };

        const receipt = {};

        newHeadsSubscriptionMock.subscribe = jest.fn((callback) => {
            callback(false, blockHeadOne);
            callback(false, blockHeadTwo);
        });

        newHeadsSubscriptionMock.unsubscribe.mockReturnValueOnce(Promise.resolve(true));

        getTransactionReceiptMethodMock.execute.mockReturnValueOnce(Promise.resolve(receipt));
        getTransactionReceiptMethodMock.execute.mockReturnValueOnce(Promise.resolve(receipt));

        transactionObserver.observe('transactionHash').subscribe(
            (transactionConfirmation) => {
                if (transactionConfirmation.confirmations === 1) {
                    expect(transactionConfirmation.receipt).toEqual(receipt);

                    return;
                }

                expect(transactionConfirmation.receipt).toEqual(receipt);
                expect(transactionConfirmation.confirmations).toEqual(2);
            },
            () => {},
            () => {
                expect(providerMock.supportsSubscriptions).toHaveBeenCalled();

                expect(newHeadsSubscriptionMock.unsubscribe).toHaveBeenCalled();

                done();
            }
        );
    });

    it('calls observe with a socket provider and throws an timeout error', (done) => {
        transactionObserver.blockConfirmations = 2;
        transactionObserver.timeout = 1;

        providerMock.supportsSubscriptions.mockReturnValueOnce(true);

        const blockHeadOne = {
            number: 0
        };

        const receipt = {};

        newHeadsSubscriptionMock.subscribe = jest.fn((callback) => {
            callback(false, blockHeadOne);
        });

        newHeadsSubscriptionMock.unsubscribe.mockReturnValueOnce(Promise.resolve(true));

        getTransactionReceiptMethodMock.execute.mockReturnValueOnce(Promise.resolve(receipt));

        transactionObserver.observe('transactionHash').subscribe(
            (transactionConfirmation) => {
                expect(transactionConfirmation.receipt).toEqual(receipt);
            },
            (error) => {
                expect(error.error).toEqual(
                    new Error(
                        'Timeout exceeded during the transaction confirmation process. Be aware the transaction could still get confirmed!'
                    )
                );

                expect(providerMock.supportsSubscriptions).toHaveBeenCalled();

                expect(error.receipt).toEqual(receipt);

                expect(error.confirmations).toEqual(1);

                expect(error.confirmationChecks).toEqual(1);

                expect(newHeadsSubscriptionMock.unsubscribe).toHaveBeenCalled();

                done();
            }
        );
    });

    it('calls observe with a socket provider and the newHeads subscription returns a error', (done) => {
        transactionObserver.blockConfirmations = 2;

        providerMock.supportsSubscriptions.mockReturnValueOnce(true);

        newHeadsSubscriptionMock.subscribe = jest.fn((callback) => {
            callback(true, false);
        });

        transactionObserver.observe('transactionHash').subscribe(
            () => {},
            (error) => {
                expect(error.error).toEqual(true);

                expect(providerMock.supportsSubscriptions).toHaveBeenCalled();

                expect(error.receipt).toEqual(false);

                expect(error.confirmations).toEqual(0);

                expect(error.confirmationChecks).toEqual(0);

                done();
            }
        );
    });

    it('calls observe with a http provider and returns a transaction receipt', (done) => {
        transactionObserver.blockConfirmations = 2;

        providerMock.supportsSubscriptions.mockReturnValueOnce(false);

        const receipt = {blockNumber: '0xa'};
        const blockOne = {number: '0xa', hash: '0x0'};
        const blockTwo = {number: '0xc', parentHash: '0x0'};

        getTransactionReceiptMethodMock.execute
            .mockReturnValueOnce(Promise.resolve(receipt))
            .mockReturnValueOnce(Promise.resolve(receipt));

        getBlockByNumberMethodMock.execute
            .mockReturnValueOnce(Promise.resolve(blockOne))
            .mockReturnValueOnce(Promise.resolve(blockTwo));

        transactionObserver.observe('transactionHash').subscribe(
            (transactionConfirmation) => {
                if (transactionConfirmation.confirmations === 1) {
                    expect(transactionConfirmation.receipt).toEqual(receipt);
                    expect(transactionObserver.lastBlock).toEqual(blockOne);

                    return;
                }

                expect(transactionConfirmation.receipt).toEqual(receipt);
                expect(transactionConfirmation.confirmations).toEqual(2);
                expect(transactionObserver.lastBlock).toEqual(blockTwo);
            },
            () => {},
            () => {
                expect(getTransactionReceiptMethodMock.execute).toHaveBeenCalledTimes(2);

                expect(providerMock.supportsSubscriptions).toHaveBeenCalled();

                expect(getTransactionReceiptMethodMock.parameters).toEqual(['transactionHash']);

                expect(getBlockByNumberMethodMock.parameters).toEqual(['0xb']);

                done();
            }
        );
    });

    it('calls observe with a http provider and the timeout got exceeded', (done) => {
        transactionObserver.blockConfirmations = 2;
        transactionObserver.timeout = 1;

        providerMock.supportsSubscriptions.mockReturnValueOnce(false);

        const receipt = {blockNumber: '0xa'};
        const blockOne = {number: '0xa', hash: '0x0'};

        getTransactionReceiptMethodMock.execute.mockReturnValueOnce(Promise.resolve(receipt));

        getBlockByNumberMethodMock.execute.mockReturnValueOnce(Promise.resolve(blockOne));

        transactionObserver.observe('transactionHash').subscribe(
            (transactionConfirmation) => {
                expect(transactionConfirmation.receipt).toEqual(receipt);
                expect(transactionObserver.lastBlock).toEqual(blockOne);
            },
            (error) => {
                expect(error.error).toEqual(
                    new Error(
                        'Timeout exceeded during the transaction confirmation process. Be aware the transaction could still get confirmed!'
                    )
                );
                expect(error.receipt).toEqual(receipt);
                expect(error.confirmations).toEqual(1);
                expect(error.confirmationChecks).toEqual(1);

                expect(providerMock.supportsSubscriptions).toHaveBeenCalled();

                expect(getTransactionReceiptMethodMock.execute).toHaveBeenCalledTimes(1);

                expect(getTransactionReceiptMethodMock.parameters).toEqual(['transactionHash']);

                done();
            }
        );
    });

    it('calls observe with a http provider and the getTransactionMethod throws an error', (done) => {
        transactionObserver.blockConfirmations = 2;
        transactionObserver.timeout = 1;

        providerMock.supportsSubscriptions.mockReturnValueOnce(false);

        getTransactionReceiptMethodMock.execute = jest.fn(() => {
            return Promise.reject(new Error('ERROR'));
        });

        transactionObserver.observe('transactionHash').subscribe(
            (transactionConfirmation) => {},
            (error) => {
                expect(error.error).toEqual(new Error('ERROR'));
                expect(error.receipt).toEqual(false);
                expect(error.confirmations).toEqual(0);
                expect(error.confirmationChecks).toEqual(0);

                expect(providerMock.supportsSubscriptions).toHaveBeenCalled();

                expect(getTransactionReceiptMethodMock.execute).toHaveBeenCalledTimes(1);

                expect(getTransactionReceiptMethodMock.parameters).toEqual(['transactionHash']);

                done();
            }
        );
    });
});
