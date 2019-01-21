import {WebsocketProvider} from 'web3-providers';
import {AbstractWeb3Module} from 'web3-core';
import * as Utils from 'web3-utils';
import {formatters} from 'web3-core-helpers';
import {PromiEvent} from 'web3-core-promievent';
import TransactionConfirmationWorkflow from '../../../src/workflows/TransactionConfirmationWorkflow';
import AbstractSendMethod from '../../../lib/methods/AbstractSendMethod';

// Mocks
jest.mock('../../../src/workflows/TransactionConfirmationWorkflow');
jest.mock('WebsocketProvider');
jest.mock('AbstractWeb3Module');
jest.mock('Utils');
jest.mock('formatters');

/**
 * AbstractSendMethod test
 */
describe('AbstractSendMethodTest', () => {
    let abstractSendMethod, providerMock, moduleInstanceMock, promiEvent, transactionConfirmationWorkflowMock;

    beforeEach(() => {
        new WebsocketProvider('host', {});
        providerMock = WebsocketProvider.mock.instances[0];
        providerMock.send = jest.fn();

        new AbstractWeb3Module(providerMock, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];

        promiEvent = new PromiEvent();

        new TransactionConfirmationWorkflow({}, {}, {});
        transactionConfirmationWorkflowMock = TransactionConfirmationWorkflow.mock.instances[0];

        abstractSendMethod = new AbstractSendMethod(
            'RPC_METHOD',
            1,
            Utils,
            formatters,
            transactionConfirmationWorkflowMock
        );

        abstractSendMethod.beforeExecution = jest.fn();
        abstractSendMethod.callback = jest.fn();
        abstractSendMethod.parameters = [
            {
                gas: 100,
                gasPrice: 100
            }
        ];
    });

    it('constructor check', () => {
        expect(AbstractSendMethod.Type).toEqual('SEND');

        expect(abstractSendMethod.rpcMethod).toEqual('RPC_METHOD');

        expect(abstractSendMethod.parametersAmount).toEqual(1);

        expect(abstractSendMethod.utils).toEqual(Utils);

        expect(abstractSendMethod.formatters).toEqual(formatters);

        expect(abstractSendMethod.transactionConfirmationWorkflow).toEqual(transactionConfirmationWorkflowMock);
    });

    it('calls execute and returns a PromiEvent object', async (done) => {
        providerMock.send.mockReturnValueOnce(Promise.resolve('0x0'));

        moduleInstanceMock.currentProvider = providerMock;

        promiEvent.on('transactionHash', (response) => {
            expect(response).toEqual('0x0');

            expect(abstractSendMethod.beforeExecution).toHaveBeenCalledWith(moduleInstanceMock);

            expect(transactionConfirmationWorkflowMock.execute).toHaveBeenCalledWith(
                abstractSendMethod,
                moduleInstanceMock,
                '0x0',
                promiEvent
            );

            expect(providerMock.send).toHaveBeenCalledWith(abstractSendMethod.rpcMethod, abstractSendMethod.parameters);

            done();
        });

        const response = await abstractSendMethod.execute(moduleInstanceMock, promiEvent);

        expect(response).toEqual('0x0');

        expect(abstractSendMethod.callback).toHaveBeenCalledWith(false, '0x0');
    });

    it('calls execute and throws an error on send', async (done) => {
        const error = new Error('ERROR ON SEND');
        providerMock.send = jest.fn(() => {
            return new Promise((resolve, reject) => {
                reject(error);
            });
        });

        moduleInstanceMock.currentProvider = providerMock;

        try {
            await abstractSendMethod.execute(moduleInstanceMock, promiEvent);
        } catch (error2) {
            expect(error2).toEqual(error);

            expect(abstractSendMethod.beforeExecution).toHaveBeenCalledWith(moduleInstanceMock);

            expect(providerMock.send).toHaveBeenCalledWith(abstractSendMethod.rpcMethod, abstractSendMethod.parameters);

            expect(abstractSendMethod.callback).toHaveBeenCalledWith(error, null);
        }

        abstractSendMethod.execute(moduleInstanceMock, promiEvent).on('error', (e) => {
            expect(e).toEqual(error);

            expect(abstractSendMethod.beforeExecution).toHaveBeenCalledWith(moduleInstanceMock);

            expect(providerMock.send).toHaveBeenCalledWith(abstractSendMethod.rpcMethod, abstractSendMethod.parameters);

            expect(abstractSendMethod.callback).toHaveBeenCalledWith(error, null);

            done();
        });
    });
});
