var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var formatters = require('web3-core-helpers').formatters;

var SignMethodModel = require('../../../src/models/methods/SignMethodModel');

/**
 * GetStorageAtMethodModel test
 */
describe('SignMethodModelTest', function () {
    var model,
        formattersMock = sinon.mock(formatters);

    beforeEach(function () {
        model = new SignMethodModel({}, formatters, {test: true});
    });

    after(function () {
        formattersMock.restore();
    });

    describe('accounts', function () {
        it('should be defined', function () {
            expect(model.accounts.test).to.be.true;
        });
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
                .returns('string')
                .once();

            formattersMock
                .expects('inputAddressFormatter')
                .withArgs(model.parameters[1])
                .returns('0x0')
                .once();

            model.beforeExecution({});

            expect(model.parameters[0]).equal('string');
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
