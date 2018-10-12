var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;

var MessageSigner = require('../../src/signers/MessageSigner');
var SignMessageCommand = require('../../src/commands/SignMessageCommand');
var AbstractMethodModel = require('../../lib/models/AbstractMethodModel');

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
        expect(returnValue).to.equal('0x0');

        expect(methodModelCallbackSpy.calledOnce).to.be.true;
        expect(methodModelCallbackSpy.calledWith(false, '0x0')).to.be.true;

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
            expect(methodModelCallbackSpy.calledOnce).to.be.true;
            expect(methodModelCallbackSpy.calledWith(error, null)).to.be.true;
            expect(error).to.be.instanceof(Error);
            expect(error.message).equal('PANIC');

            methodModelMock.verify();
            messageSignerMock.verify();
        }

    });
});
