import {NewHeadsSubscription} from 'web3-core-subscriptions';
import GetTransactionReceiptMethod from '../../../src/methods/transaction/GetTransactionReceiptMethod';
import SocketTransactionObserver from '../../../src/observers/SocketTransactionObserver';
import AbstractTransactionObserver from '../../../lib/observers/AbstractTransactionObserver';

// Mocks
jest.mock('web3-core-subscriptions');
jest.mock('../../../src/methods/transaction/GetTransactionReceiptMethod');

/**
 * SocketTransactionObserver test
 */
describe('SocketTransactionObserverTest', () => {
    let socketTransactionObserver, getTransactionReceiptMethodMock, newHeadsSubscriptionMock;

    beforeEach(() => {
        new GetTransactionReceiptMethod();
        getTransactionReceiptMethodMock = GetTransactionReceiptMethod.mock.instances[0];

        new NewHeadsSubscription();
        newHeadsSubscriptionMock = NewHeadsSubscription.mock.instances[0];

        socketTransactionObserver = new SocketTransactionObserver(
            {},
            2,
            1,
            getTransactionReceiptMethodMock,
            newHeadsSubscriptionMock
        );
    });

    it('constructor check', () => {
        expect(socketTransactionObserver.provider).toEqual({});

        expect(socketTransactionObserver.timeout).toEqual(2);

        expect(socketTransactionObserver.blockConfirmations).toEqual(1);

        expect(socketTransactionObserver.getTransactionReceiptMethod).toEqual(getTransactionReceiptMethodMock);

        expect(socketTransactionObserver.newHeadsSubscription).toEqual(newHeadsSubscriptionMock);

        expect(socketTransactionObserver.blockNumbers).toEqual([]);

        expect(socketTransactionObserver).toBeInstanceOf(AbstractTransactionObserver);
    });

    it('calls observe and returns the expected transaction receipt', (done) => {
        socketTransactionObserver.blockConfirmations = 2;

        const blockHeadOne = {
            number: 0
        };

        const blockHeadTwo = {
            number: 1
        };

        const receipt = {blockNumber: true};

        newHeadsSubscriptionMock.subscribe = jest.fn((callback) => {
            callback(false, blockHeadOne);
            callback(false, blockHeadTwo);
        });

        newHeadsSubscriptionMock.unsubscribe.mockReturnValueOnce(Promise.resolve(true));

        getTransactionReceiptMethodMock.execute
            .mockReturnValueOnce(Promise.resolve(receipt))
            .mockReturnValueOnce(Promise.resolve(receipt))
            .mockReturnValueOnce(Promise.resolve(receipt));

        socketTransactionObserver.observe('transactionHash').subscribe(
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
                expect(newHeadsSubscriptionMock.unsubscribe).toHaveBeenCalled();

                done();
            }
        );
    });

    it('calls observe and it returns the expected value also with blockNumber set to 0', (done) => {
        socketTransactionObserver.blockConfirmations = 2;

        const blockHeadOne = {
            number: 0
        };

        const blockHeadTwo = {
            number: 1
        };

        const receipt = {blockNumber: 0};

        newHeadsSubscriptionMock.subscribe = jest.fn((callback) => {
            callback(false, blockHeadOne);
            callback(false, blockHeadTwo);
        });

        newHeadsSubscriptionMock.unsubscribe.mockReturnValueOnce(Promise.resolve(true));

        getTransactionReceiptMethodMock.execute
            .mockReturnValueOnce(Promise.resolve(receipt))
            .mockReturnValueOnce(Promise.resolve(receipt))
            .mockReturnValueOnce(Promise.resolve(receipt));

        socketTransactionObserver.observe('transactionHash').subscribe(
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
                expect(newHeadsSubscriptionMock.unsubscribe).toHaveBeenCalled();

                done();
            }
        );
    });

    it('calls observe throws an timeout error', (done) => {
        socketTransactionObserver.blockConfirmations = 2;
        socketTransactionObserver.timeout = 1;

        const blockHeadOne = {
            number: 0
        };

        const receipt = {blockNumber: true};

        newHeadsSubscriptionMock.subscribe = jest.fn((callback) => {
            callback(false, blockHeadOne);
        });

        newHeadsSubscriptionMock.unsubscribe.mockReturnValueOnce(Promise.resolve(true));

        getTransactionReceiptMethodMock.execute
            .mockReturnValueOnce(Promise.resolve(receipt))
            .mockReturnValueOnce(Promise.resolve(receipt));

        socketTransactionObserver.observe('transactionHash').subscribe(
            (transactionConfirmation) => {
                expect(transactionConfirmation.receipt).toEqual(receipt);
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

                expect(newHeadsSubscriptionMock.unsubscribe).toHaveBeenCalled();

                done();
            }
        );
    });

    it('calls observe and the newHeads subscription returns a error', (done) => {
        socketTransactionObserver.blockConfirmations = 2;

        getTransactionReceiptMethodMock.execute.mockReturnValueOnce(Promise.resolve(false));

        newHeadsSubscriptionMock.subscribe = jest.fn((callback) => {
            callback(true, false);
        });

        socketTransactionObserver.observe('transactionHash').subscribe(
            () => {},
            (error) => {
                expect(error.error).toEqual(true);

                expect(error.receipt).toEqual(false);

                expect(error.confirmations).toEqual(0);

                expect(error.confirmationChecks).toEqual(0);

                done();
            }
        );
    });

    it('calls observe with blockConfirmations set to 0 and returns the expected receipt', (done) => {
        socketTransactionObserver.blockConfirmations = 0;

        getTransactionReceiptMethodMock.execute.mockReturnValueOnce(Promise.resolve({blockNumber: 1}));

        socketTransactionObserver.observe('transactionHash').subscribe(
            (transactionConfirmation) => {
                expect(transactionConfirmation.receipt).toEqual({blockNumber: 1});

                expect(transactionConfirmation.confirmations).toEqual(0);
            },
            () => {},
            () => {
                expect(getTransactionReceiptMethodMock.execute).toHaveBeenCalledTimes(1);

                expect(getTransactionReceiptMethodMock.parameters).toEqual(['transactionHash']);

                done();
            }
        );
    });

    it('calls observe with blockConfirmations set to 0 and throws the expected error', (done) => {
        socketTransactionObserver.blockConfirmations = 0;

        getTransactionReceiptMethodMock.execute.mockReturnValueOnce(Promise.resolve(null));

        socketTransactionObserver.observe('transactionHash').subscribe(
            () => {},
            (error) => {
                expect(error.error).toEqual(
                    new Error(
                        'No transaction receipt found! Increase the transactionConfirmationBlocks property or enable automine/instant-seal in your Ethereumm node settings'
                    )
                );
                expect(error.receipt).toEqual(false);
                expect(error.confirmations).toEqual(0);
                expect(error.confirmationChecks).toEqual(0);

                expect(getTransactionReceiptMethodMock.execute).toHaveBeenCalledTimes(1);

                expect(getTransactionReceiptMethodMock.parameters).toEqual(['transactionHash']);

                done();
            }
        );
    });

    it('calls observe and the first getTransactionReceiptCall rejects with the expected error', (done) => {
        socketTransactionObserver.blockConfirmations = 0;

        getTransactionReceiptMethodMock.execute.mockReturnValueOnce(Promise.reject(new Error('ERROR')));

        socketTransactionObserver.observe('transactionHash').subscribe(
            () => {},
            (error) => {
                expect(error.error).toEqual(new Error('ERROR'));
                expect(error.receipt).toEqual(false);
                expect(error.confirmations).toEqual(0);
                expect(error.confirmationChecks).toEqual(0);

                done();
            }
        );
    });
});
