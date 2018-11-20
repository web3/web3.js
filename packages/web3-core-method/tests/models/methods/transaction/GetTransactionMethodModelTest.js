const chai = require('chai');
const sinon = require('sinon').createSandbox();
const expect = chai.expect;
const formatters = require('web3-core-helpers').formatters;

const GetTransactionMethodModel = require('../../../../src/models/methods/transaction/GetTransactionMethodModel');

/**
 * GetTransactionMethodModel test
 */
describe('GetTransactionMethodModelTest', () => {
    let model;
    let formattersMock;

    beforeEach(() => {
        formattersMock = sinon.mock(formatters);
        model = new GetTransactionMethodModel({}, formatters);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_getTransactionByHash', () => {
        expect(model.rpcMethod).to.equal('eth_getTransactionByHash');
    });

    it('parametersAmount should return 1', () => {
        expect(model.parametersAmount).to.equal(1);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];

        model.beforeExecution();

        expect(model.parameters[0]).equal(undefined);
    });

    it('afterExecution should map the response', () => {
        formattersMock
            .expects('outputTransactionFormatter')
            .withArgs({})
            .returns({empty: false})
            .once();

        expect(model.afterExecution({})).to.have.property('empty', false);

        formattersMock.verify();
    });
});
