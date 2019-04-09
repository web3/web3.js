import * as Utils from 'conflux-web-utils';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetEpochNumberMethod from '../../../../src/methods/epoch/GetEpochNumberMethod';

// Mocks
jest.mock('conflux-web-utils');

/**
 * GetEpochNumberMethod test
 */
describe('GetEpochNumberMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetEpochNumberMethod(Utils, null, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('cfx_epochNumber');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(Utils);

        expect(method.formatters).toEqual(null);
    });

    it('afterExecution should map theresponse', () => {
        Utils.hexToNumber.mockReturnValueOnce(100);

        expect(method.afterExecution('0x0')).toEqual(100);

        expect(Utils.hexToNumber).toHaveBeenCalledWith('0x0');
    });
});
