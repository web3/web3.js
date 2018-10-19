import * as sinonLib from 'sinon';
const sinon = sinonLib.createSandbox();
import CallMethodCommand from '../../src/commands/CallMethodCommand';
import AbstractMethodModel from '../../lib/models/AbstractMethodModel';
import {WebsocketProvider, SocketProviderAdapter} from 'web3-providers';
import AbstractWeb3Module from 'web3-core';

/**
 * CallMethodCommand test
 */
describe('CallMethodCommandTest', function () {
    var callMethodCommand,
        provider,
        providerMock,
        providerAdapter,
        providerAdapterMock,
        moduleInstance,
        methodModel,
        methodModelCallbackSpy,
        methodModelMock;

    beforeEach(function () {
        provider = new WebsocketProvider('ws://127.0.0.1', {});
        providerMock = sinon.mock(provider);

        providerAdapter = new SocketProviderAdapter(provider);
        providerAdapterMock = sinon.mock(providerAdapter);

        moduleInstance = new AbstractWeb3Module(providerAdapter, ProvidersPackage, null, null);

        methodModel = new AbstractMethodModel('', 0, {}, {});
        methodModelCallbackSpy = sinon.spy();
        methodModel.callback = methodModelCallbackSpy;
        methodModelMock = sinon.mock(methodModel);

        callMethodCommand = new CallMethodCommand();
    });

    afterEach(function () {
        sinon.restore();
    });

    it('calls execute', async function () {
        methodModelMock
            .expects('beforeExecution')
            .withArgs(moduleInstance)
            .once();

        providerAdapterMock
            .expects('send')
            .returns(new Promise(
                function (resolve) {
                    resolve('response')
                }
            ))
            .once();

        methodModelMock
            .expects('afterExecution')
            .withArgs('response')
            .returns('0x0')
            .once();

        var returnValue = await callMethodCommand.execute(moduleInstance, methodModel);
        expect(returnValue).toBe('0x0');

        expect(methodModelCallbackSpy.calledOnce).toBeTruthy();
        expect(methodModelCallbackSpy.calledWith(false, '0x0')).toBeTruthy();

        methodModelMock.verify();
        providerAdapterMock.verify();
    });

    it('calls execute and throws error', async function () {
        methodModelMock
            .expects('beforeExecution')
            .withArgs(moduleInstance)
            .once();

        providerAdapterMock
            .expects('send')
            .returns(new Promise(
                function (resolve, reject) {
                    reject('error')
                }
            ))
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
