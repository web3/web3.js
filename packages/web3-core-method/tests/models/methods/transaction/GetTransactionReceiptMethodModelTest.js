var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;
var formatters = require('web3-core-helpers').formatters;

var GetTransactionReceiptMethodModel = require('../../../../src/models/methods/transaction/GetTransactionReceiptMethodModel');

/**
 * GetTransactionReceiptMethodModel test
 */
describe('GetTransactionReceiptMethodModelTest', function () {
    var model, formattersMock;

    beforeEach(function () {
        formattersMock = sinon.mock(formatters);
        model = new GetTransactionReceiptMethodModel({}, formatters);
    });

    afterEach(function () {
        sinon.restore();
    });

    it('rpcMethod should return eth_getTransactionReceipt', function () {
        expect(model.rpcMethod).to.equal('eth_getTransactionReceipt');
    });

    it('parametersAmount should return 1', function () {
        expect(model.parametersAmount).to.equal(1);
    });


    it('beforeExecution should do nothing with the parameters', function () {
        model.parameters = [];

        model.beforeExecution();

        expect(model.parameters[0]).equal(undefined);
    });

    it('afterExecution should map the response', function () {
        formattersMock
            .expects('outputTransactionFormatter')
            .withArgs({})
            .returns({empty: false})
            .once();

        expect(model.afterExecution({})).to.have.property('empty', false);

        formattersMock.verify();
    });
});
