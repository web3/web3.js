var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;
var formatters = require('web3-core-helpers').formatters;

var SendTransactionMethodModel = require('../../../../src/models/methods/transaction/SendTransactionMethodModel');

/**
 * SendTransactionMethodModel test
 */
describe('SendTransactionMethodModelTest', function() {
    var model, formattersMock;

    beforeEach(function() {
        formattersMock = sinon.mock(formatters);
        model = new SendTransactionMethodModel({}, formatters, {accounts: true});
    });

    afterEach(function() {
        sinon.restore();
    });

    it('accounts is set', function() {
        expect(model.accounts).to.be.property('accounts', true);
    });

    it('rpcMethod should return eth_sendTransaction', function() {
        expect(model.rpcMethod).to.equal('eth_sendTransaction');
    });

    it('parametersAmount should return 1', function() {
        expect(model.parametersAmount).to.equal(1);
    });

    it('beforeExecution should do nothing with the parameters', function() {
        model.parameters = [{}];

        formattersMock
            .expects('inputTransactionFormatter')
            .withArgs({}, {})
            .returns({empty: false})
            .once();

        model.beforeExecution({});

        expect(model.parameters[0]).to.be.property('empty', false);
    });

    it('afterExecution should just return the response', function() {
        expect(model.afterExecution('sendTransaction')).equal('sendTransaction');
    });
});
