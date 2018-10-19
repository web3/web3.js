var chai = require('chai');
var expect = chai.expect;

var MethodPackageFactory = require('../../src/factories/MethodModuleFactory');
var MethodController = require('../../src/controllers/MethodController');
var CallMethodCommand = require('../../src/commands/CallMethodCommand');
var SignAndSendMethodCommand = require('../../src/commands/SignAndSendMethodCommand');
var SendMethodCommand = require('../../src/commands/SendMethodCommand');
var SignMessageCommand = require('../../src/commands/SignMessageCommand');
var TransactionConfirmationWorkflow = require('../../src/workflows/TransactionConfirmationWorkflow');
var TransactionSigner = require('../../src/signers/TransactionSigner');
var MessageSigner = require('../../src/signers/MessageSigner');
var TransactionConfirmationModel = require('../../src/models/TransactionConfirmationModel');
var TransactionReceiptValidator = require('../../src/validators/TransactionReceiptValidator');
var NewHeadsWatcher = require('../../src/watchers/NewHeadsWatcher');

/**
 * MethodModuleFactory test
 */
describe('MethodPackageFactoryTest', function () {
    var methodPackageFactory;

    beforeEach(function () {
        methodPackageFactory = new MethodPackageFactory();
    });

    it('calls createMethodController and should return an instance of MethodController', function () {
        expect(methodPackageFactory.createMethodController({}, {}, {})).to.be.an.instanceof(MethodController);
    });

    it('calls createCallMethodCommand and should return an instance of CallMethodCommand', function () {
        expect(methodPackageFactory.createCallMethodCommand()).to.be.an.instanceof(CallMethodCommand);
    });

    it('calls createSendMethodCommand and should return an instance of SendMethodCommand', function () {
        expect(methodPackageFactory.createSendMethodCommand({}, {})).to.be.an.instanceof(SendMethodCommand);
    });

    it('calls createSignAndSendMethodCommand and should return an instance of SignAndSendMethodCommand', function () {
        expect(
            methodPackageFactory.createSignAndSendMethodCommand({}, {})
        ).to.be.an.instanceof(
            SignAndSendMethodCommand
        );
    });

    it('calls createSignMessageCommand and should return an instance of SignMessageCommand', function () {
        expect(methodPackageFactory.createSignMessageCommand()).to.be.an.instanceof(SignMessageCommand);
    });

    it(
        'calls createTransactionConfirmationWorkflow and should return an instance of TransactionConfirmationWorkflow',
        function () {
            expect(
                methodPackageFactory.createTransactionConfirmationWorkflow({}, {})
            ).to.be.an.instanceof(
                TransactionConfirmationWorkflow
            );
        }
    );

    it('calls createTransactionSigner and should return an instance of TransactionSigner', function () {
        expect(methodPackageFactory.createTransactionSigner()).to.be.an.instanceof(TransactionSigner);
    });

    it('calls createMessageSigner and should return an instance of MessageSigner', function () {
        expect(methodPackageFactory.createMessageSigner()).to.be.an.instanceof(MessageSigner);
    });

    it(
        'calls createTransactionConfirmationModel and should return an instance of TransactionConfirmationModel',
        function () {
            expect(
                methodPackageFactory.createTransactionConfirmationModel()
            ).to.be.an.instanceof(
                TransactionConfirmationModel
            );
        }
    );

    it(
        'calls createTransactionReceiptValidator and should return an instance of TransactionReceiptValidator',
        function () {
            expect(
                methodPackageFactory.createTransactionReceiptValidator()
            ).to.be.an.instanceof(
                TransactionReceiptValidator
            );
        }
    );

    it('calls createNewHeadsWatcher and should return an instance of NewHeadsWatcher', function () {
        expect(methodPackageFactory.createNewHeadsWatcher({})).to.be.an.instanceof(NewHeadsWatcher);
    });
});
