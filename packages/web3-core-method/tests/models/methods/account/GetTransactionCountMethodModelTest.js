var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var formatters = require('web3-core-helpers').formatters;
var utils = require('web3-utils');

var GetTransactionCountMethodModel = require('../../../../src/models/methods/account/GetTransactionCountMethodModel');

/**
 * GetTransactionCountMethodModel test
 */
describe('GetTransactionCountMethodModelTest', function () {
    var model,
        formattersMock = sinon.mock(formatters),
        utilsMock = sinon.mock(utils);

    beforeEach(function () {
        model = new GetTransactionCountMethodModel(utils, formatters);
    });

    after(function () {
        formattersMock.restore();
        utilsMock.restore();
    });

    describe('rpcMethod', function () {
        it('should return eth_getTransactionCount', function () {
            expect(model.rpcMethod).to.equal('eth_getTransactionCount');
        });
    });

    describe('parametersAmount', function () {
        it('should return 2', function () {
            expect(model.parametersAmount).to.equal(2);
        });
    });

    describe('beforeExecution', function () {
        it('should call inputAddressFormatter and inputDefaultBlockNumberFormatter', function () {
            model.parameters = ['string', 100];

            formattersMock
                .expects('inputAddressFormatter')
                .withArgs(model.parameters[0])
                .returns('0x0')
                .once();

            formattersMock
                .expects('inputDefaultBlockNumberFormatter')
                .withArgs(model.parameters[1], {})
                .returns('0x0')
                .once();

            model.beforeExecution({});

            expect(model.parameters[0]).equal('0x0');
            expect(model.parameters[1]).equal('0x0');

            formattersMock.verify();
        });
    });

    describe('afterExecution', function () {
        it('should call hexToNumber on the response and return it', function () {
            utilsMock
                .expects('hexToNumber')
                .withArgs('0x0')
                .returns(100)
                .once();

            expect(model.afterExecution('0x0')).equal(100);

            utilsMock.verify();
        });
    });
});
