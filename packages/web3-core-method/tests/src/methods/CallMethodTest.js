import {formatters} from 'web3-core-helpers';
import CallMethod from '../../../src/methods/CallMethod';

// Mocks
jest.mock('formatters');

/**
 * CallMethod test
 */
describe('CallMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new CallMethod({}, formatters);
    });

    it('static Type property returns "CALL"', () => {
        expect(CallMethod.Type).toEqual('CALL');
    });

    it('rpcMethod should return eth_call', () => {
        expect(method.rpcMethod).toEqual('eth_call');
    });

    it('parametersAmount should return 2', () => {
        expect(method.parametersAmount).toEqual(2);
    });

    it('beforeExecution should call inputCallFormatter and inputDefaultBlockNumberFormatter', () => {
        method.parameters = [{}, 100];

        formatters.inputCallFormatter.mockReturnValueOnce({empty: true});

        formatters.inputDefaultBlockNumberFormatter.mockReturnValueOnce({empty: true});

        method.beforeExecution({});

        expect(method.parameters[0]).toHaveProperty('empty', true);

        expect(method.parameters[1]).toEqual({empty: true});

        expect(formatters.inputDefaultBlockNumberFormatter).toHaveBeenCalledWith(100, {});

        expect(formatters.inputCallFormatter).toHaveBeenCalledWith({}, {});
    });

    it('afterExecution should just return the response', () => {
        const object = {};

        expect(method.afterExecution(object)).toEqual(object);
    });
});
