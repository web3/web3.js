import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import StartMinerMethod from '../../../../src/methods/miner/StartMinerMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * StartMinerMethod test
 */
describe('StartMinerMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new StartMinerMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('miner_start');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
