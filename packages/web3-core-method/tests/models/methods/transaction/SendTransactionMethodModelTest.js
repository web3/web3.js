const chai = require('chai');
const sinon = require('sinon').createSandbox();
const expect = chai.expect;
const formatters = require('web3-core-helpers').formatters;

const SendTransactionMethodModel = require('../../../../src/models/methods/transaction/SendTransactionMethodModel');

/**
 * SendTransactionMethodModel test
 */
describe('SendTransactionMethodModelTest', () => {
    let model;
    let formattersMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        model = new SendTransactionMethodModel({}, formatters, {accounts: true});
    });

    afterEach(() => {
        sinon.restore();
    });

    it('accounts is set', () => {
        expect(model.accounts).to.be.property('accounts', true);
    });

    it('rpcMethod should return eth_sendTransaction', () => {
        expect(model.rpcMethod).to.equal('eth_sendTransaction');
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
