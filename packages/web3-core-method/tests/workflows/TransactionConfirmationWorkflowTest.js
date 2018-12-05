import {AbstractWeb3Module} from 'web3-core';
import {SocketProviderAdapter} from 'web3-providers';
import {PromiEvent} from 'web3-core-promievent';
import {formatters} from 'web3-core-helpers';
import TransactionReceiptValidator from '../../src/validators/TransactionReceiptValidator';
import NewHeadsWatcher from '../../src/watchers/NewHeadsWatcher';
import AbstractMethodModel from '../../lib/models/AbstractMethodModel';
import TransactionConfirmationWorkflow from '../../src/workflows/TransactionConfirmationWorkflow';

// Mocks
jest.mock('../../src/validators/TransactionReceiptValidator');
jest.mock('../../src/watchers/NewHeadsWatcher');
jest.mock('../../lib/models/AbstractMethodModel');
jest.mock('SocketProviderAdapter');
jest.mock('AbstractWeb3Module');
jest.mock('formatters');

/**
 * TransactionConfirmationWorkflow test
 */
describe('TransactionConfirmationWorkflowTest', () => {
    let transactionConfirmationWorkflow,
        transactionReceiptValidator,
        transactionReceiptValidatorMock,
        newHeadsWatcher,
        newHeadsWatcherMock,
        methodModel,
        methodModelMock,
        providerAdapter,
        providerAdapterMock,
        moduleInstance,
        moduleInstanceMock,
        promiEvent;

    beforeEach(() => {
        transactionReceiptValidator = new TransactionReceiptValidator();
        transactionReceiptValidatorMock = TransactionReceiptValidator.mock.instances[0];

        newHeadsWatcher = new NewHeadsWatcher({});
        newHeadsWatcherMock = NewHeadsWatcher.mock.instances[0];

        methodModel = new AbstractMethodModel();
        methodModelMock = AbstractMethodModel.mock.instances[0];

        providerAdapter = new SocketProviderAdapter({});
        providerAdapterMock = SocketProviderAdapter.mock.instances[0];

        moduleInstance = new AbstractWeb3Module(providerAdapterMock, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];
        moduleInstanceMock.currentProvider = providerAdapterMock;

        promiEvent = new PromiEvent();

        transactionConfirmationWorkflow = new TransactionConfirmationWorkflow(
            transactionReceiptValidatorMock,
            newHeadsWatcherMock,
            formatters
        );
    });

    it('constructor check', () => {
        expect(transactionConfirmationWorkflow.transactionReceiptValidator)
            .toEqual(transactionReceiptValidatorMock);

        expect(transactionConfirmationWorkflow.newHeadsWatcher)
            .toEqual(newHeadsWatcherMock);

        expect(transactionConfirmationWorkflow.formatters)
            .toEqual(formatters);
    });

    it('calls executes and receipt does already exists', (done) => {
        providerAdapterMock.send
            .mockReturnValueOnce(Promise.resolve({}));

        formatters.outputTransactionReceiptFormatter
            .mockReturnValueOnce({blockHash: '0x0'});

        transactionReceiptValidatorMock.validate
            .mockReturnValueOnce(true);

        methodModelMock.afterExecution
            .mockReturnValueOnce({blockhash: '0x0'});

        methodModelMock.callback = jest.fn((error, response) => {
            expect(error).toBe(false);
            expect(response).toEqual({blockhash: '0x0'});

            done();
        });

        transactionConfirmationWorkflow.execute(methodModelMock, moduleInstanceMock, '0x0', promiEvent);

        promiEvent
            .on('receipt', (receipt) => {
                expect(receipt)
                    .toEqual({blockhash: '0x0'});

                expect(providerAdapterMock.send)
                    .toHaveBeenCalledWith('eth_getTransactionReceipt', ['0x0']);

                expect(newHeadsWatcherMock.stop)
                    .toHaveBeenCalled();

                expect(methodModelMock.afterExecution)
                    .toHaveBeenCalledWith({blockHash: '0x0'});

                expect(transactionReceiptValidatorMock.validate)
                    .toHaveBeenCalledWith({blockHash: '0x0'});

                expect(formatters.outputTransactionReceiptFormatter)
                    .toHaveBeenCalledWith({});
            });
    });
});
