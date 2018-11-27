import * as sinonLib from 'sinon';
import AbstractMethodModel from '../../lib/models/AbstractMethodModel';
import CallMethodCommand from '../../src/commands/CallMethodCommand';
import SendMethodCommand from '../../src/commands/SendMethodCommand';
import SignAndSendMethodCommand from '../../src/commands/SignAndSendMethodCommand';
import SignMessageCommand from '../../src/commands/SignMessageCommand';
import {PromiEvent} from 'web3-core-promievent';
import MethodController from '../../src/controllers/MethodController';

const sinon = sinonLib.createSandbox();

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
        signMessageCommand;

    beforeEach(() => {
        callMethodCommand = new CallMethodCommand();
        sendMethodCommand = new SendMethodCommand({});
        signAndSendMethodCommand = new SignAndSendMethodCommand({}, {});
        signMessageCommand = new SignMessageCommand({});
        methodModel = new AbstractMethodModel('', 0, {}, {});

        callMethodCommandMock = sinon.mock(callMethodCommand);
        sendMethodCommandMock = sinon.mock(sendMethodCommand);
        signAndSendMethodCommandMock = sinon.mock(signAndSendMethodCommand);
        signMessageCommandMock = sinon.mock(signMessageCommand);
        methodModelMock = sinon.mock(methodModel);

        methodController = new MethodController(
            callMethodCommand,
            sendMethodCommand,
            signAndSendMethodCommand,
            signMessageCommand,
            PromiEvent
        );
    });

    afterEach(() => {
        sinon.restore();
    });

    it('constructor is setting all the dependencies correctly', () => {
        expect(methodController.callMethodCommand).toBeInstanceOf(CallMethodCommand);
        expect(methodController.sendMethodCommand).toBeInstanceOf(SendMethodCommand);
        expect(methodController.signAndSendMethodCommand).toBeInstanceOf(SignAndSendMethodCommand);
        expect(methodController.signMessageCommand).toBeInstanceOf(SignMessageCommand);
        expect(methodController.promiEventPackage).toBeInstanceOf(Object);
    });

    it('execute calls signMessageCommand', () => {
        const accounts = {wallet: [0]};

        methodModelMock
            .expects('isSign')
            .returns(true)
            .once();

        signMessageCommandMock
            .expects('execute')
            .withArgs({}, methodModel, accounts)
            .returns(true)
            .once();

        expect(methodController.execute(methodModel, accounts, {})).toBeTruthy();

        methodModelMock.verify();
        signMessageCommandMock.verify();
    });

    it('execute calls signAndSendMethodCommand', () => {
        const accounts = {wallet: [0]};

        methodModelMock
            .expects('isSendTransaction')
            .returns(true)
            .once();

        signAndSendMethodCommandMock
            .expects('execute')
            .withArgs(methodModel, {}, accounts, {})
            .returns(true)
            .once();

        expect(methodController.execute(methodModel, accounts, {})).toBeTruthy();

        methodModelMock.verify();
        signAndSendMethodCommandMock.verify();
    });

    it('execute calls sendMethodCommand with sendTransaction rpc method', () => {
        methodModelMock
            .expects('isSendTransaction')
            .returns(true)
            .once();

        sendMethodCommandMock
            .expects('execute')
            .withArgs({}, methodModel, {})
            .returns(true)
            .once();

        expect(methodController.execute(methodModel, null, {})).toBeTruthy();

        methodModelMock.verify();
        signAndSendMethodCommandMock.verify();
    });

    it('execute calls sendMethodCommand with sendRawTransaction rpc method', () => {
        methodModelMock
            .expects('isSendTransaction')
            .returns(false)
            .once();

        methodModelMock
            .expects('isSendRawTransaction')
            .returns(true)
            .once();

        sendMethodCommandMock
            .expects('execute')
            .withArgs({}, methodModel, {})
            .returns(true)
            .once();

        expect(methodController.execute(methodModel, null, {})).toBeTruthy();

        methodModelMock.verify();
        signAndSendMethodCommandMock.verify();
    });

    it('execute calls callMethodCommand', () => {
        methodModelMock
            .expects('isSendTransaction')
            .returns(false)
            .once();

        methodModelMock
            .expects('isSendRawTransaction')
            .returns(false)
            .once();

        callMethodCommandMock
            .expects('execute')
            .withArgs({}, methodModel)
            .returns(true)
            .once();

        expect(methodController.execute(methodModel, null, {})).toBeTruthy();

        methodModelMock.verify();
        signAndSendMethodCommandMock.verify();
    });
});
