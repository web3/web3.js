import ModuleFactory from '../../src/factories/ModuleFactory';
import MethodController from '../../src/controllers/MethodController';
import CallMethodCommand from '../../src/commands/CallMethodCommand';
import SignAndSendMethodCommand from '../../src/commands/SignAndSendMethodCommand';
import SendMethodCommand from '../../src/commands/SendMethodCommand';
import SignMessageCommand from '../../src/commands/SignMessageCommand';
import TransactionConfirmationWorkflow from '../../src/methods/transaction/workflows/TransactionConfirmationWorkflow';
import TransactionSigner from '../../src/signers/TransactionSigner';
import MessageSigner from '../../src/signers/MessageSigner';
import TransactionReceiptValidator from '../../src/methods/transaction/validators/TransactionReceiptValidator';
import NewHeadsWatcher from '../../src/methods/transaction/watchers/NewHeadsWatcher';

/**
 * ModuleFactory test
 */
describe('ModuleFactoryTest', () => {
    let moduleFactory;

    beforeEach(() => {
        moduleFactory = new ModuleFactory({}, {}, {});
    });

    it('calls createMethodController and should return an instance of MethodController', () => {
        expect(moduleFactory.createMethodController({}, {}, {})).toBeInstanceOf(MethodController);
    });

    it('calls createCallMethodCommand and should return an instance of CallMethodCommand', () => {
        expect(moduleFactory.createCallMethodCommand()).toBeInstanceOf(CallMethodCommand);
    });

    it('calls createSendMethodCommand and should return an instance of SendMethodCommand', () => {
        expect(moduleFactory.createSendMethodCommand({}, {})).toBeInstanceOf(SendMethodCommand);
    });

    it('calls createSignAndSendMethodCommand and should return an instance of SignAndSendMethodCommand', () => {
        expect(moduleFactory.createSignAndSendMethodCommand({}, {})).toBeInstanceOf(SignAndSendMethodCommand);
    });

    it('calls createSignMessageCommand and should return an instance of SignMessageCommand', () => {
        expect(moduleFactory.createSignMessageCommand()).toBeInstanceOf(SignMessageCommand);
    });

    it('calls createTransactionConfirmationWorkflow and should return an instance of TransactionConfirmationWorkflow', () => {
        expect(moduleFactory.createTransactionConfirmationWorkflow({}, {})).toBeInstanceOf(
            TransactionConfirmationWorkflow
        );
    });

    it('calls createTransactionSigner and should return an instance of TransactionSigner', () => {
        expect(moduleFactory.createTransactionSigner()).toBeInstanceOf(TransactionSigner);
    });

    it('calls createMessageSigner and should return an instance of MessageSigner', () => {
        expect(moduleFactory.createMessageSigner()).toBeInstanceOf(MessageSigner);
    });

    it('calls createTransactionReceiptValidator and should return an instance of TransactionReceiptValidator', () => {
        expect(moduleFactory.createTransactionReceiptValidator()).toBeInstanceOf(TransactionReceiptValidator);
    });

    it('calls createNewHeadsWatcher and should return an instance of NewHeadsWatcher', () => {
        expect(moduleFactory.createNewHeadsWatcher({})).toBeInstanceOf(NewHeadsWatcher);
    });
});
