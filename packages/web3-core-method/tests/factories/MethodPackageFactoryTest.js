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
        expect(methodPackageFactory.createMethodController({}, {}, {})).toBeInstanceOf(MethodController);
    });

    it('calls createCallMethodCommand and should return an instance of CallMethodCommand', () => {
        expect(methodPackageFactory.createCallMethodCommand()).toBeInstanceOf(CallMethodCommand);
    });

    it('calls createSendMethodCommand and should return an instance of SendMethodCommand', () => {
        expect(methodPackageFactory.createSendMethodCommand({}, {})).toBeInstanceOf(SendMethodCommand);
    });

    it('calls createSignAndSendMethodCommand and should return an instance of SignAndSendMethodCommand', () => {
        expect(methodPackageFactory.createSignAndSendMethodCommand({}, {})).toBeInstanceOf(SignAndSendMethodCommand);
    });

    it('calls createSignMessageCommand and should return an instance of SignMessageCommand', () => {
        expect(methodPackageFactory.createSignMessageCommand()).toBeInstanceOf(SignMessageCommand);
    });

    it('calls createTransactionConfirmationWorkflow and should return an instance of TransactionConfirmationWorkflow', () => {
        expect(methodPackageFactory.createTransactionConfirmationWorkflow({}, {})).toBeInstanceOf(
            TransactionConfirmationWorkflow
        );
    });

    it('calls createTransactionSigner and should return an instance of TransactionSigner', () => {
        expect(methodPackageFactory.createTransactionSigner()).toBeInstanceOf(TransactionSigner);
    });

    it('calls createMessageSigner and should return an instance of MessageSigner', () => {
        expect(methodPackageFactory.createMessageSigner()).toBeInstanceOf(MessageSigner);
    });

    it('calls createTransactionConfirmationModel and should return an instance of TransactionConfirmationModel', () => {
        expect(methodPackageFactory.createTransactionConfirmationModel()).toBeInstanceOf(TransactionConfirmationModel);
    });

    it('calls createTransactionReceiptValidator and should return an instance of TransactionReceiptValidator', () => {
        expect(methodPackageFactory.createTransactionReceiptValidator()).toBeInstanceOf(TransactionReceiptValidator);
    });

    it('calls createNewHeadsWatcher and should return an instance of NewHeadsWatcher', () => {
        expect(methodPackageFactory.createNewHeadsWatcher({})).toBeInstanceOf(NewHeadsWatcher);
    });
});
