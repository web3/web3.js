var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var formatters = require('web3-core-helpers').formatters;

var GetPastLogsMethodModel = require('../../../src/models/methods/GetPastLogsMethodModel');

/**
 * GetPastLogsMethodModel test
 */
describe('GetPastLogsMethodModelTest', function () {
    var model,
        formattersMock = sinon.mock(formatters);

    beforeEach(function () {
        model = new GetPastLogsMethodModel({}, formatters);
    });

    after(function () {
        formattersMock.restore();
    });

    describe('rpcMethod', function () {
        it('should return eth_getLogs', function () {
            expect(model.rpcMethod).to.equal('eth_getLogs');
        });
    });

    describe('parametersAmount', function () {
        it('should return 1', function () {
            expect(model.parametersAmount).to.equal(1);
        });
    });

    describe('beforeExecution', function () {
        it('should call the inputAddressFormatter and inputDefaultBlockNumberFormatter method', function () {
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
    });

    describe('afterExecution', function () {
        it('should just return the response', function () {
            formattersMock
                .expects('outputLogFormatter')
                .withArgs({})
                .returns({formatted: true})
                .once();

            expect(model.afterExecution([{}])[0]).to.have.property('formatted', true);

            formattersMock.verify();
        });
    });
});
