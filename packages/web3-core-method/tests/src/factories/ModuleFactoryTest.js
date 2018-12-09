import ModuleFactory from '../../../src/factories/ModuleFactory';
import CallMethodCommand from '../../../src/commands/CallMethodCommand';
import SendTransactionMethodCommand from '../../../src/commands/SendTransactionMethodCommand';
import TransactionConfirmationWorkflow from '../../../src/workflows/TransactionConfirmationWorkflow';
import TransactionSigner from '../../../src/signers/TransactionSigner';
import MessageSigner from '../../../src/signers/MessageSigner';
import TransactionReceiptValidator from '../../../src/validators/TransactionReceiptValidator';
import NewHeadsWatcher from '../../../src/watchers/NewHeadsWatcher';

/**
 * ModuleFactory test
 */
describe('ModuleFactoryTest', () => {
    let moduleFactory;

    beforeEach(() => {
        moduleFactory = new ModuleFactory({}, {}, {});
    });

    it('calls createCallMethodCommand and should return an instance of CallMethodCommand', () => {
        expect(moduleFactory.createCallMethodCommand()).toBeInstanceOf(CallMethodCommand);
    });

    it('calls createSendMethodCommand and should return an instance of SendTransactionMethodCommand', () => {
        expect(moduleFactory.createSendTransactionMethodCommand({}, {})).toBeInstanceOf(SendTransactionMethodCommand);
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

    it('calls createMethodProxy and should return an instance of MethodProxy', () => {
        expect(moduleFactory.createMethodProxy({}, {hasMethod: () => {}})).toBeInstanceOf(Object);
    });
});
