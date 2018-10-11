var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;
var formatters = require('web3-core-helpers').formatters;

var GetCodeMethodModel = require('../../../src/models/methods/GetCodeMethodModel');

/**
 * GetCodeMethodModel test
 */
describe('GetCodeMethodModelTest', function () {
    var model, formattersMock;

    beforeEach(function () {
        formattersMock = sinon.mock(formatters);
        model = new GetCodeMethodModel({}, formatters);
    });

    afterEach(function () {
        sinon.restore();
    });

    it('rpcMethod should return eth_getCode', function () {
        expect(model.rpcMethod).to.equal('eth_getCode');
    });

    it('parametersAmount should return 2', function () {
        expect(model.parametersAmount).to.equal(2);
    });

    it('beforeExecution should call the inputAddressFormatter and inputDefaultBlockNumberFormatter method', function () {
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

    it('afterExecution should just return the response', function () {
        var object = {};

        expect(model.afterExecution(object)).to.equal(object);
    });
});
