const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon').createSandbox();
const utils = require('web3-utils');

const GetCoinbaseMethodModel = require('../../../../src/models/methods/node/GetCoinbaseMethodModel');

/**
 * GetCoinbaseMethodModel test
 */
describe('GetCoinbaseMethodModelTest', () => {
    let model;
    let utilsMock;

    beforeEach(() => {
        utilsMock = sinon.mock(utils);
        model = new GetCoinbaseMethodModel(utils, {});
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_coinbase', () => {
        expect(model.rpcMethod).to.equal('eth_coinbase');
    });

    it('parametersAmount should return 0', () => {
        expect(model.parametersAmount).to.equal(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).equal(undefined);
    });

    it('afterExecution should just return the response', () => {
        expect(model.afterExecution('coinbase')).equal('coinbase');
    });
});
