import {SocketProviderAdapter} from 'web3-providers';
import {AbstractWeb3Module} from 'web3-core';
import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {PromiEvent} from 'web3-core-promievent';
import TransactionConfirmationWorkflow from '../../../src/workflows/TransactionConfirmationWorkflow';
import AbstractSendMethod from '../../../lib/methods/AbstractSendMethod';

// Mocks
jest.mock('../../../src/workflows/TransactionConfirmationWorkflow');
jest.mock('SocketProviderAdapter');
jest.mock('AbstractWeb3Module');
jest.mock('Utils');
jest.mock('formatters');

/**
 * AbstractSendMethod test
 */
describe('AbstractSendMethodTest', () => {
    let abstractSendMethod,
        providerAdapter,
        providerAdapterMock,
        moduleInstance,
        moduleInstanceMock,
        promiEvent,
        transactionConfirmationWorkflow,
        transactionConfirmationWorkflowMock;

    beforeEach(() => {
        providerAdapter = new SocketProviderAdapter({});
        providerAdapterMock = SocketProviderAdapter.mock.instances[0];

        moduleInstance = new AbstractWeb3Module(providerAdapterMock, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];

        promiEvent = new PromiEvent();

        transactionConfirmationWorkflow = new TransactionConfirmationWorkflow({}, {}, {});
        transactionConfirmationWorkflowMock = TransactionConfirmationWorkflow.mock.instances[0];

        abstractSendMethod = new AbstractSendMethod(
            'RPC_METHOD',
            0,
            Utils,
            formatters,
            transactionConfirmationWorkflowMock
        );

        abstractSendMethod.beforeExecution = jest.fn();
        abstractSendMethod.callback = jest.fn();
        abstractSendMethod.parameters = [{
            gas: 100,
            gasPrice: 100
        }];

    });

    it('constructor check', () => {
        expect(AbstractSendMethod.Type)
            .toEqual('SEND');

        expect(abstractSendMethod.rpcMethod)
            .toEqual('RPC_METHOD');

        expect(abstractSendMethod.parametersAmount)
            .toEqual(0);

        expect(abstractSendMethod.utils)
            .toEqual(Utils);

        expect(abstractSendMethod.formatters)
            .toEqual(formatters);

        expect(abstractSendMethod.transactionConfirmationWorkflow)
            .toEqual(transactionConfirmationWorkflowMock);
    });

    it('calls execute and returns a PromiEvent object', async (done) => {
        providerAdapterMock.send
            .mockReturnValueOnce(Promise.resolve('0x0'));

        moduleInstanceMock.currentProvider = providerAdapterMock;

        promiEvent.on('transactionHash', (response) => {
            expect(response)
                .toEqual('0x0');

            expect(abstractSendMethod.beforeExecution)
                .toHaveBeenCalledWith(moduleInstanceMock);

            expect(transactionConfirmationWorkflowMock.execute)
                .toHaveBeenCalledWith(abstractSendMethod, moduleInstanceMock, '0x0', promiEvent);

            expect(providerAdapter.send)
                .toHaveBeenCalledWith(abstractSendMethod.rpcMethod, abstractSendMethod.parameters);

            done();
        });

        const response = await abstractSendMethod.execute(moduleInstanceMock, promiEvent);

        expect(response)
            .toEqual('0x0');

        expect(abstractSendMethod.callback)
            .toHaveBeenCalledWith(false, '0x0');
    });

    it('calls execute and throws an error on send', async (done) => {
        const error = new Error('ERROR ON SEND');
        providerAdapterMock.send = jest.fn(() => {
           return new Promise((resolve, reject) => {
               reject(error);
           });
        });

        moduleInstanceMock.currentProvider = providerAdapterMock;

        try {
            await abstractSendMethod.execute(moduleInstanceMock, promiEvent);
        } catch (e) {
            expect(e)
                .toEqual(error);

            expect(abstractSendMethod.beforeExecution)
                .toHaveBeenCalledWith(moduleInstanceMock);

            expect(providerAdapter.send)
                .toHaveBeenCalledWith(abstractSendMethod.rpcMethod, abstractSendMethod.parameters);

            expect(abstractSendMethod.callback)
                .toHaveBeenCalledWith(error, null);
        }

        abstractSendMethod.execute(moduleInstanceMock, promiEvent)
            .on('error', e => {
                expect(e)
                    .toEqual(error);

                expect(abstractSendMethod.beforeExecution)
                    .toHaveBeenCalledWith(moduleInstanceMock);

                expect(providerAdapter.send)
                    .toHaveBeenCalledWith(abstractSendMethod.rpcMethod, abstractSendMethod.parameters);

                expect(abstractSendMethod.callback)
                    .toHaveBeenCalledWith(error, null);

                done();
            });
    });
});
