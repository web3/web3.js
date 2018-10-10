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
    var model;
    var formattersMock = sinon.mock(formatters);
    var utilsMock = sinon.mock(utils);

    beforeEach(function () {
        model = new EstimateGasMethodModel(utils, formatters);
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
                .once();

            model.beforeExecution({});

            formattersMock.verify();
        });
    });

    describe('afterExecution', function () {
        it('should call hexToNumber and return the response', function () {
            utilsMock
                .expects('hexToNumber')
                .withArgs({})
                .once();

            model.afterExecution({});

            utilsMock.verify();
        });
    });
});
