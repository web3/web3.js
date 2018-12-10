import * as Utils from 'web3-utils';
import GetCoinbaseMethod from '../../../../src/methods/node/GetCoinbaseMethod';

// Mocks
jest.mock('Utils');

/**
 * GetCoinbaseMethod test
 */
describe('GetCoinbaseMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new GetCoinbaseMethod(Utils, {});
    });

    it('static Type property returns "CALL"', () => {
        expect(GetCoinbaseMethod.Type)
            .toBe('CALL');
    });

    it('rpcMethod should return eth_coinbase', () => {
        expect(method.rpcMethod)
            .toBe('eth_coinbase');
    });

    it('parametersAmount should return 0', () => {
        expect(method.parametersAmount)
            .toBe(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [];
        method.beforeExecution();

        expect(method.parameters[0])
            .toBe(undefined);
    });

    it('afterExecution should just return the response', () => {
        expect(method.afterExecution('coinbase'))
            .toBe('coinbase');
    });
});
