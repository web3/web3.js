import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import SetEtherBaseMethod from '../../../../src/methods/miner/SetEtherBaseMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * SetEtherBaseMethod test
 */
describe('SetEtherBaseMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SetEtherBaseMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('miner_setEtherbase');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
