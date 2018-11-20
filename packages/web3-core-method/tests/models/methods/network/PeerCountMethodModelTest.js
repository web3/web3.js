const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon').createSandbox();
const utils = require('web3-utils');

const PeerCountMethodModel = require('../../../../src/models/methods/network/PeerCountMethodModel');

/**
 * PeerCountMethodModel test
 */
describe('PeerCountMethodModelTest', () => {
    let model;
    let utilsMock;

    beforeEach(() => {
        utilsMock = sinon.mock(utils);
        model = new PeerCountMethodModel(utils, {});
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return net_peerCount', () => {
        expect(model.rpcMethod).to.equal('net_peerCount');
    });

    it('parametersAmount should return 0', () => {
        expect(model.parametersAmount).to.equal(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).equal(undefined);
    });

    it('afterExecution should map the response', () => {
        utilsMock
            .expects('hexToNumber')
            .withArgs('0x0')
            .returns(100)
            .once();

        expect(model.afterExecution('0x0')).equal(100);

        utilsMock.verify();
    });
});
