import * as sinonLib from 'sinon';
import utils from 'web3-utils';
import PeerCountMethodModel from '../../../../src/models/methods/network/PeerCountMethodModel';

const sinon = sinonLib.createSandbox();

/**
 * PeerCountMethodModel test
 */
describe('PeerCountMethodModelTest', () => {
    let model, utilsMock;

    beforeEach(() => {
        utilsMock = sinon.mock(utils);
        model = new PeerCountMethodModel(utils, {});
    });

    afterEach(() => {
        sinon.restore();
    });

    it('rpcMethod should return net_peerCount', () => {
        expect(model.rpcMethod).toBe('net_peerCount');
    });

    it('parametersAmount should return 0', () => {
        expect(model.parametersAmount).toBe(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0]).toBe(undefined);
    });

    it('afterExecution should map the response', () => {
        utilsMock
            .expects('hexToNumber')
            .withArgs('0x0')
            .returns(100)
            .once();

        expect(model.afterExecution('0x0')).toBe(100);

        utilsMock.verify();
    });
});
