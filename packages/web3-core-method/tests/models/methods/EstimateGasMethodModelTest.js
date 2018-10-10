var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var formatters = require('web3-core-helpers').formatters;
var utils = require('web3-utils');

var EstimateGasMethodModel = require('../../../src/models/methods/EstimateGasMethodModel');

/**
 * EstimateGasMethodModel test
 */
describe('EstimateGasMethodModelTest', function () {
    var model,
        formattersMock = sinon.mock(formatters),
        utilsMock = sinon.mock(utils);

    beforeEach(function () {
        model = new EstimateGasMethodModel(utils, formatters);
    });

    after(function () {
        formattersMock.restore();
        utilsMock.restore();
    });

    describe('rpcMethod', function () {
        it('should return eth_estimateGas', function () {
            expect(model.rpcMethod).to.equal('eth_estimateGas');
        });
    });

    describe('parametersAmount', function () {
        it('should return 1', function () {
            expect(model.parametersAmount).to.equal(1);
        });
    });

    describe('beforeExecution', function () {
        it('should call the inputCallFormatter', function () {
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
    });

    describe('afterExecution', function () {
        it('should call hexToNumber and return the response', function () {
            utilsMock
                .expects('hexToNumber')
                .withArgs({})
                .returns(100)
                .once();

            expect(model.afterExecution({})).equal(100);

            utilsMock.verify();
        });
    });
});
