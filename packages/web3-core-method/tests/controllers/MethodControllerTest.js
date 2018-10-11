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
 * SendTransactionMethodModel test
 */
describe('SendTransactionMethodModelTest', function () {
    var methodController,
        methodModel,
        methodModelMock,
        callMethodCommandMock,
        sendMethodCommandMock,
        signAndSendMethodCommandMock,
        signMessageCommandMock,
        promiEventPackageMock;

    beforeEach(function () {
        callMethodCommandMock = sinon.mock(CallMethodCommand);
        sendMethodCommandMock = sinon.mock(SendMethodCommand);
        signAndSendMethodCommandMock = sinon.mock(SignAndSendMethodCommand);
        signMessageCommandMock = sinon.mock(new SignMessageCommand({}));
        promiEventPackageMock = sinon.mock(PromiEventPackage);
        methodModelMock = sinon.mock(new AbstractMethodModel('', 0, {}, {}));

        methodModel = new AbstractMethodModel('', 0, {}, {});
        methodController = new MethodController(
            new CallMethodCommand(),
            new SendMethodCommand({}),
            new SignAndSendMethodCommand({}, {}),
            new SignMessageCommand({}),
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
        expect(methodController.promiEventPackage).to.be.not.equal(undefined);
    });

    it('execute calls signMessageCommand', function () {
        var accounts = {wallet: [0]};

        promiEventPackageMock
            .expects('createPromiEvent')
            .once();

        methodModelMock
            .expects('isSign')
            .returns(true)
            .once();

        signMessageCommandMock
            .expects('execute')
            .withArgs(methodModel, accounts)
            .returns(true)
            .once();

        expect(methodController.execute(methodModel, accounts, {})).to.be.true;

        methodModelMock.verify();
        signMessageCommandMock.verify();
    });

    it('execute calls signAndSendmethodCommand', function () {
        var accounts = {wallet: [0]};

        promiEventPackageMock
            .expects('createPromiEvent')
            .returns({})
            .once();

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
        promiEventPackageMock
            .expects('createPromiEvent')
            .returns({})
            .once();

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
        promiEventPackageMock
            .expects('createPromiEvent')
            .returns({})
            .once();

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
        promiEventPackageMock
            .expects('createPromiEvent')
            .returns({})
            .once();

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
