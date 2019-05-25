import * as Utils from 'web3-utils';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import BlockProfileMethod from '../../../../src/methods/debug/BlockProfileMethod';

// Mocks
jest.mock('web3-utils');
/**
 * BlockProfileMethod test
 */
describe('BlockProfileMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new BlockProfileMethod(Utils, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('debug_blockProfile');

        expect(method.parametersAmount).toEqual(2);
    });

    it('calls beforeExecution and maps the given number to a hex string', () => {
        Utils.numberToHex.mockReturnValueOnce('0x1');

        method.parameters = [0, 1];

        method.beforeExecution();

        expect(method.parameters[1]).toEqual('0x1');

        expect(Utils.numberToHex).toHaveBeenCalledWith(1);
    });
});
