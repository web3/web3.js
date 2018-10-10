var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var formatters = require('web3-core-helpers').formatters;

var CallMethodModel = require('../../../src/models/methods/CallMethodModel');

/**
 * CallMethodModel test
 */
describe('CallMethodModelTest', function () {
    var model;
    var formattersMock = sinon.mock(formatters);

    beforeEach(function () {
        model = new CallMethodModel({}, formatters);
    });

    describe('rpcMethod', function () {
        it('should return eth_call', function () {
            expect(model.rpcMethod).to.equal('eth_call');
        });
    });

    describe('parametersAmount', function () {
        it('should return 2', function () {
            expect(model.parametersAmount).to.equal(2);
        });
    });

    describe('beforeExecution', function () {
        it('should call inputCallFormatter and inputDefaultBlockNumberFormatter', function () {
            model.parameters = [{}, 100];

            formattersMock
                .expects('inputCallFormatter')
                .withArgs(model.parameters[0], {})
                .once();

            formattersMock
                .expects('inputDefaultBlockNumberFormatter')
                .withArgs(model.parameters[1], {})
                .once();

            model.beforeExecution({});

            formattersMock.verify();
        });
    });

    describe('afterExecution', function () {
        it('should just return the response', function () {
            var object = {};

            expect(model.afterExecution(object)).to.equal(object);
        });
    });
});
