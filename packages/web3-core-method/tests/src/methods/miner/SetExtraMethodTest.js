import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import SetExtraMethod from '../../../../src/methods/miner/SetExtraMethod';

/**
 * SetExtraMethod test
 */
describe('SetExtraMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new SetExtraMethod({});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('miner_setExtra');

        expect(method.parametersAmount).toEqual(1);
    });
});
