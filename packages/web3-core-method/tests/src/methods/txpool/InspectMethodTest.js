import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import InspectMethod from '../../../../src/methods/txpool/InspectMethod';

/**
 * InspectMethod test
 */
describe('InspectMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new InspectMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('txpool_inspect');

        expect(method.parametersAmount).toEqual(0);
    });
});
