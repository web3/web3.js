import TransactionConfirmationWorkflow from '../../../src/workflows/TransactionConfirmationWorkflow';
import TransactionReceiptValidator from '../../../src/validators/TransactionReceiptValidator';
import NewHeadsWatcher from '../../../src/watchers/NewHeadsWatcher';
import SendRawTransactionMethod from '../../../src/methods/transaction/SendRawTransactionMethod';
import ModuleFactory from '../../../src/factories/ModuleFactory';

/**
 * ModuleFactory test
 */
describe('ModuleFactoryTest', () => {
    let moduleFactory;

    beforeEach(() => {
        moduleFactory = new ModuleFactory({}, {}, {});
    });

    it('calls createTransactionConfirmationWorkflow and should return an instance of TransactionConfirmationWorkflow', () => {
        expect(moduleFactory.createTransactionConfirmationWorkflow({}, {})).toBeInstanceOf(
            TransactionConfirmationWorkflow
        );
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

    it('calls createSendRawTransactionMethod and should return an instance of SendRawTransactionMethod', () => {
        expect(moduleFactory.createSendRawTransactionMethod()).toBeInstanceOf(SendRawTransactionMethod);
    });
});
