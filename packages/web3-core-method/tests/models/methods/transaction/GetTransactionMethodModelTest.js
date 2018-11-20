import * as sinonLib from 'sinon';
import {formatters} from 'web3-core-helpers';
import GetTransactionMethodModel from '../../../../src/models/methods/transaction/GetTransactionMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * GetTransactionMethodModel test
 */
describe('GetTransactionMethodModelTest', () => {
    let model, formattersMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        model = new GetTransactionMethodModel({}, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_getTransactionByHash', () => {
        expect(model.rpcMethod).to.equal('eth_getTransactionByHash');
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
