import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import SetExtraMethod from '../../../../src/methods/miner/SetExtraMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * SetExtraMethod test
 */
describe('SetExtraMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SetExtraMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('miner_setExtra');

        expect(method.parametersAmount).toEqual(1);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
