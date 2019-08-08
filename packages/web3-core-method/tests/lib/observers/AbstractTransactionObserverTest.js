import GetTransactionReceiptMethod from '../../../src/methods/transaction/GetTransactionReceiptMethod';
import AbstractTransactionObserver from '../../../lib/observers/AbstractTransactionObserver';
import Observer from '../../__mocks__/Observer';

// Mocks
jest.mock('../../../src/methods/transaction/GetTransactionReceiptMethod');

/**
 * HttpTransactionObserver test
 */
describe('HttpTransactionObserverTest', () => {
    let abstractTransactionObserver, getTransactionReceiptMethodMock, observer;

    beforeEach(() => {
        observer = new Observer();

        new GetTransactionReceiptMethod();
        getTransactionReceiptMethodMock = GetTransactionReceiptMethod.mock.instances[0];

        abstractTransactionObserver = new AbstractTransactionObserver({}, 2, 1, getTransactionReceiptMethodMock);
    });

    it('constructor check', () => {
        expect(abstractTransactionObserver.provider).toEqual({});

        expect(abstractTransactionObserver.timeout).toEqual(2);

        expect(abstractTransactionObserver.blockConfirmations).toEqual(1);

        expect(abstractTransactionObserver.getTransactionReceiptMethod).toEqual(getTransactionReceiptMethodMock);

        expect(abstractTransactionObserver.confirmations).toEqual(0);

        expect(abstractTransactionObserver.confirmationChecks).toEqual(0);
    });

    it('calls emitNext and the mocked next method gets called as expected', (done) => {
        observer.next = jest.fn((value) => {
            expect(value).toEqual({receipt: {}, confirmations: abstractTransactionObserver.confirmations});

            done();
        });

        abstractTransactionObserver.emitNext({}, observer);
    });

    it('calls emitError and the mocked error method gets called as expected', (done) => {
        observer.error = jest.fn((value) => {
            expect(value).toEqual({
                error: {},
                receipt: {},
                confirmations: abstractTransactionObserver.confirmations,
                confirmationChecks: abstractTransactionObserver.confirmationChecks
            });

            done();
        });

        abstractTransactionObserver.emitError({}, {}, observer);
    });

    it('calls isConfirmed and returns true', () => {
        abstractTransactionObserver.confirmations = 1;
        abstractTransactionObserver.blockConfirmations = 1;

        expect(abstractTransactionObserver.isConfirmed()).toEqual(true);
    });

    it('calls isConfirmed and returns false', () => {
        abstractTransactionObserver.confirmations = 1;
        abstractTransactionObserver.blockConfirmations = 2;

        expect(abstractTransactionObserver.isConfirmed()).toEqual(false);
    });

    it('calls isTimeoutTimeExceeded and returns true', () => {
        abstractTransactionObserver.timeout = 1;
        abstractTransactionObserver.confirmationChecks = 1;

        expect(abstractTransactionObserver.isTimeoutTimeExceeded()).toEqual(true);
    });

    it('calls isTimeoutTimeExceeded and returns false', () => {
        abstractTransactionObserver.timeout = 1;
        abstractTransactionObserver.confirmationChecks = 2;

        expect(abstractTransactionObserver.isTimeoutTimeExceeded()).toEqual(false);
    });

    it('calls getTransactionReceipt and resolves to the expected value', async () => {
        getTransactionReceiptMethodMock.execute.mockReturnValueOnce(Promise.resolve({}));

        await expect(abstractTransactionObserver.getTransactionReceipt('hash')).resolves.toEqual({});

        expect(getTransactionReceiptMethodMock.parameters).toEqual(['hash']);
    });

    it('calls getTransactionReceipt and rejects the expected value', async () => {
        getTransactionReceiptMethodMock.execute.mockReturnValueOnce(Promise.reject(new Error('ERROR')));

        await expect(abstractTransactionObserver.getTransactionReceipt('hash')).rejects.toEqual(new Error('ERROR'));

        expect(getTransactionReceiptMethodMock.parameters).toEqual(['hash']);
    });
});
