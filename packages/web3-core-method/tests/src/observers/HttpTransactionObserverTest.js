import GetTransactionReceiptMethod from '../../../src/methods/transaction/GetTransactionReceiptMethod';
import GetBlockByNumberMethod from '../../../src/methods/block/GetBlockByNumberMethod';
import AbstractTransactionObserver from '../../../lib/observers/AbstractTransactionObserver';
import HttpTransactionObserver from '../../../src/observers/HttpTransactionObserver';

// Mocks
jest.mock('../../../src/methods/transaction/GetTransactionReceiptMethod');
jest.mock('../../../src/methods/block/GetBlockByNumberMethod');

/**
 * HttpTransactionObserver test
 */
describe('HttpTransactionObserverTest', () => {
    let httpTransactionObserver, getTransactionReceiptMethodMock, getBlockByNumberMethodMock;

    beforeEach(() => {
        new GetTransactionReceiptMethod();
        getTransactionReceiptMethodMock = GetTransactionReceiptMethod.mock.instances[0];

        new GetBlockByNumberMethod();
        getBlockByNumberMethodMock = GetBlockByNumberMethod.mock.instances[0];

        httpTransactionObserver = new HttpTransactionObserver(
            {},
            2,
            1,
            getTransactionReceiptMethodMock,
            getBlockByNumberMethodMock
        );
    });

    it('constructor check', () => {
        expect(httpTransactionObserver.provider).toEqual({});

        expect(httpTransactionObserver.timeout).toEqual(2);

        expect(httpTransactionObserver.blockConfirmations).toEqual(1);

        expect(httpTransactionObserver.getTransactionReceiptMethod).toEqual(getTransactionReceiptMethodMock);

        expect(httpTransactionObserver.getBlockByNumberMethod).toEqual(getBlockByNumberMethodMock);

        expect(httpTransactionObserver.lastBlock).toEqual(false);

        expect(httpTransactionObserver).toBeInstanceOf(AbstractTransactionObserver);
    });

    it('calls observe and returns the expected transaction receipt', (done) => {
        httpTransactionObserver.blockConfirmations = 2;

        const receipt = {blockNumber: 1};
        const blockOne = {number: 1, hash: '0x0'};
        const blockTwo = {number: 2, parentHash: '0x0'};

        getTransactionReceiptMethodMock.execute
            .mockReturnValueOnce(Promise.resolve(receipt))
            .mockReturnValueOnce(Promise.resolve(receipt))
            .mockReturnValueOnce(Promise.resolve(receipt));

        getBlockByNumberMethodMock.execute
            .mockReturnValueOnce(Promise.resolve(blockOne))
            .mockReturnValueOnce(Promise.resolve(blockTwo));

        httpTransactionObserver.observe('transactionHash').subscribe(
            (transactionConfirmation) => {
                if (transactionConfirmation.confirmations === 1) {
                    expect(transactionConfirmation.receipt).toEqual(receipt);
                    expect(httpTransactionObserver.lastBlock).toEqual(blockOne);

                    return;
                }

                expect(transactionConfirmation.receipt).toEqual(receipt);
                expect(transactionConfirmation.confirmations).toEqual(2);
                expect(httpTransactionObserver.lastBlock).toEqual(blockTwo);
            },
            () => {},
            () => {
                expect(getTransactionReceiptMethodMock.execute).toHaveBeenCalledTimes(3);

                expect(getTransactionReceiptMethodMock.parameters).toEqual(['transactionHash']);

                expect(getBlockByNumberMethodMock.parameters).toEqual([2]);

                done();
            }
        );
    });

    it('calls observe and the timeout got exceeded', (done) => {
        httpTransactionObserver.blockConfirmations = 2;
        httpTransactionObserver.timeout = 1;

        const receipt = {blockNumber: 1};
        const blockOne = {number: 1, hash: '0x0'};

        getTransactionReceiptMethodMock.execute
            .mockReturnValueOnce(Promise.resolve(receipt))
            .mockReturnValueOnce(Promise.resolve(receipt));

        getBlockByNumberMethodMock.execute
            .mockReturnValueOnce(Promise.resolve(blockOne))
            .mockReturnValueOnce(Promise.resolve(blockOne));

        httpTransactionObserver.observe('transactionHash').subscribe(
            (transactionConfirmation) => {
                expect(transactionConfirmation.receipt).toEqual(receipt);
                expect(httpTransactionObserver.lastBlock).toEqual(blockOne);
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

                expect(getTransactionReceiptMethodMock.execute).toHaveBeenCalledTimes(2);

                expect(getTransactionReceiptMethodMock.parameters).toEqual(['transactionHash']);

                done();
            }
        );
    });

    it('calls observe and getTransactionReceipt throws a error', (done) => {
        httpTransactionObserver.blockConfirmations = 2;
        httpTransactionObserver.timeout = 1;

        getTransactionReceiptMethodMock.execute = jest.fn(() => {
            return Promise.reject(new Error('ERROR'));
        });

        httpTransactionObserver.observe('transactionHash').subscribe(
            () => {},
            (error) => {
                expect(error.error).toEqual(new Error('ERROR'));
                expect(error.receipt).toEqual(false);
                expect(error.confirmations).toEqual(0);
                expect(error.confirmationChecks).toEqual(0);

                expect(getTransactionReceiptMethodMock.execute).toHaveBeenCalledTimes(1);

                expect(getTransactionReceiptMethodMock.parameters).toEqual(['transactionHash']);

                done();
            }
        );
    });

    it('calls observe with blockConfirmations set to 0 and returns the expected receipt', (done) => {
        httpTransactionObserver.blockConfirmations = 0;

        getTransactionReceiptMethodMock.execute.mockReturnValueOnce(Promise.resolve({blockNumber: 1}));

        httpTransactionObserver.observe('transactionHash').subscribe(
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
        httpTransactionObserver.blockConfirmations = 0;

        getTransactionReceiptMethodMock.execute.mockReturnValueOnce(Promise.resolve(null));

        httpTransactionObserver.observe('transactionHash').subscribe(
            () => {},
            (error) => {
                expect(error.error).toEqual(
                    new Error(
                        'No transaction receipt found! Increase the transactionConfirmationBlocks property or be sure automine is activated in your development environment.'
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
});
