import * as sinonLib from 'sinon';
import {formatters} from 'web3-core-helpers';
import SignTransactionMethodModel from '../../../../src/models/methods/transaction/SignTransactionMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * SendTransactionMethodModel test
 */
describe('SendTransactionMethodModelTest', () => {
    let model,
        formattersMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        model = new SignTransactionMethodModel({}, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_signTransaction', () => {
        expect(model.rpcMethod).to.equal('eth_signTransaction');
    });

    it('parametersAmount should return 1', () => {
        expect(model.parametersAmount).to.equal(1);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [{}];

        formattersMock
            .expects('inputTransactionFormatter')
            .withArgs({}, {})
            .returns({empty: false})
            .once();

        model.beforeExecution({});

        expect(model.parameters[0]).to.be.property('empty', false);
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('sendTransaction')).equal('sendTransaction');
    });
});
