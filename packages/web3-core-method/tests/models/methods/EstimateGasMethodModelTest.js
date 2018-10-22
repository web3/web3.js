var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;
var formatters = require('web3-core-helpers').formatters;
var utils = require('web3-utils');

var EstimateGasMethodModel = require('../../../src/models/methods/EstimateGasMethodModel');

/**
 * EstimateGasMethodModel test
 */
describe('EstimateGasMethodModelTest', function() {
    var model, formattersMock, utilsMock;

    beforeEach(function() {
        formattersMock = sinon.mock(formatters);
        utilsMock = sinon.mock(utils);
        model = new EstimateGasMethodModel(utils, formatters);
    });

    afterEach(function() {
        sinon.restore();
    });

    it('rpcMethod should return eth_estimateGas', function() {
        expect(model.rpcMethod).to.equal('eth_estimateGas');
    });

    it('parametersAmount should return 1', function() {
        expect(model.parametersAmount).to.equal(1);
    });

    it('beforeExecution should call the inputCallFormatter', function() {
        model.parameters = [{}];

        formattersMock
            .expects('inputCallFormatter')
            .withArgs(model.parameters[0], {})
            .returns({empty: true})
            .once();

        model.beforeExecution({});

        expect(model.parameters[0]).to.have.property('empty', true);

        formattersMock.verify();
    });

    it('afterExecution should call hexToNumber and return the response', function() {
        utilsMock
            .expects('hexToNumber')
            .withArgs({})
            .returns(100)
            .once();

        expect(model.afterExecution({})).equal(100);

        utilsMock.verify();
    });
});
