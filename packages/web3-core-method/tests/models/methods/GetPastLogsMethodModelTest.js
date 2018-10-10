var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var formatters = require('web3-core-helpers').formatters;

var GetPastLogsMethodModel = require('../../../src/models/methods/GetPastLogsMethodModel');

/**
 * GetPastLogsMethodModel test
 */
describe('GetPastLogsMethodModelTest', function () {
    var model;
    var formattersMock = sinon.mock(formatters);

    beforeEach(function () {
        model = new GetPastLogsMethodModel({}, formatters);
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
                .once();

            model.beforeExecution({});

            formattersMock.verify();
        });
    });

    describe('afterExecution', function () {
        it('should just return the response', function () {
            formattersMock
                .expects('outputLogFormatter')
                .withArgs({})
                .once();

            expect(model.afterExecution([{}])).to.be.an.instanceof(Array);

            formattersMock.verify();
        });
    });
});
