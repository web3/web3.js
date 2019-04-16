import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StopMinerMethod from '../../../../src/methods/miner/StopMinerMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * StopMinerMethod test
 */
describe('StopMinerMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StopMinerMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('miner_stop');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
