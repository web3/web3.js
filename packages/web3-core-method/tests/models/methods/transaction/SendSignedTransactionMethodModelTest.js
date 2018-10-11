var chai = require('chai');
var expect = chai.expect;

var SendSignedTransactionMethodModel = require('../../../../src/models/methods/transaction/SendSignedTransactionMethodModel');

/**
 * SendSignedTransactionMethodModel test
 */
describe('SendSignedTransactionMethodModelTest', function () {
    var model;

    beforeEach(function () {
        model = new SendSignedTransactionMethodModel({}, {});
    });

    it('rpcMethod should return eth_sendRawTransaction', function () {
        expect(model.rpcMethod).to.equal('eth_sendRawTransaction');
    });

    it('parametersAmount should return 1', function () {
        expect(model.parametersAmount).to.equal(1);
    });


    it('beforeExecution should do nothing with the parameters', function () {
        model.parameters = [];

        model.beforeExecution();

        expect(model.parameters[0]).equal(undefined);
    });

    it('afterExecution should just return the response', function () {
        expect(model.afterExecution('sendSignedTransaction')).equal('sendSignedTransaction');
    });
});
