var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var formatters = require('web3-core-helpers').formatters;

var GetCodeMethodModel = require('../../../src/models/methods/GetCodeMethodModel');

/**
 * GetCodeMethodModel test
 */
describe('GetCodeMethodModelTest', function () {
    var model;
    var formattersMock = sinon.mock(formatters);

    beforeEach(function () {
        model = new GetCodeMethodModel({}, formatters);
    });

    describe('rpcMethod', function () {
        it('should return eth_getCode', function () {
            expect(model.rpcMethod).to.equal('eth_getCode');
        });
    });

    describe('parametersAmount', function () {
        it('should return 2', function () {
            expect(model.parametersAmount).to.equal(2);
        });
    });

    describe('beforeExecution', function () {
        it('should call the inputAddressFormatter and inputDefaultBlockNumberFormatter method', function () {
            model.parameters = ['string', 100];

            formattersMock
                .expects('inputAddressFormatter')
                .withArgs(model.parameters[0])
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
