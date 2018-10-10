var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var formatters = require('web3-core-helpers').formatters;
var utils = require('web3-utils');

var GetStorageAtMethodModel = require('../../../src/models/methods/GetStorageAtMethodModel');

/**
 * GetStorageAtMethodModel test
 */
describe('GetStorageAtMethodModelTest', function () {
    var model;
    var formattersMock = sinon.mock(formatters);
    var utilsMock = sinon.mock(utils);

    beforeEach(function () {
        model = new GetStorageAtMethodModel(utils, formatters);
    });

    describe('rpcMethod', function () {
        it('should return eth_getStorageAt', function () {
            expect(model.rpcMethod).to.equal('eth_getStorageAt');
        });
    });

    describe('parametersAmount', function () {
        it('should return 3', function () {
            expect(model.parametersAmount).to.equal(3);
        });
    });

    describe('beforeExecution', function () {
        it(
            'should call the formatters.inputAddressFormatter, formatters.inputDefaultBlockNumberFormatter ' +
            'and utils.numberToHex method',
            function () {
                model.parameters = ['string', 100, 100];

                formattersMock
                    .expects('inputAddressFormatter')
                    .withArgs(model.parameters[0])
                    .once();

                utilsMock
                    .expects('numberToHex')
                    .withArgs(model.parameters[1])
                    .once();

                formattersMock
                    .expects('inputDefaultBlockNumberFormatter')
                    .withArgs(model.parameters[2])
                    .once();

                model.beforeExecution({});

                formattersMock.verify();
            }
        );
    });

    describe('afterExecution', function () {
        it('should just return the response', function () {
            var object = {};

            expect(model.afterExecution(object)).to.equal(object);
        });
    });
});
