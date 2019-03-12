import PromiEvent from '../../../../lib/PromiEvent';
import TransactionObserver from '../../../../src/observers/TransactionObserver';
import AbstractObservedTransactionMethod from '../../../../lib/methods/transaction/AbstractObservedTransactionMethod';

// Mocks
jest.mock('../../../../src/observers/TransactionObserver');

/**
 * AbstractObservedTransactionMethod test
 */
describe('AbstractObservedTransactionMethodTest', () => {
    let method,
        beforeExecutionMock,
        afterExecutionMock,
        moduleInstanceMock,
        providerMock,
        transactionObserverMock,
        observableMock,
        transactionHashCallback,
        confirmationCallback;

    beforeEach(() => {
        providerMock = {send: jest.fn()};

        moduleInstanceMock = {};
        moduleInstanceMock.currentProvider = providerMock;

        observableMock = {subscribe: ''};

        transactionHashCallback = jest.fn();
        confirmationCallback = jest.fn();

        new TransactionObserver();
        transactionObserverMock = TransactionObserver.mock.instances[0];
        transactionObserverMock.observe.mockReturnValue(observableMock);

        beforeExecutionMock = jest.fn();
        afterExecutionMock = jest.fn((value) => {
            return value;
        });

        method = new AbstractObservedTransactionMethod(
            'rpcMethod',
            5,
            {},
            {},
            moduleInstanceMock,
            transactionObserverMock
        );
        method.beforeExecution = beforeExecutionMock;
        method.afterExecution = afterExecutionMock;
    });

    it('constructor check', () => {
        expect(AbstractObservedTransactionMethod.Type).toEqual('observed-transaction-method');

        expect(method.rpcMethod).toEqual('rpcMethod');

        expect(method.parametersAmount).toEqual(5);

        expect(method.moduleInstance).toEqual(moduleInstanceMock);

        expect(method.transactionObserver).toEqual(transactionObserverMock);

        expect(method.promiEvent).toBeInstanceOf(PromiEvent);
    });

    it('calls execute with event listeners and is emitting the expected values', (done) => {
        providerMock.send.mockReturnValueOnce(Promise.resolve('transactionHash'));

        observableMock.subscribe = jest.fn((next, error, complete) => {
            next({confirmations: 0, receipt: {status: '0x1'}});

            complete();
        });

        const promiEvent = method.execute();
        promiEvent.on('transactionHash', transactionHashCallback);
        promiEvent.on('confirmation', confirmationCallback);
        promiEvent.on('receipt', (receipt) => {
            expect(receipt).toEqual({status: '0x1'});

            expect(providerMock.send).toHaveBeenCalledWith('rpcMethod', []);

            expect(beforeExecutionMock).toHaveBeenCalledWith(moduleInstanceMock);

            expect(afterExecutionMock).toHaveBeenCalledWith({status: '0x1'});

            expect(transactionHashCallback).toHaveBeenCalledWith('transactionHash');

            expect(confirmationCallback).toHaveBeenCalledWith(0, {status: '0x1'});

            done();
        });
    });

    it('calls execute with event listeners and is emitting a error', (done) => {
        providerMock.send.mockReturnValueOnce(Promise.resolve('transactionHash'));

        observableMock.subscribe = jest.fn((next, error, complete) => {
            error('FAILED');
        });

        method.execute().on('error', (error, receipt, count) => {
            expect(error).toEqual('FAILED');

            expect(receipt).toEqual(undefined);

            expect(count).toEqual(undefined);

            expect(providerMock.send).toHaveBeenCalledWith('rpcMethod', []);

            expect(beforeExecutionMock).toHaveBeenCalledWith(moduleInstanceMock);

            done();
        });
    });

    it('calls execute and returns with the expected resolved Promise', async () => {
        providerMock.send.mockReturnValueOnce(Promise.resolve('transactionHash'));

        observableMock.subscribe = jest.fn((next, error, complete) => {
            next({count: 0, receipt: {status: '0x1'}});

            complete();
        });

        await expect(method.execute()).resolves.toEqual({status: '0x1'});

        expect(providerMock.send).toHaveBeenCalledWith('rpcMethod', []);

        expect(beforeExecutionMock).toHaveBeenCalledWith(moduleInstanceMock);

        expect(afterExecutionMock).toHaveBeenCalledWith({status: '0x1'});
    });

    it('calls execute and returns with the expected rejected Promise', async () => {
        providerMock.send.mockReturnValueOnce(Promise.resolve('transactionHash'));

        observableMock.subscribe = jest.fn((next, error, complete) => {
            error('FAILED');
        });

        await expect(method.execute()).rejects.toEqual('FAILED');

        expect(providerMock.send).toHaveBeenCalledWith('rpcMethod', []);

        expect(beforeExecutionMock).toHaveBeenCalledWith(moduleInstanceMock);
    });

    it('calls execute and returns a rejected Promise because of EVM error', async () => {
        providerMock.send.mockReturnValueOnce(Promise.resolve('transactionHash'));

        observableMock.subscribe = jest.fn((next, error, complete) => {
            next({count: 0, receipt: {status: '0x0'}});

            complete();
        });

        await expect(method.execute()).rejects.toThrow(
            `Transaction has been reverted by the EVM:\n${JSON.stringify({status: '0x0'}, null, 2)}`
        );

        expect(providerMock.send).toHaveBeenCalledWith('rpcMethod', []);
    });

    it('calls execute and returns a rejected Promise because the transaction ran out of gas', async () => {
        providerMock.send.mockReturnValueOnce(Promise.resolve('transactionHash'));

        observableMock.subscribe = jest.fn((next, error, complete) => {
            next({count: 0, receipt: {status: '0x1', outOfGas: true}});

            complete();
        });

        await expect(method.execute()).rejects.toThrow(
            `Transaction ran out of gas. Please provide more gas:\n${JSON.stringify(
                {status: '0x1', outOfGas: true},
                null,
                2
            )}`
        );

        expect(providerMock.send).toHaveBeenCalledWith('rpcMethod', []);
    });

    it('calls execute and calls the given callback with the transaction hash', (done) => {
        providerMock.send.mockReturnValueOnce(Promise.resolve('transactionHash'));

        method.callback = jest.fn((error, transactionHash) => {
            expect(error).toEqual(false);

            expect(transactionHash).toEqual('transactionHash');

            expect(providerMock.send).toHaveBeenCalledWith('rpcMethod', []);

            expect(beforeExecutionMock).toHaveBeenCalledWith(moduleInstanceMock);

            done();
        });

        method.execute();
    });

    it('calls execute and the provider send method throws an error', async () => {
        providerMock.send.mockReturnValueOnce(Promise.reject(new Error('ERROR')));

        await expect(method.execute()).rejects.toThrow('ERROR');

        expect(providerMock.send).toHaveBeenCalledWith('rpcMethod', []);

        expect(beforeExecutionMock).toHaveBeenCalledWith(moduleInstanceMock);
    });

    it('calls execute with event listeners and the provider send method throws an error', (done) => {
        providerMock.send.mockReturnValueOnce(Promise.reject(new Error('ERROR')));

        const promiEvent = method.execute();

        promiEvent.on('error', (error) => {
            expect(error).toEqual(new Error('ERROR'));

            expect(providerMock.send).toHaveBeenCalledWith('rpcMethod', []);

            expect(beforeExecutionMock).toHaveBeenCalledWith(moduleInstanceMock);

            done();
        });
    });

    it('calls execute with a callback and the provider send method throws an error', (done) => {
        providerMock.send.mockReturnValueOnce(Promise.reject(new Error('ERROR')));

        method.callback = jest.fn((error, receipt) => {
            expect(error).toEqual(new Error('ERROR'));

            expect(receipt).toEqual(null);

            expect(providerMock.send).toHaveBeenCalledWith('rpcMethod', []);

            expect(beforeExecutionMock).toHaveBeenCalledWith(moduleInstanceMock);

            done();
        });

        method.execute();
    });
});
