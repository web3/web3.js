var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon').createSandbox();
var formatters = require('web3-core-helpers').formatters;

var GetGasPriceMethodModel = require('../../../../src/models/methods/node/GetGasPriceMethodModel');

/**
 * GetGasPriceMethodModel test
 */
describe('GetGasPriceMethodModelTest', function() {
    var model, formattersMock;

    beforeEach(function() {
        formattersMock = sinon.mock(formatters);
        model = new GetGasPriceMethodModel({}, formatters);
    });

    afterEach(function() {
        sinon.restore();
    });

    it('rpcMethod should return eth_gasPrice', function() {
        expect(model.rpcMethod).to.equal('eth_gasPrice');
    });

    it('parametersAmount should return 0', function() {
        expect(model.parametersAmount).to.equal(0);
    });

    it('beforeExecution should do nothing with the parameters', function() {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).equal(undefined);
    });

    it('afterExecution should map the response', function() {
        formattersMock
            .expects('outputBigNumberFormatter')
            .withArgs('1000')
            .returns({bigNumber: true})
            .once();

        expect(model.afterExecution('1000')).to.be.property('bigNumber', true);

        formattersMock.verify();
    });
});
