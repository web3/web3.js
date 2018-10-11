var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;
var formatters = require('web3-core-helpers').formatters;
var utils = require('web3-utils');

var GetStorageAtMethodModel = require('../../../src/models/methods/GetStorageAtMethodModel');

/**
 * GetStorageAtMethodModel test
 */
describe('GetStorageAtMethodModelTest', function () {
    var model, formattersMock, utilsMock;

    beforeEach(function () {
        formattersMock = sinon.mock(formatters);
        utilsMock = sinon.mock(utils);
        model = new GetStorageAtMethodModel(utils, formatters);
    });

    afterEach(function () {
        sinon.restore();
    });

    it('rpcMethod should return eth_getStorageAt', function () {
        expect(model.rpcMethod).to.equal('eth_getStorageAt');
    });

    it('parametersAmount should return 3', function () {
        expect(model.parametersAmount).to.equal(3);
    });

    it(
        'beforeExecution should call the formatters.inputAddressFormatter, formatters.inputDefaultBlockNumberFormatter ' +
        'and utils.numberToHex method',
        function () {
            model.parameters = ['string', 100, 100];

            formattersMock
                .expects('inputAddressFormatter')
                .withArgs(model.parameters[0])
                .returns('0x0')
                .once();

            utilsMock
                .expects('numberToHex')
                .withArgs(model.parameters[1])
                .returns('0x0')
                .once();

            formattersMock
                .expects('inputDefaultBlockNumberFormatter')
                .withArgs(model.parameters[2])
                .returns('0x0')
                .once();

            model.beforeExecution({});

            expect(model.parameters[0]).equal('0x0');
            expect(model.parameters[1]).equal('0x0');
            expect(model.parameters[2]).equal('0x0');

            formattersMock.verify();
        }
    );

    it('afterExecution should just return the response', function () {
        var object = {};

        expect(model.afterExecution(object)).to.equal(object);
    });
});
