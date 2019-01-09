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
        expect(GetCoinbaseMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return eth_coinbase', () => {
        expect(method.rpcMethod).toEqual('eth_coinbase');
    });

    it('parametersAmount should return 0', () => {
        expect(method.parametersAmount).toEqual(0);
    });

    it('beforeExecution should do nothing with the parameters', () => {
        method.parameters = [];
        method.beforeExecution();

        expect(method.parameters[0]).toEqual(undefined);
    });

    it('afterExecution should just return the response', () => {
        expect(method.afterExecution('coinbase')).toEqual('coinbase');
    });
});
