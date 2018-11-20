import * as sinonLib from 'sinon';
import CallMethodCommand from '../../src/commands/CallMethodCommand';
import AbstractMethodModel from '../../lib/models/AbstractMethodModel';
import {WebsocketProvider, SocketProviderAdapter} from 'web3-providers';
import AbstractWeb3Module from 'web3-core';

const sinon = sinonLib.createSandbox(); // Check if the sandbox is still needed (jest has his own sandbox handling implemented)

/**
 * CallMethodCommand test
 */
describe('CallMethodCommandTest', () => {
    let callMethodCommand,
        provider,
        providerAdapter,
        providerAdapterMock,
        moduleInstance,
        methodModel,
        methodModelCallbackSpy,
        methodModelMock;

    beforeEach(() => {
        provider = new WebsocketProvider('ws://127.0.0.1', {});

        providerAdapter = new SocketProviderAdapter(provider);
        providerAdapterMock = sinon.mock(providerAdapter);

        moduleInstance = new AbstractWeb3Module(providerAdapter, {}, {}, {});

        methodModel = new AbstractMethodModel('', 0, {}, {});
        methodModelCallbackSpy = sinon.spy();
        methodModel.callback = methodModelCallbackSpy;
        methodModelMock = sinon.mock(methodModel);

        callMethodCommand = new CallMethodCommand();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('calls execute', async () => {
        methodModelMock
            .expects('beforeExecution')
            .withArgs(moduleInstance)
            .once();

        providerAdapterMock
            .expects('send')
            .returns(
                new Promise((resolve) => {
                    resolve('response');
                })
            )
            .once();

        methodModelMock
            .expects('afterExecution')
            .withArgs('response')
            .returns('0x0')
            .once();

        const returnValue = await callMethodCommand.execute(moduleInstance, methodModel);
        expect(returnValue).toBe('0x0');

        expect(methodModelCallbackSpy.calledOnce).toBeTruthy();
        expect(methodModelCallbackSpy.calledWith(false, '0x0')).toBeTruthy();

        methodModelMock.verify();
        providerAdapterMock.verify();
    });

    it('calls execute and throws error', async () => {
        methodModelMock
            .expects('beforeExecution')
            .withArgs(moduleInstance)
            .once();

        providerAdapterMock
            .expects('send')
            .returns(
                new Promise((resolve, reject) => {
                    reject(new Error('error'));
                })
            )
            .once();

        try {
            await callMethodCommand.execute(moduleInstance, methodModel);
        } catch (error) {
            expect(error).toBe('error');
        }

        expect(methodModelCallbackSpy.calledOnce).toBeTruthy();
        expect(methodModelCallbackSpy.calledWith('error', null)).toBeTruthy();

        methodModelMock.verify();
        providerAdapterMock.verify();
    });
});
