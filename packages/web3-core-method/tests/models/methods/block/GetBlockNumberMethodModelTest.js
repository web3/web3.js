const chai = require('chai');
const sinon = require('sinon').createSandbox();
const expect = chai.expect;
const utils = require('web3-utils');

const GetBlockNumberMethodModel = require('../../../../src/models/methods/block/GetBlockNumberMethodModel');

/**
 * GetBlockNumberMethodModel test
 */
describe('GetBlockNumberMethodModelTest', () => {
    let model;
    let utilsMock;

    beforeEach(() => {
        utilsMock = sinon.mock(utils);
        model = new GetBlockNumberMethodModel(utils, {});
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return eth_blockNumber', () => {
        expect(model.rpcMethod).to.equal('eth_blockNumber');
    });

    it('parametersAmount should return 0', () => {
        expect(model.parametersAmount).to.equal(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).equal(undefined);
    });

    it('afterExecution should map theresponse', () => {
        utilsMock
            .expects('hexToNumber')
            .withArgs('0x0')
            .returns(100)
            .once();

        expect(model.afterExecution('0x0')).equal(100);

        utilsMock.verify();
    });
});
