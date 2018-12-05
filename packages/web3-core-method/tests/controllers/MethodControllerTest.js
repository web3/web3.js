import AbstractMethodModel from '../../lib/models/AbstractMethodModel';
import CallMethodCommand from '../../src/commands/CallMethodCommand';
import SendMethodCommand from '../../src/commands/SendTransactionMethodCommand';
import SignAndSendMethodCommand from '../../src/commands/SignAndSendMethodCommand';
import SignMessageCommand from '../../src/commands/SignMessageCommand';
import MethodController from '../../src/controllers/MethodController';
import {PromiEvent} from 'web3-core-promievent';
import {AbstractWeb3Module} from 'web3-core';
import {SocketProviderAdapter} from 'web3-providers';

//Mocks
jest.mock('../../src/commands/CallMethodCommand');
jest.mock('../../src/commands/SendMethodCommand');
jest.mock('../../lib/models/AbstractMethodModel');
jest.mock('../../src/commands/SignAndSendMethodCommand');
jest.mock('../../src/commands/SignMessageCommand');
jest.mock('SocketProviderAdapter');
jest.mock('AbstractWeb3Module');

/**
 * MethodController test
 */
describe('MethodControllerTest', () => {
    let methodController,
        methodModel,
        methodModelMock,
        callMethodCommandMock,
        sendMethodCommandMock,
        signAndSendMethodCommandMock,
        signMessageCommandMock,
        callMethodCommand,
        sendMethodCommand,
        signAndSendMethodCommand,
        signMessageCommand,
        providerAdapter,
        providerAdapterMock,
        moduleInstance,
        moduleInstanceMock;

    beforeEach(() => {
        providerAdapter = new SocketProviderAdapter({});
        providerAdapterMock = SocketProviderAdapter.mock.instances[0];

        moduleInstance = new AbstractWeb3Module(providerAdapterMock, {}, {}, {});
        moduleInstanceMock = AbstractWeb3Module.mock.instances[0];

        callMethodCommand = new CallMethodCommand();
        callMethodCommandMock = CallMethodCommand.mock.instances[0];

        sendMethodCommand = new SendMethodCommand({});
        sendMethodCommandMock = SendMethodCommand.mock.instances[0];

        signAndSendMethodCommand = new SignAndSendMethodCommand({}, {});
        signAndSendMethodCommandMock = SignAndSendMethodCommand.mock.instances[0];

        signMessageCommand = new SignMessageCommand({});
        signMessageCommandMock = SignMessageCommand.mock.instances[0];

        methodModel = new AbstractMethodModel('', 0, {}, {});
        methodModelMock = AbstractMethodModel.mock.instances[0];

        methodController = new MethodController(
            callMethodCommandMock,
            sendMethodCommandMock,
            signAndSendMethodCommandMock,
            signMessageCommandMock,
            PromiEvent
        );
    });

    it('constructor is setting all the dependencies correctly', () => {
        expect(methodController.callMethodCommand)
            .toEqual(callMethodCommandMock);

        expect(methodController.sendMethodCommand)
            .toEqual(sendMethodCommandMock);

        expect(methodController.signAndSendMethodCommand)
            .toEqual(signAndSendMethodCommandMock);

        expect(methodController.signMessageCommand)
            .toEqual(signMessageCommandMock);

        expect(methodController.PromiEvent)
            .toEqual(PromiEvent);
    });

    it('execute calls signMessageCommand', () => {
        const accounts = {wallet: [0]};

        methodModelMock.isSign
            .mockReturnValueOnce(true);

        signMessageCommandMock.execute
            .mockReturnValueOnce(true);

        expect(methodController.execute(methodModelMock, accounts, moduleInstanceMock))
            .toBeTruthy();

        expect(methodModelMock.isSign)
            .toBeCalled();

        expect(signMessageCommandMock.execute)
            .toBeCalled();
    });

    it('execute calls signAndSendMethodCommand', () => {
        const accounts = {wallet: [0]};

        methodModelMock.isSign
            .mockReturnValueOnce(false);

        methodModelMock.isSendTransaction
            .mockReturnValueOnce(true);

        signAndSendMethodCommandMock.execute
            .mockReturnValueOnce(true);

        expect(methodController.execute(methodModelMock, accounts, moduleInstanceMock))
            .toBeTruthy();

        expect(methodModelMock.isSendTransaction)
            .toBeCalled();

        // Can't define arguments because the PromiEvent object will be created in the controller.
        // This is a clear sign of bad architecture.. the PromiEvent object should be removed.
        expect(signAndSendMethodCommandMock.execute)
            .toBeCalled();
    });

    it('execute calls sendMethodCommand with sendTransaction rpc method', () => {
        methodModelMock.isSendTransaction
            .mockReturnValueOnce(true);

        sendMethodCommandMock.execute
            .mockReturnValueOnce(true);

        expect(methodController.execute(methodModelMock, null, moduleInstanceMock)).toBeTruthy();

        expect(methodModelMock.isSendTransaction)
            .toBeCalled();

        // Can't define arguments because the PromiEvent object will be created in the controller.
        // This is a clear sign of bad architecture.. the PromiEvent object should be removed.
        expect(sendMethodCommandMock.execute)
            .toBeCalled();
    });

    it('execute calls sendMethodCommand with sendRawTransaction rpc method', () => {
        methodModelMock.isSendTransaction
            .mockReturnValueOnce(false);

        methodModelMock.isSendRawTransaction
            .mockReturnValueOnce(true);

        sendMethodCommandMock.execute
            .mockReturnValueOnce(true);

        expect(methodController.execute(methodModelMock, null, moduleInstanceMock)).toBeTruthy();

        expect(methodModelMock.isSendTransaction)
            .toBeCalled();

        expect(methodModelMock.isSendRawTransaction)
            .toBeCalled();

        // Can't define arguments because the PromiEvent object will be created in the controller.
        // This is a clear sign of bad architecture.. the PromiEvent object should be removed.
        expect(sendMethodCommandMock.execute)
            .toBeCalled();
    });

    it('execute calls callMethodCommand', () => {
        methodModelMock.isSendTransaction
            .mockReturnValueOnce(false);

        methodModelMock.isSendRawTransaction
            .mockReturnValueOnce(false);

        callMethodCommandMock.execute
            .mockReturnValueOnce(true);

        expect(methodController.execute(methodModelMock, null, moduleInstanceMock)).toBeTruthy();

        expect(methodModelMock.isSendTransaction)
            .toBeCalled();

        expect(methodModelMock.isSendRawTransaction)
            .toBeCalled();

        expect(callMethodCommandMock.execute)
            .toHaveBeenCalledWith(moduleInstanceMock, methodModelMock);
    });
});
