var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon').createSandbox();
var utils = require('web3-utils');

var GetCoinbaseMethodModel = require('../../../../src/models/methods/node/GetCoinbaseMethodModel');

/**
 * GetCoinbaseMethodModel test
 */
describe('GetCoinbaseMethodModelTest', function () {
    var model, utilsMock;

    beforeEach(function () {
        utilsMock = sinon.mock(utils);
        model = new GetCoinbaseMethodModel(utils, {});
    });

    afterEach(function () {
       sinon.restore();
    });

    it('rpcMethod should return eth_coinbase', function () {
        expect(model.rpcMethod).to.equal('eth_coinbase');
    });

    it('parametersAmount should return 0', function () {
        expect(model.parametersAmount).to.equal(0);
    });

    it('beforeExecution should do nothing with the parameters', function () {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).equal(undefined);
    });

    it('afterExecution should just return the response', function () {
        expect(model.afterExecution('coinbase')).equal('coinbase');
    });
});
