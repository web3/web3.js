import * as sinonLib from 'sinon';
import {formatters} from 'web3-core-helpers';
import SendTransactionMethodModel from '../../../../src/models/methods/transaction/SendTransactionMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * SendTransactionMethodModel test
 */
describe('SendTransactionMethodModelTest', () => {
    let model, formattersMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        model = new SendTransactionMethodModel({}, formatters, {accounts: true});
    });

    afterEach(() => {
        sinon.restore();
    });

    it('accounts is set', () => {
        expect(model.accounts).toHaveProperty('accounts', true);
    });

    it('rpcMethod should return eth_sendTransaction', () => {
        expect(model.rpcMethod).toBe('eth_sendTransaction');
    });

    it('parametersAmount should return 1', () => {
        expect(model.parametersAmount).toBe(1);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [{}];

        formattersMock
            .expects('inputTransactionFormatter')
            .withArgs({}, {})
            .returns({empty: false})
            .once();

        model.beforeExecution({});

        expect(model.parameters[0]).toHaveProperty('empty', false);
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('sendTransaction')).toBe('sendTransaction');
    });
});
