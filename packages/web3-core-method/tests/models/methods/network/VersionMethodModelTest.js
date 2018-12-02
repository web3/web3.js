import * as Utils from 'web3-utils';
import VersionMethodModel from '../../../../src/models/methods/network/VersionMethodModel';

// Mocks
jest.mock('Utils');

/**
 * VersionMethodModel test
 */
describe('VersionMethodModelTest', () => {
    let model;

    beforeEach(() => {
        model = new VersionMethodModel(Utils, {});
    });

    it('rpcMethod should return eth_protocolVersion', () => {
        expect(model.rpcMethod)
            .toBe('eth_protocolVersion');
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
