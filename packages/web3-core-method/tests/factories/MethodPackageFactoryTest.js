import MethodPackageFactory from '../../src/factories/MethodModuleFactory';
import MethodController from '../../src/controllers/MethodController';
import CallMethodCommand from '../../src/commands/CallMethodCommand';
import SignAndSendMethodCommand from '../../src/commands/SignAndSendMethodCommand';
import SendMethodCommand from '../../src/commands/SendMethodCommand';
import SignMessageCommand from '../../src/commands/SignMessageCommand';
import TransactionConfirmationWorkflow from '../../src/workflows/TransactionConfirmationWorkflow';
import TransactionSigner from '../../src/signers/TransactionSigner';
import MessageSigner from '../../src/signers/MessageSigner';
import TransactionConfirmationModel from '../../src/models/TransactionConfirmationModel';
import TransactionReceiptValidator from '../../src/validators/TransactionReceiptValidator';
import NewHeadsWatcher from '../../src/watchers/NewHeadsWatcher';

/**
 * MethodModuleFactory test
 */
describe('MethodPackageFactoryTest', () => {
    let methodPackageFactory;

    beforeEach(() => {
        methodPackageFactory = new MethodPackageFactory();
    });

    it('calls createMethodController and should return an instance of MethodController', () => {
        expect(methodPackageFactory.createMethodController({}, {}, {})).to.be.an.instanceof(MethodController);
    });

    it('calls createCallMethodCommand and should return an instance of CallMethodCommand', () => {
        expect(methodPackageFactory.createCallMethodCommand()).to.be.an.instanceof(CallMethodCommand);
    });

    it('calls createSendMethodCommand and should return an instance of SendMethodCommand', () => {
        expect(methodPackageFactory.createSendMethodCommand({}, {})).to.be.an.instanceof(SendMethodCommand);
    });

    it('calls createSignAndSendMethodCommand and should return an instance of SignAndSendMethodCommand', () => {
        expect(methodPackageFactory.createSignAndSendMethodCommand({}, {})).to.be.an.instanceof(
            SignAndSendMethodCommand
        );
    });

    it('calls createSignMessageCommand and should return an instance of SignMessageCommand', () => {
        expect(methodPackageFactory.createSignMessageCommand()).to.be.an.instanceof(SignMessageCommand);
    });

    it('calls createTransactionConfirmationWorkflow and should return an instance of TransactionConfirmationWorkflow', () => {
        expect(methodPackageFactory.createTransactionConfirmationWorkflow({}, {})).to.be.an.instanceof(
            TransactionConfirmationWorkflow
        );
    });

    it('calls createTransactionSigner and should return an instance of TransactionSigner', () => {
        expect(methodPackageFactory.createTransactionSigner()).to.be.an.instanceof(TransactionSigner);
    });

    it('calls createMessageSigner and should return an instance of MessageSigner', () => {
        expect(methodPackageFactory.createMessageSigner()).to.be.an.instanceof(MessageSigner);
    });

    it('calls createTransactionConfirmationModel and should return an instance of TransactionConfirmationModel', () => {
        expect(methodPackageFactory.createTransactionConfirmationModel()).to.be.an.instanceof(
            TransactionConfirmationModel
        );
    });

    it('calls createTransactionReceiptValidator and should return an instance of TransactionReceiptValidator', () => {
        expect(methodPackageFactory.createTransactionReceiptValidator()).to.be.an.instanceof(
            TransactionReceiptValidator
        );
    });

    it('calls createNewHeadsWatcher and should return an instance of NewHeadsWatcher', () => {
        expect(methodPackageFactory.createNewHeadsWatcher({})).to.be.an.instanceof(NewHeadsWatcher);
    });
});
