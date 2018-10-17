var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;

var AbstractMethodModel = require('../../lib/models/AbstractMethodModel');
var CallMethodCommand = require('../../src/commands/CallMethodCommand');
var SendMethodCommand = require('../../src/commands/SendMethodCommand');
var SignAndSendMethodCommand = require('../../src/commands/SignAndSendMethodCommand');
var SignMessageCommand = require('../../src/commands/SignMessageCommand');
var PromiEventPackage = require('web3-core-promievent');
var MethodController = require('../../src/controllers/MethodController');

/**
 * MethodController test
 */
describe('MethodControllerTest', function () {
    var methodController,
        methodModel,
        methodModelMock,
        callMethodCommandMock,
        sendMethodCommandMock,
        signAndSendMethodCommandMock,
        signMessageCommandMock,
        promiEventPackageMock,
        callMethodCommand,
        sendMethodCommand,
        signAndSendMethodCommand,
        signMessageCommand;

    beforeEach(function () {
        callMethodCommand = new CallMethodCommand();
        sendMethodCommand = new SendMethodCommand({});
        signAndSendMethodCommand = new SignAndSendMethodCommand({}, {});
        signMessageCommand = new SignMessageCommand({});
        methodModel = new AbstractMethodModel('', 0, {}, {});

        callMethodCommandMock = sinon.mock(callMethodCommand);
        sendMethodCommandMock = sinon.mock(sendMethodCommand);
        signAndSendMethodCommandMock = sinon.mock(signAndSendMethodCommand);
        signMessageCommandMock = sinon.mock(signMessageCommand);
        promiEventPackageMock = sinon.mock(PromiEventPackage);
        methodModelMock = sinon.mock(methodModel);

        methodController = new MethodController(
            callMethodCommand,
            sendMethodCommand,
            signAndSendMethodCommand,
            signMessageCommand,
            PromiEventPackage
        );
    });

    afterEach(function () {
        sinon.restore();
    });

    it('constructor is setting all the dependencies correctly', function () {
        expect(methodController.callMethodCommand).to.be.an.instanceof(CallMethodCommand);
        expect(methodController.sendMethodCommand).to.be.an.instanceof(SendMethodCommand);
        expect(methodController.signAndSendMethodCommand).to.be.an.instanceof(SignAndSendMethodCommand);
        expect(methodController.signMessageCommand).to.be.an.instanceof(SignMessageCommand);
        expect(methodController.promiEventPackage).to.be.an.instanceof(Object);
    });

    it('execute calls signMessageCommand', function () {
        var accounts = {wallet: [0]};

        methodModelMock
            .expects('isSign')
            .returns(true)
            .once();

        signMessageCommandMock
            .expects('execute')
            .withArgs({}, methodModel, accounts)
            .returns(true)
            .once();

        expect(methodController.execute(methodModel, accounts, {})).to.be.true;

        methodModelMock.verify();
        signMessageCommandMock.verify();
    });

    it('execute calls signAndSendMethodCommand', function () {
        var accounts = {wallet: [0]};

        methodModelMock
            .expects('isSendTransaction')
            .returns(true)
            .once();

        signAndSendMethodCommandMock
            .expects('execute')
            .withArgs(methodModel, {}, accounts, {})
            .returns(true)
            .once();

        expect(methodController.execute(methodModel, accounts, {})).to.be.true;

        methodModelMock.verify();
        signAndSendMethodCommandMock.verify();
    });

    it('execute calls sendMethodCommand with sendTransaction rpc method', function () {
        methodModelMock
            .expects('isSendTransaction')
            .returns(true)
            .once();

        sendMethodCommandMock
            .expects('execute')
            .withArgs({}, methodModel, {})
            .returns(true)
            .once();

        expect(methodController.execute(methodModel, null, {})).to.be.true;

        methodModelMock.verify();
        signAndSendMethodCommandMock.verify();
    });

    it('execute calls sendMethodCommand with sendRawTransaction rpc method', function () {
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

        expect(methodController.execute(methodModel, null, {})).to.be.true;

        methodModelMock.verify();
        signAndSendMethodCommandMock.verify();
    });

    it('execute calls callMethodCommand', function () {
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

        expect(methodController.execute(methodModel, null, {})).to.be.true;

        methodModelMock.verify();
        signAndSendMethodCommandMock.verify();
    });
});
