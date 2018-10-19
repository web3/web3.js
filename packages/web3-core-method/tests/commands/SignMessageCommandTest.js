import * as sinonLib from 'sinon';
const sinon = sinonLib.createSandbox();
import MessageSigner from '../../src/signers/MessageSigner';
import SignMessageCommand from '../../src/commands/SignMessageCommand';
import AbstractMethodModel from '../../lib/models/AbstractMethodModel';

/**
 * SignMessageCommand test
 */
describe('SignMessageCommandTest', function () {
    var signMessageCommand,
        methodModel,
        methodModelCallbackSpy,
        methodModelMock,
        messageSigner,
        messageSignerMock;

    beforeEach(function () {
        methodModel = new AbstractMethodModel('', 0, {}, {});
        methodModelCallbackSpy = sinon.spy();
        methodModel.callback = methodModelCallbackSpy;
        methodModelMock = sinon.mock(methodModel);

        messageSigner = new MessageSigner();
        messageSignerMock = sinon.mock(messageSigner);

        signMessageCommand = new SignMessageCommand(messageSigner);
    });

    afterEach(function () {
        sinon.restore();
    });

    it('calls execute and returns signed message', function () {
        methodModel.parameters = ['string', '0x0'];

        methodModelMock
            .expects('beforeExecution')
            .withArgs({})
            .once();

        messageSignerMock
            .expects('sign')
            .withArgs(methodModel.parameters[0], methodModel.parameters[1], {})
            .returns('0x00')
            .once();

        methodModelMock
            .expects('afterExecution')
            .withArgs('0x00')
            .returns('0x0')
            .once();

        var returnValue = signMessageCommand.execute({}, methodModel, {});
        expect(returnValue).toBe('0x0');

        expect(methodModelCallbackSpy.calledOnce).toBeTruthy();
        expect(methodModelCallbackSpy.calledWith(false, '0x0')).toBeTruthy();

        methodModelMock.verify();
        messageSignerMock.verify();
    });

    it('calls execute and throws error', function () {
        methodModel.parameters = ['string', '0x0'];
        var error = new Error('PANIC');

        methodModelMock
            .expects('beforeExecution')
            .withArgs({})
            .once();

        messageSignerMock
            .expects('sign')
            .withArgs(methodModel.parameters[0], methodModel.parameters[1], {})
            .throws(error)
            .once();

        try {
            signMessageCommand.execute({}, methodModel, {});
        } catch(error) {
            expect(methodModelCallbackSpy.calledOnce).toBeTruthy();
            expect(methodModelCallbackSpy.calledWith(error, null)).toBeTruthy();
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('PANIC');

            methodModelMock.verify();
            messageSignerMock.verify();
        }

    });
});
