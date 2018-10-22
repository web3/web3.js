var chai = require('chai');
var sinon = require('sinon').createSandbox();
var expect = chai.expect;
var formatters = require('web3-core-helpers').formatters;

var GetPastLogsMethodModel = require('../../../src/models/methods/GetPastLogsMethodModel');

/**
 * GetPastLogsMethodModel test
 */
describe('GetPastLogsMethodModelTest', function() {
    var model, formattersMock;

    beforeEach(function() {
        formattersMock = sinon.mock(formatters);
        model = new GetPastLogsMethodModel({}, formatters);
    });

    afterEach(function() {
        sinon.restore();
    });

    it('rpcMethod should return eth_getLogs', function() {
        expect(model.rpcMethod).to.equal('eth_getLogs');
    });

    it('parametersAmount should return 1', function() {
        expect(model.parametersAmount).to.equal(1);
    });

    it('beforeExecution should call the inputAddressFormatter and inputDefaultBlockNumberFormatter method', function() {
        model.parameters = [{}];

        formattersMock
            .expects('inputLogFormatter')
            .withArgs(model.parameters[0])
            .returns({empty: true})
            .once();

        model.beforeExecution({});

        expect(model.parameters[0]).to.have.property('empty', true);

        formattersMock.verify();
    });

    it('afterExecution should just return the response', function() {
        formattersMock
            .expects('outputLogFormatter')
            .withArgs({})
            .returns({formatted: true})
            .once();

        expect(model.afterExecution([{}])[0]).to.have.property('formatted', true);

        formattersMock.verify();
    });
});
