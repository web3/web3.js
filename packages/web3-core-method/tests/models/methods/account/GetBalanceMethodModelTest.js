var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;
var formatters = require('web3-core-helpers').formatters;

var GetBalanceMethodModel = require('../../../../src/models/methods/account/GetBalanceMethodModel');

/**
 * GetBalanceMethodModel test
 */
describe('GetBalanceMethodModelTest', function () {
    var model, formattersMock;

    beforeEach(function () {
        formattersMock = sinon.mock(formatters);
        model = new GetBalanceMethodModel({}, formatters);
    });

    afterEach(function () {
        sinon.restore();
    });

    it('rpcMethod should return eth_getBalance', function () {
        expect(model.rpcMethod).to.equal('eth_getBalance');
    });

    it('parametersAmount should return 2', function () {
        expect(model.parametersAmount).to.equal(2);
    });

    it('beforeExecution should call inputAddressFormatter and inputDefaultBlockNumberFormatter', function () {
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

    it('afterExecution should call outputBigNumberFormatter on the response and return it', function () {
        var response = {};

        formattersMock
            .expects('outputBigNumberFormatter')
            .withArgs(response)
            .returns({bigNumber: true})
            .once();

        expect(model.afterExecution({})).to.have.property('bigNumber', true);

        formattersMock.verify();
    });
});
