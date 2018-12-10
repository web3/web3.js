import {AbstractWeb3Module} from 'web3-core';
import {PromiEvent} from 'web3-core-promievent';
import TransactionReceiptValidator from '../../../src/validators/TransactionReceiptValidator';
import NewHeadsWatcher from '../../../src/watchers/NewHeadsWatcher';
import AbstractMethod from '../../../lib/methods/AbstractMethod';
import TransactionConfirmationWorkflow from '../../../src/workflows/TransactionConfirmationWorkflow';
import GetTransactionReceiptMethod from '../../../src/methods/transaction/GetTransactionReceiptMethod';

// Mocks
jest.mock('../../../src/validators/TransactionReceiptValidator');
jest.mock('../../../src/watchers/NewHeadsWatcher');
jest.mock('../../../src/methods/transaction/GetTransactionReceiptMethod');
jest.mock('../../../lib/methods/AbstractMethod');
jest.mock('AbstractWeb3Module');

/**
 * TransactionConfirmationWorkflow test
 */
describe('TransactionConfirmationWorkflowTest', () => {
    let transactionConfirmationWorkflow,
        transactionReceiptValidator,
        transactionReceiptValidatorMock,
        newHeadsWatcher,
        newHeadsWatcherMock,
        method,
        methodMock,
        moduleInstance,
        moduleInstanceMock,
        getTransactionReceiptMethod,
        getTransactionReceiptMethodMock,
        promiEvent;

    beforeEach(() => {
        transactionReceiptValidator = new TransactionReceiptValidator();
        transactionReceiptValidatorMock = TransactionReceiptValidator.mock.instances[0];

        newHeadsWatcher = new NewHeadsWatcher({});
        newHeadsWatcherMock = NewHeadsWatcher.mock.instances[0];

        method = new AbstractMethod();
        methodMock = AbstractMethod.mock.instances[0];

        moduleInstance = new AbstractWeb3Module({}, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];

        getTransactionReceiptMethod = new GetTransactionReceiptMethod({}, {}, {});
        getTransactionReceiptMethodMock = GetTransactionReceiptMethod.mock.instances[0];

        promiEvent = new PromiEvent();
    });

    it('constructor check', () => {
        transactionConfirmationWorkflow = new TransactionConfirmationWorkflow(
            transactionReceiptValidatorMock,
            newHeadsWatcherMock,
            getTransactionReceiptMethodMock
        );

        expect(transactionConfirmationWorkflow.transactionReceiptValidator)
            .toEqual(transactionReceiptValidatorMock);

        expect(transactionConfirmationWorkflow.newHeadsWatcher)
            .toEqual(newHeadsWatcherMock);

        expect(transactionConfirmationWorkflow.getTransactionReceiptMethod)
            .toEqual(getTransactionReceiptMethodMock);
    });

    it('calls executes and receipt does already exists but is invalid', (done) => {
        methodMock.callback = jest.fn();

        getTransactionReceiptMethodMock.execute
            .mockReturnValueOnce(Promise.resolve({blockHash: true}));

        transactionReceiptValidatorMock.validate
            .mockReturnValueOnce(false);

        transactionConfirmationWorkflow = new TransactionConfirmationWorkflow(
            transactionReceiptValidatorMock,
            newHeadsWatcherMock,
            getTransactionReceiptMethodMock
        );

        transactionConfirmationWorkflow.execute(methodMock, moduleInstanceMock, '0x0', promiEvent);

        promiEvent.catch((error) => {
            expect(error)
                .toBe(false);

            expect(getTransactionReceiptMethodMock.arguments)
                .toEqual(['0x0']);

            expect(getTransactionReceiptMethodMock.execute)
                .toHaveBeenCalledWith(moduleInstanceMock);

            expect(transactionReceiptValidatorMock.validate)
                .toHaveBeenCalledWith({blockHash: true});

            expect(transactionConfirmationWorkflow.timeoutCounter)
                .toBe(0);

            expect(transactionConfirmationWorkflow.confirmationsCounter)
                .toBe(0);

            expect(newHeadsWatcherMock.stop)
                .toHaveBeenCalled();

            expect(methodMock.callback)
                .toHaveBeenCalledWith(error, null);

            done();
        });
    });

    it('calls executes and receipt does already exists', (done) => {
        methodMock.callback = jest.fn(() => {
            done();
        });

        getTransactionReceiptMethodMock.execute
            .mockReturnValueOnce(Promise.resolve({blockHash: '0x0'}));

        transactionReceiptValidatorMock.validate
            .mockReturnValueOnce(true);

        methodMock.afterExecution
            .mockReturnValueOnce({blockHash: '0x0'});

        transactionConfirmationWorkflow = new TransactionConfirmationWorkflow(
            transactionReceiptValidatorMock,
            newHeadsWatcherMock,
            getTransactionReceiptMethodMock
        );

        transactionConfirmationWorkflow.execute(
            methodMock,
            moduleInstanceMock,
            '0x0',
            promiEvent
        );

        promiEvent.on('receipt', (receipt) => {
            expect(receipt)
                .toEqual({blockHash: '0x0'});

            expect(methodMock.callback)
                .toHaveBeenCalledWith(false, {blockHash: '0x0'});

            expect(newHeadsWatcherMock.stop)
                .toHaveBeenCalled();

            expect(methodMock.afterExecution)
                .toHaveBeenCalledWith({blockHash: '0x0'});

            expect(transactionReceiptValidatorMock.validate)
                .toHaveBeenCalledWith({blockHash: '0x0'});
        });
    });

    it('calls executes and receipt doesn\'t already exists', (done) => {
        methodMock.callback = jest.fn(() => {
            done();
        });

        getTransactionReceiptMethodMock.execute
            .mockReturnValueOnce(Promise.resolve(false));

        getTransactionReceiptMethodMock.execute
            .mockReturnValueOnce(Promise.resolve({blockHash: '0x0'}));

        newHeadsWatcherMock.on = jest.fn((name, method) => {
            expect(name)
                .toBe('newHead');

            method();
        });

        newHeadsWatcherMock.watch
            .mockReturnValueOnce(newHeadsWatcherMock);

        newHeadsWatcher.isPolling = true;
        moduleInstanceMock.transactionPollingTimeout = 10;
        moduleInstanceMock.transactionConfirmationBlocks = 0;

        transactionReceiptValidatorMock.validate
            .mockReturnValueOnce(true);

        methodMock.afterExecution
            .mockReturnValueOnce({blockHash: '0x0'});

        transactionConfirmationWorkflow = new TransactionConfirmationWorkflow(
            transactionReceiptValidatorMock,
            newHeadsWatcherMock,
            getTransactionReceiptMethodMock
        );

        transactionConfirmationWorkflow.execute(methodMock, moduleInstanceMock, '0x0', promiEvent);

        promiEvent.on('confirmation', (confirmationsCounter, receipt) => {
            expect(transactionConfirmationWorkflow.timeoutCounter)
                .toBe(1);

            expect(confirmationsCounter)
                .toBe(1);

            expect(receipt)
                .toEqual({blockHash: '0x0'});
        });

        promiEvent.on('receipt', receipt => {
            expect(receipt)
                .toEqual({blockHash: '0x0'});

            expect(promiEvent.listeners().length)
                .toBe(0);

            expect(methodMock.callback)
                .toHaveBeenCalledWith(false, {blockHash: '0x0'});

            expect(newHeadsWatcherMock.stop)
                .toHaveBeenCalled();

            expect(methodMock.afterExecution)
                .toHaveBeenCalledWith({blockHash: '0x0'});

            expect(transactionReceiptValidatorMock.validate)
                .toHaveBeenCalledWith({blockHash: '0x0'});

            done();
        });
    });

    it('calls executes and receipt doesn\'t already exists but is invalid', (done) => {
        methodMock.callback = jest.fn(() => {
            done();
        });

        getTransactionReceiptMethodMock.execute
            .mockReturnValueOnce(Promise.resolve(false));

        getTransactionReceiptMethodMock.execute
            .mockReturnValueOnce(Promise.resolve({blockHash: '0x0'}));

        newHeadsWatcherMock.on = jest.fn((name, method) => {
            expect(name)
                .toBe('newHead');

            method();
        });

        newHeadsWatcherMock.watch
            .mockReturnValueOnce(newHeadsWatcherMock);

        newHeadsWatcher.isPolling = true;
        moduleInstanceMock.transactionPollingTimeout = 10;
        moduleInstanceMock.transactionConfirmationBlocks = 0;

        transactionReceiptValidatorMock.validate
            .mockReturnValueOnce(false);

        transactionConfirmationWorkflow = new TransactionConfirmationWorkflow(
            transactionReceiptValidatorMock,
            newHeadsWatcherMock,
            getTransactionReceiptMethodMock
        );

        transactionConfirmationWorkflow.execute(methodMock, moduleInstanceMock, '0x0', promiEvent);

        promiEvent.catch(error => {
            expect(error)
                .toBe(false)
        });

        promiEvent.on('error', error => {
            expect(error)
                .toBe(false);

            expect(promiEvent.listeners().length)
                .toBe(0);

            expect(methodMock.callback)
                .toHaveBeenCalledWith(false, null);

            expect(newHeadsWatcherMock.stop)
                .toHaveBeenCalled();

            expect(transactionReceiptValidatorMock.validate)
                .toHaveBeenCalledWith({blockHash: '0x0'});

            done();
        });
    });
});
