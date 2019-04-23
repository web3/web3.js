import * as Utils from 'web3-utils';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import GetProofMethod from '../../../../src/methods/node/GetProofMethod';

/**
 * GetProofMethod test
 */
describe('GetProofMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetProofMethod(Utils, null, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('eth_getProof');

        expect(method.parametersAmount).toEqual(3);

        expect(method.utils).toEqual(Utils);

        expect(method.formatters).toEqual(null);
    });

    it('afterExecution should map the response', () => {
        Utils.hexToNumber.mockReturnValueOnce(100);

        expect(method.afterExecution('0x1').nonce).toEqual(1);
        expect(method.afterExecution('0x1').balance).toEqual(1);

        const tests = [{input: '0x2', result: 2}, {input: '0x63', result: 99}];

        for (let i = 0; i < 2; i++) {
            it('should call BN', () => {
                var afterExecution = method.afterExecution(tests[i].input);
                var actual = afterExecution.storageProof[i].value;

                expect(actual).toBe(tests[i].result);

                expect(Utils.toBN).toHaveBeenCalledWith(tests[i].input);
            });
        }

        expect(Utils.hexToNumber).toHaveBeenCalledWith('0x1');
    });

    it('afterExecution should directly return the response', () => {
        expect(method.afterExecution(false)).toEqual(false);
    });
});
