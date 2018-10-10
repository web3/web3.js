var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var formatters = require('web3-core-helpers').formatters;

var SignMethodModel = require('../../../src/models/methods/SignMethodModel');

/**
 * GetStorageAtMethodModel test
 */
describe('SignMethodModelTest', function () {
    var model;
    var formattersMock = sinon.mock(formatters);

    beforeEach(function () {
        model = new SignMethodModel({}, formatters);
    });

    describe('rpcMethod', function () {
        it('should return eth_sign', function () {
            expect(model.rpcMethod).to.equal('eth_sign');
        });
    });

    describe('parametersAmount', function () {
        it('should return 2', function () {
            expect(model.parametersAmount).to.equal(2);
        });
    });

    describe('beforeExecution', function () {
        it('should call the inputSignFormatter and inputAddressFormatter', function () {
                model.parameters = ['string', 'string'];

                formattersMock
                    .expects('inputSignFormatter')
                    .withArgs(model.parameters[0])
                    .once();

                formattersMock
                    .expects('inputAddressFormatter')
                    .withArgs(model.parameters[1])
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
