import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import ContentMethod from '../../../../src/methods/txpool/ContentMethod';

/**
 * ContentMethod test
 */
describe('ContentMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new ContentMethod({}, {}, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('txpool_content');

        expect(method.parametersAmount).toEqual(0);
    });
});
