import * as Utils from 'web3-utils';
import PeerCountMethodModel from '../../../../src/models/methods/network/PeerCountMethodModel';

// Mocks
jest.mock('Utils');

/**
 * PeerCountMethodModel test
 */
describe('PeerCountMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new PeerCountMethodModel(Utils, {});
    });

    it('rpcMethod should return net_peerCount', () => {
        expect(model.rpcMethod)
            .toBe('net_peerCount');
    });

    it('parametersAmount should return 0', () => {
        expect(model.parametersAmount)
            .toBe(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        model.parameters = [];
        model.beforeExecution();

        expect(model.parameters[0])
            .toBe(undefined);
    });

    it('afterExecution should map the response', () => {
        Utils.hexToNumber
            .mockReturnValueOnce(100);

        expect(model.afterExecution('0x0'))
            .toBe(100);

        expect(Utils.hexToNumber)
            .toHaveBeenCalledWith('0x0');
    });
});
