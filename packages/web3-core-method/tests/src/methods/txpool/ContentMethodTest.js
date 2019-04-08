import {formatters} from 'web3-core-helpers';
import AbstractMethod from '../../../../lib/methods/AbstractMethod';
import ContentMethod from '../../../../src/methods/txpool/ContentMethod';

// Mocks
jest.mock('web3-core-helpers');

/**
 * ContentMethod test
 */
describe('ContentMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new ContentMethod(null, formatters, {});
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(AbstractMethod);

        expect(method.rpcMethod).toEqual('txpool_content');

        expect(method.parametersAmount).toEqual(0);

        expect(method.utils).toEqual(null);

        expect(method.formatters).toEqual(formatters);
    });
});
