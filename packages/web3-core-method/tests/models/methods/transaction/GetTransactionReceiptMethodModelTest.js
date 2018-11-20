import * as sinonLib from 'sinon';
import {formatters} from 'web3-core-helpers';
import GetTransactionReceiptMethodModel from '../../../../src/models/methods/transaction/GetTransactionReceiptMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * GetTransactionReceiptMethodModel test
 */
describe('GetTransactionReceiptMethodModelTest', () => {
    let model, formattersMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        model = new GetTransactionReceiptMethodModel({}, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_getTransactionReceipt', () => {
        expect(model.rpcMethod).to.equal('eth_getTransactionReceipt');
    });

    it('parametersAmount should return 1', () => {
        expect(model.parametersAmount).to.equal(1);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];

        model.beforeExecution();

        expect(model.parameters[0]).equal(undefined);
    });

    it('afterExecution should map the response', () => {
        formattersMock
            .expects('outputTransactionFormatter')
            .withArgs({})
            .returns({empty: false})
            .once();

        expect(model.afterExecution({})).to.have.property('empty', false);

        formattersMock.verify();
    });
});
