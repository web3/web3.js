const chai = require('chai');
const sinon = require('sinon').createSandbox();
const expect = chai.expect;
const formatters = require('web3-core-helpers').formatters;

const GetPastLogsMethodModel = require('../../../src/models/methods/GetPastLogsMethodModel');

/**
 * GetPastLogsMethodModel test
 */
describe('GetPastLogsMethodModelTest', () => {
    let model;
    let formattersMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        model = new GetPastLogsMethodModel({}, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_getLogs', () => {
        expect(model.rpcMethod).to.equal('eth_getLogs');
    });

    it('parametersAmount should return 1', () => {
        expect(model.parametersAmount).to.equal(1);
    });

    it('beforeExecution should call the inputAddressFormatter and inputDefaultBlockNumberFormatter method', () => {
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

    it('afterExecution should just return the response', () => {
        formattersMock
            .expects('outputLogFormatter')
            .withArgs({})
            .returns({formatted: true})
            .once();

        expect(model.afterExecution([{}])[0]).to.have.property('formatted', true);

        formattersMock.verify();
    });
});
