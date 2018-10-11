var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;
var formatters = require('web3-core-helpers').formatters;

var SignMethodModel = require('../../../src/models/methods/SignMethodModel');

/**
 * GetStorageAtMethodModel test
 */
describe('SignMethodModelTest', function () {
    var model, formattersMock;

    beforeEach(function () {
        formattersMock = sinon.mock(formatters);
        model = new SignMethodModel({}, formatters, {test: true});
    });

    afterEach(function () {
       sinon.restore();
    });

    it('accounts should be defined', function () {
        expect(model.accounts.test).to.be.true;
    });

    it('rpcMethod should return eth_sign', function () {
        expect(model.rpcMethod).to.equal('eth_sign');
    });

    it('parametersAmount should return 2', function () {
        expect(model.parametersAmount).to.equal(2);
    });

    it('beforeExecution should call the inputSignFormatter and inputAddressFormatter', function () {
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

    it('afterExecution should just return the response', function () {
        var object = {};

        expect(model.afterExecution(object)).to.equal(object);
    });
});
