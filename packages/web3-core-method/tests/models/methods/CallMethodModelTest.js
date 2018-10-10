var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var formatters = require('web3-core-helpers').formatters;

var CallMethodModel = require('../../../src/models/methods/CallMethodModel');

/**
 * CallMethodModel test
 */
describe('CallMethodModelTest', function () {
    var model,
        formattersMock = sinon.mock(formatters);

    beforeEach(function () {
        model = new CallMethodModel({}, formatters);
    });

    after(function () {
        formattersMock.restore();
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
                .returns({empty: true})
                .once();

            formattersMock
                .expects('inputDefaultBlockNumberFormatter')
                .withArgs(model.parameters[1], {})
                .returns('0x0')
                .once();

            model.beforeExecution({});

            expect(model.parameters[0]).to.have.property('empty', true);
            expect(model.parameters[1]).equal('0x0');

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
